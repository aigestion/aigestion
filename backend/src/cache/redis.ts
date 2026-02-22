import type { RedisClientType } from 'redis';
import * as redis from 'redis';

import { logger } from '../utils/logger';

export const resetRedisClient = () => {
  if (redisClient && redisClient.isOpen) {
    redisClient.quit();
  }
  redisClient = null;
};
let redisClient: RedisClientType | null = null;

export const getRedisClient = (): RedisClientType => {
  if (process.env.ENABLE_REDIS === 'false') {
    // Return a mock that satisfies basic needs of rate-limit-redis and other consumers
    if (!redisClient) {
      redisClient = {
        on: () => {},
        connect: async () => {},
        quit: async () => {},
        isOpen: true,
        isReady: true,
        status: 'ready',
        get: async () => null,
        set: async () => 'OK',
        setEx: async () => 'OK',
        sendCommand: async () => null,
        del: async () => 1,
        hGet: async () => null,
        hSet: async () => 1,
        hGetAll: async () => ({}),
        exists: async () => 0,
        expire: async () => true,
        ttl: async () => -1,
        incr: async () => 1,
        decr: async () => 0,
        lPush: async () => 1,
        lTrim: async () => 'OK',
        lRange: async () => [],
        ping: async () => 'PONG',
        flushDb: async () => 'OK',
        // Add others as needed
      } as any;
      logger.info('Redis is disabled: Using God Mode Mock');
    }
    return redisClient!;
  }

  if (!redisClient) {
    const clusterNodes = process.env.REDIS_CLUSTER_NODES;

    if (clusterNodes) {
      // Cluster Connection
      const nodes = clusterNodes.split(',').map(url => ({ url: url.trim() }));
      logger.info(`Initializing Redis Cluster with nodes: ${JSON.stringify(nodes)}`);

      redisClient = redis.createCluster({
        rootNodes: nodes,
        defaults: {
          socket: {
            reconnectStrategy: retries => Math.min(retries * 100, 5000),
          },
        },
      }) as unknown as RedisClientType; // Cast compatibility
    } else {
      // Standalone Connection
      const redisUrl = process.env.REDIS_URL;
      const host = process.env.REDIS_HOST || 'localhost';
      const port = process.env.REDIS_PORT || '6379';
      const password = process.env.REDIS_PASSWORD;
      const url =
        redisUrl || (password ? `redis://:${password}@${host}:${port}` : `redis://${host}:${port}`);

      logger.info({ url, redisUrl, host, port }, 'Initializing Redis Standalone');

      redisClient = redis.createClient({
        url,
        socket: {
          reconnectStrategy: retries => {
            if (retries > 50) {
              logger.error(
                `Redis reconnection GAVE UP after 50 attempts. Manual intervention required.`
              );
              return new Error('Redis reconnection failed');
            }
            const delay = Math.min(retries * 200, 5000);
            if (retries > 10) {
              logger.warn(`Redis reconnection attempt ${retries}. Delay: ${delay}ms`);
            }
            return delay;
          },
        },
      }) as RedisClientType;
    }

    if (redisClient) {
      redisClient.on('error', (err: Error) => {
        logger.error(err, 'Redis Client Error:');
      });
    }

    // Connect in the background
    const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;

    if (!isTest) {
      (async () => {
        try {
          await redisClient?.connect();
          logger.info(
            clusterNodes ? 'Connected to Redis Cluster' : 'Connected to Redis Standalone'
          );
        } catch (err) {
          logger.error(err, 'Failed to connect to Redis:');
        }
      })();
    }
  }
  return redisClient;
};

// Utility function to safely close the Redis connection
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

// In-memory L1 cache
const l1Cache = new Map<string, { value: any; expiry: number }>();
const MAX_L1_SIZE = 1000;

// Proactive L1 GC — sweeps every 5 minutes regardless of write volume
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of l1Cache) {
    if (v.expiry < now) l1Cache.delete(k);
  }
}, 5 * 60 * 1000).unref();

import { promisify } from 'node:util';
import { deflate, inflate } from 'node:zlib';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

/**
 * Get value from layered cache
 * L1: Memory (fastest)
 * L2: Redis (distributed)
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  // Check L1 first
  const l1Item = l1Cache.get(key);
  if (l1Item && l1Item.expiry > Date.now()) {
    logger.debug({ key }, 'L1 Cache Hit');
    return l1Item.value;
  }

  // L1 Miss or Expired, try L2 (Redis)
  const client = getRedisClient();
  if (client?.isOpen) {
    try {
      const data = await client.get(key);
      if (data) {
        let value: any;

        // Handle decompression if payload is compressed
        if (data.startsWith('gz:')) {
          const compressed = Buffer.from(data.substring(3), 'base64');
          const decompressed = await inflateAsync(compressed);
          value = JSON.parse(decompressed.toString());
          logger.debug({ key }, 'L2 Cache Hit (Decompressed)');
        } else {
          value = JSON.parse(data);
          logger.debug({ key }, 'L2 Cache Hit');
        }

        // Populate L1 for subsequent requests
        l1Cache.set(key, {
          value,
          expiry: Date.now() + 5 * 60 * 1000,
        });

        return value;
      }
    } catch (error) {
      logger.warn({ error, key }, 'Redis get error');
    }
  }

  return null;
};

/**
 * Set value in layered cache
 * Sets both L1 and L2
 */
export const setCache = async (key: string, value: any, ttlSeconds = 3600): Promise<boolean> => {
  // Set L1
  l1Cache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });

  // Simple L1 GC
  if (l1Cache.size > MAX_L1_SIZE) {
    const now = Date.now();
    for (const [k, v] of l1Cache) {
      if (v.expiry < now) {
        l1Cache.delete(k);
      }
    }
  }

  // Set L2 (Redis)
  const client = getRedisClient();
  if (client?.isOpen) {
    try {
      let data = JSON.stringify(value);

      // Compress if payload is large (> 1KB)
      if (data.length > 1024) {
        const compressed = await deflateAsync(data);
        data = 'gz:' + compressed.toString('base64');
        logger.debug({ key, originalSize: data.length }, 'L2 Cache Compressed');
      }

      await client.set(key, data, {
        EX: ttlSeconds,
      });
      return true;
    } catch (error) {
      logger.warn({ error, key }, 'Redis set error');
    }
  }

  return true;
};
