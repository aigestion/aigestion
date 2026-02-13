import { inject, injectable } from 'inversify';
import { Readable } from 'stream';

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
// Types for function declarations and schema types are loosely typed as any to avoid TS2709 errors
type FunctionDeclaration = any;

export interface AIStreamParams {
  prompt: string;
  history?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  userId: string;
  userRole?: string;
}

@injectable()
export class AIService {
  private _model: any;

  private generateContentBreaker: any;
  private chatStreamBreaker: any;

  constructor(
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService,
    @inject(TYPES.RagService) private ragService: RagService,
    @inject(TYPES.UsageService) private usageService: UsageService,
    @inject(TYPES.SemanticCacheService) private semanticCache: SemanticCacheService
  ) {
    // Breakers initialized with async lambdas that will call getModel() on execution
    this.generateContentBreaker = CircuitBreakerFactory.create(
      async (prompt: string) => {
        const model = await this.getModel();
        return model.generateContent(prompt);
      },
      { name: 'Gemini.generateContent', timeout: 10000 } // Higher timeout for AI
    );

    this.chatStreamBreaker = CircuitBreakerFactory.create(
      async (prompt: string, chatSession: any) => chatSession.sendMessageStream(prompt),
      { name: 'Gemini.sendMessageStream', timeout: 10000 }
    );
  }

  private async getProviderModel(config: ModelConfig) {
    if (config.provider === 'gemini') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');
      return genAI.getGenerativeModel({ model: config.modelId });
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

  private getTools(): FunctionDeclaration[] {
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

    const config = AIModelRouter.getModelConfig(tier);

    const runner = async () => {
      let fullResponse = '';
      try {
        // Default / Gemini implementation
        const modelTier = AIModelRouter.getModelConfig(AIModelTier.STANDARD);
        const model = await this.getProviderModel(modelTier);

        const systemInstruction = `You are Nexus AI, an advanced agent.
                When asked about revenue or users, use the provided tools.
                Current User ID: ${params.userId}.
                Use the 'search_web' tool for current info.`;

        const chat = model.startChat({
          history: history.map(h => ({ role: h.role, parts: h.parts })),
          generationConfig: { maxOutputTokens: 2048 },
          systemInstruction: { parts: [{ text: systemInstruction }] },
          tools: [{ functionDeclarations: this.getTools() }],
        });

        const result = await this.chatStreamBreaker.fire(params.prompt, chat);

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
                this.analyticsService
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
          modelId: modelTier.modelId,
          prompt: params.prompt,
          completion: fullResponse || 'Streamed response',
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
    userRole: string = 'user'
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

      const config = AIModelRouter.getModelConfig(tier);

      logger.info(`[AIService] Routing to Tier: ${tier} (${config.provider}/${config.modelId})`);

      if (config.provider === 'gemini') {
        const model = await this.getProviderModel(config);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Track usage
        this.usageService.trackUsage({
          userId,
          provider: 'gemini',
          modelId: config.modelId,
          prompt: prompt,
          completion: text,
        });

        await this.semanticCache.setSemantic(prompt, text);

        return text;
      }

      return 'Error: Unsupported provider in router.';
    } catch (error) {
      logger.error(error, '[AIService] Error in generateContent');
      return 'Error generating content.';
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

  private async handleToolCall(
    call: any,
    stream: Readable,
    params: AIStreamParams,
    ragService: RagService,
    analyticsService: AnalyticsService
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
        })}\n\n`
      );
    } else if (name === 'get_user_growth') {
      const data = await analyticsService.getDashboardData();
      toolResult = JSON.stringify(data.users);
      stream.push(
        `data: ${JSON.stringify({
          type: 'a2ui',
          component: 'chart',
          props: { title: 'User Growth', type: 'bar', data: data.users },
        })}\n\n`
      );
    } else if (name === 'search_web') {
      const query = args.query;
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nSearching web for: "${query}"...\n\n`,
        })}\n\n`
      );
      const searchTool = new SearchWebTool();
      const results = await searchTool.execute({ query });
      toolResult = JSON.stringify(results);
    } else if (name === 'get_codebase_context') {
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nReading codebase context for: "${args.query}"...\n\n`,
        })}\n\n`
      );
      const context = await ragService.getProjectContext(args.query);
      toolResult = context;
    } else if (name === 'manage_subscription') {
      stream.push(
        `data: ${JSON.stringify({
          type: 'text',
          content: `\n\nAccessing subscription data...\n\n`,
        })}\n\n`
      );
      const stripeTool = new StripeTool();
      const toolInput = { ...args, userId: params.userId };
      const result = await stripeTool.execute(toolInput);
      toolResult = JSON.stringify(result);
    }

    stream.push(`data: ${JSON.stringify({ type: 'text', content: toolResult })}\n\n`);
  }
}
