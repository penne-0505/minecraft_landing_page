// Minimal no-op analytics hooks (GA4 / Sentry placeholders).
// Populate VITE_GA4_MEASUREMENT_ID and VITE_SENTRY_DSN to enable real tracking later.

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function trackEvent(name, params = {}) {
  if (!GA_ID) {
    // no-op
    return;
  }
  // Placeholder: replace with gtag or GA library call once GA is enabled.
  // window.gtag?.("event", name, { ...params });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, params);
  }
}

export function captureError(error, context = {}) {
  if (!SENTRY_DSN) {
    // fallback to console in dev
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[error]", error, context);
    }
    return;
  }
  // Placeholder: replace with Sentry.captureException when DSN is set.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error("[sentry placeholder]", error, context);
  }
}
