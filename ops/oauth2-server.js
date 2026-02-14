#!/usr/bin/env node

/**
 * OAuth2 MCP Server - Divine Level
 * Authentication management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class OAuth2MCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'oauth2',
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
          name: 'oauth2_authorize',
          description: 'Generate OAuth2 authorization URL',
          inputSchema: {
            type: 'object',
            properties: {
              client_id: { type: 'string', description: 'OAuth2 client ID' },
              redirect_uri: { type: 'string', description: 'Redirect URI' },
              scope: { type: 'array', items: { type: 'string' }, description: 'Requested scopes' },
              state: { type: 'string', description: 'OAuth2 state parameter' },
            },
            required: ['client_id', 'redirect_uri', 'scope'],
          },
        },
        {
          name: 'oauth2_exchange_code',
          description: 'Exchange authorization code for tokens',
          inputSchema: {
            type: 'object',
            properties: {
              client_id: { type: 'string', description: 'OAuth2 client ID' },
              client_secret: { type: 'string', description: 'OAuth2 client secret' },
              code: { type: 'string', description: 'Authorization code' },
              redirect_uri: { type: 'string', description: 'Redirect URI' },
            },
            required: ['client_id', 'client_secret', 'code', 'redirect_uri'],
          },
        },
        {
          name: 'oauth2_refresh_token',
          description: 'Refresh access token using refresh token',
          inputSchema: {
            type: 'object',
            properties: {
              client_id: { type: 'string', description: 'OAuth2 client ID' },
              client_secret: { type: 'string', description: 'OAuth2 client secret' },
              refresh_token: { type: 'string', description: 'Refresh token' },
            },
            required: ['client_id', 'client_secret', 'refresh_token'],
          },
        },
        {
          name: 'oauth2_revoke_token',
          description: 'Revoke OAuth2 token',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'Token to revoke' },
              token_type_hint: { type: 'string', description: 'Token type hint' },
            },
            required: ['token'],
          },
        },
        {
          name: 'oauth2_validate_token',
          description: 'Validate OAuth2 token',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'Access token to validate' },
            },
            required: ['token'],
          },
        },
        {
          name: 'oauth2_get_user_info',
          description: 'Get user information from OAuth2 provider',
          inputSchema: {
            type: 'object',
            properties: {
              access_token: { type: 'string', description: 'Access token' },
              provider: { type: 'string', description: 'OAuth2 provider (google, github, etc.)' },
            },
            required: ['access_token', 'provider'],
          },
        },
        {
          name: 'oauth2_create_client',
          description: 'Create new OAuth2 client',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Client name' },
              redirect_uris: {
                type: 'array',
                items: { type: 'string' },
                description: 'Redirect URIs',
              },
              scopes: { type: 'array', items: { type: 'string' }, description: 'Allowed scopes' },
            },
            required: ['name', 'redirect_uris'],
          },
        },
        {
          name: 'oauth2_list_clients',
          description: 'List OAuth2 clients',
          inputSchema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['active', 'inactive', 'all'],
                description: 'Client status filter',
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
          case 'oauth2_authorize':
            return await this.authorize(args);
          case 'oauth2_exchange_code':
            return await this.exchangeCode(args);
          case 'oauth2_refresh_token':
            return await this.refreshToken(args);
          case 'oauth2_revoke_token':
            return await this.revokeToken(args);
          case 'oauth2_validate_token':
            return await this.validateToken(args);
          case 'oauth2_get_user_info':
            return await this.getUserInfo(args);
          case 'oauth2_create_client':
            return await this.createClient(args);
          case 'oauth2_list_clients':
            return await this.listClients(args);
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

  async authorize(args) {
    const { client_id, redirect_uri, scope, state } = args;

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${client_id}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `scope=${encodeURIComponent(scope.join(' '))}&` +
      `response_type=code&` +
      `state=${state || 'oauth2_' + Date.now()}`;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Authorization URL Generated:\n\nClient ID: ${client_id}\nRedirect URI: ${redirect_uri}\nScopes: ${scope.join(', ')}\nState: ${state || 'Auto-generated'}\n\nAuthorization URL:\n${authUrl}\n\nNote: Actual OAuth2 flow requires OAuth2 client library.\n\nThis prepares OAuth2 authorization.`,
        },
      ],
    };
  }

  async exchangeCode(args) {
    const { client_id, client_secret, code, redirect_uri } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Code Exchange:\n\nClient ID: ${client_id}\nCode: ${code.substring(0, 10)}...\nRedirect URI: ${redirect_uri}\n\nResponse will include:\n- Access Token\n- Refresh Token\n- Token Type: Bearer\n- Expires In: 3600 seconds\n\nNote: Actual code exchange requires OAuth2 client library.\n\nThis prepares token exchange.`,
        },
      ],
    };
  }

  async refreshToken(args) {
    const { client_id, client_secret, refresh_token } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Token Refresh:\n\nClient ID: ${client_id}\nRefresh Token: ${refresh_token.substring(0, 10)}...\n\nNew access token will be generated with:\n- New access token\n- Same refresh token\n- Extended expiration\n\nNote: Actual token refresh requires OAuth2 client library.\n\nThis prepares token refresh.`,
        },
      ],
    };
  }

  async revokeToken(args) {
    const { token, token_type_hint } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Token Revocation:\n\nToken: ${token.substring(0, 10)}...\nToken Type Hint: ${token_type_hint || 'access_token'}\n\nToken will be revoked and invalidated.\n\nNote: Actual token revocation requires OAuth2 client library.\n\nThis prepares token revocation.`,
        },
      ],
    };
  }

  async validateToken(args) {
    const { token } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Token Validation:\n\nToken: ${token.substring(0, 10)}...\n\nValidation checks:\n- Token format\n- Token expiration\n- Token signature\n- Token scopes\n\nNote: Actual token validation requires OAuth2 client library.\n\nThis prepares token validation.`,
        },
      ],
    };
  }

  async getUserInfo(args) {
    const { access_token, provider } = args;

    const userInfoEndpoints = {
      google: 'https://www.googleapis.com/oauth2/v2/userinfo',
      github: 'https://api.github.com/user',
      microsoft: 'https://graph.microsoft.com/v1.0/me',
    };

    const endpoint = userInfoEndpoints[provider] || userInfoEndpoints.google;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 User Info:\n\nAccess Token: ${access_token.substring(0, 10)}...\nProvider: ${provider}\nUser Info Endpoint: ${endpoint}\n\nUser information will include:\n- User ID\n- Email\n- Name\n- Profile picture\n- Verified status\n\nNote: Actual user info retrieval requires OAuth2 client library.\n\nThis prepares user info retrieval.`,
        },
      ],
    };
  }

  async createClient(args) {
    const { name, redirect_uris, scopes } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Client Creation:\n\nName: ${name}\nRedirect URIs: ${redirect_uris.join(', ')}\nScopes: ${scopes ? scopes.join(', ') : 'Default scopes'}\n\nGenerated credentials:\n- Client ID: ${Math.random().toString(36).substr(2, 32)}\n- Client Secret: ${Math.random().toString(36).substr(2, 64)}\n\nNote: Actual client creation requires OAuth2 provider API.\n\nThis prepares client creation.`,
        },
      ],
    };
  }

  async listClients(args) {
    const { status } = args;

    return {
      content: [
        {
          type: 'text',
          text: `OAuth2 Clients List:\n\nStatus: ${status || 'All'}\n\nSample clients:\n- Client ID: oauth2_client_1 - Name: AIGestion Web - Status: Active\n- Client ID: oauth2_client_2 - Name: AIGestion Mobile - Status: Active\n- Client ID: oauth2_client_3 - Name: AIGestion API - Status: Active\n\nNote: Actual client listing requires OAuth2 provider API.\n\nThis prepares client listing.`,
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = error => console.error('[OAuth2 MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OAuth2 MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new OAuth2MCPServer();
  server.run().catch(console.error);
}

module.exports = OAuth2MCPServer;
