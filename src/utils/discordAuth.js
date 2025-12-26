import { trackEvent } from "../analytics";

const STATE_STORAGE_KEY = "discord_oauth_state";

export function createDiscordOAuthState(returnTo) {
  if (typeof window === "undefined") return "";

  const nonceBytes = new Uint8Array(16);
  window.crypto.getRandomValues(nonceBytes);
  const nonce = base64UrlEncode(nonceBytes);
  const payload = { nonce, returnTo };

  storeOAuthNonce(nonce);
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
}

export function consumeDiscordOAuthState(state) {
  if (typeof window === "undefined" || !state) return null;

  let payload;
  try {
    const decoded = base64UrlDecode(state);
    payload = JSON.parse(new TextDecoder().decode(decoded));
  } catch {
    return null;
  }

  if (!payload?.nonce) return null;
  const stored = loadOAuthNonce();
  clearOAuthNonce();

  if (!stored || stored !== payload.nonce) return null;
  return payload;
}

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
  const state = createDiscordOAuthState(returnTo);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || "",
    response_type: "code",
    scope: "identify guilds.join",
    redirect_uri: redirectUriClient,
    prompt: "consent",
    state,
  });

  window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
}

function base64UrlEncode(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  let normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  if (pad) {
    normalized += "=".repeat(4 - pad);
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function storeOAuthNonce(nonce) {
  try {
    sessionStorage.setItem(STATE_STORAGE_KEY, nonce);
    return;
  } catch {
    // fall through to localStorage
  }

  try {
    localStorage.setItem(STATE_STORAGE_KEY, nonce);
  } catch {
    // ignore
  }
}

function loadOAuthNonce() {
  try {
    const value = sessionStorage.getItem(STATE_STORAGE_KEY);
    if (value) return value;
  } catch {
    // ignore
  }

  try {
    return localStorage.getItem(STATE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearOAuthNonce() {
  try {
    sessionStorage.removeItem(STATE_STORAGE_KEY);
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(STATE_STORAGE_KEY);
  } catch {
    // ignore
  }
}
