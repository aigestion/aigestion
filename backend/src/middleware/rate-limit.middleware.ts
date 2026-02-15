import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import { Logger } from '../utils/logger';

// Default Limits (per window)
const LIMITS = {
  AUTH: 5,        // Strict: Login/Register
  AI: 50,         // Moderate: AI Generation
  GENERAL: 1000,  // Loose: General API
};

const WINDOW_MS = 60 * 1000; // 1 Minute

export class RateLimitMiddleware {
  private redis: Redis | null = null;
  private logger: Logger;

  constructor(redisClient: Redis | null, logger: Logger) {
    this.redis = redisClient;
    this.logger = logger;
  }

  /**
   * Factory method to create a middleware handler for a specific limit type
   */
  public attempt(type: 'AUTH' | 'AI' | 'GENERAL') {
    return async (req: Request, res: Response, next: NextFunction) => {
      // 1. Fail open if Redis is down (or fallback to memory - simpler to fail open for now)
      if (!this.redis || this.redis.status !== 'ready') {
        // ideally we would log this once per minute to avoid spam, but for now:
        // this.logger.warn('Rate limiter disabled: Redis unavailable');
        return next();
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const key = `ratelimit:${type}:${ip}`;
      const limit = LIMITS[type];

      try {
        const current = await this.redis.incr(key);

        // Set expiry on first request
        if (current === 1) {
          await this.redis.expire(key, WINDOW_MS / 1000);
        }

        // Add headers (Legacy + Standard)
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
        res.setHeader('RateLimit-Limit', limit);
        res.setHeader('RateLimit-Remaining', Math.max(0, limit - current));

        if (current > limit) {
          this.logger.warn(`Rate limit exceeded for IP ${ip} on ${type} route`);
          res.status(429).json({
            error: 'Too Many Requests',
            message: 'Please try again later',
            retryAfter: Math.ceil(WINDOW_MS / 1000)
          });
          return;
        }

        next();
      } catch (err) {
        this.logger.error('Rate limiter error', err);
        next(); // Fail open
      }
    };
  }
}
import { getClient } from '../utils/redis';
import { logger } from '../utils/logger';

export const rateLimitMiddleware = new RateLimitMiddleware(getClient(), logger);
export const dynamicRateLimiter = rateLimitMiddleware.attempt('GENERAL');
