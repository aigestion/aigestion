import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getCache, setCache } from '../utils/redis';

/**
 * Middleware to cache responses in Redis
 * @param ttlSeconds Seconds to cache the response
 */
export const redisCache = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(key);
      if (cachedData) {
        logger.debug({ key }, 'Redis Cache Hit');
        return res.json(cachedData);
      }

      // Override res.json to capture the response and store it in cache
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        setCache(key, body, ttlSeconds).catch(err =>
          logger.warn({ err, key }, 'Failed to set Redis cache'),
        );
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.warn({ error, key }, 'Redis cache middleware error');
      next();
    }
  };
};
