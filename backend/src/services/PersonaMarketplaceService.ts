import { injectable, inject } from 'inversify';
import { Persona, IPersona } from '../models/Persona';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

@injectable()
export class PersonaMarketplaceService {
  constructor(@inject(TYPES.EconomyService) private economyService: any) {
    logger.info('🎭 Persona Marketplace Service active: Orchestrating voice sovereignity');
  }

  public async getPersonas(filters: any = {}) {
    return await Persona.find({ isPublic: true, ...filters }).sort({ reputationScore: -1 });
  }

  public async hirePersona(userId: string, personaId: string) {
    logger.info(`🚨 [Marketplace] User ${userId} hiring persona: ${personaId}`);
    const persona = await Persona.findById(personaId);
    if (!persona) throw new Error('Persona not found');

    // Handle transaction via EconomyService
    await this.economyService.processTransaction({
      from: userId,
      to: persona.ownerId,
      amount: persona.price,
      type: 'PERSONA_HIRE',
      metadata: { personaId },
    });

    // Update stats
    persona.totalExecutions += 1;
    await persona.save();

    return persona;
  }

  /**
   * SOVEREIGN REVENUE SHARING
   * Calculates platform commission and creator earnings based on execution tokens/usage.
   */
  public async calculateRevenueShare(personaId: string, tokens: number) {
    const persona = await Persona.findById(personaId);
    if (!persona) throw new Error('Persona not found');

    const PLATFORM_FEE_PERCENT = 0.2; // 20% platform commission
    const baseRatePerToken = 0.0001; // Example: $0.0001 per token

    const totalRevenue = tokens * baseRatePerToken * persona.commissionMultiplier;
    const platformCommission = totalRevenue * PLATFORM_FEE_PERCENT;
    const creatorEarnings = totalRevenue - platformCommission;

    logger.info(
      `[Marketplace] Revenue Share for ${persona.name}: Total=$${totalRevenue.toFixed(4)}, Creator=$${creatorEarnings.toFixed(4)}`,
    );

    return {
      totalRevenue,
      platformCommission,
      creatorEarnings,
      currency: 'USD',
    };
  }

  public async getMarketplaceStats() {
    const topPersonas = await Persona.find({ isPublic: true })
      .sort({ totalExecutions: -1 })
      .limit(5);

    return {
      topPerformers: topPersonas.map(p => ({
        name: p.name,
        executions: p.totalExecutions,
        reputation: p.reputationScore,
      })),
      totalMarketplaceExecutions: await Persona.aggregate([
        { $group: { _id: null, total: { $sum: '$totalExecutions' } } },
      ]),
    };
  }

  public async ratePersona(personaId: string, rating: number) {
    const persona = await Persona.findById(personaId);
    if (!persona) throw new Error('Persona not found');

    // Protocol: Weighted reputation update based on executions
    const totalWeight = persona.totalExecutions || 1;
    const currentReputation = persona.reputationScore || 5;
    persona.reputationScore = (currentReputation * totalWeight + rating) / (totalWeight + 1);

    await persona.save();
    return persona;
  }
}
