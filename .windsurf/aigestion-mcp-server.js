#!/usr/bin/env node

/**
 * AIGestion Integration MCP Server
 * Proporciona integración directa con el backend de AIGestion
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const Redis = require('redis');

class AIGestionIntegration {
  constructor() {
    this.apiUrl = process.env.AIGESTION_API_URL || 'https://api.aigestion.net';
    this.apiKey = process.env.AIGESTION_API_KEY;
    this.mongoUri = process.env.MONGODB_URI;
    this.redisUrl = process.env.REDIS_URL;
    this.mongoClient = null;
    this.redisClient = null;
  }

  async initialize() {
    // Inicializar MongoDB
    if (this.mongoUri) {
      this.mongoClient = new MongoClient(this.mongoUri);
      await this.mongoClient.connect();
    }

    // Inicializar Redis
    if (this.redisUrl) {
      this.redisClient = Redis.createClient({ url: this.redisUrl });
      await this.redisClient.connect();
    }
  }

  async makeApiRequest(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.apiUrl}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async queryMongoDB(database, collection, query = {}) {
    if (!this.mongoClient) {
      throw new Error('MongoDB not connected');
    }

    try {
      const db = this.mongoClient.db(database);
      const coll = db.collection(collection);
      const result = await coll.find(query).toArray();
      return result;
    } catch (error) {
      throw new Error(`MongoDB query failed: ${error.message}`);
    }
  }

  async setRedisCache(key, value, ttl = 3600) {
    if (!this.redisClient) {
      throw new Error('Redis not connected');
    }

    try {
      await this.redisClient.setEx(key, ttl, JSON.stringify(value));
      return { success: true, key, ttl };
    } catch (error) {
      throw new Error(`Redis set failed: ${error.message}`);
    }
  }

  async getRedisCache(key) {
    if (!this.redisClient) {
      throw new Error('Redis not connected');
    }

    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      throw new Error(`Redis get failed: ${error.message}`);
    }
  }

  async generateAIContent(prompt, model = 'gemini-pro') {
    return await this.makeApiRequest('/api/ai/generate', 'POST', {
      prompt,
      model,
      max_tokens: 1000,
    });
  }

  async searchDocuments(query, index = 'aigestion') {
    return await this.makeApiRequest('/api/search', 'POST', {
      query,
      index,
      limit: 10,
    });
  }

  async getUserPreferences(userId) {
    return await this.makeApiRequest(`/api/users/${userId}/preferences`);
  }

  async updateUserPreferences(userId, preferences) {
    return await this.makeApiRequest(`/api/users/${userId}/preferences`, 'PUT', preferences);
  }

  async getSystemMetrics() {
    return await this.makeApiRequest('/api/system/metrics');
  }

  async createBackup(name = null) {
    return await this.makeApiRequest('/api/backup/create', 'POST', {
      name: name || `backup_${Date.now()}`,
    });
  }

  async restoreBackup(backupId) {
    return await this.makeApiRequest('/api/backup/restore', 'POST', {
      backup_id: backupId,
    });
  }

  async analyzeCode(code, language = 'javascript') {
    return await this.makeApiRequest('/api/code/analyze', 'POST', {
      code,
      language,
    });
  }

  async optimizeCode(code, language = 'javascript') {
    return await this.makeApiRequest('/api/code/optimize', 'POST', {
      code,
      language,
    });
  }

  async generateTests(code, language = 'javascript') {
    return await this.makeApiRequest('/api/code/generate-tests', 'POST', {
      code,
      language,
    });
  }

  async cleanup() {
    if (this.mongoClient) {
      await this.mongoClient.close();
    }
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

const server = new Server(
  {
    name: 'aigestion-integration',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const aigestion = new AIGestionIntegration();

// Initialize connections
aigestion.initialize().catch(console.error);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_ai_content',
        description: 'Genera contenido usando AI de AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'Prompt para generar contenido' },
            model: { type: 'string', description: 'Modelo AI a usar', default: 'gemini-pro' },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'search_documents',
        description: 'Busca documentos en AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Query de búsqueda' },
            index: { type: 'string', description: 'Índice de búsqueda', default: 'aigestion' },
          },
          required: ['query'],
        },
      },
      {
        name: 'query_mongodb',
        description: 'Ejecuta queries en MongoDB de AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            database: { type: 'string', description: 'Nombre de la base de datos' },
            collection: { type: 'string', description: 'Nombre de la colección' },
            query: { type: 'object', description: 'Query MongoDB' },
          },
          required: ['database', 'collection'],
        },
      },
      {
        name: 'cache_set',
        description: 'Almacena datos en Redis cache',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Clave del cache' },
            value: { type: 'object', description: 'Valor a cachear' },
            ttl: { type: 'number', description: 'TTL en segundos', default: 3600 },
          },
          required: ['key', 'value'],
        },
      },
      {
        name: 'cache_get',
        description: 'Obtiene datos del Redis cache',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Clave del cache' },
          },
          required: ['key'],
        },
      },
      {
        name: 'analyze_code',
        description: 'Analiza código con AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Código a analizar' },
            language: { type: 'string', description: 'Lenguaje del código', default: 'javascript' },
          },
          required: ['code'],
        },
      },
      {
        name: 'optimize_code',
        description: 'Optimiza código con AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Código a optimizar' },
            language: { type: 'string', description: 'Lenguaje del código', default: 'javascript' },
          },
          required: ['code'],
        },
      },
      {
        name: 'generate_tests',
        description: 'Genera tests automáticos',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Código para generar tests' },
            language: { type: 'string', description: 'Lenguaje del código', default: 'javascript' },
          },
          required: ['code'],
        },
      },
      {
        name: 'get_system_metrics',
        description: 'Obtiene métricas del sistema AIGestion',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'create_backup',
        description: 'Crea backup de AIGestion',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del backup' },
          },
        },
      },
      {
        name: 'get_user_preferences',
        description: 'Obtiene preferencias de usuario',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'ID del usuario' },
          },
          required: ['userId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_ai_content': {
        const { prompt, model = 'gemini-pro' } = args;
        const result = await aigestion.generateAIContent(prompt, model);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_documents': {
        const { query, index = 'aigestion' } = args;
        const result = await aigestion.searchDocuments(query, index);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'query_mongodb': {
        const { database, collection, query = {} } = args;
        const result = await aigestion.queryMongoDB(database, collection, query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'cache_set': {
        const { key, value, ttl = 3600 } = args;
        const result = await aigestion.setRedisCache(key, value, ttl);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'cache_get': {
        const { key } = args;
        const result = await aigestion.getRedisCache(key);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_code': {
        const { code, language = 'javascript' } = args;
        const result = await aigestion.analyzeCode(code, language);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'optimize_code': {
        const { code, language = 'javascript' } = args;
        const result = await aigestion.optimizeCode(code, language);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_tests': {
        const { code, language = 'javascript' } = args;
        const result = await aigestion.generateTests(code, language);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_system_metrics': {
        const result = await aigestion.getSystemMetrics();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_backup': {
        const { name } = args;
        const result = await aigestion.createBackup(name);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_user_preferences': {
        const { userId } = args;
        const result = await aigestion.getUserPreferences(userId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AIGestion Integration MCP Server running on stdio');
}

// Cleanup on exit
process.on('SIGINT', async () => {
  await aigestion.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await aigestion.cleanup();
  process.exit(0);
});

if (require.main === module) {
  main().catch(error => {
    console.error('Server error:', error);
    process.exit(1);
  });
}
