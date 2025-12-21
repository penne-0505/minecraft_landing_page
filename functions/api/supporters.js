import Stripe from "stripe";
import { trackEvent, captureError } from "../telemetry";

const PLAN_PRIORITY = { Yearly: 3, Monthly: 2, Ticket: 1, Supporter: 0 };
const DISCORD_AVATAR_BASE = "https://cdn.discordapp.com";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const config = getConfig(env);
  if (!config.ok) {
    return new Response(config.message, { status: 500 });
  }

  try {
    const [subscriptionMap, members] = await Promise.all([
      fetchActiveSubscriptions(config.stripe),
      fetchMembersWithRole(config.discord).catch((err) => {
        captureError(err, { stage: "supporters_members_fetch" }, env);
        return null;
      }),
    ]);

    const supporters = buildSupporterList(subscriptionMap, members);

    trackEvent("supporters_list_success", { count: supporters.length }, env);

    return new Response(JSON.stringify({ supporters }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    captureError(err, { stage: "supporters_list" }, env);
    return new Response("Failed to load supporters", { status: 500 });
  }
}

function getConfig(env) {
  const missing = [];
  if (!env?.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!env?.DISCORD_BOT_TOKEN) missing.push("DISCORD_BOT_TOKEN");
  if (!env?.DISCORD_GUILD_ID) missing.push("DISCORD_GUILD_ID");
  if (!env?.DISCORD_ROLE_MEMBER_ID) missing.push("DISCORD_ROLE_MEMBER_ID");

  if (missing.length) {
    return {
      ok: false,
      message: `Missing env: ${missing.join(", ")}`,
    };
  }

  return {
    ok: true,
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY,
    },
    discord: {
      botToken: env.DISCORD_BOT_TOKEN,
      guildId: env.DISCORD_GUILD_ID,
      roleId: env.DISCORD_ROLE_MEMBER_ID,
      maxMembers: Number(env.DISCORD_ROLE_MAX_FETCH || 2000),
    },
  };
}

async function fetchActiveSubscriptions(stripeConfig) {
  const stripe = new Stripe(stripeConfig.secretKey);
  const query = "metadata['discord_user_id']:'*' AND (status:'active' OR status:'trialing' OR status:'past_due')";

  const subscriptions = [];
  let page;
  let guard = 0;

  while (guard < 5) {
    const res = await stripe.subscriptions.search({
      query,
      limit: 100,
      page,
      expand: ["data.customer", "data.items.data.price"],
    });

    subscriptions.push(...(res.data || []));
    if (!res.next_page) break;

    page = res.next_page;
    guard += 1;
  }

  const map = new Map();

  for (const sub of subscriptions) {
    const userId =
      sub.metadata?.discord_user_id ||
      (sub.customer && !sub.customer.deleted ? sub.customer.metadata?.discord_user_id : null);

    if (!userId) continue;

    const plan = resolvePlan(sub);
    const startedAt = sub.start_date ? new Date(sub.start_date * 1000).toISOString() : undefined;
    const customerAvatar =
      sub.customer && !sub.customer.deleted ? sub.customer.metadata?.avatar_url : null;
    const avatarUrl = sub.metadata?.avatar_url || customerAvatar || null;

    const existing = map.get(userId);
    if (!existing || PLAN_PRIORITY[plan] > PLAN_PRIORITY[existing.plan]) {
      map.set(userId, { plan, startedAt, avatarUrl });
    }
  }

  return map;
}

function resolvePlan(subscription) {
  const metaType = subscription?.metadata?.price_type;
  if (metaType === "sub_yearly") return "Yearly";
  if (metaType === "sub_monthly") return "Monthly";
  if (metaType === "one_month") return "Ticket";

  const interval = subscription?.items?.data?.[0]?.price?.recurring?.interval;
  if (interval === "year") return "Yearly";
  if (interval === "month") return "Monthly";

  return "Supporter";
}

async function fetchMembersWithRole(discordConfig) {
  const { botToken, guildId, roleId, maxMembers } = discordConfig;
  const supporters = [];
  let after;

  while (supporters.length < maxMembers) {
    const url = new URL(`https://discord.com/api/v10/guilds/${guildId}/members`);
    url.searchParams.set("limit", "1000");
    if (after) url.searchParams.set("after", after);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (res.status === 403) {
      throw new Error("Discord bot lacks required privileged member intent");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Discord API error ${res.status}: ${text}`);
    }

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const member of batch) {
      if (member?.roles?.includes(roleId)) {
        supporters.push(member);
      }
    }

    if (batch.length < 1000) break;
    after = batch[batch.length - 1]?.user?.id;
    if (!after) break;
  }

  return supporters.slice(0, maxMembers);
}

function buildSupporterList(subscriptionMap, members) {
  // If Discord fetch failed, fall back to subscription list only.
  if (!members) {
    return Array.from(subscriptionMap.entries()).map(([userId, sub]) => ({
      id: userId,
      name: `Member_${userId.slice(0, 6)}`,
      avatar: sub.avatarUrl || `${DISCORD_AVATAR_BASE}/embed/avatars/0.png`,
      plan: sub.plan,
      joinedAt: formatDate(sub.startedAt),
    }));
  }

  return members.map((member) => {
    const userId = member?.user?.id;
    const sub = userId ? subscriptionMap.get(userId) : undefined;
    const plan = sub?.plan ?? "Supporter";

    return {
      id: userId,
      name:
        member?.nick ||
        member?.user?.global_name ||
        member?.user?.username ||
        "Member",
      avatar: sub?.avatarUrl || buildAvatarUrl(member?.user),
      plan,
      joinedAt: formatDate(sub?.startedAt || member?.joined_at),
    };
  });
}

function buildAvatarUrl(user) {
  if (!user) return `${DISCORD_AVATAR_BASE}/embed/avatars/0.png`;

  if (user.avatar) {
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `${DISCORD_AVATAR_BASE}/avatars/${user.id}/${user.avatar}.${ext}`;
  }

  const discriminator = Number(user.discriminator || 0);
  const defaultIndex = Number.isNaN(discriminator) ? 0 : discriminator % 5;
  return `${DISCORD_AVATAR_BASE}/embed/avatars/${defaultIndex}.png`;
}

function formatDate(value) {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}
