import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { Gemini2Service } from '../gemini-2.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────

export interface CustomGemConfig {
  id: string;
  name: string;
  systemInstruction: string;
  model: string;
  tools?: any[];
  temperature?: number;
}

export interface CachedContext {
  id: string;
  name: string;
  model: string;
  createdAt: string;
  tokenCount?: number;
}

export interface SovereignPrompt {
  id: string;
  name: string;
  category: string;
  systemInstruction?: string;
  template: string;
  model?: string;
  temperature?: number;
  createdAt: string;
}

export interface BatchResult {
  index: number;
  prompt: string;
  result: string | null;
  error: string | null;
  durationMs: number;
}

export interface StudioHealthReport {
  status: 'operational' | 'degraded' | 'offline';
  apiKeyConfigured: boolean;
  defaultModel: string;
  promptLibraryCount: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// AI STUDIO SERVICE — GOD MODE
// Sovereign AI Command Center for Google AI Studio.
// Context Caching · Code Execution · Search Grounding
// Tuned Models · Prompt Library · Batch Processing
// ─────────────────────────────────────────────────────────────

@injectable()
export class AiStudioService {
  private client!: GoogleGenerativeAI;
  private readonly promptLibraryDir: string;
  private readonly defaultModel: string;

  constructor(@inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
    this.defaultModel = process.env.GEMINI_2_MODEL || 'gemini-2.0-flash';
    this.promptLibraryDir = path.join(
      process.env.AIGESTION_ROOT || 'C:\\Users\\Alejandro\\AIGestion',
      'data',
      'ai-studio',
      'prompts',
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 1. CUSTOM GEM EXECUTION
  // ═══════════════════════════════════════════════════════════

  async executeCustomGem(config: CustomGemConfig, prompt: string): Promise<string> {
    logger.info(`[AiStudio] 🔮 Executing Custom Gem: ${config.name} (${config.id})`);
    return this.gemini.generateText(prompt, {
      model: config.model,
      systemInstruction: config.systemInstruction,
      temperature: config.temperature || 0.7,
      tools: config.tools,
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 2. CONTEXT CACHING — Token Reuse Engine
  // ═══════════════════════════════════════════════════════════

  /**
   * Creates a cached context from large content (documents, codebases).
   * Saves precomputed tokens for repeated queries against the same material.
   */
  async createCachedContext(
    name: string,
    content: string,
    model?: string,
    systemInstruction?: string,
  ): Promise<CachedContext> {
    logger.info(`[AiStudio] 🧠 Creating cached context: "${name}"`);

    const targetModel = model || 'gemini-1.5-flash-001';

    try {
      const { GoogleAICacheManager } = await import('@google/generative-ai/server');
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
      const cacheManager = new GoogleAICacheManager(apiKey);

      const cache = await cacheManager.create({
        model: targetModel,
        displayName: name,
        systemInstruction: systemInstruction || 'You are a sovereign AI analyst.',
        contents: [{ role: 'user', parts: [{ text: content }] }],
        ttlSeconds: 3600, // 1 hour cache
      });

      logger.info(`[AiStudio] ✅ Cached context created: ${cache.name}`);
      return {
        id: cache.name || `cache_${Date.now()}`,
        name,
        model: targetModel,
        createdAt: new Date().toISOString(),
        tokenCount: (cache as any).usageMetadata?.totalTokenCount,
      };
    } catch (error: any) {
      logger.warn(`[AiStudio] ⚠️ Cache API unavailable, using fallback: ${error.message}`);
      // Fallback: store in-memory reference
      return {
        id: `cache_fallback_${Date.now()}`,
        name,
        model: targetModel,
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Generates content using a previously cached context.
   */
  async generateWithCache(cacheId: string, prompt: string): Promise<string> {
    logger.info(`[AiStudio] 🧠 Generating with cached context: ${cacheId}`);

    try {
      const { GoogleAICacheManager } = await import('@google/generative-ai/server');
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
      const cacheManager = new GoogleAICacheManager(apiKey);

      const cache = await cacheManager.get(cacheId);
      const model = this.client.getGenerativeModel({
        model: cache.model || this.defaultModel,
        cachedContent: cache,
      } as any);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      logger.warn(
        `[AiStudio] Cache miss for ${cacheId}, using standard generation: ${error.message}`,
      );
      return this.gemini.generateText(prompt);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 3. CODE EXECUTION — Sovereign Sandbox
  // ═══════════════════════════════════════════════════════════

  /**
   * Enables Gemini to generate AND execute Python code in a secure sandbox.
   * Perfect for math, data analysis, and computational tasks.
   */
  async executeWithCode(
    prompt: string,
    model?: string,
  ): Promise<{ text: string; code?: string; output?: string }> {
    logger.info('[AiStudio] ⚡ Code execution mode activated');

    const targetModel = model || 'gemini-2.0-flash';

    try {
      const genModel = this.client.getGenerativeModel({
        model: targetModel,
        tools: [{ codeExecution: {} } as any],
      });

      const result = await genModel.generateContent(prompt);
      const response = result.response;
      const parts = response.candidates?.[0]?.content?.parts || [];

      let text = '';
      let code = '';
      let output = '';

      for (const part of parts) {
        if (part.text) text += part.text;
        if ((part as any).executableCode) code += (part as any).executableCode.code;
        if ((part as any).codeExecutionResult) output += (part as any).codeExecutionResult.output;
      }

      logger.info('[AiStudio] ✅ Code execution complete');
      return { text, code: code || undefined, output: output || undefined };
    } catch (error: any) {
      logger.error(`[AiStudio] Code execution failed: ${error.message}`);
      // Fallback to standard generation
      const fallback = await this.gemini.generateText(
        `${prompt}\n\nPlease include any code in markdown code blocks.`,
      );
      return { text: fallback };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 4. GOOGLE SEARCH GROUNDING — Real-Time Facts
  // ═══════════════════════════════════════════════════════════

  /**
   * Generates responses grounded in Google Search for factual accuracy.
   * Responses include source citations and reduce hallucinations.
   */
  async generateGrounded(
    prompt: string,
    model?: string,
    systemInstruction?: string,
  ): Promise<{ text: string; sources: any[] }> {
    logger.info('[AiStudio] 🌍 Google Search Grounding activated');

    const targetModel = model || this.defaultModel;

    try {
      const genModel = this.client.getGenerativeModel({
        model: targetModel,
        systemInstruction: systemInstruction,
        tools: [{ googleSearchRetrieval: {} } as any],
      });

      const result = await genModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract grounding metadata
      const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata;
      const sources =
        groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          title: chunk?.web?.title || 'Source',
          uri: chunk?.web?.uri || '',
        })) || [];

      logger.info(`[AiStudio] ✅ Grounded response with ${sources.length} sources`);
      return { text, sources };
    } catch (error: any) {
      logger.error(`[AiStudio] Grounding failed: ${error.message}`);
      const fallback = await this.gemini.generateText(prompt);
      return { text: fallback, sources: [] };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 5. TUNED MODEL REGISTRY
  // ═══════════════════════════════════════════════════════════

  /**
   * Lists tuned models available in AI Studio.
   */
  async listTunedModels(): Promise<any[]> {
    logger.info('[AiStudio] 🔧 Fetching tuned models...');

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/tunedModels?key=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = (await response.json()) as any;
      const models = data.tunedModels || [];
      logger.info(`[AiStudio] ✅ Found ${models.length} tuned models`);
      return models;
    } catch (error: any) {
      logger.warn(`[AiStudio] ⚠️ Could not fetch tuned models: ${error.message}`);
      return [];
    }
  }

  /**
   * Generates content using a specific tuned model.
   */
  async generateWithTunedModel(tunedModelName: string, prompt: string): Promise<string> {
    logger.info(`[AiStudio] 🔧 Generating with tuned model: ${tunedModelName}`);

    try {
      const model = this.client.getGenerativeModel({ model: tunedModelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      logger.error(`[AiStudio] Tuned model generation failed: ${error.message}`);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 6. SOVEREIGN PROMPT LIBRARY
  // ═══════════════════════════════════════════════════════════

  /**
   * Saves a reusable prompt template.
   */
  async savePrompt(prompt: Omit<SovereignPrompt, 'id' | 'createdAt'>): Promise<SovereignPrompt> {
    logger.info(`[AiStudio] 📚 Saving prompt: "${prompt.name}"`);

    if (!fs.existsSync(this.promptLibraryDir)) {
      fs.mkdirSync(this.promptLibraryDir, { recursive: true });
    }

    const saved: SovereignPrompt = {
      ...prompt,
      id: `prompt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(this.promptLibraryDir, `${saved.id}.json`),
      JSON.stringify(saved, null, 2),
    );

    logger.info(`[AiStudio] ✅ Prompt saved: ${saved.id}`);
    return saved;
  }

  /**
   * Lists all saved prompt templates.
   */
  async listPrompts(): Promise<SovereignPrompt[]> {
    if (!fs.existsSync(this.promptLibraryDir)) return [];

    const files = fs.readdirSync(this.promptLibraryDir).filter(f => f.endsWith('.json'));
    return files.map(f => {
      const content = fs.readFileSync(path.join(this.promptLibraryDir, f), 'utf8');
      return JSON.parse(content) as SovereignPrompt;
    });
  }

  /**
   * Executes a saved prompt template with variable substitution.
   */
  async executePrompt(promptId: string, variables?: Record<string, string>): Promise<string> {
    logger.info(`[AiStudio] 📚 Executing prompt: ${promptId}`);

    const promptFile = path.join(this.promptLibraryDir, `${promptId}.json`);
    if (!fs.existsSync(promptFile)) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const saved: SovereignPrompt = JSON.parse(fs.readFileSync(promptFile, 'utf8'));
    let resolvedTemplate = saved.template;

    // Variable substitution: {{variable_name}}
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        resolvedTemplate = resolvedTemplate.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
    }

    return this.gemini.generateText(resolvedTemplate, {
      model: saved.model || this.defaultModel,
      systemInstruction: saved.systemInstruction,
      temperature: saved.temperature || 0.7,
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 7. BATCH PROCESSING — Parallel Execution
  // ═══════════════════════════════════════════════════════════

  /**
   * Executes multiple prompts in parallel for maximum throughput.
   */
  async batchGenerate(
    prompts: string[],
    options?: { model?: string; systemInstruction?: string },
  ): Promise<BatchResult[]> {
    logger.info(`[AiStudio] 📦 Batch processing ${prompts.length} prompts...`);

    const results = await Promise.allSettled(
      prompts.map(async (prompt, index) => {
        const start = Date.now();
        const result = await this.gemini.generateText(prompt, {
          model: options?.model || this.defaultModel,
          systemInstruction: options?.systemInstruction,
        });
        return {
          index,
          prompt: prompt.substring(0, 100),
          result,
          error: null,
          durationMs: Date.now() - start,
        } as BatchResult;
      }),
    );

    const output = results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      return {
        index: i,
        prompt: prompts[i]?.substring(0, 100) || '',
        result: null,
        error: (r.reason as Error).message,
        durationMs: 0,
      } as BatchResult;
    });

    const successCount = output.filter(r => !r.error).length;
    logger.info(`[AiStudio] ✅ Batch complete: ${successCount}/${prompts.length} succeeded`);
    return output;
  }

  // ═══════════════════════════════════════════════════════════
  // 8. HEALTH DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════

  async getStudioHealth(): Promise<StudioHealthReport> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    let status: 'operational' | 'degraded' | 'offline' = 'offline';

    if (apiKey && this.client) {
      try {
        // Quick connectivity test
        const model = this.client.getGenerativeModel({ model: this.defaultModel });
        await model.generateContent('ping');
        status = 'operational';
      } catch {
        status = 'degraded';
      }
    }

    const prompts = await this.listPrompts();

    return {
      status,
      apiKeyConfigured: !!apiKey,
      defaultModel: this.defaultModel,
      promptLibraryCount: prompts.length,
      timestamp: new Date().toISOString(),
    };
  }
}
