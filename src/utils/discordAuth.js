import { trackEvent, captureError } from "../analytics";
import { DEMO_USER, IS_DEMO_MODE } from "../constants/demo";

const STATE_STORAGE_KEY = "discord_oauth_state";
const DISCORD_AUTHORIZE_URL = "https://discord.com/oauth2/authorize";
const DEFAULT_SCOPE = "identify guilds.join";
const DEFAULT_PROMPT = "consent";
const DISCORD_AVATAR_BASE = "https://cdn.discordapp.com/avatars";

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
export function beginDiscordLogin(returnToOverride, options = {}) {
  if (typeof window === "undefined") return;
  const context = options.context;
  const returnTo = resolveReturnTo(returnToOverride || options.returnTo);

  if (IS_DEMO_MODE) {
    const user = persistDiscordUser(DEMO_USER);
    trackEvent("login_demo", {
      provider: "discord",
      ...(context ? { context } : {}),
    });
    if (user) {
      window.location.href = returnTo;
    }
    return;
  }

  const state = options.state || createDiscordOAuthState(returnTo);

  trackEvent("login_start", {
    provider: "discord",
    ...(context ? { context } : {}),
  });

  const authorizeUrl = buildDiscordAuthorizeUrl({
    returnTo,
    state,
    scope: options.scope,
    prompt: options.prompt,
    redirectUri: options.redirectUri,
    clientId: options.clientId,
  });

  window.location.href = authorizeUrl;
}

export function buildDiscordAuthorizeUrl({
  returnTo,
  state,
  scope = DEFAULT_SCOPE,
  prompt = DEFAULT_PROMPT,
  redirectUri,
  clientId,
} = {}) {
  const resolvedState = state || createDiscordOAuthState(returnTo || "/membership");
  const resolvedClientId = clientId ?? import.meta.env.VITE_DISCORD_CLIENT_ID ?? "";
  const resolvedRedirectUri = resolveRedirectUri(redirectUri);

  const params = new URLSearchParams({
    client_id: resolvedClientId,
    response_type: "code",
    scope,
    redirect_uri: resolvedRedirectUri,
    prompt,
    state: resolvedState,
  });

  return `${DISCORD_AUTHORIZE_URL}?${params.toString()}`;
}

export function extractDiscordOAuthParams(href, { extraParams = [] } = {}) {
  if (!href) return { code: null, state: null, cleanUrl: null };
  try {
    const url = new URL(href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const paramsToClear = new Set(["code", "state", ...extraParams]);
    let changed = false;

    paramsToClear.forEach((key) => {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    });

    return {
      code,
      state,
      cleanUrl: changed ? url.toString() : null,
    };
  } catch {
    return { code: null, state: null, cleanUrl: null };
  }
}

export async function exchangeDiscordCode(
  code,
  {
    captureResponseError = true,
    errorMessage = "OAuth exchange failed",
    errorContext = {},
    errorStage = "oauth_callback",
    persistUser = true,
  } = {}
) {
  if (IS_DEMO_MODE) {
    const user = persistUser ? persistDiscordUser(DEMO_USER) : DEMO_USER;
    return { ok: true, user, data: { user, demo: true } };
  }

  if (!code) return { ok: false, reason: "missing_code" };

  try {
    const res = await fetch("/discord-oauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (captureResponseError) {
        captureError(new Error(errorMessage), {
          ...errorContext,
          text,
          status: res.status,
        });
      }
      return { ok: false, status: res.status, text };
    }

    const data = await res.json();
    const user = normalizeDiscordUser(data?.user);
    if (user && persistUser) {
      persistDiscordUser(user);
    }

    return { ok: true, user, data };
  } catch (err) {
    captureError(err, { stage: errorStage, ...errorContext });
    return { ok: false, error: err };
  }
}

export function normalizeDiscordUser(user) {
  if (!user?.id) return null;
  return {
    id: user.id,
    name: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar ? `${DISCORD_AVATAR_BASE}/${user.id}/${user.avatar}.png` : null,
  };
}

export function persistDiscordUser(user) {
  if (typeof window === "undefined" || !user?.id) return null;
  try {
    sessionStorage.setItem("discord_user", JSON.stringify(user));
  } catch {
    // ignore storage failure
  }
  return user;
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

function resolveReturnTo(returnToOverride) {
  if (returnToOverride) return returnToOverride;
  if (typeof window === "undefined") return "/membership";
  const currentPath = `${window.location.pathname}${window.location.search}`;
  return currentPath || "/membership";
}

function resolveRedirectUri(redirectUriOverride) {
  if (redirectUriOverride) return redirectUriOverride;
  if (typeof window === "undefined") {
    return import.meta.env.VITE_DISCORD_REDIRECT_URI || "";
  }
  const appBaseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
  return import.meta.env.VITE_DISCORD_REDIRECT_URI || `${appBaseUrl}/auth/callback`;
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
