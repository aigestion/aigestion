import { logger } from './logger';
import { getCache, getClient, setCache } from './redis';

const l1Cache = new Map<string, { value: any; expires: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const DEFAULT_L1_TTL = 60; // seconds for L1

/**
 * Cache Manager: L1 (In-Memory) + L2 (Redis) layered strategy.
 * Includes resilience and thundering herd prevention.
 */
export const cache = {
  /**
   * Get value from cache with Generic support
   */
  get: async <T>(key: string): Promise<T | null> => {
    const now = Date.now();

    // 1. L1 Check
    const l1Item = l1Cache.get(key);
    if (l1Item && l1Item.expires > now) {
      logger.debug({ key }, 'Cache L1 HIT');
      return l1Item.value as T;
    }

    if (l1Item) l1Cache.delete(key);

    // 2. Thundering Herd Prevention: Coalesce multiple requests for the same key
    if (pendingRequests.has(key)) {
      logger.debug({ key }, 'Cache Pending Request JOIN');
      return pendingRequests.get(key);
    }

    const fetchPromise = (async () => {
      try {
        // 3. L2 Check (Redis)
        const value = await getCache(key);

        if (value !== null) {
          logger.debug({ key }, 'Cache L2 HIT');
          l1Cache.set(key, {
            value,
            expires: Date.now() + DEFAULT_L1_TTL * 1000,
          });
          return value as T;
        }
      } catch (error) {
        logger.warn({ error, key }, 'Redis L2 Cache Error - Falling back to DB/Origin');
      }

      return null;
    })();

    pendingRequests.set(key, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      pendingRequests.delete(key);
    }
  },

  /**
   * Set value in cache with L1/L2 write-through
   */
  set: async (key: string, value: any, options?: { ttl?: number; tags?: string[] }) => {
    const ttl = options?.ttl || 300;
    const now = Date.now();

    try {
      // Set L1
      l1Cache.set(key, {
        value,
        expires: now + Math.min(ttl, DEFAULT_L1_TTL) * 1000,
      });

      // Set L2
      const success = await setCache(key, value, ttl);
      if (!success) {
        logger.warn({ key }, 'Redis L2 Set Failed');
      }
      return success;
    } catch (error) {
      logger.error({ error, key }, 'Cache Set Error');
      return false;
    }
  },

  /**
   * Delete value from cache (Purge L1 and L2)
   */
  delete: async (key: string) => {
    l1Cache.delete(key);
    const redisClient = getClient();
    if (!redisClient || !redisClient.isOpen) {
      return true; // Consider it deleted if we can't reach L2
    }
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error({ error, key }, 'Cache delete error');
      return false;
    }
  },

  /**
   * Status and Stats
   */
  getStats: () => {
    const redisClient = getClient();
    return {
      connected: redisClient?.isOpen || false,
      strategy: 'layered-resilient',
      l1Size: l1Cache.size,
      pendingCount: pendingRequests.size,
    };
  },

  /**
   * Clear all L1 memory
   */
  clearL1: () => {
    l1Cache.clear();
    pendingRequests.clear();
  },

  close: async () => {
    l1Cache.clear();
    pendingRequests.clear();
    const redisClient = getClient();
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  },
};
