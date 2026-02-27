import type { RedisClientType } from 'redis';
import * as redis from 'redis';

import { logger } from '../utils/logger';

// ═══════════════════════════════════════════════════════════════
// AIGestion Nexus — Redis God Mode Cache Layer
// L1: In-Memory | L2: Redis (Local or Cloud Enterprise)
// Features: Metrics, Namespacing, TLS, Compression, Health Monitor
// ═══════════════════════════════════════════════════════════════

// ─── Cache Metrics ───────────────────────────────────────────
const metrics = {
  l1Hits: 0,
  l1Misses: 0,
  l2Hits: 0,
  l2Misses: 0,
  l2Errors: 0,
  compressedWrites: 0,
  totalWrites: 0,
  lastHealthCheck: 0,
  isHealthy: false,
};

export const getCacheStats = () => ({
  ...metrics,
  l1HitRate: metrics.l1Hits + metrics.l1Misses > 0
    ? ((metrics.l1Hits / (metrics.l1Hits + metrics.l1Misses)) * 100).toFixed(1) + '%'
    : 'N/A',
  l2HitRate: metrics.l2Hits + metrics.l2Misses > 0
    ? ((metrics.l2Hits / (metrics.l2Hits + metrics.l2Misses)) * 100).toFixed(1) + '%'
    : 'N/A',
  l1Size: l1Cache.size,
  l1MaxSize: MAX_L1_SIZE,
});

// ─── Key Namespace ───────────────────────────────────────────
const KEY_PREFIX = process.env.REDIS_KEY_PREFIX || 'aig:';
const prefixKey = (key: string): string =>
  key.startsWith(KEY_PREFIX) ? key : `${KEY_PREFIX}${key}`;

// ─── Client Singleton ────────────────────────────────────────
let redisClient: RedisClientType | null = null;

export const resetRedisClient = () => {
  if (redisClient && redisClient.isOpen) {
    redisClient.quit().catch(() => {});
  }
  redisClient = null;
  metrics.isHealthy = false;
};

export const getRedisClient = (): RedisClientType => {
  if (process.env.ENABLE_REDIS === 'false') {
    if (!redisClient) {
      redisClient = createGodModeMock();
      logger.info('⚡ Redis God Mode Mock — ACTIVE (ENABLE_REDIS=false)');
    }
    return redisClient!;
  }

  if (!redisClient) {
    const clusterNodes = process.env.REDIS_CLUSTER_NODES;

    if (clusterNodes) {
      redisClient = createClusterClient(clusterNodes);
    } else {
      redisClient = createStandaloneClient();
    }

    attachEventHandlers(redisClient, !!clusterNodes);
    connectInBackground(redisClient, !!clusterNodes);
  }

  return redisClient;
};

// ─── Client Factories ────────────────────────────────────────
function createStandaloneClient(): RedisClientType {
  const redisUrl = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT || '6379';
  const password = process.env.REDIS_PASSWORD;
  const url =
    redisUrl || (password ? `redis://:${password}@${host}:${port}` : `redis://${host}:${port}`);

  const isTLS = url.startsWith('rediss://');

  logger.info(
    { host, port, tls: isTLS, hasPassword: !!password },
    '🔴 Initializing Redis Standalone — God Mode',
  );

  return redis.createClient({
    url,
    socket: {
      tls: isTLS,
      reconnectStrategy: (retries: number) => {
        if (retries > 50) {
          logger.error('Redis reconnection GAVE UP after 50 attempts.');
          metrics.isHealthy = false;
          return new Error('Redis reconnection failed');
        }
        const delay = Math.min(retries * 200, 5000);
        if (retries > 10) {
          logger.warn(`Redis reconnect attempt ${retries}. Delay: ${delay}ms`);
        }
        return delay;
      },
    },
  }) as RedisClientType;
}

function createClusterClient(clusterNodes: string): RedisClientType {
  const nodes = clusterNodes.split(',').map(url => ({ url: url.trim() }));
  logger.info({ nodes: nodes.length }, '🔴 Initializing Redis Cluster — God Mode');

  return redis.createCluster({
    rootNodes: nodes,
    defaults: {
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 100, 5000),
      },
    },
  }) as unknown as RedisClientType;
}

function createGodModeMock(): RedisClientType {
  return {
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
    keys: async () => [],
    scan: async () => ({ cursor: 0, keys: [] }),
  } as any;
}

// ─── Event Handlers ──────────────────────────────────────────
function attachEventHandlers(client: RedisClientType, isCluster: boolean): void {
  client.on('error', (err: Error) => {
    metrics.isHealthy = false;
    metrics.l2Errors++;
    logger.error(err, '🔴 Redis Client Error');
  });

  client.on('connect', () => {
    logger.info('🟢 Redis Connected');
  });

  client.on('ready', () => {
    metrics.isHealthy = true;
    logger.info(`🟢 Redis Ready (${isCluster ? 'Cluster' : 'Standalone'})`);
  });

  client.on('reconnecting', () => {
    metrics.isHealthy = false;
    logger.warn('🟡 Redis Reconnecting...');
  });

  client.on('end', () => {
    metrics.isHealthy = false;
    logger.warn('🔴 Redis Connection Closed');
  });
}

function connectInBackground(client: RedisClientType, isCluster: boolean): void {
  const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
  if (isTest) return;

  (async () => {
    try {
      await client.connect();
      metrics.isHealthy = true;
      logger.info(
        isCluster
          ? '🟢 Connected to Redis Cluster — God Mode'
          : '🟢 Connected to Redis Standalone — God Mode',
      );
    } catch (err: any) {
      metrics.isHealthy = false;
      logger.error(err, '🔴 Failed to connect to Redis');
    }
  })();
}

// ─── Health Monitor ──────────────────────────────────────────
let healthInterval: ReturnType<typeof setInterval> | null = null;

export const startHealthMonitor = (intervalMs = 30_000): void => {
  if (healthInterval) return;
  healthInterval = setInterval(async () => {
    const client = getRedisClient();
    if (!client?.isOpen) {
      metrics.isHealthy = false;
      return;
    }
    try {
      const start = Date.now();
      await client.ping();
      metrics.lastHealthCheck = Date.now();
      metrics.isHealthy = true;
      const latency = Date.now() - start;
      if (latency > 100) {
        logger.warn({ latency }, '🟡 Redis PING latency high');
      }
    } catch {
      metrics.isHealthy = false;
      metrics.l2Errors++;
      logger.error('🔴 Redis health check FAILED');
    }
  }, intervalMs);
  healthInterval.unref();
};

// ─── Graceful Shutdown ───────────────────────────────────────
export const closeRedis = async (): Promise<void> => {
  if (healthInterval) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {
      // already closed
    }
    redisClient = null;
    metrics.isHealthy = false;
    logger.info('🔴 Redis connection closed gracefully');
  }
};

// ═══════════════════════════════════════════════════════════════
// L1 In-Memory Cache
// ═══════════════════════════════════════════════════════════════
const l1Cache = new Map<string, { value: any; expiry: number }>();
const MAX_L1_SIZE = 1000;

// Proactive L1 GC — sweeps every 5 minutes
setInterval(() => {
  const now = Date.now();
  let swept = 0;
  l1Cache.forEach((v, k) => {
    if (v.expiry < now) {
      l1Cache.delete(k);
      swept++;
    }
  });
  if (swept > 0) {
    logger.debug({ swept, remaining: l1Cache.size }, 'L1 Cache GC');
  }
}, 5 * 60 * 1000).unref();

// ═══════════════════════════════════════════════════════════════
// Compression (zlib, for payloads > 1KB)
// ═══════════════════════════════════════════════════════════════
import { promisify } from 'node:util';
import { deflate, inflate } from 'node:zlib';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

const COMPRESSION_THRESHOLD = 1024; // 1KB

// ═══════════════════════════════════════════════════════════════
// Cache Operations — L1 + L2 Layered
// ═══════════════════════════════════════════════════════════════

/**
 * Get value from layered cache.
 * L1: Memory (fastest) → L2: Redis (distributed)
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  const prefixed = prefixKey(key);

  // L1 check
  const l1Item = l1Cache.get(prefixed);
  if (l1Item && l1Item.expiry > Date.now()) {
    metrics.l1Hits++;
    logger.debug({ key: prefixed }, 'L1 Cache Hit');
    return l1Item.value;
  }
  metrics.l1Misses++;

  // L2 (Redis)
  const client = getRedisClient();
  if (!client?.isOpen || !metrics.isHealthy) {
    metrics.l2Misses++;
    return null;
  }

  try {
    const data = await client.get(prefixed);
    if (data) {
      let value: any;

      if (data.startsWith('gz:')) {
        const compressed = Buffer.from(data.substring(3), 'base64');
        const decompressed = await inflateAsync(compressed);
        value = JSON.parse(decompressed.toString());
      } else {
        value = JSON.parse(data);
      }

      // Promote to L1 with smart TTL
      l1Cache.set(prefixed, {
        value,
        expiry: Date.now() + 2 * 60 * 1000, // 2 min L1 retention
      });

      metrics.l2Hits++;
      return value;
    }
    metrics.l2Misses++;
  } catch (error) {
    metrics.l2Errors++;
    logger.warn({ error, key: prefixed }, 'Redis GET error');
  }

  return null;
};

/**
 * Set value in layered cache.
 * Sets both L1 and L2.
 */
export const setCache = async (key: string, value: any, ttlSeconds = 3600): Promise<boolean> => {
  const prefixed = prefixKey(key);

  // L1
  l1Cache.set(prefixed, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });

  // L1 eviction
  if (l1Cache.size > MAX_L1_SIZE) {
    const now = Date.now();
    l1Cache.forEach((v, k) => {
      if (v.expiry < now) l1Cache.delete(k);
    });
    // If still over, evict oldest entries
    if (l1Cache.size > MAX_L1_SIZE) {
      const entries = Array.from(l1Cache.entries());
      entries
        .sort((a, b) => a[1].expiry - b[1].expiry)
        .slice(0, Math.floor(MAX_L1_SIZE * 0.2))
        .forEach(([k]) => l1Cache.delete(k));
    }
  }

  // L2 (Redis)
  const client = getRedisClient();
  if (!client?.isOpen) return true; // L1 succeeded

  try {
    let data = JSON.stringify(value);
    metrics.totalWrites++;

    // Compress if payload > threshold
    if (data.length > COMPRESSION_THRESHOLD) {
      const compressed = await deflateAsync(data);
      data = 'gz:' + compressed.toString('base64');
      metrics.compressedWrites++;
      logger.debug({ key: prefixed, originalSize: data.length }, 'L2 Compressed Write');
    }

    await client.set(prefixed, data, { EX: ttlSeconds });
    return true;
  } catch (error) {
    metrics.l2Errors++;
    logger.warn({ error, key: prefixed }, 'Redis SET error');
    return false;
  }
};

/**
 * Delete a specific key from both cache layers.
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  const prefixed = prefixKey(key);
  l1Cache.delete(prefixed);

  const client = getRedisClient();
  if (!client?.isOpen) return true;

  try {
    await client.del(prefixed);
    return true;
  } catch (error) {
    metrics.l2Errors++;
    logger.warn({ error, key: prefixed }, 'Redis DEL error');
    return false;
  }
};

/**
 * Invalidate all keys matching a pattern (e.g. 'aig:cache:users:*').
 * Uses SCAN to avoid blocking Redis.
 */
export const invalidatePattern = async (pattern: string): Promise<number> => {
  const prefixed = prefixKey(pattern);
  const client = getRedisClient();
  if (!client?.isOpen) return 0;

  let deleted = 0;
  try {
    let cursor = 0;
    do {
      const result = await client.sendCommand(['SCAN', String(cursor), 'MATCH', prefixed, 'COUNT', '100']) as [string, string[]];
      cursor = parseInt(result[0], 10);
      const keys = result[1];
      if (keys.length > 0) {
        await client.sendCommand(['DEL', ...keys]);
        deleted += keys.length;
        // Also evict from L1
        keys.forEach(k => l1Cache.delete(k));
      }
    } while (cursor !== 0);

    logger.info({ pattern: prefixed, deleted }, 'Cache pattern invalidation');
  } catch (error) {
    metrics.l2Errors++;
    logger.warn({ error, pattern: prefixed }, 'Redis SCAN/DEL error');
  }

  return deleted;
};

/**
 * Flush entire L1 cache (emergency).
 */
export const flushL1 = (): number => {
  const size = l1Cache.size;
  l1Cache.clear();
  logger.info({ flushed: size }, 'L1 Cache flushed');
  return size;
};
