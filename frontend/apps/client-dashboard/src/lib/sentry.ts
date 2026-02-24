/**
 * 🌌 Sentry God Mode — client-dashboard
 * MUST be imported as first module in main.tsx
 */
import { initSentry } from '@aigestion/sentry-config';

initSentry({ appName: 'client-dashboard', version: '2.0.0' });
