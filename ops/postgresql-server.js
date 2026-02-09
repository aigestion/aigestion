#!/usr/bin/env node

/**
 * PostgreSQL MCP Server - Divine Level
 * Database management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class PostgreSQLMCPServer {
  constructor() {
    this.server = new Server({
      name: 'postgresql',
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
          name: 'postgres_query',
          description: 'Execute PostgreSQL queries',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'SQL query to execute' },
              database: { type: 'string', description: 'Database name' },
              params: { type: 'array', items: { type: 'string' }, description: 'Query parameters' }
            },
            required: ['query', 'database']
          }
        },
        {
          name: 'postgres_schema_info',
          description: 'Get database schema information',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database name' },
              table: { type: 'string', description: 'Table name (optional)' }
            },
            required: ['database']
          }
        },
        {
          name: 'postgres_backup',
          description: 'Create database backup',
          inputSchema: {
            type: 'object',
            properties: {
              database: { type: 'string', description: 'Database to backup' },
              backup_type: { type: 'string', enum: ['full', 'incremental'], description: 'Backup type' }
            },
            required: ['database', 'backup_type']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'postgres_query':
            return await this.executeQuery(args);
          case 'postgres_schema_info':
            return await this.getSchemaInfo(args);
          case 'postgres_backup':
            return await this.createBackup(args);
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

  async executeQuery(args) {
    const { query, database, params } = args;
    
    return {
      content: [{
        type: 'text',
        text: `PostgreSQL Query Execution:\n\nDatabase: ${database}\nQuery: ${query}\nParameters: ${JSON.stringify(params || [])}\n\nNote: Actual execution requires PostgreSQL connection configuration.\n\nFor now, this prepares the query for execution.`
      }]
    };
  }

  async getSchemaInfo(args) {
    const { database, table } = args;
    
    return {
      content: [{
        type: 'text',
        text: `PostgreSQL Schema Information:\n\nDatabase: ${database}\n${table ? `Table: ${table}` : 'All tables'}\n\nNote: Actual schema retrieval requires PostgreSQL connection.\n\nThis prepares schema information requests.`
      }]
    };
  }

  async createBackup(args) {
    const { database, backup_type } = args;
    
    return {
      content: [{
        type: 'text',
        text: `PostgreSQL Backup Request:\n\nDatabase: ${database}\nBackup Type: ${backup_type}\n\nNote: Actual backup requires PostgreSQL connection and permissions.\n\nThis prepares backup operations.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[PostgreSQL MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PostgreSQL MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new PostgreSQLMCPServer();
  server.run().catch(console.error);
}

module.exports = PostgreSQLMCPServer;
