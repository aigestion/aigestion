import { injectable } from 'inversify';
import { getRedisClient } from '../cache/redis';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

@injectable()
export class RateLimitService {
  /**
   * Increments a counter for a specific key and checks if it exceeds the limit.
   * If the key doesn't exist, it sets it with the specified expiration window.
   *
   * @param key The unique key to rate limit (e.g., "2fa:userId")
   * @param limit Maximum allowed attempts
   * @param windowSeconds Time window in seconds
   * @throws AppError if limit is exceeded
   */
  async incrementAndCheck(key: string, limit: number, windowSeconds: number): Promise<void> {
    const redis = getRedisClient();

    if (!redis || !redis.isOpen) {
      logger.warn('Redis not available for rate limiting, skipping check');
      return;
    }

    try {
      // INCR returns the new value
      const current = await redis.incr(key);

      // If this is the first request (current === 1), set expiration
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (current > limit) {
        const ttl = await redis.ttl(key);
        throw new AppError(
            `Too many attempts. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
            429,
            'RATE_LIMIT_EXCEEDED'
        );
      }
    } catch (error: any) {
      // Re-throw AppErrors (rate limit exceeded)
      if (error instanceof AppError) {
        throw error;
      }
      // Log other Redis errors but don't block the user flow generally,
      // unless strict sec is required. For now, log and proceed is "safer" for availability,
      // but "fail open" might be bad for security.
      // Given this is a security feature, "fail closed" (block) is safer but risky for UX if Redis dies.
      // Decision: Let's log error and allow access to avoid lockout if Redis blips,
      // UNLESS it's the specific AppError we threw above.
      logger.error({ error, key }, 'Rate limit service error');
    }
  }

  /**
   * Resets (deletes) the rate limit key. Useful on successful verification.
   */
  async reset(key: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis || !redis.isOpen) return;

    try {
      await redis.del(key);
    } catch (error) {
      logger.error({ error, key }, 'Failed to reset rate limit key');
    }
  }
}
