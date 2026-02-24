/**
 * 🌌 Sentry God Mode — AIGestion Nexus Backend
 *
 * MUST be imported as the very first module in bootstrap.ts
 * so Sentry can monkey-patch Node internals before anything else loads.
 *
 * Region: EU (de.sentry.io)
 *
 * Features:
 *  - HTTP / Express / Mongo / Redis auto-instrumentation
 *  - GraphQL resolver tracing
 *  - Console breadcrumbs (auto-captures logger output)
 *  - Security scrubbing (auth headers, cookies, API keys)
 *  - CRON & queue monitoring helpers
 *  - User context injection
 */
import * as Sentry from '@sentry/node';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: `aigestion-nexus@${process.env.npm_package_version || '1.0.0'}`,
  serverName: process.env.HOSTNAME || 'nexus-backend',
  enabled: !!process.env.SENTRY_DSN,

  // ── Performance ──────────────────────────────────────────────
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  profilesSampleRate: isProduction ? 0.1 : 0.5,

  // ── Breadcrumbs ──────────────────────────────────────────────
  maxBreadcrumbs: 100,

  // ── Integrations ─────────────────────────────────────────────
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.mongoIntegration(),
    Sentry.redisIntegration(),
    Sentry.graphqlIntegration(),
    Sentry.consoleIntegration(),
  ],

  // ── Filtering ────────────────────────────────────────────────
  ignoreErrors: [
    'ECONNREFUSED',
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
    /ResizeObserver loop/,
    /Failed to fetch/,
    /ENOTFOUND/,
    /getaddrinfo/,
  ],

  // ── Security: strip sensitive data from events ───────────────
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-api-key'];
      delete event.request.headers['x-forwarded-for'];
    }
    // Scrub sensitive data from request body
    if (event.request?.data) {
      const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
      for (const key of sensitiveKeys) {
        if (
          typeof event.request.data === 'object' &&
          event.request.data !== null &&
          key in event.request.data
        ) {
          (event.request.data as Record<string, unknown>)[key] = '[REDACTED]';
        }
      }
    }
    return event;
  },

  // ── Drop noisy health-check transactions ─────────────────────
  beforeSendTransaction(event) {
    if (event.transaction?.includes('/health') || event.transaction?.includes('/ready')) {
      return null;
    }
    return event;
  },

  // ── Breadcrumb filtering ─────────────────────────────────────
  beforeBreadcrumb(breadcrumb) {
    // Filter out noisy health-check breadcrumbs
    if (
      breadcrumb.category === 'http' &&
      (breadcrumb.data?.url as string | undefined)?.includes('/health')
    ) {
      return null;
    }
    // Filter out noisy Redis PING/PONG
    if (breadcrumb.category === 'redis' && breadcrumb.message?.includes('PING')) {
      return null;
    }
    return breadcrumb;
  },
});

// ── CRON Monitoring Helper ──────────────────────────────────────
/**
 * Wrap a CRON job callback with Sentry CRON monitoring.
 * Usage: cronJob.schedule(sentryCheckIn('daily-backup', myCallback))
 */
export function sentryCheckIn(monitorSlug: string, callback: () => Promise<void> | void) {
  return async () => {
    const checkInId = Sentry.captureCheckIn({
      monitorSlug,
      status: 'in_progress',
    });
    try {
      await callback();
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug,
        status: 'ok',
      });
    } catch (err) {
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug,
        status: 'error',
      });
      Sentry.captureException(err);
      throw err;
    }
  };
}

// ── Queue Job Monitoring Helper ─────────────────────────────────
/**
 * Wrap a BullMQ worker processor with Sentry tracing.
 * Usage: new Worker('queueName', sentryWorker('my-queue', processor))
 */
export function sentryWorker<T>(queueName: string, processor: (job: T) => Promise<void>) {
  return async (job: T) => {
    return Sentry.startSpan(
      {
        op: 'queue.process',
        name: `bullmq.${queueName}`,
      },
      async () => {
        try {
          await processor(job);
        } catch (err) {
          Sentry.captureException(err, {
            tags: { queue: queueName },
          });
          throw err;
        }
      },
    );
  };
}

// ── User Context Setter ─────────────────────────────────────────
/**
 * Call from auth middleware after JWT verification to attach user
 * context to all Sentry events for the current request.
 */
export function setSentryUser(user: { id: string; email?: string; role?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    ...(user.role ? { role: user.role } : {}),
  } as Sentry.User);
}

/**
 * Clear user context (e.g., on logout or request end).
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

// ── Boot Log ────────────────────────────────────────────────────
if (process.env.SENTRY_DSN) {
  console.log('🌌 [Sentry] God Mode initialized — EU region (de.sentry.io)');
  console.log(`   ├─ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   ├─ Traces: ${isProduction ? '20%' : '100%'}`);
  console.log(`   ├─ Profiles: ${isProduction ? '10%' : '50%'}`);
  console.log(`   └─ Integrations: HTTP, Express, Mongo, Redis, GraphQL, Console`);
} else {
  console.log('⚠️ [Sentry] DSN not set — running without error tracking');
}

export { Sentry };
