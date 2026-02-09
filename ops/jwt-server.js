#!/usr/bin/env node

/**
 * JWT MCP Server - Divine Level
 * Token management for AIGestion Pro 2026
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class JWTMCPServer {
  constructor() {
    this.server = new Server({
      name: 'jwt',
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
          name: 'jwt_create_token',
          description: 'Create JWT token',
          inputSchema: {
            type: 'object',
            properties: {
              payload: { type: 'object', description: 'JWT payload data' },
              secret_key: { type: 'string', description: 'Secret key for signing' },
              algorithm: { type: 'string', enum: ['HS256', 'HS512', 'RS256', 'RS512'], description: 'Signing algorithm' },
              expires_in: { type: 'number', description: 'Expiration time in seconds' }
            },
            required: ['payload', 'secret_key']
          }
        },
        {
          name: 'jwt_verify_token',
          description: 'Verify JWT token',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'JWT token to verify' },
              secret_key: { type: 'string', description: 'Secret key for verification' },
              algorithm: { type: 'string', description: 'Expected algorithm' }
            },
            required: ['token', 'secret_key']
          }
        },
        {
          name: 'jwt_decode_token',
          description: 'Decode JWT token without verification',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'JWT token to decode' }
            },
            required: ['token']
          }
        },
        {
          name: 'jwt_refresh_token',
          description: 'Refresh JWT token',
          inputSchema: {
            type: 'object',
            properties: {
              refresh_token: { type: 'string', description: 'Refresh token' },
              secret_key: { type: 'string', description: 'Secret key for signing' },
              new_payload: { type: 'object', description: 'New payload data' }
            },
            required: ['refresh_token', 'secret_key']
          }
        },
        {
          name: 'jwt_revoke_token',
          description: 'Revoke JWT token',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'JWT token to revoke' },
              reason: { type: 'string', description: 'Revocation reason' }
            },
            required: ['token']
          }
        },
        {
          name: 'jwt_list_revoked_tokens',
          description: 'List revoked tokens',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of tokens to return' }
            }
          }
        },
        {
          name: 'jwt_get_token_info',
          description: 'Get JWT token information',
          inputSchema: {
            type: 'object',
            properties: {
              token: { type: 'string', description: 'JWT token' }
            },
            required: ['token']
          }
        },
        {
          name: 'jwt_create_key_pair',
          description: 'Create RSA key pair for JWT',
          inputSchema: {
            type: 'object',
            properties: {
              key_size: { type: 'number', description: 'Key size in bits' },
              algorithm: { type: 'string', description: 'Key algorithm' }
            }
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'jwt_create_token':
            return await this.createToken(args);
          case 'jwt_verify_token':
            return await this.verifyToken(args);
          case 'jwt_decode_token':
            return await this.decodeToken(args);
          case 'jwt_refresh_token':
            return await this.refreshToken(args);
          case 'jwt_revoke_token':
            return await this.revokeToken(args);
          case 'jwt_list_revoked_tokens':
            return await this.listRevokedTokens(args);
          case 'jwt_get_token_info':
            return await this.getTokenInfo(args);
          case 'jwt_create_key_pair':
            return await this.createKeyPair(args);
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

  async createToken(args) {
    const { payload, secret_key, algorithm, expires_in } = args;
    
    const header = {
      alg: algorithm || 'HS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: expires_in ? now + expires_in : now + 3600,
      iss: 'aigestion-pro-2026',
      aud: 'aigestion-users'
    };
    
    return {
      content: [{
        type: 'text',
        text: `JWT Token Creation:\n\nHeader: ${JSON.stringify(header, null, 2)}\nPayload: ${JSON.stringify(tokenPayload, null, 2)}\nAlgorithm: ${algorithm || 'HS256'}\nExpires In: ${expires_in || 3600} seconds\n\nToken will be signed with provided secret key.\n\nNote: Actual JWT creation requires JWT library (jsonwebtoken).\n\nThis prepares JWT token creation.`
      }]
    };
  }

  async verifyToken(args) {
    const { token, secret_key, algorithm } = args;
    
    return {
      content: [{
        type: 'text',
        text: `JWT Token Verification:\n\nToken: ${token.substring(0, 50)}...\nSecret Key: ${secret_key.substring(0, 10)}...\nAlgorithm: ${algorithm || 'HS256'}\n\nVerification checks:\n- Token signature\n- Token expiration\n- Token issuer\n- Token audience\n\nNote: Actual JWT verification requires JWT library (jsonwebtoken).\n\nThis prepares JWT token verification.`
      }]
    };
  }

  async decodeToken(args) {
    const { token } = args;
    
    try {
      const parts = token.split('.');
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      return {
        content: [{
          type: 'text',
          text: `JWT Token Decoded:\n\nHeader: ${JSON.stringify(header, null, 2)}\nPayload: ${JSON.stringify(payload, null, 2)}\nSignature: ${parts[2] ? parts[2].substring(0, 50) + '...' : 'No signature'}\n\nNote: This is decoded without verification. Use verify_token for security.\n\nThis prepares JWT token decoding.`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `JWT Token Decoding Error:\n\nError: ${error.message}\n\nNote: Invalid JWT format.\n\nThis prepares JWT token decoding error handling.`
        }]
      };
    }
  }

  async refreshToken(args) {
    const { refresh_token, secret_key, new_payload } = args;
    
    return {
      content: [{
        type: 'text',
        text: `JWT Token Refresh:\n\nRefresh Token: ${refresh_token.substring(0, 50)}...\nSecret Key: ${secret_key.substring(0, 10)}...\nNew Payload: ${JSON.stringify(new_payload || {}, null, 2)}\n\nNew access token will be created with:\n- Updated expiration\n- New payload data\n- Same user identity\n\nNote: Actual token refresh requires JWT library.\n\nThis prepares JWT token refresh.`
      }]
    };
  }

  async revokeToken(args) {
    const { token, reason } = args;
    
    return {
      content: [{
        type: 'text',
        text: `JWT Token Revocation:\n\nToken: ${token.substring(0, 50)}...\nReason: ${reason || 'User logout'}\n\nToken will be added to revocation list:\n- Token ID (jti)\n- Revocation timestamp\n- Revocation reason\n\nNote: Actual token revocation requires storage mechanism.\n\nThis prepares JWT token revocation.`
      }]
    };
  }

  async listRevokedTokens(args) {
    const { limit } = args;
    
    return {
      content: [{
        type: 'text',
        text: `Revoked JWT Tokens List:\n\nLimit: ${limit || 10}\n\nSample revoked tokens:\n- Token ID: jti_1 - Revoked: 2024-01-15T10:30:00Z - Reason: User logout\n- Token ID: jti_2 - Revoked: 2024-01-15T11:45:00Z - Reason: Security breach\n- Token ID: jti_3 - Revoked: 2024-01-15T12:20:00Z - Reason: Token expired\n\nNote: Actual revoked tokens list requires storage mechanism.\n\nThis prepares revoked tokens listing.`
      }]
    };
  }

  async getTokenInfo(args) {
    const { token } = args;
    
    return {
      content: [{
        type: 'text',
        text: `JWT Token Information:\n\nToken: ${token.substring(0, 50)}...\n\nToken information includes:\n- Header (algorithm, type)\n- Payload (claims, expiration)\n- Signature verification status\n- Token age\n- Time until expiration\n\nNote: Actual token info requires JWT library.\n\nThis prepares JWT token information retrieval.`
      }]
    };
  }

  async createKeyPair(args) {
    const { key_size, algorithm } = args;
    
    return {
      content: [{
        type: 'text',
        text: `RSA Key Pair Creation:\n\nKey Size: ${key_size || 2048} bits\nAlgorithm: ${algorithm || 'RSA'}\n\nGenerated files:\n- private_key.pem\n- public_key.pem\n- key_info.json\n\nKey pair will be used for:\n- JWT signing (private key)\n- JWT verification (public key)\n\nNote: Actual key pair generation requires crypto library.\n\nThis prepares RSA key pair creation.`
      }]
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[JWT MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('JWT MCP server running on stdio');
  }
}

if (require.main === module) {
  const server = new JWTMCPServer();
  server.run().catch(console.error);
}

module.exports = JWTMCPServer;
