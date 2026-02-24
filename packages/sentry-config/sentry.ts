/**
 * 🌌 Sentry God Mode — Shared Frontend Initializer
 *
 * All AIGestion React apps call `initSentry()` with app-specific params.
 * This ensures consistent configuration across the ecosystem.
 *
 * Features:
 *  - Browser tracing with route instrumentation
 *  - Session Replay (10% normal, 100% on error)
 *  - Error + URL filtering for browser noise
 *  - Security scrubbing
 */
import * as Sentry from '@sentry/react';

export interface SentryInitOptions {
  appName: string;
  version?: string;
}

export function initSentry({ appName, version = '2.0.0' }: SentryInitOptions) {
  const dsn = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || '';
  const isProd = (typeof import.meta !== 'undefined' && import.meta.env?.PROD) || false;

  Sentry.init({
    dsn,
    environment: (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 'development',
    release: `aigestion-${appName}@${version}`,
    enabled: !!dsn,

    // ── Integrations ─────────────────────────────────────────────
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // ── Performance ──────────────────────────────────────────────
    tracesSampleRate: isProd ? 0.2 : 1.0,

    // ── Session Replay ───────────────────────────────────────────
    replaysSessionSampleRate: 0.1,   // 10% of sessions
    replaysOnErrorSampleRate: 1.0,   // 100% of sessions with errors

    // ── Breadcrumbs ──────────────────────────────────────────────
    maxBreadcrumbs: 80,

    // ── Filtering ────────────────────────────────────────────────
    ignoreErrors: [
      /ResizeObserver loop/,
      /Non-Error promise rejection/,
      /Loading chunk .* failed/,
      /Network request failed/,
      /Failed to fetch/,
      /Load failed/,
      /AbortError/,
      /TypeError: cancelled/,
      /TypeError: NetworkError/,
    ],
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
    ],

    // ── Security: strip sensitive data ───────────────────────────
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },

    // ── Drop noisy transactions ──────────────────────────────────
    beforeSendTransaction(event) {
      if (event.transaction?.includes('/health') || event.transaction?.includes('/ready')) {
        return null;
      }
      return event;
    },
  });

  if (dsn) {
    console.log(`🌌 [Sentry] ${appName} God Mode initialized — EU (de.sentry.io)`);
  }
}

// ── User Context ──────────────────────────────────────────────────
export function setSentryUser(user: { id: string; email?: string; role?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    ...(user.role ? { role: user.role } : {}),
  } as Sentry.User);
}

export function clearSentryUser() {
  Sentry.setUser(null);
}

export { Sentry };
