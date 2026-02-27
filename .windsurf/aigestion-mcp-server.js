#!/usr/bin/env node

/**
 * AIGestion Nexus — Sovereign MCP Server
 * Version: 1.0.0-sovereign
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
const { printBanner, logTelemetry } = require('./Sovereign-Banner.js');

// ───────────── CORE INFRASTRUCTURE ─────────────

class BaseSovereignManager {
  constructor() {
    this.apiUrl = process.env.AIGESTION_API_URL || 'https://api.aigestion.net';
    this.apiKey = process.env.AIGESTION_API_KEY;
    this.mongoUri = process.env.MONGODB_URI;
    this.redisUrl = process.env.REDIS_URL;
    this.mongoClient = null;
    this.redisClient = null;
  }

  async initialize() {
    try {
      if (this.mongoUri) {
        this.mongoClient = new MongoClient(this.mongoUri);
        await this.mongoClient.connect();
      }
      if (this.redisUrl) {
        this.redisClient = Redis.createClient({ url: this.redisUrl });
        await this.redisClient.connect();
      }
    } catch (e) {
      console.error(`[Sovereign-Init-Error] ${e.message}`);
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
      if (data) config.data = data;
      const response = await axios(config);
      return response.data;
    } catch (error) {
      const status = error.response ? error.response.status : 'NETWORK_ERROR';
      throw new Error(`Sovereign API Request Failed [${status}]: ${error.message}`);
    }
  }

  async cleanup() {
    if (this.mongoClient) await this.mongoClient.close();
    if (this.redisClient) await this.redisClient.quit();
  }
}

// ───────────── DOMAIN MANAGERS ─────────────

class AIGestionCoreManager extends BaseSovereignManager {
  async queryMongoDB(database, collection, query = {}) {
    if (!this.mongoClient) throw new Error('MongoDB not connected');
    const db = this.mongoClient.db(database);
    return await db.collection(collection).find(query).toArray();
  }

  async cacheSet(key, value, ttl = 3600) {
    if (!this.redisClient) throw new Error('Redis not connected');
    await this.redisClient.setEx(key, ttl, JSON.stringify(value));
    return { success: true, key };
  }

  async cacheGet(key) {
    if (!this.redisClient) throw new Error('Redis not connected');
    const val = await this.redisClient.get(key);
    return val ? JSON.parse(val) : null;
  }

  async getMetrics() {
    return await this.makeApiRequest('/api/system/metrics');
  }

  async createBackup(name) {
    return await this.makeApiRequest('/api/backup/create', 'POST', {
      name: name || `sovereign_backup_${Date.now()}`,
    });
  }

  async codeAction(type, code, language) {
    const endpoints = {
      analyze: '/api/code/analyze',
      optimize: '/api/code/optimize',
      'generate-tests': '/api/code/generate-tests',
    };
    return await this.makeApiRequest(endpoints[type], 'POST', { code, language });
  }
}

class GeminiSovereignManager extends BaseSovereignManager {
  async generateSovereign(args) {
    return await this.makeApiRequest('/api/v1/gemini/sovereign', 'POST', args);
  }

  async multimodal(args) {
    return await this.makeApiRequest('/api/v1/gemini/multimodal', 'POST', args);
  }

  async liveAction(action, args) {
    const endpoints = {
      create: { url: '/api/v1/gemini/live/session', method: 'POST' },
      terminate: { url: `/api/v1/gemini/live/session/${args.sessionId}`, method: 'DELETE' },
      list: { url: '/api/v1/gemini/live/sessions', method: 'GET' },
      speak: { url: '/api/v1/gemini/live/speak', method: 'POST' },
      voices: { url: '/api/v1/gemini/live/voices', method: 'GET' },
      health: { url: '/api/v1/gemini/live/health', method: 'GET' },
    };
    const { url, method } = endpoints[action];
    return await this.makeApiRequest(url, method, args);
  }

  async aiStudio(args) {
    const { prompt, mode = 'standard', model: studioModel, systemInstruction: sysInst } = args;
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const studioKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

    if (!studioKey) throw new Error('GEMINI_API_KEY not configured');

    const genAI = new GoogleGenerativeAI(studioKey);
    const targetModel = studioModel || 'gemini-2.0-flash';

    if (mode === 'grounded') {
      const model = genAI.getGenerativeModel({
        model: targetModel,
        systemInstruction: sysInst,
        tools: [{ googleSearchRetrieval: {} }],
      });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const sources = response.response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { mode: 'grounded', text, sources };
    } else if (mode === 'code_exec') {
      const model = genAI.getGenerativeModel({ model: targetModel, tools: [{ codeExecution: {} }] });
      const response = await model.generateContent(prompt);
      const parts = response.response.candidates?.[0]?.content?.parts || [];
      let text = '',
        code = '',
        output = '';
      for (const part of parts) {
        if (part.text) text += part.text;
        if (part.executableCode) code += part.executableCode.code;
        if (part.codeExecutionResult) output += part.codeExecutionResult.output;
      }
      return { mode: 'code_exec', text, code, output };
    } else {
      const model = genAI.getGenerativeModel({ model: targetModel, systemInstruction: sysInst });
      const response = await model.generateContent(prompt);
      return { mode: 'standard', text: response.response.text() };
    }
  }
}

class GoogleProductivityManager extends BaseSovereignManager {
  async calendarAction(action, args) {
    const { eventId, timeMin, timeMax, query, text, summary, description, location, startDateTime, endDateTime, attendees } = args;
    switch (action) {
      case 'list': return await this.makeApiRequest(`/api/v1/productivity/calendar/events?${new URLSearchParams({ timeMin, timeMax, query, maxResults: '20' }).toString()}`);
      case 'get': return await this.makeApiRequest(`/api/v1/productivity/calendar/events/${eventId}`);
      case 'create': return await this.makeApiRequest('/api/v1/productivity/calendar/events', 'POST', { summary, description, location, start: { dateTime: startDateTime }, end: { dateTime: endDateTime }, attendees: attendees ? attendees.map(e => ({ email: e })) : undefined });
      case 'update': return await this.makeApiRequest(`/api/v1/productivity/calendar/events/${eventId}`, 'PATCH', { summary, description, location, ...(startDateTime && { start: { dateTime: startDateTime } }), ...(endDateTime && { end: { dateTime: endDateTime } }) });
      case 'delete': return await this.makeApiRequest(`/api/v1/productivity/calendar/events/${eventId}`, 'DELETE');
      case 'quick-create': return await this.makeApiRequest('/api/v1/productivity/calendar/quick-create', 'POST', { text });
      case 'availability': return await this.makeApiRequest('/api/v1/productivity/calendar/availability', 'POST', { timeMin, timeMax });
      case 'today': return await this.makeApiRequest('/api/v1/productivity/calendar/today');
      case 'calendars': return await this.makeApiRequest('/api/v1/productivity/calendar/list');
      default: throw new Error(`Unknown calendar action: ${action}`);
    }
  }

  async gmailAction(action, args) {
    const { messageId, query, to, subject, body, cc, isHtml, maxResults } = args;
    switch (action) {
      case 'list': return await this.makeApiRequest(`/api/v1/productivity/gmail/messages?maxResults=${maxResults || 20}`);
      case 'get': return await this.makeApiRequest(`/api/v1/productivity/gmail/messages/${messageId}`);
      case 'search': return await this.makeApiRequest('/api/v1/productivity/gmail/search', 'POST', { query, maxResults });
      case 'send': return await this.makeApiRequest('/api/v1/productivity/gmail/send', 'POST', { to, subject, body, cc, isHtml });
      case 'draft': return await this.makeApiRequest('/api/v1/productivity/gmail/draft', 'POST', { to, subject, body, isHtml });
      case 'labels': return await this.makeApiRequest('/api/v1/productivity/gmail/labels');
      case 'inbox-summary': return await this.makeApiRequest('/api/v1/productivity/gmail/inbox-summary');
      default: throw new Error(`Unknown gmail action: ${action}`);
    }
  }

  async sheetsAction(action, args) {
    const { spreadsheetId, range, values, title, sheetNames, headers, data } = args;
    switch (action) {
      case 'read': return await this.makeApiRequest('/api/v1/productivity/sheets/read', 'POST', { spreadsheetId, range });
      case 'write': return await this.makeApiRequest('/api/v1/productivity/sheets/write', 'POST', { spreadsheetId, range, values });
      case 'append': return await this.makeApiRequest('/api/v1/productivity/sheets/append', 'POST', { spreadsheetId, range, values });
      case 'create': return await this.makeApiRequest('/api/v1/productivity/sheets/create', 'POST', { title, sheetNames });
      case 'info': return await this.makeApiRequest(`/api/v1/productivity/sheets/info/${spreadsheetId}`);
      case 'report': return await this.makeApiRequest('/api/v1/productivity/sheets/report', 'POST', { title, headers, data });
      default: throw new Error(`Unknown sheets action: ${action}`);
    }
  }

  async cognitiveAction(domain, action, args) {
    const endpoints = {
      vision: { analyze: '/api/v1/cognitive/vision/analyze', ocr: '/api/v1/cognitive/vision/ocr' },
      speech: { tts: '/api/v1/cognitive/speech/tts', stt: '/api/v1/cognitive/speech/stt' },
    };
    return await this.makeApiRequest(endpoints[domain][action], 'POST', args);
  }

  async contactsAction(action, args) {
    const { q, givenName, familyName, email, phone, resourceName, pageSize } = args;
    switch (action) {
      case 'list': return await this.makeApiRequest(`/api/v1/productivity/contacts?pageSize=${pageSize || 100}`);
      case 'search': return await this.makeApiRequest(`/api/v1/productivity/contacts/search?q=${q}`);
      case 'create': return await this.makeApiRequest('/api/v1/productivity/contacts', 'POST', { givenName, familyName, email, phone });
      case 'delete': return await this.makeApiRequest('/api/v1/productivity/contacts', 'DELETE', { resourceName });
      default: throw new Error(`Unknown contacts action: ${action}`);
    }
  }
}

class PerceptionGatewayManager extends BaseSovereignManager {
  async weather(args) {
    const { location, lat, lon } = args;
    const q = lat && lon ? `?lat=${lat}&lon=${lon}` : `?location=${encodeURIComponent(location)}`;
    return await this.makeApiRequest(`/api/v1/perception/weather${q}`);
  }

  async maps(args) {
    const { action, address, lat, lng, query } = args;
    if (action === 'geocode') return await this.makeApiRequest(`/api/v1/perception/maps/geocode?address=${encodeURIComponent(address)}`);
    return await this.makeApiRequest(`/api/v1/perception/maps/nearby?lat=${lat}&lng=${lng}&query=${encodeURIComponent(query || '')}`);
  }

  async navigate(args) {
    return await this.makeApiRequest('/api/v1/perception/navigate', 'POST', args);
  }
}

// ───────────── MCP SERVER DEFINITION ─────────────

const server = new Server(
  { name: 'aigestion-sovereign', version: '1.0.0-sovereign' },
  { capabilities: { tools: {} } }
);

const core = new AIGestionCoreManager();
const gemini = new GeminiSovereignManager();
const google = new GoogleProductivityManager();
const perception = new PerceptionGatewayManager();

// Initialize
(async () => {
  await Promise.all([core.initialize(), gemini.initialize(), google.initialize(), perception.initialize()]);
})();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      { name: 'generate_ai_content', description: 'Genera contenido usando AI de AIGestion', inputSchema: { type: 'object', properties: { prompt: { type: 'string' }, model: { type: 'string', default: 'gemini-pro' } }, required: ['prompt'] } },
      { name: 'search_documents', description: 'Busca documentos en AIGestion', inputSchema: { type: 'object', properties: { query: { type: 'string' }, index: { type: 'string', default: 'aigestion' } }, required: ['query'] } },
      { name: 'query_mongodb', description: 'Ejecuta queries en MongoDB de AIGestion', inputSchema: { type: 'object', properties: { database: { type: 'string' }, collection: { type: 'string' }, query: { type: 'object' } }, required: ['database', 'collection'] } },
      { name: 'cache_set', description: 'Almacena datos en Redis cache', inputSchema: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'object' }, ttl: { type: 'number', default: 3600 } }, required: ['key', 'value'] } },
      { name: 'cache_get', description: 'Obtiene datos del Redis cache', inputSchema: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] } },
      { name: 'analyze_code', description: 'Analiza código con AIGestion', inputSchema: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string', default: 'javascript' } }, required: ['code'] } },
      { name: 'optimize_code', description: 'Optimiza código con AIGestion', inputSchema: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string', default: 'javascript' } }, required: ['code'] } },
      { name: 'generate_tests', description: 'Genera tests automáticos', inputSchema: { type: 'object', properties: { code: { type: 'string' }, language: { type: 'string', default: 'javascript' } }, required: ['code'] } },
      { name: 'get_system_metrics', description: 'Obtiene métricas del sistema AIGestion', inputSchema: { type: 'object', properties: {} } },
      { name: 'create_backup', description: 'Crea backup de AIGestion', inputSchema: { type: 'object', properties: { name: { type: 'string' } } } },
      { name: 'sync_notebooklm', description: 'Genera paquetes de fuentes optimizados para NotebookLM', inputSchema: { type: 'object', properties: {} } },
      { name: 'ai_studio_generate', description: 'God Mode AI Studio - Generate content with grounding, code execution, or standard mode', inputSchema: { type: 'object', properties: { prompt: { type: 'string' }, mode: { type: 'string', default: 'standard' }, model: { type: 'string' }, systemInstruction: { type: 'string' } }, required: ['prompt'] } },
      { name: 'colab_deep_research', description: 'Deep Research God Mode - Generates and executes a Colab notebook for autonomous investigation', inputSchema: { type: 'object', properties: { topic: { type: 'string' }, context: { type: 'object' } }, required: ['topic'] } },
      { name: 'gemini_sovereign', description: 'Gemini God Mode — Sovereign text generation', inputSchema: { type: 'object', properties: { prompt: { type: 'string' }, mode: { type: 'string', enum: ['standard', 'structured', 'thinking'] }, model: { type: 'string' }, systemInstruction: { type: 'string' }, schema: { type: 'object' }, thinkingBudget: { type: 'number' } }, required: ['prompt'] } },
      { name: 'gemini_multimodal', description: 'Gemini Multimodal — Analyze images, audio, or combined inputs', inputSchema: { type: 'object', properties: { text: { type: 'string' }, imageUrl: { type: 'string' }, audioUrl: { type: 'string' } }, required: ['text'] } },
      { name: 'gemini_live', description: 'Gemini Live — Real-time voice sessions', inputSchema: { type: 'object', properties: { action: { type: 'string', enum: ['create', 'terminate', 'list', 'speak', 'voices', 'health'] }, sessionId: { type: 'string' }, voice: { type: 'string' }, text: { type: 'string' } }, required: ['action'] } },
      { name: 'google_calendar', description: 'Google Calendar — Manage events', inputSchema: { type: 'object', properties: { action: { type: 'string' }, eventId: { type: 'string' }, text: { type: 'string' }, summary: { type: 'string' }, description: { type: 'string' }, location: { type: 'string' }, startDateTime: { type: 'string' }, endDateTime: { type: 'string' }, attendees: { type: 'array', items: { type: 'string' } }, timeMin: { type: 'string' }, timeMax: { type: 'string' }, query: { type: 'string' } }, required: ['action'] } },
      { name: 'google_gmail', description: 'Gmail — Read, search, send, draft emails', inputSchema: { type: 'object', properties: { action: { type: 'string' }, messageId: { type: 'string' }, query: { type: 'string' }, to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' }, cc: { type: 'string' }, isHtml: { type: 'boolean' }, maxResults: { type: 'number' } }, required: ['action'] } },
      { name: 'google_sheets', description: 'Google Sheets — Read, write, append, create', inputSchema: { type: 'object', properties: { action: { type: 'string' }, spreadsheetId: { type: 'string' }, range: { type: 'string' }, values: { type: 'array', items: { type: 'array', items: { type: 'string' } } }, title: { type: 'string' }, sheetNames: { type: 'array', items: { type: 'string' } }, headers: { type: 'array', items: { type: 'string' } }, data: { type: 'array', items: { type: 'array', items: { type: 'string' } } } }, required: ['action'] } },
      { name: 'google_vision', description: 'Google Vision AI — Analyze images', inputSchema: { type: 'object', properties: { action: { type: 'string', enum: ['analyze', 'ocr'] }, image: { type: 'string' } }, required: ['action', 'image'] } },
      { name: 'google_speech', description: 'Google Speech — TTS and STT', inputSchema: { type: 'object', properties: { action: { type: 'string', enum: ['tts', 'stt'] }, text: { type: 'string' }, audio: { type: 'string' }, languageCode: { type: 'string' } }, required: ['action'] } },
      { name: 'google_contacts', description: 'Google Contacts — People API', inputSchema: { type: 'object', properties: { action: { type: 'string' }, q: { type: 'string' }, givenName: { type: 'string' }, familyName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, resourceName: { type: 'string' } }, required: ['action'] } },
      { name: 'perception_weather', description: 'Weather Data Gateway', inputSchema: { type: 'object', properties: { location: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' } } } },
      { name: 'perception_maps', description: 'Navigation & Place perception', inputSchema: { type: 'object', properties: { action: { type: 'string' }, address: { type: 'string' }, lat: { type: 'number' }, lng: { type: 'number' }, query: { type: 'string' } }, required: ['action'] } },
      { name: 'perception_navigate', description: 'Autonomous Browser Navigation perception', inputSchema: { type: 'object', properties: { url: { type: 'string' }, extractContent: { type: 'boolean' } }, required: ['url'] } },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();

  try {
    let result;
    switch (name) {
      // ───────────── CORE ─────────────
      case 'generate_ai_content': result = await core.makeApiRequest('/api/ai/generate', 'POST', args); break;
      case 'search_documents': result = await core.makeApiRequest('/api/search', 'POST', args); break;
      case 'query_mongodb': result = await core.queryMongoDB(args.database, args.collection, args.query); break;
      case 'cache_set': result = await core.cacheSet(args.key, args.value, args.ttl); break;
      case 'cache_get': result = await core.cacheGet(args.key); break;
      case 'analyze_code': result = await core.codeAction('analyze', args.code, args.language); break;
      case 'optimize_code': result = await core.codeAction('optimize', args.code, args.language); break;
      case 'generate_tests': result = await core.codeAction('generate-tests', args.code, args.language); break;
      case 'get_system_metrics': result = await core.getMetrics(); break;
      case 'create_backup': result = await core.createBackup(args.name); break;

      // ───────────── GEMINI ─────────────
      case 'gemini_sovereign': result = await gemini.generateSovereign(args); break;
      case 'gemini_multimodal': result = await gemini.multimodal(args); break;
      case 'gemini_live': result = await gemini.liveAction(args.action, args); break;
      case 'ai_studio_generate': result = await gemini.aiStudio(args); break;
      case 'colab_deep_research': result = await core.makeApiRequest('/api/v1/wisdom/research', 'POST', args); break;

      // ───────────── GOOGLE ─────────────
      case 'google_calendar': result = await google.calendarAction(args.action, args); break;
      case 'google_gmail': result = await google.gmailAction(args.action, args); break;
      case 'google_sheets': result = await google.sheetsAction(args.action, args); break;
      case 'google_vision': result = await google.cognitiveAction('vision', args.action, args); break;
      case 'google_speech': result = await google.cognitiveAction('speech', args.action, args); break;
      case 'google_contacts': result = await google.contactsAction(args.action, args); break;

      // ───────────── PERCEPTION ─────────────
      case 'perception_weather': result = await perception.weather(args); break;
      case 'perception_maps': result = await perception.maps(args); break;
      case 'perception_navigate': result = await perception.navigate(args); break;

      case 'sync_notebooklm':
        const { exec } = require('child_process');
        result = await new Promise((res) => exec(`npx tsx C:\\Users\\Alejandro\\AIGestion\\backend\\src\\scripts\\generate_notebooklm_sources.ts`, (e, so) => res(e ? `Error: ${e.message}` : so)));
        break;

      default: throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    logTelemetry(name, Date.now() - startTime);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Sovereign Tool Error: ${error.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  printBanner('aigestion-sovereign', '1.0.0-sovereign');
}

process.on('SIGINT', async () => { await Promise.all([core.cleanup(), gemini.cleanup(), google.cleanup(), perception.cleanup()]); process.exit(0); });
if (require.main === module) main().catch(e => { console.error('Sovereign Server Error:', e); process.exit(1); });
