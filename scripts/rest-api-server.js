#!/usr/bin/env node

/**
 * REST API MCP Server - Divine Level
 * API testing and management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class RestAPIMCPServer {
  constructor() {
    this.server = new Server({
      name: 'rest-api',
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
          name: 'api_get_request',
          description: 'Execute GET request to REST API',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'API endpoint URL' },
              headers: { type: 'object', description: 'Request headers' },
              params: { type: 'object', description: 'Query parameters' }
            },
            required: ['url']
          }
        },
        {
          name: 'api_post_request',
          description: 'Execute POST request to REST API',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'API endpoint URL' },
              headers: { type: 'object', description: 'Request headers' },
              body: { type: 'object', description: 'Request body' },
              content_type: { type: 'string', description: 'Content type' }
            },
            required: ['url']
          }
        },
        {
          name: 'api_put_request',
          description: 'Execute PUT request to REST API',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'API endpoint URL' },
              headers: { type: 'object', description: 'Request headers' },
              body: { type: 'object', description: 'Request body' }
            },
            required: ['url']
          }
        },
        {
          name: 'api_delete_request',
          description: 'Execute DELETE request to REST API',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'API endpoint URL' },
              headers: { type: 'object', description: 'Request headers' }
            },
            required: ['url']
          }
        },
        {
          name: 'api_test_suite',
          description: 'Run API test suite',
          inputSchema: {
            type: 'object',
            properties: {
              endpoints: { type: 'array', items: { type: 'string' }, description: 'List of endpoints to test' },
              test_type: { type: 'string', enum: ['smoke', 'integration', 'performance'], description: 'Type of test' }
            },
            required: ['endpoints']
          }
        },
        {
          name: 'api_documentation',
          description: 'Generate API documentation',
          inputSchema: {
            type: 'object',
            properties: {
              base_url: { type: 'string', description: 'Base API URL' },
              format: { type: 'string', enum: ['openapi', 'postman', 'swagger'], description: 'Documentation format' }
            },
            required: ['base_url']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'api_get_request':
            return await this.executeGet(args);
          case 'api_post_request':
            return await this.executePost(args);
          case 'api_put_request':
            return await this.executePut(args);
          case 'api_delete_request':
            return await this.executeDelete(args);
          case 'api_test_suite':
            return await this.runTestSuite(args);
          case 'api_documentation':
            return await this.generateDocumentation(args);
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

  async executeGet(args) {
    const { url, headers, params } = args;
    
    return {
      content: [{
        type: 'text',
        text: `REST API GET Request:\n\nURL: ${url}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\nParameters: ${JSON.stringify(params || {}, null, 2)}\n\nNote: Actual HTTP requests require fetch/axios library.\n\nThis prepares the GET request for execution.`
      }]
    };
  }

  async executePost(args) {
    const { url, headers, body, content_type } = args;
    
    return {
      content: [{
        type: 'text',
        text: `REST API POST Request:\n\nURL: ${url}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\nContent-Type: ${content_type || 'application/json'}\nBody: ${JSON.stringify(body || {}, null, 2)}\n\nNote: Actual HTTP requests require fetch/axios library.\n\nThis prepares the POST request for execution.`
      }]
    };
  }

  async executePut(args) {
    const { url, headers, body } = args;
    
    return {
      content: [{
        type: 'text',
        text: `REST API PUT Request:\n\nURL: ${url}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\nBody: ${JSON.stringify(body || {}, null, 2)}\n\nNote: Actual HTTP requests require fetch/axios library.\n\nThis prepares the PUT request for execution.`
      }]
    };
  }

  async executeDelete(args) {
    const { url, headers } = args;
    
    return {
      content: [{
        type: 'text',
        text: `REST API DELETE Request:\n\nURL: ${url}\nHeaders: ${JSON.stringify(headers || {}, null, 2)}\n\nNote: Actual HTTP requests require fetch/axios library.\n\nThis prepares the DELETE request for execution.`
      }]
    };
  }

  async runTestSuite(args) {
    const { endpoints, test_type } = args;
    
    return {
      content: [{
        type: 'text',
        text: `API Test Suite:\n\nEndpoints: ${endpoints.join(', ')}\nTest Type: ${test_type}\n\nTests to run:\n${endpoints.map((endpoint, index) => `${index + 1}. ${endpoint} - ${test_type} test`).join('\n')}\n\nNote: Actual testing requires HTTP client library.\n\nThis prepares the test suite for execution.`
      }]
    };
  }

  async generateDocumentation(args) {
    const { base_url, format } = args;
    
    return {
      content: [{
        type: 'text',
        text: `API Documentation Generation:\n\nBase URL: ${base_url}\nFormat: ${format}\n\nDocumentation structure:\n- API Overview\n- Authentication\n- Endpoints\n- Request/Response schemas\n- Error handling\n- Examples\n\nNote: Actual documentation generation requires API introspection.\n\nThis prepares documentation generation.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[REST API MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('REST API MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new RestAPIMCPServer();
  server.run().catch(console.error);
}

module.exports = RestAPIMCPServer;
