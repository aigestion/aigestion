#!/usr/bin/env node

/**
 * Elasticsearch MCP Server - Divine Level
 * Search and analytics for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class ElasticsearchMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'elasticsearch',
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
          name: 'elasticsearch_search',
          description: 'Search documents in Elasticsearch',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              query: { type: 'object', description: 'Search query' },
              sort: { type: 'array', items: { type: 'object' }, description: 'Sort specification' },
              size: { type: 'number', description: 'Number of results' },
              from: { type: 'number', description: 'Starting offset' },
            },
            required: ['index', 'query'],
          },
        },
        {
          name: 'elasticsearch_index_document',
          description: 'Index document in Elasticsearch',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              id: { type: 'string', description: 'Document ID' },
              document: { type: 'object', description: 'Document to index' },
            },
            required: ['index', 'document'],
          },
        },
        {
          name: 'elasticsearch_update_document',
          description: 'Update document in Elasticsearch',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              id: { type: 'string', description: 'Document ID' },
              doc: { type: 'object', description: 'Document updates' },
            },
            required: ['index', 'id', 'doc'],
          },
        },
        {
          name: 'elasticsearch_delete_document',
          description: 'Delete document from Elasticsearch',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              id: { type: 'string', description: 'Document ID' },
            },
            required: ['index', 'id'],
          },
        },
        {
          name: 'elasticsearch_create_index',
          description: 'Create Elasticsearch index',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              mappings: { type: 'object', description: 'Index mappings' },
              settings: { type: 'object', description: 'Index settings' },
            },
            required: ['index'],
          },
        },
        {
          name: 'elasticsearch_delete_index',
          description: 'Delete Elasticsearch index',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
            },
            required: ['index'],
          },
        },
        {
          name: 'elasticsearch_indices_list',
          description: 'List all indices',
          inputSchema: {
            type: 'object',
            properties: {
              pattern: { type: 'string', description: 'Index pattern' },
            },
          },
        },
        {
          name: 'elasticsearch_cluster_health',
          description: 'Get cluster health status',
          inputSchema: {
            type: 'object',
            properties: {
              level: {
                type: 'string',
                enum: ['cluster', 'indices', 'shards'],
                description: 'Health level',
              },
            },
          },
        },
        {
          name: 'elasticsearch_cluster_stats',
          description: 'Get cluster statistics',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'elasticsearch_aggregation',
          description: 'Execute aggregation query',
          inputSchema: {
            type: 'object',
            properties: {
              index: { type: 'string', description: 'Index name' },
              aggs: { type: 'object', description: 'Aggregation specification' },
              size: { type: 'number', description: 'Number of results' },
            },
            required: ['index', 'aggs'],
          },
        },
        {
          name: 'elasticsearch_bulk_index',
          description: 'Bulk index multiple documents',
          inputSchema: {
            type: 'object',
            properties: {
              operations: {
                type: 'array',
                items: { type: 'object' },
                description: 'Bulk operations',
              },
            },
            required: ['operations'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'elasticsearch_search':
            return await this.search(args);
          case 'elasticsearch_index_document':
            return await this.indexDocument(args);
          case 'elasticsearch_update_document':
            return await this.updateDocument(args);
          case 'elasticsearch_delete_document':
            return await this.deleteDocument(args);
          case 'elasticsearch_create_index':
            return await this.createIndex(args);
          case 'elasticsearch_delete_index':
            return await this.deleteIndex(args);
          case 'elasticsearch_indices_list':
            return await this.listIndices(args);
          case 'elasticsearch_cluster_health':
            return await this.getClusterHealth(args);
          case 'elasticsearch_cluster_stats':
            return await this.getClusterStats(args);
          case 'elasticsearch_aggregation':
            return await this.aggregation(args);
          case 'elasticsearch_bulk_index':
            return await this.bulkIndex(args);
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

  async search(args) {
    const { index, query, sort, size, from } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Search:\n\nIndex: ${index}\nQuery: ${JSON.stringify(query, null, 2)}\nSort: ${JSON.stringify(sort || [], null, 2)}\nSize: ${size || 10}\nFrom: ${from || 0}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the search query for execution.`,
        },
      ],
    };
  }

  async indexDocument(args) {
    const { index, id, document } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Index Document:\n\nIndex: ${index}\nID: ${id || 'Auto-generated'}\nDocument: ${JSON.stringify(document, null, 2)}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the index operation for execution.`,
        },
      ],
    };
  }

  async updateDocument(args) {
    const { index, id, doc } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Update Document:\n\nIndex: ${index}\nID: ${id}\nUpdates: ${JSON.stringify(doc, null, 2)}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the update operation for execution.`,
        },
      ],
    };
  }

  async deleteDocument(args) {
    const { index, id } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Delete Document:\n\nIndex: ${index}\nID: ${id}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the delete operation for execution.`,
        },
      ],
    };
  }

  async createIndex(args) {
    const { index, mappings, settings } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Create Index:\n\nIndex: ${index}\nMappings: ${JSON.stringify(mappings || {}, null, 2)}\nSettings: ${JSON.stringify(settings || {}, null, 2)}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the index creation for execution.`,
        },
      ],
    };
  }

  async deleteIndex(args) {
    const { index } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Delete Index:\n\nIndex: ${index}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the index deletion for execution.`,
        },
      ],
    };
  }

  async listIndices(args) {
    const { pattern } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch List Indices:\n\nPattern: ${pattern || 'All indices'}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the indices listing for execution.`,
        },
      ],
    };
  }

  async getClusterHealth(args) {
    const { level } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Cluster Health:\n\nLevel: ${level || 'cluster'}\n\nHealth indicators:\n- Status (green/yellow/red)\n- Number of nodes\n- Active shards\n- Relocating shards\n- Initializing shards\n- Unassigned shards\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares cluster health retrieval.`,
        },
      ],
    };
  }

  async getClusterStats(args) {
    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Cluster Stats:\n\nStatistics to retrieve:\n- Nodes count\n- Indices count\n- Documents count\n- Store size\n- Memory usage\n- CPU usage\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares cluster stats retrieval.`,
        },
      ],
    };
  }

  async aggregation(args) {
    const { index, aggs, size } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Aggregation:\n\nIndex: ${index}\nAggregations: ${JSON.stringify(aggs, null, 2)}\nSize: ${size || 0}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the aggregation query for execution.`,
        },
      ],
    };
  }

  async bulkIndex(args) {
    const { operations } = args;

    return {
      content: [
        {
          type: 'text',
          text: `Elasticsearch Bulk Index:\n\nOperations: ${JSON.stringify(operations, null, 2)}\n\nNote: Actual Elasticsearch operations require Elasticsearch client.\n\nThis prepares the bulk operation for execution.`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = error => console.error('[Elasticsearch MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Elasticsearch MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new ElasticsearchMCPServer();
  server.run().catch(console.error);
}

module.exports = ElasticsearchMCPServer;
