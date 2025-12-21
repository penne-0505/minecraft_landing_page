import Stripe from "stripe";
import { trackEvent, captureError } from "../telemetry";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secretKey = env?.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  const url = new URL(request.url);
  const discordUserId = url.searchParams.get("discord_user_id");
  if (!discordUserId) {
    return new Response("Missing discord_user_id", { status: 400 });
  }

  // Use account default API version; avoid pinning to unavailable future versions.
  const stripe = new Stripe(secretKey);

  try {
    const result = await stripe.subscriptions.search({
      query: `metadata['discord_user_id']:'${discordUserId}'`,
      limit: 10,
      expand: ["data.items.data.price"],
    });

    const subscriptions = result?.data || [];
    if (!subscriptions.length) {
      return new Response(
        JSON.stringify({ ok: false, reason: "not_found" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const latest = subscriptions
      .slice()
      .sort((a, b) => {
        const aValue = a.current_period_end || a.created || 0;
        const bValue = b.current_period_end || b.created || 0;
        return bValue - aValue;
      })[0];

    const cancelled =
      latest.status === "canceled" || latest.cancel_at_period_end === true;

    if (!cancelled) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: "not_cancelled",
          status: latest.status,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const endTimestamp =
      latest.cancel_at ||
      latest.current_period_end ||
      latest.ended_at ||
      latest.canceled_at ||
      null;

    const nowMs = Date.now();
    const endMs = endTimestamp ? endTimestamp * 1000 : null;
    const daysLeft =
      endMs && endMs > nowMs ? Math.ceil((endMs - nowMs) / 86400000) : 0;

    const priceType = latest.metadata?.price_type || null;
    const lineItem = latest.items?.data?.[0];

    trackEvent(
      "subscription_status_fetch_success",
      { status: latest.status, cancelAtPeriodEnd: latest.cancel_at_period_end },
      env
    );

    return new Response(
      JSON.stringify({
        ok: true,
        subscription: {
          id: latest.id,
          status: latest.status,
          cancel_at_period_end: latest.cancel_at_period_end,
          current_period_end: latest.current_period_end,
          canceled_at: latest.canceled_at,
          ended_at: latest.ended_at,
          price_type: priceType,
          plan_label:
            lineItem?.price?.nickname ||
            lineItem?.price?.product?.name ||
            null,
          days_left: daysLeft,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    captureError(err, { stage: "subscription_status_fetch" }, env);
    return new Response("Failed to load subscription status", { status: 500 });
  }
}
