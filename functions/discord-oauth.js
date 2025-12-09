/**
 * Exchange Discord OAuth code server-side and (optionally) add user to guild.
 * Expects POST JSON: { code }
 */
import { trackEvent, captureError } from "./telemetry";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI,
    DISCORD_GUILD_ID,
    DISCORD_BOT_TOKEN,
  } = env;

  if (
    !DISCORD_CLIENT_ID ||
    !DISCORD_CLIENT_SECRET ||
    !DISCORD_REDIRECT_URI ||
    !DISCORD_GUILD_ID ||
    !DISCORD_BOT_TOKEN
  ) {
    return new Response("Missing Discord env", { status: 500 });
  }

  let code;
  try {
    const body = await request.json();
    code = body.code;
  } catch (_) {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  // 1) Exchange code for token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    captureError(new Error("Token exchange failed"), { status: tokenRes.status, text }, env);
    return new Response(`Token exchange failed: ${text}`, { status: 400 });
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  const refreshToken = tokenJson.refresh_token;

  // 2) Fetch user info
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    const text = await userRes.text();
    captureError(new Error("User fetch failed"), { status: userRes.status, text }, env);
    return new Response(`User fetch failed: ${text}`, { status: 400 });
  }

  const user = await userRes.json(); // contains id, username, discriminator, avatar

  // 3) Ensure guild join (guilds.join requires user token + bot token)
  const joinRes = await fetch(
    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    }
  );
  if (!joinRes.ok && joinRes.status !== 204 && joinRes.status !== 201) {
    const text = await joinRes.text();
    // 409/400 は既に参加済みなどのケースもあるため警告扱いで返さない
    captureError(new Error("Guild join failed"), { status: joinRes.status, text }, env);
    console.warn("Guild join failed", joinRes.status, text);
  }

  trackEvent("discord_oauth_success", { userId: user.id }, env);

  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: tokenJson.expires_in,
      scope: tokenJson.scope,
      token_type: tokenJson.token_type,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
