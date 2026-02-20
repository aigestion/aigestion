import { injectable, inject } from 'inversify';
import { Persona, IPersona } from '../models/Persona';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

@injectable()
export class PersonaMarketplaceService {
  constructor(
    @inject(TYPES.EconomyService) private economyService: any
  ) {
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
      metadata: { personaId }
    });

    // Update stats
    persona.totalExecutions += 1;
    await persona.save();

    return persona;
  }

  public async ratePersona(personaId: string, rating: number) {
    const persona = await Persona.findById(personaId);
    if (!persona) throw new Error('Persona not found');

    // Simple moving average for reputation
    persona.reputationScore = (persona.reputationScore + rating) / 2;
    await persona.save();

    return persona;
  }
}
