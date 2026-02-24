/**
 * 🌌 Sentry God Mode — Shared Frontend Config
 *
 * Factory function + ErrorBoundary for all AIGestion React apps.
 * Region: EU (de.sentry.io)
 */
export { initSentry, setSentryUser, clearSentryUser } from './sentry';
export { SentryErrorBoundary } from './ErrorBoundary';
