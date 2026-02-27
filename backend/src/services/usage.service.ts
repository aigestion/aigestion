import { injectable, inject } from 'inversify';
import { encode } from 'gpt-tokenizer';
import { User } from '../models/User';
import { UsageRecord } from '../models/UsageRecord';
import { StripeService } from './stripe.service';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

import { Persona } from '../models/Persona';
import { TreasuryService } from './TreasuryService';

@injectable()
export class UsageService {
  private readonly PLATFORM_COMMISSION_RATE = 0.3;

  constructor(
    @inject(TYPES.StripeService) private readonly stripeService: StripeService,
    @inject(TYPES.TreasuryService) private readonly treasury: TreasuryService,
  ) {}

  /**
   * Calculates token count for a text
   */
  public countTokens(text: string): number {
    if (!text) return 0;
    try {
      // gpt-tokenizer is compatible with most modern LLMs (BPE)
      return encode(text).length;
    } catch (error: unknown) {
      logger.warn('Token counting failed, using fallback estimate', error);
      return Math.ceil(text.length / 4); // Very rough fallback
    }
  }

  /**
   * Tracks and reports AI usage
   */
  public async trackUsage(params: {
    userId: string;
    provider: string;
    modelId: string;
    prompt: string;
    completion: string;
    personaId?: string;
    arbitrationReason?: string;
  }): Promise<void> {
    const promptTokens = this.countTokens(params.prompt);
    const completionTokens = this.countTokens(params.completion);
    const totalTokens = promptTokens + completionTokens;
    const costEstimate = this.estimateCost(params.modelId, promptTokens, completionTokens);

    try {
      // 0. Sovereign Bond Redemption
      // Try to pay with bonds first. If remainingCost > 0, the rest goes to billing.
      const remainingCost = await this.treasury.redeemCredit(params.userId, costEstimate);
      const _isPaidByBond = remainingCost < costEstimate;

      let creatorId: string | undefined;
      let creatorCommission = 0;
      let platformCommission = 0;

      // 1. Process Persona commissions if applicable
      if (params.personaId) {
        const persona = await Persona.findById(params.personaId);
        if (persona) {
          creatorId = persona.ownerId.toString();
          // Logic: 30% platform BASE, adjusted by persona's multiplier
          // Base cost is estimated tokens. Multiplier increases the creator's cut.
          const multiplier = persona.commissionMultiplier || 1;
          platformCommission = costEstimate * this.PLATFORM_COMMISSION_RATE;
          creatorCommission = costEstimate * (1 - this.PLATFORM_COMMISSION_RATE) * multiplier;

          // Increment execution count synchronously for reputation tracking
          await Persona.findByIdAndUpdate(params.personaId, { $inc: { totalExecutions: 1 } });
        }
      }

      // 2. Save record to DB for internal auditing
      const record = new UsageRecord({
        userId: params.userId,
        provider: params.provider,
        modelId: params.modelId,
        promptTokens,
        completionTokens,
        totalTokens,
        costEstimate,
        personaId: params.personaId,
        creatorId,
        creatorCommission,
        platformCommission,
        arbitrationReason: params.arbitrationReason,
      });
      await record.save();

      // 3. Report to Stripe if user has a metered subscription
      const user = await User.findById(params.userId).select('+stripeSubscriptionItemId');
      if (user?.stripeSubscriptionItemId) {
        // Stripe usually bills in fixed units.
        // Example: 1 unit per 1,000 tokens.
        const units = Math.ceil(totalTokens / 1000);
        if (units > 0) {
          await this.stripeService.reportUsage(user.stripeSubscriptionItemId, units);
        }
      }

      logger.info(
        `[UsageService] Tracked ${totalTokens} tokens for user ${params.userId} (Persona: ${params.personaId || 'None'})`,
      );
    } catch (error) {
      logger.error(error, `[UsageService] Failed to track usage for user ${params.userId}`);
    }
  }

  /**
   * Simple cost estimator (Reflected in USD)
   */
  private estimateCost(modelId: string, promptTokens: number, completionTokens: number): number {
    const rates: Record<string, { prompt: number; completion: number }> = {
      'gemini-2.0-flash': { prompt: 0.1 / 1_000_000, completion: 0.3 / 1_000_000 },
      'gemini-2.0-flash-lite': { prompt: 0.03 / 1_000_000, completion: 0.09 / 1_000_000 },
      'gemini-2.0-pro-exp': { prompt: 1.25 / 1_000_000, completion: 3.75 / 1_000_000 },
      'claude-3-5-sonnet-20241022': { prompt: 3 / 1_000_000, completion: 15 / 1_000_000 },
      'claude-3-5-sonnet': { prompt: 3 / 1_000_000, completion: 15 / 1_000_000 },
      'gpt-4o': { prompt: 5 / 1_000_000, completion: 15 / 1_000_000 },
    };

    const rate = rates[modelId] || rates['gemini-2.0-flash'];
    return promptTokens * rate.prompt + completionTokens * rate.completion;
  }

  /**
   * Updates persona reputation based on success metrics
   */
  public async updatePersonaReputation(personaId: string, success: boolean): Promise<void> {
    try {
      const persona = await Persona.findById(personaId);
      if (!persona) return;

      const total = persona.totalExecutions || 1;
      const currentSuccesses = (persona.successRate || 1) * total;
      const newSuccesses = success ? currentSuccesses + 1 : currentSuccesses;
      const newRate = newSuccesses / total; // total already incremented in trackUsage

      // Linear interpolation for reputation: weight success rate and execution volume
      const reputationScore = newRate * 0.7 + Math.min(total / 1000, 1) * 0.3;

      await Persona.findByIdAndUpdate(personaId, {
        successRate: newRate,
        reputationScore,
      });

      logger.info(
        `[UsageService] Updated reputation for Persona ${personaId}: ${reputationScore.toFixed(4)}`,
      );
    } catch (error) {
      logger.error(`[UsageService] Failed to update persona reputation ${personaId}`, error);
    }
  }
}
