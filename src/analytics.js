// Analytics hooks
// - GA4: gtag.js (frontend)
// - Sentry: placeholder (frontend) / wired later

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

let gtagLoadPromise = null;
let lastPageViewPath = null;
let sentryInitPromise = null;

async function ensureSentryInitialized() {
  if (!SENTRY_DSN) return null;
  if (typeof window === "undefined") return null;
  if (sentryInitPromise) return sentryInitPromise;

  sentryInitPromise = import("@sentry/browser")
    .then((Sentry) => {
      try {
        Sentry.init({
          dsn: SENTRY_DSN,
          environment: import.meta.env.MODE,
        });
      } catch {
        // ignore
      }
      return Sentry;
    })
    .catch(() => null);

  return sentryInitPromise;
}

function ensureGtagLoaded() {
  if (!GA_ID) return Promise.resolve(false);
  if (typeof window === "undefined") return Promise.resolve(false);
  if (typeof document === "undefined") return Promise.resolve(false);
  if (typeof window.gtag === "function") return Promise.resolve(true);
  if (gtagLoadPromise) return gtagLoadPromise;

  gtagLoadPromise = new Promise((resolve) => {
    // Bootstrap dataLayer + gtag stub immediately so events can queue.
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    // Load gtag.js only once.
    const existing = document.querySelector('script[data-gtag="true"]');
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      script.setAttribute("data-gtag", "true");
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    } else {
      resolve(true);
    }

    // Configure GA4. Disable automatic page_view; SPA will send explicitly.
    try {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        send_page_view: false,
        debug_mode: import.meta.env.DEV,
      });
    } catch {
      // ignore
    }
  });

  return gtagLoadPromise;
}

export function trackEvent(name, params = {}) {
  if (!GA_ID) return;
  if (typeof window === "undefined") return;

  // Fire-and-forget: ensure loader is bootstrapped, then queue event.
  ensureGtagLoaded();
  try {
    window.gtag?.("event", name, { ...params });
  } catch {
    // ignore
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics:event]", name, params);
  }
}

export function trackPageView(path) {
  if (!GA_ID) return;
  if (typeof window === "undefined") return;

  const normalizedPath = path || window.location.pathname + window.location.search;
  // Avoid duplicate page_view in dev (React StrictMode double-invokes effects).
  if (import.meta.env.DEV && lastPageViewPath === normalizedPath) return;
  lastPageViewPath = normalizedPath;

  ensureGtagLoaded();
  try {
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: normalizedPath,
      page_title: document?.title,
    });
  } catch {
    // ignore
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics:page_view]", normalizedPath);
  }
}

export function captureError(error, context = {}) {
  if (!SENTRY_DSN) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[error]", error, context);
    }
    return;
  }

  // Fire-and-forget: initialize in background and capture.
  ensureSentryInitialized().then((Sentry) => {
    if (!Sentry) return;
    try {
      Sentry.captureException(error, { extra: context });
    } catch {
      // ignore
    }
  });

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error("[sentry]", error, context);
  }
}
