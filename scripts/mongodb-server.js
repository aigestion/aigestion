#!/usr/bin/env node

/**
 * MongoDB MCP Server - Divine Level
 * NoSQL database operations for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class MongoDBMCPServer {
  constructor() {
    this.server = new Server({
      name: 'mongodb',
      version: '1.0.0',
    }, {
      capabilities: {
        tools: {},
      },
    });

    this.setupTools();
    this.setupErrorHandling();
  }

  setupTools() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'mongodb_find',
          description: 'Find documents in MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              query: { type: 'object', description: 'Query filter' },
              projection: { type: 'object', description: 'Fields to include/exclude' },
              limit: { type: 'number', description: 'Number of documents to return' },
              sort: { type: 'object', description: 'Sort specification' }
            },
            required: ['database', 'collection']
          }
        },
        {
          name: 'mongodb_insert_one',
          description: 'Insert one document into MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              document: { type: 'object', description: 'Document to insert' }
            },
            required: ['database', 'collection', 'document']
          }
        },
        {
          name: 'mongodb_insert_many',
          description: 'Insert multiple documents into MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              documents: { type: 'array', items: { type: 'object' }, description: 'Documents to insert' }
            },
            required: ['database', 'collection', 'documents']
          }
        },
        {
          name: 'mongodb_update_one',
          description: 'Update one document in MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              filter: { type: 'object', description: 'Query filter' },
              update: { type: 'object', description: 'Update specification' },
              upsert: { type: 'boolean', description: 'Insert if not found' }
            },
            required: ['database', 'collection', 'filter', 'update']
          }
        },
        {
          name: 'mongodb_update_many',
          description: 'Update multiple documents in MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              filter: { type: 'object', description: 'Query filter' },
              update: { type: 'object', description: 'Update specification' }
            },
            required: ['database', 'collection', 'filter', 'update']
          }
        },
        {
          name: 'mongodb_delete_one',
          description: 'Delete one document from MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              filter: { type: 'object', description: 'Query filter' }
            },
            required: ['database', 'collection', 'filter']
          }
        },
        {
          name: 'mongodb_delete_many',
          description: 'Delete multiple documents from MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              filter: { type: 'object', description: 'Query filter' }
            },
            required: ['database', 'collection', 'filter']
          }
        },
        {
          name: 'mongodb_aggregate',
          description: 'Execute aggregation pipeline on MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              pipeline: { type: 'array', items: { type: 'object' }, description: 'Aggregation pipeline' }
            },
            required: ['database', 'collection', 'pipeline']
          }
        },
        {
          name: 'mongodb_create_index',
          description: 'Create index on MongoDB collection',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              collection: { type: 'string', description: 'Collection name' },
              keys: { type: 'object', description: 'Index keys' },
              options: { type: 'object', description: 'Index options' }
            },
            required: ['database', 'collection', 'keys']
          }
        },
        {
          name: 'mongodb_list_collections',
          description: 'List collections in MongoDB database',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' }
            },
            required: ['database']
          }
        },
        {
          name: 'mongodb_database_stats',
          description: 'Get database statistics',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' }
            },
            required: ['database']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'mongodb_find':
            return await this.findDocuments(args);
          case 'mongodb_insert_one':
            return await this.insertOne(args);
          case 'mongodb_insert_many':
            return await this.insertMany(args);
          case 'mongodb_update_one':
            return await this.updateOne(args);
          case 'mongodb_update_many':
            return await this.updateMany(args);
          case 'mongodb_delete_one':
            return await this.deleteOne(args);
          case 'mongodb_delete_many':
            return await this.deleteMany(args);
          case 'mongodb_aggregate':
            return await this.aggregate(args);
          case 'mongodb_create_index':
            return await this.createIndex(args);
          case 'mongodb_list_collections':
            return await this.listCollections(args);
          case 'mongodb_database_stats':
            return await this.getDatabaseStats(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.message}`
          }]
        };
      }
    });
  }

  async findDocuments(args) {
    const { database, collection, query, projection, limit, sort } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Find:\n\nDatabase: ${database}\nCollection: ${collection}\nQuery: ${JSON.stringify(query || {}, null, 2)}\nProjection: ${JSON.stringify(projection || {}, null, 2)}\nLimit: ${limit || 'No limit'}\nSort: ${JSON.stringify(sort || {}, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the find operation for execution.`
      }]
    };
  }

  async insertOne(args) {
    const { database, collection, document } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Insert One:\n\nDatabase: ${database}\nCollection: ${collection}\nDocument: ${JSON.stringify(document, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the insert operation for execution.`
      }]
    };
  }

  async insertMany(args) {
    const { database, collection, documents } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Insert Many:\n\nDatabase: ${database}\nCollection: ${collection}\nDocuments: ${JSON.stringify(documents, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the insert many operation for execution.`
      }]
    };
  }

  async updateOne(args) {
    const { database, collection, filter, update, upsert } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Update One:\n\nDatabase: ${database}\nCollection: ${collection}\nFilter: ${JSON.stringify(filter, null, 2)}\nUpdate: ${JSON.stringify(update, null, 2)}\nUpsert: ${upsert || false}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the update operation for execution.`
      }]
    };
  }

  async updateMany(args) {
    const { database, collection, filter, update } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Update Many:\n\nDatabase: ${database}\nCollection: ${collection}\nFilter: ${JSON.stringify(filter, null, 2)}\nUpdate: ${JSON.stringify(update, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the update many operation for execution.`
      }]
    };
  }

  async deleteOne(args) {
    const { database, collection, filter } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Delete One:\n\nDatabase: ${database}\nCollection: ${collection}\nFilter: ${JSON.stringify(filter, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the delete operation for execution.`
      }]
    };
  }

  async deleteMany(args) {
    const { database, collection, filter } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Delete Many:\n\nDatabase: ${database}\nCollection: ${collection}\nFilter: ${JSON.stringify(filter, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the delete many operation for execution.`
      }]
    };
  }

  async aggregate(args) {
    const { database, collection, pipeline } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Aggregate:\n\nDatabase: ${database}\nCollection: ${collection}\nPipeline: ${JSON.stringify(pipeline, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the aggregation operation for execution.`
      }]
    };
  }

  async createIndex(args) {
    const { database, collection, keys, options } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Create Index:\n\nDatabase: ${database}\nCollection: ${collection}\nKeys: ${JSON.stringify(keys, null, 2)}\nOptions: ${JSON.stringify(options || {}, null, 2)}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the index creation for execution.`
      }]
    };
  }

  async listCollections(args) {
    const { database } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB List Collections:\n\nDatabase: ${database}\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the collection listing for execution.`
      }]
    };
  }

  async getDatabaseStats(args) {
    const { database } = args;
    
    return {
      content: [{
        type: 'text',
        text: `MongoDB Database Stats:\n\nDatabase: ${database}\n\nStats to retrieve:\n- Collections count\n- Documents count\n- Data size\n- Index size\n- Storage size\n\nNote: Actual MongoDB operations require MongoDB driver.\n\nThis prepares the database stats retrieval for execution.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MongoDB MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MongoDB MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new MongoDBMCPServer();
  server.run().catch(console.error);
}

module.exports = MongoDBMCPServer;
