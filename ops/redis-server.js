#!/usr/bin/env node

/**
 * Redis MCP Server — God Mode
 * Live Redis connection for cache management
 * AIGestion Nexus 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { createClient } = require('redis');

class RedisMCPServer {
  constructor() {
    this.server = new Server(
      { name: 'redis-godmode', version: '2.0.0' },
      { capabilities: { tools: {} } },
    );
    this.redis = null;
    this.setupTools();
    this.setupErrorHandling();
  }

  async getRedis() {
    if (this.redis && this.redis.isOpen) return this.redis;

    const url =
      process.env.REDIS_URL ||
      (process.env.REDIS_PASSWORD
        ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
        : `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);

    const isTLS = url.startsWith('rediss://');

    this.redis = createClient({
      url,
      socket: {
        tls: isTLS,
        reconnectStrategy: retries => (retries > 10 ? new Error('Max retries') : retries * 200),
      },
    });

    this.redis.on('error', err => console.error('[Redis MCP] Connection error:', err.message));

    try {
      await this.redis.connect();
      console.error('[Redis MCP] Connected to Redis — God Mode');
    } catch (err) {
      console.error('[Redis MCP] Failed to connect:', err.message);
      this.redis = null;
      throw err;
    }

    return this.redis;
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'redis_set',
          description: 'Set a Redis key-value pair with optional TTL',
          inputSchema: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Redis key' },
              value: { type: 'string', description: 'Value to store' },
              ttl: { type: 'number', description: 'TTL in seconds (optional)' },
            },
            required: ['key', 'value'],
          },
        },
        {
          name: 'redis_get',
          description: 'Get a value by key from Redis',
          inputSchema: {
            type: 'object',
            properties: { key: { type: 'string', description: 'Redis key' } },
            required: ['key'],
          },
        },
        {
          name: 'redis_delete',
          description: 'Delete a key from Redis',
          inputSchema: {
            type: 'object',
            properties: { key: { type: 'string', description: 'Redis key' } },
            required: ['key'],
          },
        },
        {
          name: 'redis_health',
          description: 'Check Redis health: PING, memory, clients, uptime',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'redis_cache_info',
          description: 'Get detailed Redis INFO (memory, stats, keyspace)',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'redis_flush_cache',
          description: 'Flush the current Redis database',
          inputSchema: {
            type: 'object',
            properties: {
              confirm: {
                type: 'boolean',
                description: 'Must be true to execute flush',
              },
            },
            required: ['confirm'],
          },
        },
        {
          name: 'redis_keys',
          description: 'Scan for keys matching a pattern (uses SCAN, not KEYS)',
          inputSchema: {
            type: 'object',
            properties: {
              pattern: { type: 'string', description: 'Glob pattern (e.g., aig:cache:*)' },
              count: { type: 'number', description: 'Max keys to return (default 50)' },
            },
            required: ['pattern'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;
      try {
        switch (name) {
          case 'redis_set':
            return await this.setValue(args);
          case 'redis_get':
            return await this.getValue(args);
          case 'redis_delete':
            return await this.deleteKey(args);
          case 'redis_health':
            return await this.healthCheck();
          case 'redis_cache_info':
            return await this.getCacheInfo();
          case 'redis_flush_cache':
            return await this.flushCache(args);
          case 'redis_keys':
            return await this.scanKeys(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{ type: 'text', text: `❌ Error: ${error.message}` }],
        };
      }
    });
  }

  async setValue({ key, value, ttl }) {
    const client = await this.getRedis();
    if (ttl) {
      await client.set(key, value, { EX: ttl });
    } else {
      await client.set(key, value);
    }
    return {
      content: [
        {
          type: 'text',
          text: `✅ SET "${key}" = "${value.substring(0, 100)}${value.length > 100 ? '...' : ''}"${ttl ? ` (TTL: ${ttl}s)` : ''}`,
        },
      ],
    };
  }

  async getValue({ key }) {
    const client = await this.getRedis();
    const value = await client.get(key);
    return {
      content: [
        {
          type: 'text',
          text: value !== null ? `✅ GET "${key}" = ${value}` : `⚠️ Key "${key}" not found`,
        },
      ],
    };
  }

  async deleteKey({ key }) {
    const client = await this.getRedis();
    const count = await client.del(key);
    return {
      content: [
        {
          type: 'text',
          text: count > 0 ? `✅ DEL "${key}" — removed` : `⚠️ Key "${key}" did not exist`,
        },
      ],
    };
  }

  async healthCheck() {
    const start = Date.now();
    const client = await this.getRedis();
    const pong = await client.ping();
    const latency = Date.now() - start;

    const info = await client.sendCommand(['INFO', 'server']);
    const memInfo = await client.sendCommand(['INFO', 'memory']);
    const clientsInfo = await client.sendCommand(['INFO', 'clients']);

    const extract = (text, key) => {
      const match = text.match(new RegExp(`${key}:(.+)`));
      return match ? match[1].trim() : 'N/A';
    };

    return {
      content: [
        {
          type: 'text',
          text: [
            `🟢 Redis Health Check — God Mode`,
            `─────────────────────────────────`,
            `PING: ${pong} (${latency}ms)`,
            `Version: ${extract(info, 'redis_version')}`,
            `Uptime: ${extract(info, 'uptime_in_days')} days`,
            `Memory Used: ${extract(memInfo, 'used_memory_human')}`,
            `Memory Peak: ${extract(memInfo, 'used_memory_peak_human')}`,
            `Connected Clients: ${extract(clientsInfo, 'connected_clients')}`,
            `OS: ${extract(info, 'os')}`,
          ].join('\n'),
        },
      ],
    };
  }

  async getCacheInfo() {
    const client = await this.getRedis();
    const stats = await client.sendCommand(['INFO', 'stats']);
    const keyspace = await client.sendCommand(['INFO', 'keyspace']);
    const memory = await client.sendCommand(['INFO', 'memory']);

    const extract = (text, key) => {
      const match = text.match(new RegExp(`${key}:(.+)`));
      return match ? match[1].trim() : 'N/A';
    };

    const hits = parseInt(extract(stats, 'keyspace_hits')) || 0;
    const misses = parseInt(extract(stats, 'keyspace_misses')) || 0;
    const hitRate = hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : 'N/A';

    return {
      content: [
        {
          type: 'text',
          text: [
            `📊 Redis Cache Info — God Mode`,
            `─────────────────────────────────`,
            `Hit Rate: ${hitRate}%`,
            `Keyspace Hits: ${hits}`,
            `Keyspace Misses: ${misses}`,
            `Ops/sec: ${extract(stats, 'instantaneous_ops_per_sec')}`,
            `Memory Used: ${extract(memory, 'used_memory_human')}`,
            `Memory Fragmentation: ${extract(memory, 'mem_fragmentation_ratio')}`,
            `Evicted Keys: ${extract(stats, 'evicted_keys')}`,
            `Expired Keys: ${extract(stats, 'expired_keys')}`,
            `Total Commands: ${extract(stats, 'total_commands_processed')}`,
            ``,
            `Keyspace:`,
            keyspace.split('\n').filter(l => l.startsWith('db')).join('\n') || 'Empty',
          ].join('\n'),
        },
      ],
    };
  }

  async flushCache({ confirm }) {
    if (!confirm) {
      return {
        content: [{ type: 'text', text: '⚠️ Set confirm=true to execute flush' }],
      };
    }
    const client = await this.getRedis();
    await client.flushDb();
    return {
      content: [{ type: 'text', text: '🔴 Redis database flushed' }],
    };
  }

  async scanKeys({ pattern, count = 50 }) {
    const client = await this.getRedis();
    const keys = [];
    let cursor = 0;
    do {
      const result = await client.sendCommand([
        'SCAN', String(cursor), 'MATCH', pattern, 'COUNT', '100',
      ]);
      cursor = parseInt(result[0], 10);
      keys.push(...result[1]);
      if (keys.length >= count) break;
    } while (cursor !== 0);

    const limited = keys.slice(0, count);
    return {
      content: [
        {
          type: 'text',
          text: [
            `🔍 SCAN "${pattern}" — ${limited.length} keys${keys.length > count ? ` (truncated to ${count})` : ''}`,
            `─────────────────────────────────`,
            ...limited.map((k, i) => `${i + 1}. ${k}`),
            limited.length === 0 ? 'No keys found' : '',
          ]
            .filter(Boolean)
            .join('\n'),
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = error => console.error('[Redis MCP Error]', error);
    process.on('SIGINT', async () => {
      if (this.redis) await this.redis.quit().catch(() => {});
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🔴 Redis MCP Server v2.0 — God Mode — Running on stdio');
  }
}

if (require.main === module) {
  const server = new RedisMCPServer();
  server.run().catch(console.error);
}

module.exports = RedisMCPServer;
