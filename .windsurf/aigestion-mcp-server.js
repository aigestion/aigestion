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
        name: 'sync_notebooklm',
        description: 'Genera paquetes de fuentes optimizados para NotebookLM',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'ai_studio_generate',
        description:
          'God Mode AI Studio - Generate content with grounding, code execution, or standard mode',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'The prompt to generate from' },
            mode: {
              type: 'string',
              description: 'Generation mode: standard | grounded | code_exec',
              default: 'standard',
            },
            model: { type: 'string', description: 'Model to use (default: gemini-2.0-flash)' },
            systemInstruction: { type: 'string', description: 'Optional system instruction' },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'colab_deep_research',
        description:
          'Deep Research God Mode - Generates and executes a Colab notebook for autonomous investigation',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'The research topic' },
            context: { type: 'object', description: 'Additional context for the research' },
          },
          required: ['topic'],
        },
      },

      // ───────────── GEMINI GOD MODE TOOLS ─────────────
      {
        name: 'gemini_sovereign',
        description:
          'Gemini God Mode — Sovereign text generation with model selection, structured JSON output, or deep thinking mode',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: { type: 'string', description: 'The prompt to send to Gemini' },
            mode: {
              type: 'string',
              enum: ['standard', 'structured', 'thinking'],
              description:
                'Generation mode: standard, structured (JSON), or thinking (deep reasoning)',
              default: 'standard',
            },
            model: {
              type: 'string',
              description:
                'Model ID (e.g. gemini-2.5-pro-preview-06-05, gemini-2.5-flash-preview-05-20)',
            },
            systemInstruction: { type: 'string', description: 'System instruction for the model' },
            schema: { type: 'object', description: 'JSON schema for structured mode' },
            thinkingBudget: {
              type: 'number',
              description: 'Token budget for thinking mode (default: 8192)',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'gemini_multimodal',
        description:
          'Gemini Multimodal — Analyze images, audio, or combined inputs with vision and understanding',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Text prompt or question about the media' },
            imageUrl: { type: 'string', description: 'URL of the image to analyze' },
            audioUrl: { type: 'string', description: 'URL of the audio to analyze' },
          },
          required: ['text'],
        },
      },
      {
        name: 'gemini_live',
        description:
          'Gemini Live — Create, manage, or terminate real-time voice sessions with proactive speech',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['create', 'terminate', 'list', 'speak', 'voices', 'health'],
              description: 'Action to perform on live sessions',
            },
            sessionId: { type: 'string', description: 'Session ID (for terminate/speak)' },
            voice: { type: 'string', description: 'Voice ID for session creation' },
            text: { type: 'string', description: 'Text for proactive speech injection' },
          },
          required: ['action'],
        },
      },

      // ───────────── GOOGLE PRODUCTIVITY TOOLS ─────────────
      {
        name: 'google_calendar',
        description:
          'Google Calendar — Manage events, check availability, quick-create from text, get today agenda',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: [
                'list',
                'get',
                'create',
                'update',
                'delete',
                'quick-create',
                'availability',
                'today',
                'calendars',
              ],
              description: 'Calendar action to perform',
            },
            eventId: { type: 'string', description: 'Event ID (for get/update/delete)' },
            text: { type: 'string', description: 'Natural language text for quick-create' },
            summary: { type: 'string', description: 'Event title' },
            description: { type: 'string', description: 'Event description' },
            location: { type: 'string', description: 'Event location' },
            startDateTime: { type: 'string', description: 'Start time (ISO)' },
            endDateTime: { type: 'string', description: 'End time (ISO)' },
            attendees: { type: 'array', items: { type: 'string' }, description: 'Attendee emails' },
            timeMin: { type: 'string', description: 'Start of time range (ISO)' },
            timeMax: { type: 'string', description: 'End of time range (ISO)' },
            query: { type: 'string', description: 'Search query for events' },
          },
          required: ['action'],
        },
      },
      {
        name: 'google_gmail',
        description: 'Gmail — Read, search, send, draft emails. Get inbox summary, manage labels',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['list', 'get', 'search', 'send', 'draft', 'labels', 'inbox-summary'],
              description: 'Gmail action to perform',
            },
            messageId: { type: 'string', description: 'Message ID (for get)' },
            query: { type: 'string', description: 'Gmail search query' },
            to: { type: 'string', description: 'Recipient email' },
            subject: { type: 'string', description: 'Email subject' },
            body: { type: 'string', description: 'Email body' },
            cc: { type: 'string', description: 'CC recipient' },
            isHtml: { type: 'boolean', description: 'Send as HTML' },
            maxResults: { type: 'number', description: 'Max results to return' },
          },
          required: ['action'],
        },
      },
      {
        name: 'google_sheets',
        description:
          'Google Sheets — Read, write, append data. Create spreadsheets and generate reports',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['read', 'write', 'append', 'create', 'info', 'report'],
              description: 'Sheets action to perform',
            },
            spreadsheetId: { type: 'string', description: 'Spreadsheet ID' },
            range: { type: 'string', description: 'Cell range (e.g. Sheet1!A1:D10)' },
            values: {
              type: 'array',
              description: '2D array of values',
              items: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            title: { type: 'string', description: 'Spreadsheet or report title' },
            sheetNames: {
              type: 'array',
              items: { type: 'string' },
              description: 'Sheet names for creation',
            },
            headers: {
              type: 'array',
              items: { type: 'string' },
              description: 'Report column headers',
            },
            data: {
              type: 'array',
              description: 'Report data rows (2D array)',
              items: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
          required: ['action'],
        },
      },
      {
        name: 'google_vision',
        description: 'Google Vision AI — Analyze images (labels, OCR, landmarks, safe search)',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['analyze', 'ocr'], description: 'Vision action' },
            image: { type: 'string', description: 'Base64 image content or path' },
          },
          required: ['action', 'image'],
        },
      },
      {
        name: 'google_speech',
        description: 'Google Speech — TTS and STT capabilities',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['tts', 'stt'], description: 'Speech action' },
            text: { type: 'string', description: 'Text for TTS' },
            audio: { type: 'string', description: 'Base64 audio for STT' },
            languageCode: { type: 'string', description: 'Language code' },
          },
          required: ['action'],
        },
      },
      {
        name: 'google_contacts',
        description: 'Google Contacts — People API management',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['list', 'search', 'create', 'delete'],
              description: 'Contact action',
            },
            q: { type: 'string', description: 'Search query' },
            givenName: { type: 'string', description: 'First name' },
            familyName: { type: 'string', description: 'Last name' },
            email: { type: 'string', description: 'Email address' },
            phone: { type: 'string', description: 'Phone number' },
            resourceName: { type: 'string', description: 'Resource name for deletion' },
          },
          required: ['action'],
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

      case 'sync_notebooklm': {
        const { exec } = require('child_process');
        const scriptPath =
          'C:\\Users\\Alejandro\\AIGestion\\backend\\src\\scripts\\generate_notebooklm_sources.ts';

        return new Promise((resolve, reject) => {
          exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
              resolve({
                content: [{ type: 'text', text: `Error: ${error.message}` }],
                isError: true,
              });
              return;
            }
            resolve({
              content: [
                {
                  type: 'text',
                  text: `Sovereign Knowledge Sync Complete.\nSources generated in docs/notebooklm_sources/\n\nOutput:\n${stdout}`,
                },
              ],
            });
          });
        });
      }

      case 'ai_studio_generate': {
        const {
          prompt: studioPrompt,
          mode = 'standard',
          model: studioModel,
          systemInstruction: sysInst,
        } = args;
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const studioKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

        if (!studioKey) {
          return {
            content: [{ type: 'text', text: 'Error: GEMINI_API_KEY not configured' }],
            isError: true,
          };
        }

        const genAI = new GoogleGenerativeAI(studioKey);
        const targetModel = studioModel || 'gemini-2.0-flash';

        try {
          let result;

          if (mode === 'grounded') {
            const model = genAI.getGenerativeModel({
              model: targetModel,
              systemInstruction: sysInst,
              tools: [{ googleSearchRetrieval: {} }],
            });
            const response = await model.generateContent(studioPrompt);
            const text = response.response.text();
            const sources =
              response.response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            result = { mode: 'grounded', text, sources };
          } else if (mode === 'code_exec') {
            const model = genAI.getGenerativeModel({
              model: targetModel,
              tools: [{ codeExecution: {} }],
            });
            const response = await model.generateContent(studioPrompt);
            const parts = response.response.candidates?.[0]?.content?.parts || [];
            let text = '',
              code = '',
              output = '';
            for (const part of parts) {
              if (part.text) text += part.text;
              if (part.executableCode) code += part.executableCode.code;
              if (part.codeExecutionResult) output += part.codeExecutionResult.output;
            }
            result = { mode: 'code_exec', text, code, output };
          } else {
            const model = genAI.getGenerativeModel({
              model: targetModel,
              systemInstruction: sysInst,
            });
            const response = await model.generateContent(studioPrompt);
            result = { mode: 'standard', text: response.response.text() };
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (studioError) {
          return {
            content: [{ type: 'text', text: `AI Studio Error: ${studioError.message}` }],
            isError: true,
          };
        }
      }

      case 'colab_deep_research': {
        const { topic, context = {} } = args;
        const response = await aigestion.makeApiRequest('/api/v1/wisdom/research', 'POST', {
          topic,
          context,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      // ───────────── GEMINI GOD MODE HANDLERS ─────────────

      case 'gemini_sovereign': {
        const {
          prompt,
          mode = 'standard',
          model,
          systemInstruction,
          schema,
          thinkingBudget,
        } = args;
        const response = await aigestion.makeApiRequest('/api/v1/gemini/sovereign', 'POST', {
          prompt,
          mode,
          model,
          systemInstruction,
          schema,
          thinkingBudget,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      case 'gemini_multimodal': {
        const { text, imageUrl, audioUrl } = args;
        const response = await aigestion.makeApiRequest('/api/v1/gemini/multimodal', 'POST', {
          text,
          imageUrl,
          audioUrl,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      case 'gemini_live': {
        const { action, sessionId, voice, text } = args;
        let response;

        switch (action) {
          case 'create':
            response = await aigestion.makeApiRequest('/api/v1/gemini/live/session', 'POST', {
              voice,
            });
            break;
          case 'terminate':
            response = await aigestion.makeApiRequest(
              `/api/v1/gemini/live/session/${sessionId}`,
              'DELETE'
            );
            break;
          case 'list':
            response = await aigestion.makeApiRequest('/api/v1/gemini/live/sessions', 'GET');
            break;
          case 'speak':
            response = await aigestion.makeApiRequest('/api/v1/gemini/live/speak', 'POST', {
              sessionId,
              text,
            });
            break;
          case 'voices':
            response = await aigestion.makeApiRequest('/api/v1/gemini/live/voices', 'GET');
            break;
          case 'health':
            response = await aigestion.makeApiRequest('/api/v1/gemini/live/health', 'GET');
            break;
          default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown live action: ${action}`);
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      }

      // ───────────── GOOGLE PRODUCTIVITY HANDLERS ─────────────
      case 'google_calendar': {
        const {
          action,
          eventId,
          text,
          summary,
          description,
          location,
          startDateTime,
          endDateTime,
          attendees,
          timeMin,
          timeMax,
          query,
        } = args;
        let response;
        switch (action) {
          case 'list':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/calendar/events?${new URLSearchParams(Object.entries({ timeMin, timeMax, query, maxResults: '20' }).filter(([, v]) => v)).toString()}`,
              'GET'
            );
            break;
          case 'get':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/calendar/events/${eventId}`,
              'GET'
            );
            break;
          case 'create':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/calendar/events',
              'POST',
              {
                summary,
                description,
                location,
                start: { dateTime: startDateTime },
                end: { dateTime: endDateTime },
                attendees: attendees ? attendees.map(e => ({ email: e })) : undefined,
              }
            );
            break;
          case 'update':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/calendar/events/${eventId}`,
              'PATCH',
              {
                summary,
                description,
                location,
                ...(startDateTime && { start: { dateTime: startDateTime } }),
                ...(endDateTime && { end: { dateTime: endDateTime } }),
              }
            );
            break;
          case 'delete':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/calendar/events/${eventId}`,
              'DELETE'
            );
            break;
          case 'quick-create':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/calendar/quick-create',
              'POST',
              { text }
            );
            break;
          case 'availability':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/calendar/availability',
              'POST',
              { timeMin, timeMax }
            );
            break;
          case 'today':
            response = await aigestion.makeApiRequest('/api/v1/productivity/calendar/today', 'GET');
            break;
          case 'calendars':
            response = await aigestion.makeApiRequest('/api/v1/productivity/calendar/list', 'GET');
            break;
          default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown calendar action: ${action}`);
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'google_gmail': {
        const { action, messageId, query, to, subject, body, cc, isHtml, maxResults } = args;
        let response;
        switch (action) {
          case 'list':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/gmail/messages?maxResults=${maxResults || 20}`,
              'GET'
            );
            break;
          case 'get':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/gmail/messages/${messageId}`,
              'GET'
            );
            break;
          case 'search':
            response = await aigestion.makeApiRequest('/api/v1/productivity/gmail/search', 'POST', {
              query,
              maxResults,
            });
            break;
          case 'send':
            response = await aigestion.makeApiRequest('/api/v1/productivity/gmail/send', 'POST', {
              to,
              subject,
              body,
              cc,
              isHtml,
            });
            break;
          case 'draft':
            response = await aigestion.makeApiRequest('/api/v1/productivity/gmail/draft', 'POST', {
              to,
              subject,
              body,
              isHtml,
            });
            break;
          case 'labels':
            response = await aigestion.makeApiRequest('/api/v1/productivity/gmail/labels', 'GET');
            break;
          case 'inbox-summary':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/gmail/inbox-summary',
              'GET'
            );
            break;
          default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown gmail action: ${action}`);
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'google_sheets': {
        const { action, spreadsheetId, range, values, title, sheetNames, headers, data } = args;
        let response;
        switch (action) {
          case 'read':
            response = await aigestion.makeApiRequest('/api/v1/productivity/sheets/read', 'POST', {
              spreadsheetId,
              range,
            });
            break;
          case 'write':
            response = await aigestion.makeApiRequest('/api/v1/productivity/sheets/write', 'POST', {
              spreadsheetId,
              range,
              values,
            });
            break;
          case 'append':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/sheets/append',
              'POST',
              { spreadsheetId, range, values }
            );
            break;
          case 'create':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/sheets/create',
              'POST',
              { title, sheetNames }
            );
            break;
          case 'info':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/sheets/info/${spreadsheetId}`,
              'GET'
            );
            break;
          case 'report':
            response = await aigestion.makeApiRequest(
              '/api/v1/productivity/sheets/report',
              'POST',
              { title, headers, data }
            );
            break;
          default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown sheets action: ${action}`);
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'google_vision': {
        const { action, image } = args;
        const endpoint =
          action === 'analyze'
            ? '/api/v1/cognitive/vision/analyze'
            : '/api/v1/cognitive/vision/ocr';
        const response = await aigestion.makeApiRequest(endpoint, 'POST', { image });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'google_speech': {
        const { action, text, audio, languageCode } = args;
        const endpoint =
          action === 'tts' ? '/api/v1/cognitive/speech/tts' : '/api/v1/cognitive/speech/stt';
        const response = await aigestion.makeApiRequest(endpoint, 'POST', {
          text,
          audio,
          languageCode,
        });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'google_contacts': {
        const { action, q, givenName, familyName, email, phone, resourceName, pageSize } = args;
        let response;
        switch (action) {
          case 'list':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/contacts?pageSize=${pageSize || 100}`,
              'GET'
            );
            break;
          case 'search':
            response = await aigestion.makeApiRequest(
              `/api/v1/productivity/contacts/search?q=${q}`,
              'GET'
            );
            break;
          case 'create':
            response = await aigestion.makeApiRequest('/api/v1/productivity/contacts', 'POST', {
              givenName,
              familyName,
              email,
              phone,
            });
            break;
          case 'delete':
            response = await aigestion.makeApiRequest('/api/v1/productivity/contacts', 'DELETE', {
              resourceName,
            });
            break;
          default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown contacts action: ${action}`);
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'perception_weather': {
        const { location, lat, lon } = args;
        const queryParams =
          lat && lon ? `?lat=${lat}&lon=${lon}` : `?location=${encodeURIComponent(location)}`;
        const response = await aigestion.makeApiRequest(
          `/api/v1/perception/weather${queryParams}`,
          'GET'
        );
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'perception_maps': {
        const { action, address, lat, lng, query } = args;
        let response;
        if (action === 'geocode') {
          response = await aigestion.makeApiRequest(
            `/api/v1/perception/maps/geocode?address=${encodeURIComponent(address)}`,
            'GET'
          );
        } else {
          response = await aigestion.makeApiRequest(
            `/api/v1/perception/maps/nearby?lat=${lat}&lng=${lng}&query=${encodeURIComponent(query || '')}`,
            'GET'
          );
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }

      case 'perception_navigate': {
        const { url, extractContent } = args;
        const response = await aigestion.makeApiRequest('/api/v1/perception/navigate', 'POST', {
          url,
          extractContent,
        });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
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
