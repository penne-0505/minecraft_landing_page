import Stripe from "stripe";
import { trackEvent, captureError } from "./telemetry";

/**
 * Create Stripe Checkout Session
 * POST JSON: { priceType: "one_month" | "sub_monthly" | "sub_yearly", discord_user_id: string }
 */
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const {
    STRIPE_SECRET_KEY,
    STRIPE_PRICE_ONE_MONTH,
    STRIPE_PRICE_SUB_MONTHLY,
    STRIPE_PRICE_SUB_YEARLY,
    APP_BASE_URL,
  } = env;

  if (
    !STRIPE_SECRET_KEY ||
    !STRIPE_PRICE_ONE_MONTH ||
    !STRIPE_PRICE_SUB_MONTHLY ||
    !STRIPE_PRICE_SUB_YEARLY ||
    !APP_BASE_URL
  ) {
    return new Response("Missing Stripe env", { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { priceType, discord_user_id } = body || {};
  if (!priceType || !discord_user_id) {
    return new Response("Missing priceType or discord_user_id", { status: 400 });
  }

  const priceMap = {
    one_month: STRIPE_PRICE_ONE_MONTH,
    sub_monthly: STRIPE_PRICE_SUB_MONTHLY,
    sub_yearly: STRIPE_PRICE_SUB_YEARLY,
  };

  const priceId = priceMap[priceType];
  if (!priceId) {
    return new Response("Invalid priceType", { status: 400 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-11-20" });

  const mode = priceType === "one_month" ? "payment" : "subscription";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_BASE_URL}/?checkout=success`,
      cancel_url: `${APP_BASE_URL}/?checkout=cancel`,
      metadata: {
        discord_user_id,
        price_type: priceType,
      },
    });

    trackEvent("checkout_session_created", { priceType, mode }, env);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    captureError(err, { stage: "checkout_session_create", priceType }, env);
    return new Response("Stripe error", { status: 500 });
  }
}
