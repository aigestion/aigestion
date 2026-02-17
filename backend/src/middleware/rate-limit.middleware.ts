import { NextFunction, Request, Response } from 'express';
import { config } from '../config/config';
import { logger } from '../utils/logger';

// Default Limits (per window)
const LIMITS = {
  AUTH: config.rateLimit.auth.max,
  AI: config.rateLimit.ai.max,
  GENERAL: config.rateLimit.plans.default.max,
  MCP: 20, // 20 requests per minute for bridge health/proxy
};

const WINDOW_MS = 60 * 1000; // 1 Minute

export class RateLimitMiddleware {
  private readonly redis: any = null;
  private readonly _logger: any;

  constructor(redisClient: any, loggerInstance: any) {
    this.redis = redisClient;
    this._logger = loggerInstance;
  }

  /**
   * Factory method to create a middleware handler for a specific limit type
   */
  public attempt(type: 'AUTH' | 'AI' | 'GENERAL' | 'MCP') {
    return async (req: Request, res: Response, next: NextFunction) => {
      // 1. Fail open if Redis is down
      if (!this.redis?.isOpen) {
        return next();
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const user = (req as any).user;

      // Skip for God role
      if (user?.role === 'god') {
        return next();
      }

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
          this._logger.warn(`Rate limit exceeded for IP ${ip} on ${type} route`);
          res.status(429).json({
            error: 'Demasiadas Peticiones',
            message: 'Por favor, inténtalo de nuevo más tarde.',
            retryAfter: Math.ceil(WINDOW_MS / 1000),
          });
          return;
        }

        next();
      } catch (err) {
        this._logger.error('Rate limiter error', err);
        next(); // Fail open
      }
    };
  }
}

// Export a singleton instance for backward compatibility
const rateLimitMiddleware = new RateLimitMiddleware(null, logger);

// Export the dynamic rate limiter function
export const dynamicRateLimiter = rateLimitMiddleware.attempt('GENERAL');
