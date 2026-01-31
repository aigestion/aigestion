#!/usr/bin/env node

/**
 * GraphQL MCP Server - Divine Level
 * GraphQL query management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class GraphQLMCPServer {
  constructor() {
    this.server = new Server({
      name: 'graphql',
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
          name: 'graphql_query',
          description: 'Execute GraphQL query',
          inputSchema: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', description: 'GraphQL endpoint URL' },
              query: { type: 'string', description: 'GraphQL query' },
              variables: { type: 'object', description: 'Query variables' },
              headers: { type: 'object', description: 'Request headers' }
            },
            required: ['endpoint', 'query']
          }
        },
        {
          name: 'graphql_mutation',
          description: 'Execute GraphQL mutation',
          inputSchema: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', description: 'GraphQL endpoint URL' },
              mutation: { type: 'string', description: 'GraphQL mutation' },
              variables: { type: 'object', description: 'Mutation variables' },
              headers: { type: 'object', description: 'Request headers' }
            },
            required: ['endpoint', 'mutation']
          }
        },
        {
          name: 'graphql_subscription',
          description: 'Execute GraphQL subscription',
          inputSchema: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', description: 'GraphQL endpoint URL' },
              subscription: { type: 'string', description: 'GraphQL subscription' },
              variables: { type: 'object', description: 'Subscription variables' }
            },
            required: ['endpoint', 'subscription']
          }
        },
        {
          name: 'graphql_introspection',
          description: 'Get GraphQL schema introspection',
          inputSchema: {
            type: 'object',
            properties: {
              endpoint: { type: 'string', description: 'GraphQL endpoint URL' },
              headers: { type: 'object', description: 'Request headers' }
            },
            required: ['endpoint']
          }
        },
        {
          name: 'graphql_schema_validation',
          description: 'Validate GraphQL schema',
          inputSchema: {
            type: 'object',
            properties: {
              schema: { type: 'string', description: 'GraphQL schema' },
              query: { type: 'string', description: 'Query to validate' }
            },
            required: ['schema', 'query']
          }
        },
        {
          name: 'graphql_query_builder',
          description: 'Build GraphQL queries',
          inputSchema: {
            type: 'object',
            properties: {
              fields: { type: 'array', items: { type: 'string' }, description: 'Fields to include' },
              filters: { type: 'object', description: 'Filter conditions' },
              sorting: { type: 'array', items: { type: 'object' }, description: 'Sort conditions' },
              pagination: { type: 'object', description: 'Pagination settings' }
            }
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'graphql_query':
            return await this.executeQuery(args);
          case 'graphql_mutation':
            return await this.executeMutation(args);
          case 'graphql_subscription':
            return await this.executeSubscription(args);
          case 'graphql_introspection':
            return await this.getIntrospection(args);
          case 'graphql_schema_validation':
            return await this.validateSchema(args);
          case 'graphql_query_builder':
            return await this.buildQuery(args);
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
    const { endpoint, query, variables, headers } = args;
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Query Execution:\n\nEndpoint: ${endpoint}\nQuery: ${query}\nVariables: ${JSON.stringify(variables || {}, null, 2)}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\n\nNote: Actual GraphQL queries require GraphQL client library.\n\nThis prepares the query for execution.`
      }]
    };
  }

  async executeMutation(args) {
    const { endpoint, mutation, variables, headers } = args;
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Mutation Execution:\n\nEndpoint: ${endpoint}\nMutation: ${mutation}\nVariables: ${JSON.stringify(variables || {}, null, 2)}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\n\nNote: Actual GraphQL mutations require GraphQL client library.\n\nThis prepares the mutation for execution.`
      }]
    };
  }

  async executeSubscription(args) {
    const { endpoint, subscription, variables } = args;
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Subscription Execution:\n\nEndpoint: ${endpoint}\nSubscription: ${subscription}\nVariables: ${JSON.stringify(variables || {}, null, 2)}\n\nNote: Actual GraphQL subscriptions require WebSocket client library.\n\nThis prepares the subscription for execution.`
      }]
    };
  }

  async getIntrospection(args) {
    const { endpoint, headers } = args;
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Schema Introspection:\n\nEndpoint: ${endpoint}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\n\nIntrospection query:\n{\n  __schema {\n    types {\n      name\n      kind\n      description\n      fields {\n        name\n        type {\n          name\n          kind\n          ofType {\n            name\n            kind\n          }\n        }\n      }\n    }\n  }\n}\n\nNote: Actual introspection requires GraphQL client library.\n\nThis prepares schema introspection.`
      }]
    };
  }

  async validateSchema(args) {
    const { schema, query } = args;
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Schema Validation:\n\nSchema: ${schema}\nQuery: ${query}\n\nValidation checks:\n- Syntax validation\n- Type validation\n- Field existence\n- Argument validation\n\nNote: Actual validation requires GraphQL validation library.\n\nThis prepares schema validation.`
      }]
    };
  }

  async buildQuery(args) {
    const { fields, filters, sorting, pagination } = args;
    
    let query = 'query {\n';
    
    if (fields && fields.length > 0) {
      query += '  items {\n';
      fields.forEach(field => {
        query += `    ${field}\n`;
      });
      query += '  }\n';
    }
    
    if (filters && Object.keys(filters).length > 0) {
      query += '  where: {\n';
      Object.entries(filters).forEach(([key, value]) => {
        query += `    ${key}: ${JSON.stringify(value)}\n`;
      });
      query += '  }\n';
    }
    
    if (sorting && sorting.length > 0) {
      query += '  orderBy: [\n';
      sorting.forEach(sort => {
        query += `    { ${sort.field}: ${sort.direction} }\n`;
      });
      query += '  ]\n';
    }
    
    if (pagination) {
      query += `  first: ${pagination.first || 10}\n`;
      query += `  offset: ${pagination.offset || 0}\n`;
    }
    
    query += '}';
    
    return {
      content: [{
        type: 'text',
        text: `GraphQL Query Builder:\n\nGenerated Query:\n${query}\n\nFields: ${fields ? fields.join(', ') : 'None'}\nFilters: ${JSON.stringify(filters || {}, null, 2)}\nSorting: ${JSON.stringify(sorting || [], null, 2)}\nPagination: ${JSON.stringify(pagination || {}, null, 2)}\n\nNote: This query is ready for execution.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[GraphQL MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GraphQL MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new GraphQLMCPServer();
  server.run().catch(console.error);
}

module.exports = GraphQLMCPServer;
