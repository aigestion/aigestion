import { inject, injectable } from 'inversify';
import { Readable } from 'node:stream';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { ArbitrationService } from './arbitration.service';
import { AIProviderFactory } from '../infrastructure/ai/AIProviderFactory';
import { AIToolExecutor } from '../infrastructure/ai/AIToolExecutor';
import { SemanticCacheService } from './semantic-cache.service';
import { UsageService } from './usage.service';
import { AIModelTier, AIModelRouter } from '../utils/aiRouter';
import { NexusSwarmOrchestrator } from './gems/swarm-orchestrator.service';
import { SwarmInternalClient } from './swarm-internal.client';
import { AIStreamParams } from '../interfaces/ai-provider.interface';
import { Persona } from '../models/Persona';
import { getCache } from '../utils/redis';

@injectable()
export class AIService {
  constructor(
    @inject(TYPES.AIProviderFactory) private providerFactory: AIProviderFactory,
    @inject(TYPES.AIToolExecutor) private toolExecutor: AIToolExecutor,
    @inject(TYPES.ArbitrationService) private arbitrationService: ArbitrationService,
    @inject(TYPES.SemanticCacheService) private semanticCache: SemanticCacheService,
    @inject(TYPES.UsageService) private usageService: UsageService,
    @inject(TYPES.NexusSwarmOrchestrator) private swarm: NexusSwarmOrchestrator,
    @inject(TYPES.SwarmInternalClient) private swarmClient: SwarmInternalClient,
    @inject(TYPES.JulesGem) private jules: any,
    @inject(TYPES.NexusStitchGem) private stitchGem: any,
  ) {}

  public async streamChat(params: AIStreamParams): Promise<Readable> {
    const stream = new Readable({ read() {} });

    // Force tier for Admin/God
    const tier =
      params.userRole === 'god' || params.userRole === 'admin'
        ? AIModelTier.PREMIUM
        : AIModelRouter.route(params.prompt);

    const runner = async () => {
      try {
        const {
          provider: providerName,
          modelId,
          reason,
        } = await this.arbitrationService.getOptimalConfig(tier, params.prompt);
        logger.info(`[AIService] Arbitrated to: ${providerName}/${modelId} | Reason: ${reason}`);

        const provider = this.providerFactory.getProvider(providerName);

        // 🚀 DX: AI Prompt Hot-reload
        let systemInstruction = `Eres Nexus AI, un agente avanzado. ID de usuario: ${params.userId}`;
        const dynamicPromptKey = `prompt:system:${params.personaId || 'default'}`;
        const dynamicPrompt = await getCache<string>(dynamicPromptKey);

        if (dynamicPrompt) {
          systemInstruction = dynamicPrompt;
          logger.debug(
            { personaId: params.personaId },
            '[AIService] Hot-reloaded system instruction from Redis',
          );
        } else if (params.personaId) {
          const persona = await Persona.findById(params.personaId);
          if (persona) systemInstruction = persona.systemPrompt;
        }

        const startTime = Date.now();
        const aiStream = await provider.streamChat(params, {
          modelId,
          tools: this.toolExecutor.getStaticToolDefinitions(),
          systemInstruction,
        });
        const ttft = Date.now() - startTime; // Time to First Thought (approx)

        logger.info(
          { ttft, provider: providerName, modelId },
          '[AIService] Performance Profile: TTFT',
        );

        aiStream.on('data', async chunkData => {
          try {
            // If chunkData is a buffer, convert to string
            const dataStr = chunkData.toString();
            // Gemini provider specific parsing
            if (providerName === 'gemini') {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                stream.push(`data: ${JSON.stringify({ type: 'text', content: parsed.text })}\n\n`);
              }
              if (parsed.functionCalls) {
                for (const call of parsed.functionCalls) {
                  await this.toolExecutor.handleToolCall(call, stream, params.userId);
                }
              }
            } else {
              // Mistral or other providers just piping raw if simple string
              stream.push(chunkData);
            }
          } catch (e) {
            stream.push(chunkData);
          }
        });

        aiStream.on('end', () => {
          const totalTime = Date.now() - startTime;
          stream.push('data: [DONE]\n\n');
          stream.push(null);

          logger.info(
            { totalTime, provider: providerName, modelId },
            '[AIService] Performance Profile: Completed',
          );

          this.usageService.trackUsage({
            userId: params.userId,
            provider: providerName,
            modelId,
            prompt: params.prompt,
            completion: 'Streamed',
            arbitrationReason: reason,
          });
        });

        aiStream.on('error', err => {
          stream.emit('error', err);
          stream.push(null);
        });
      } catch (err: any) {
        logger.error(err, '[AIService] streamChat error');
        stream.emit('error', err);
        stream.push(null);
      }
    };

    runner();
    return stream;
  }

  public async generateContent(
    prompt: string,
    userId: string = 'anonymous',
    userRole: string = 'user',
  ): Promise<string> {
    try {
      // God Mode Force
      const tier =
        userRole === 'god' || userRole === 'admin'
          ? AIModelTier.PREMIUM
          : AIModelRouter.route(prompt);

      // Semantic Cache
      const cached = await this.semanticCache.getSemantic(prompt);
      if (cached) return cached;

      // Swarm collaboration for God mode
      if (userRole === 'god' && prompt.toLowerCase().includes('swarm')) {
        const result = await this.swarm.collaborate(prompt, [this.jules, this.stitchGem]);
        return result.supremeVerdict;
      }

      const {
        provider: providerName,
        modelId,
        reason,
      } = await this.arbitrationService.getOptimalConfig(tier, prompt);
      const provider = this.providerFactory.getProvider(providerName);

      const text = await provider.generateContent(prompt, { modelId });

      await this.usageService.trackUsage({
        userId,
        provider: providerName,
        modelId,
        prompt,
        completion: text,
        arbitrationReason: reason,
      });
      await this.semanticCache.setSemantic(prompt, text);

      return text;
    } catch (err) {
      logger.error(err, '[AIService] generateContent failed, falling back to local');
      return 'Error generating content. System stable but AI provider unreachable.';
    }
  }

  public async getEmbeddings(text: string): Promise<number[]> {
    const provider = this.providerFactory.getProvider('gemini');
    return provider.getEmbeddings(text);
  }

  // Swarm Mission passthrough
  public async triggerSwarmMission(mission: string) {
    return this.swarmClient.post('/swarm/trigger', { mission_description: mission });
  }
}
