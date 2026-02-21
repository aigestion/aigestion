import { inject, injectable } from 'inversify';
import { Readable } from 'node:stream';
import axios from 'axios';
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

import { env } from '../config/env.schema';
import { CircuitBreakerFactory } from '../infrastructure/resilience/CircuitBreakerFactory';
import { StripeTool } from '../tools/stripe.tool';
import { SearchWebTool } from '../tools/web-search.tool';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { AIModelRouter, AIModelTier, ModelConfig } from '../utils/aiRouter';
import { AnalyticsService } from './analytics.service';
import { RagService } from './rag.service';
import { SemanticCacheService } from './semantic-cache.service';
import { UsageService } from './usage.service';
import { ArbitrationService } from './arbitration.service';
import { Persona } from '../models/Persona';


export interface AIStreamParams {
  prompt: string;
  history?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  userId: string;
  userRole?: string;
  personaId?: string;
}

@injectable()
export class AIService {
  private _model: any;
  private _vertexAI: VertexAI | null = null;
  private _embeddingModel: any = null;

  private generateContentBreaker: any;
  private chatStreamBreaker: any;

  constructor(
    @inject(TYPES.AnalyticsService) private readonly analyticsService: AnalyticsService,
    @inject(TYPES.RagService) private readonly ragService: RagService,
    @inject(TYPES.PineconeService) private pineconeService: PineconeService,
    @inject(TYPES.NexusSwarmOrchestrator) private readonly swarm: NexusSwarmOrchestrator,
    @inject(TYPES.JulesGem) private readonly jules: any, // Use any or proper type if imported
    @inject(TYPES.NexusStitchGem) private readonly stitchGem: any,
    @inject(TYPES.UsageService) private readonly usageService: UsageService,
    @inject(TYPES.SemanticCacheService) private readonly semanticCache: SemanticCacheService,
    @inject(TYPES.ArbitrationService) private readonly arbitrationService: ArbitrationService,
  ) {
    // Breakers initialized with async lambdas that will call getModel() on execution
    this.generateContentBreaker = CircuitBreakerFactory.create(
      async (prompt: string) => {
        const model = await this.getModel();
        return model.generateContent(prompt);
      },
      { name: 'Gemini.generateContent', timeout: 10000 }, // Higher timeout for AI
    );

    this.chatStreamBreaker = CircuitBreakerFactory.create(
      async (prompt: string, chatSession: any) => chatSession.sendMessageStream(prompt),
      { name: 'Gemini.sendMessageStream', timeout: 10000 },
    );
  }

  private async getProviderModel(config: ModelConfig) {
    if (config.provider === 'gemini') {
      if (!this._vertexAI) {
        this._vertexAI = new VertexAI({
          project: env.GOOGLE_PROJECT_ID || 'aigestion-sovereign-2026',
          location: env.GOOGLE_LOCATION || 'us-central1',
        });
      }

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_VERY_LOW_AND_ABOVE,
        },
      ];

      return this._vertexAI.getGenerativeModel({
        model: config.modelId,
        safetySettings,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });
    }
    throw new Error(`Unsupported provider: ${config.provider}`);
  }

  private async getModel() {
    if (!this._model) {
      const config = AIModelRouter.getModelConfig(AIModelTier.STANDARD);
      this._model = await this.getProviderModel(config);
    }
    return this._model;
  }

  private getTools(): any[] {
    return [
      {
        name: 'get_revenue_analytics',
        description: 'Get monthly revenue data for the dashboard.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_user_growth',
        description: 'Get user growth trends for the last 14 days.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'search_web',
        description: 'Search the web for real-time information, news, or technical documentation.',
        parameters: {
          type: 'object' as any,
          properties: {
            query: { type: 'string', description: 'The search query.' },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_codebase_context',
        description:
          'Read the codebase to understand the project architecture, files, or specific implementation details. Use this when asked about the "project", "code", "architecture", or "how something works" in this app.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Optional focus or query to filter the context (currently returns full context)',
            },
          },
        },
      },
      {
        name: 'manage_subscription',
        description:
          'Manage user subscriptions, check status, or generate checkout/portal links. Use this tool when the user asks about their billing, subscription, or upgrading plan.',
        parameters: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['get_status', 'create_checkout', 'create_portal'],
              description: 'The action to perform.',
            },
            userId: { type: 'string', description: 'The ID of the user context (implicit).' },
            priceId: {
              type: 'string',
              description:
                'The Stripe Price ID for checkout (required if action is create_checkout).',
            },
          },
          required: ['action'],
        },
      },
    ];
  }

  public async streamChat(params: AIStreamParams): Promise<Readable> {
    const stream = new Readable({ read() {} });

    // Map roles for history
    const history = (params.history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content,
      parts: [{ text: msg.content }], // For Gemini
    }));

    // God Mode: Force PREMIUM tier for admin/god
    const tier =
      params.userRole === 'god' || params.userRole === 'admin'
        ? AIModelTier.PREMIUM
        : AIModelRouter.route(params.prompt);

    const runner = async () => {
      try {
        const { provider, modelId, reason } = await this.arbitrationService.getOptimalConfig(
          tier,
          params.prompt,
        );
        logger.info(`[AIService] Arbitrated to: ${provider}/${modelId} | Reason: ${reason}`);

        // Fallback to gemini if provider is not supported in stream mode yet
        const effectiveConfig =
          provider === 'gemini'
            ? { provider, modelId }
            : AIModelRouter.getModelConfig(AIModelTier.STANDARD);

        const model = await this.getProviderModel(effectiveConfig);

        let systemInstruction = `Eres Nexus AI, un agente avanzado.
                Cuando se te pida información sobre ingresos o usuarios, utiliza las herramientas proporcionadas.
                ID de usuario actual: ${params.userId}.
                Utiliza la herramienta 'search_web' para obtener información actualizada.`;

        if (params.personaId) {
          const persona = await Persona.findById(params.personaId);
          if (persona) {
            logger.info(`[AIService] Swapping to Persona: ${persona.name}`);
            systemInstruction = persona.systemPrompt;
          }
        }

        const chat = model.startChat({
          history: history.map(h => ({ role: h.role, parts: h.parts })),
          generationConfig: { maxOutputTokens: 2048 },
          systemInstruction: { parts: [{ text: systemInstruction }] },
          tools: [{ functionDeclarations: this.getTools() }],
        });

        const result = await this.chatStreamBreaker.fire(params.prompt, chat);

        let fullResponse = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            fullResponse += chunkText;
            stream.push(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`);
          }

          // Tool calls handling (Gemini specific for now)
          const functionCalls = chunk.functionCalls();
          if (functionCalls && functionCalls.length > 0) {
            for (const call of functionCalls) {
              await this.handleToolCall(
                call,
                stream,
                params,
                this.ragService,
                this.analyticsService,
              );
            }
          }
        }

        stream.push('data: [DONE]\n\n');
        stream.push(null);

        // Track usage (Simplified for stream)
        this.usageService.trackUsage({
          userId: params.userId,
          provider: 'gemini',
          modelId: effectiveConfig.modelId,
          prompt: params.prompt,
          completion: fullResponse || 'Streamed response',
          arbitrationReason: reason,
        });
      } catch (error) {
        logger.error(error, '[AIService] Error in streamChat');
        stream.emit('error', error);
        stream.push(null);
      }
    };

    runner();
    return stream;
  }

  /**
   * Generate content (Single-shot) with Semantic Routing
   */
  public async generateContent(
    prompt: string,
    userId: string = 'anonymous',
    userRole: string = 'user',
  ): Promise<string> {
    try {
      // God Mode: Force PREMIUM tier for admin/god
      const tier =
        userRole === 'god' || userRole === 'admin'
          ? AIModelTier.PREMIUM
          : AIModelRouter.route(prompt);

      // [GOD MODE] Semantic Cache Check
      const cached = await this.semanticCache.getSemantic(prompt);
      if (cached) {
        logger.info(`[AIService] Semantic Cache Hit for: "${prompt.substring(0, 30)}..."`);
        return cached;
      }

      const { provider, modelId, reason } = await this.arbitrationService.getOptimalConfig(
        tier,
        prompt,
      );

      logger.info(
        `[AIService] Arbitrated to Tier: ${tier} (${provider}/${modelId}) | Reason: ${reason}`,
      );

      // [GOD MODE] Swarm Collaboration for Premium/God users
      if (userRole === 'god' && prompt.toLowerCase().includes('swarm')) {
        logger.info('[AIService] Triggering Swarm Intelligence for God-Level query.');
        const swarmResult = await this.swarm.collaborate(prompt, [this.jules, this.stitchGem]);
        return swarmResult.supremeVerdict;
      }

      // [GOD MODE] Dual-Provider Support
      if (provider === 'gemini') {
        const model = await this.getProviderModel({ provider, modelId });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Track usage
        this.usageService.trackUsage({
          userId,
          provider: 'gemini',
          modelId: modelId,
          prompt: prompt,
          completion: text,
          arbitrationReason: reason,
        });

        await this.semanticCache.setSemantic(prompt, text);
        return text;
      }

      if (provider === 'ollama') {
        return this.generateOllamaContent(prompt, modelId);
      }

      if (provider === 'anthropic' || provider === 'openai') {
        // Fallback or specialized handling for other providers (Stub for now or use ArbitrationService if it has a direct generator)
        // Since ArbitrationService is already here, we could add a generic generateText there or implement it here.
        // For now, let's use gemini-2.0-flash as a sovereign fallback to avoid breakage while keeping the arbitration log.
        logger.warn(
          `[AIService] Provider ${provider} selected by arbitrator but not fully implemented in AIService yet. Falling back to Gemini.`,
        );
        const model = await this.getProviderModel({
          provider: 'gemini',
          modelId: 'gemini-2.0-flash',
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
      }

      return 'Error: Unsupported provider in router.';
    } catch (error) {
      logger.error(error, '[AIService] Error in generateContent - Attempting Ollama Fallback');
      try {
        return await this.generateOllamaContent(prompt, 'llama3:8b');
      } catch (fallbackError) {
        logger.error(fallbackError, '[AIService] Ultimate Fail: Ollama also failed.');
        return 'Error generating content (Total Outage).';
      }
    }
  }

  /**
   * Internal Ollama bridge for Edge Autarchy
   */
  private async generateOllamaContent(prompt: string, model: string): Promise<string> {
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model,
        prompt,
        stream: false,
      });
      return response.data.response;
    } catch (error) {
      logger.error(error, '[AIService] Ollama connection failed.');
      throw error;
    }
  }

  /**
   * Chat (Non-streaming)
   */
  public async chat(history: any[], message: string): Promise<string> {
    try {
      const model = await this.getModel();
      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      logger.error(error, '[AIService] Error in chat');
      return 'Error in chat processing.';
    }
  }

  /**
   * Generate Embeddings using Gemini API
   * Uses 'text-embedding-004' model
   */
  public async getEmbeddings(text: string): Promise<number[]> {
    try {
      if (!this._vertexAI) {
        this._vertexAI = new VertexAI({
          project: env.GOOGLE_PROJECT_ID || 'aigestion-sovereign-2026',
          location: env.GOOGLE_LOCATION || 'us-central1',
        });
      }

      if (!this._embeddingModel) {
        this._embeddingModel = this._vertexAI.getGenerativeModel({
          model: 'text-embedding-004',
        });
      }

      const result = await this._embeddingModel.embedContent({
        content: { parts: [{ text }] },
      });
      return result.predictions[0].embeddings.values;
    } catch (error) {
      logger.error(error, '[AIService] Failed to generate embeddings via Vertex AI API');
      return [];
    }
  }

  private async handleToolCall(
    call: any,
    stream: Readable,
    params: AIStreamParams,
    ragService: RagService,
    analyticsService: AnalyticsService,
  ) {
    const name = call.name;
    const args = call.args;

    logger.info(`[AIService] Tool Call: ${name}`, args);

    let toolResult = '';
    if (name === 'get_revenue_analytics') {
      const data = await analyticsService.getDashboardData();
      toolResult = JSON.stringify(data.revenue);
      stream.push(
        `data: ${JSON.stringify({
          type: 'a2ui',
          component: 'chart',
          props: { title: 'Revenue Overview', type: 'area', data: data.revenue },
        })}\n\n`,
      );
    } else if (name === 'get_user_growth') {
      const data = await analyticsService.getDashboardData();
      toolResult = JSON.stringify(data.users);
      stream.push(
        `data: ${JSON.stringify({
          type: 'a2ui',
          component: 'chart',
          props: { title: 'User Growth', type: 'bar', data: data.users },
        })}\n\n`,
      );
    } else if (name === 'search_web') {
      const query = args.query;
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nSearching web for: "${query}"...\n\n`,
        })}\n\n`,
      );
      const searchTool = new SearchWebTool();
      const results = await searchTool.execute({ query });
      toolResult = JSON.stringify(results);
    } else if (name === 'get_codebase_context') {
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nReading codebase context for: "${args.query}"...\n\n`,
        })}\n\n`,
      );
      const context = await ragService.getProjectContext(args.query);
      toolResult = context;
    } else if (name === 'manage_subscription') {
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nAccessing subscription data...\n\n`,
        })}\n\n`,
      );
      const stripeTool = new StripeTool();
      const toolInput = { ...args, userId: params.userId };
      const result = await stripeTool.execute(toolInput);
      toolResult = JSON.stringify(result);
    }

    stream.push(`data: ${JSON.stringify({ type: 'text', content: toolResult })}\n\n`);
  }
}
