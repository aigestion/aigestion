#!/usr/bin/env node

/**
 * Redis MCP Server - Divine Level
 * Cache and session management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class RedisMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'redis',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'redis_set',
          description: 'Set Redis key-value pair',
          inputSchema: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Redis key' },
              value: { type: 'string', description: 'Redis value' },
              ttl: { type: 'number', description: 'Time to live in seconds (optional)' },
            },
            required: ['key', 'value'],
          },
        },
        {
          name: 'redis_get',
          description: 'Get Redis value by key',
          inputSchema: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Redis key' },
            },
            required: ['key'],
          },
        },
        {
          name: 'redis_delete',
          description: 'Delete Redis key',
          inputSchema: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Redis key' },
            },
            required: ['key'],
          },
        },
        {
          name: 'redis_cache_info',
          description: 'Get Redis cache information',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'redis_flush_cache',
          description: 'Flush Redis cache',
          inputSchema: {
            type: 'object',
            properties: {
              cache_type: {
                type: 'string',
                enum: ['all', 'db'],
                description: 'Cache type to flush',
              },
            },
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
          case 'redis_cache_info':
            return await this.getCacheInfo(args);
          case 'redis_flush_cache':
            return await this.flushCache(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async setValue(args) {
    const { key, value, ttl } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Redis SET Operation:\n\nKey: ${key}\nValue: ${value}\nTTL: ${ttl || 'No expiration'}\n\nNote: Actual Redis operations require Redis connection configuration.\n\nThis prepares the set operation for execution.`,
        },
      ],
    };
  }

  async getValue(args) {
    const { key } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Redis GET Operation:\n\nKey: ${key}\n\nNote: Actual Redis operations require Redis connection.\n\nThis prepares the get operation for execution.`,
        },
      ],
    };
  }

  async deleteKey(args) {
    const { key } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Redis DELETE Operation:\n\nKey: ${key}\n\nNote: Actual Redis operations require Redis connection.\n\nThis prepares the delete operation for execution.`,
        },
      ],
    };
  }

  async getCacheInfo(args) {
    return {
      content: [
        {
          type: 'text',
          text: `Redis Cache Information:\n\n- Memory usage\n- Connected clients\n- Operations per second\n- Key count\n\nNote: Actual cache info requires Redis connection.\n\nThis prepares cache information retrieval.`,
        },
      ],
    };
  }

  async flushCache(args) {
    const { cache_type } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Redis Flush Operation:\n\nCache Type: ${cache_type || 'all'}\n\nNote: Actual cache flush requires Redis connection and permissions.\n\nThis prepares cache flush operation.`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = error => console.error('[Redis MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Redis MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new RedisMCPServer();
  server.run().catch(console.error);
}

module.exports = RedisMCPServer;
