import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service } from './gemini-2.service';
import { logger } from '../utils/logger';
import { AIModelTier, ModelConfig } from '../utils/aiRouter';

export interface ProviderRate {
  prompt: number; // per 1M tokens
  completion: number; // per 1M tokens
}

@injectable()
export class ArbitrationService {
  private readonly MARGIN_TARGET = 0.3; // 30% Platform Margin

  constructor(@inject(TYPES.Gemini2Service) private gemini: Gemini2Service) {}

  // Real-time rates (can be moved to a DB or External Sync later)
  private readonly rates: Record<string, Record<string, ProviderRate>> = {
    gemini: {
      'gemini-2.0-flash-lite': { prompt: 0.075, completion: 0.3 },
      'gemini-2.0-flash': { prompt: 0.1, completion: 0.4 },
      'gemini-2.5-pro': { prompt: 1.25, completion: 5.0 },
    },
    openai: {
      'gpt-4o-mini': { prompt: 0.15, completion: 0.6 },
      'gpt-4o': { prompt: 2.5, completion: 10.0 },
    },
    anthropic: {
      'claude-3-5-sonnet': { prompt: 3.0, completion: 15.0 },
      'claude-3-haiku': { prompt: 0.25, completion: 1.25 },
    },
    mistral: {
      'mistral-large-latest': { prompt: 2.0, completion: 6.0 },
      'mistral-small-latest': { prompt: 0.2, completion: 0.6 },
    },
  };

  /**
   * Determine the most profitable and suitable model for a given tier
   */
  public async getOptimalConfig(
    tier: AIModelTier,
    prompt: string,
  ): Promise<ModelConfig & { reason: string }> {
    logger.info(`[Arbitration] Deciding optimal provider for Tier: ${tier}`);

    // LOGIC: Arbitraje Soberano
    // 1. If Tier is ECONOMY, we hunt for the absolute lowest cost.
    if (tier === AIModelTier.ECONOMY) {
      return {
        provider: 'gemini',
        modelId: 'gemini-2.0-flash-lite',
        reason: 'Cost Minimum (Arbitrage Strategy)',
      };
    }

    // 2. If Tier is PREMIUM, we balance SOTA performance with margin protection.
    if (tier === AIModelTier.PREMIUM) {
      // Arbitrage: Mistral Large is very competitive in Spanish and cheaper than Sonnet
      const isSpanish = prompt.toLowerCase().match(/[áéíóúñ]/);
      if (isSpanish) {
        return {
          provider: 'mistral',
          modelId: 'mistral-large-latest',
          reason: 'Native Reasoning (Mistral Premium)',
        };
      }
      return {
        provider: 'gemini',
        modelId: 'gemini-2.0-flash', // Re-routed to high performance but cheaper provider
        reason: 'Performance Arbitrage',
      };
    }

    // 3. AUTARCHY Tier: Absolute priority for local resilience
    if (tier === AIModelTier.AUTARCHY) {
      return {
        provider: 'ollama',
        modelId: 'llama3:8b',
        reason: 'Sovereign Edge Autarchy (Zero-Trust Local)',
      };
    }

    // 4. STANDARD Tier: Dynamic selection
    return {
      provider: 'mistral',
      modelId: 'mistral-small-latest',
      reason: 'Cost/Performance Balance (Mistral Standard)',
    };
  }

  /**
   * Calculates the expected platform profit for a model choice
   */
  public calculateExpectedMargin(cost: number): number {
    return cost * this.MARGIN_TARGET;
  }

  /**
   * LAYER 2: COGNITIVE ARBITRATION
   * Resolves conflicts between different swarm agents.
   */
  public async resolveConflict(
    perspectives: { agentName: string; recommendation: string }[],
  ): Promise<{ decision: string; justification: string }> {
    logger.info('[Arbitration] Resolving cognitive conflict between agents.');

    const context = perspectives.map(p => `[${p.agentName}]: ${p.recommendation}`).join('\n\n');
    const prompt = `
      You are the SOVEREIGN JUDGE of the AIGestion Nexus.
      Two or more specialized agents have provided conflicting perspectives on a task.
      Your goal is to arbitrate and provide the definitive strategic path forward.

      AGENT PERSPECTIVES:
      ${context}

      CONSTRAINTS:
      - Prioritize system sovereignty and long-term ROI.
      - Resolve technical contradictions with Google Cloud best practices.

      OUTPUT FORMAT: JSON { "decision": "string", "justification": "string" }
    `;

    try {
      const response = await this.gemini.generateText(prompt);
      const cleaned = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      logger.error('[Arbitration] Cognitive resolution failed', error);
      return {
        decision: perspectives[0].recommendation,
        justification: 'Defaulting to primary agent due to arbitration error.',
      };
    }
  }
}
