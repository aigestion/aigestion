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
  private readonly PLATFORM_COMMISSION_RATE = 0.30;

  constructor(
    @inject(TYPES.StripeService) private stripeService: StripeService,
    @inject(TYPES.TreasuryService) private treasury: TreasuryService
  ) {}

  /**
   * Calculates token count for a text
   */
  public countTokens(text: string): number {
    if (!text) return 0;
    try {
      // gpt-tokenizer is compatible with most modern LLMs (BPE)
      return encode(text).length;
    } catch (error) {
      logger.warn('Token counting failed, using fallback estimate');
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
      const isPaidByBond = remainingCost < costEstimate;

      let creatorId: string | undefined;
      let creatorCommission = 0;
      let platformCommission = 0;

      // 1. Process Persona commissions if applicable
      if (params.personaId) {
        const persona = await Persona.findById(params.personaId);
        if (persona) {
          creatorId = persona.ownerId.toString();
          // Logic: 30% platform, 70% creator of the cost estimate
          // This can be adjusted if we have a specific 'markup' for personas
          platformCommission = costEstimate * this.PLATFORM_COMMISSION_RATE;
          creatorCommission = costEstimate * (1 - this.PLATFORM_COMMISSION_RATE);
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
        `[UsageService] Tracked ${totalTokens} tokens for user ${params.userId} (Persona: ${params.personaId || 'None'})`
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
      'gemini-3.0-flash': { prompt: 0.1 / 1_000_000, completion: 0.3 / 1_000_000 },
      'gemini-1.5-flash-8b': { prompt: 0.03 / 1_000_000, completion: 0.09 / 1_000_000 },
      'claude-3-5-sonnet-20241022': { prompt: 3 / 1_000_000, completion: 15 / 1_000_000 },
      'claude-3-5-sonnet': { prompt: 3 / 1_000_000, completion: 15 / 1_000_000 },
    };

    const rate = rates[modelId] || rates['gemini-3.0-flash'];
    return promptTokens * rate.prompt + completionTokens * rate.completion;
  }
}
