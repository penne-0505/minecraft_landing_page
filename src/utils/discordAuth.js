import { trackEvent } from "../analytics";

/**
 * Kick off Discord OAuth login flow.
 * @param {string} [returnToOverride] Optional path to return to after auth.
 */
export function beginDiscordLogin(returnToOverride) {
  if (typeof window === "undefined") return;

  trackEvent("login_start", { provider: "discord" });

  const appBaseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  const redirectUriClient =
    import.meta.env.VITE_DISCORD_REDIRECT_URI || `${appBaseUrl}/auth/callback`;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const returnTo = returnToOverride || currentPath || "/membership";

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
    response_type: "code",
    scope: "identify guilds.join",
    redirect_uri: redirectUriClient,
    prompt: "consent",
    state: returnTo,
  });

  window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
}
