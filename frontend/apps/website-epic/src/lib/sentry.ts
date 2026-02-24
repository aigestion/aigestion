/**
 * 🌌 Sentry God Mode — website-epic
 * MUST be imported as first module in main.tsx
 */
import { initSentry } from '@aigestion/sentry-config';

initSentry({ appName: 'website-epic', version: '2.0.0' });
