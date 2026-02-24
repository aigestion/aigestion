import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getCache, setCache, getCacheStats } from '../cache/redis';

// ═══════════════════════════════════════════════════════════════
// AIGestion Nexus — Redis Cache Middleware — God Mode
// Features: X-Cache headers, TTL tiers, route namespacing
// ═══════════════════════════════════════════════════════════════

/** TTL tier presets (seconds) */
export const TTL = {
  SHORT: 60,        // 1 min  — volatile data
  MEDIUM: 300,      // 5 min  — API responses
  LONG: 3600,       // 1 hour — stable data
  EXTENDED: 86400,  // 24 hrs — configuration / mostly static
} as const;

/**
 * Middleware to cache GET responses in Redis with X-Cache headers.
 * @param ttlSeconds Seconds to cache the response (default: MEDIUM)
 * @param namespace Optional route namespace for cache key isolation
 */
export const redisCache = (ttlSeconds: number = TTL.MEDIUM, namespace?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const ns = namespace || 'api';
    const key = `cache:${ns}:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(key);
      if (cachedData) {
        logger.debug({ key }, 'Redis Cache Hit');
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-TTL', String(ttlSeconds));
        return res.json(cachedData);
      }

      // Cache MISS
      res.setHeader('X-Cache', 'MISS');

      // Override res.json to capture the response and store it in cache
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(key, body, ttlSeconds).catch(err =>
            logger.warn({ err, key }, 'Failed to set Redis cache'),
          );
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.warn({ error, key }, 'Redis cache middleware error');
      res.setHeader('X-Cache', 'ERROR');
      next();
    }
  };
};

/**
 * Express endpoint handler to expose cache stats.
 * Mount at: GET /api/v1/cache/stats
 */
export const cacheStatsHandler = (_req: Request, res: Response) => {
  const stats = getCacheStats();
  res.json({
    status: 'ok',
    provider: 'Redis God Mode',
    ...stats,
    timestamp: new Date().toISOString(),
  });
};
