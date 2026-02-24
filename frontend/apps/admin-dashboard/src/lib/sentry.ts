/**
 * 🌌 Sentry God Mode — admin-dashboard
 *
 * Browser SDK with tracing, session replay, error boundaries,
 * user context, and security scrubbing.
 * MUST be imported as first module in main.tsx.
 *
 * Region: EU (de.sentry.io)
 */
import { initSentry } from '@aigestion/sentry-config';

initSentry({ appName: 'admin-dashboard', version: '2.0.0' });

// Re-export for direct usage in components
export { Sentry, setSentryUser, clearSentryUser } from '@aigestion/sentry-config/sentry';
