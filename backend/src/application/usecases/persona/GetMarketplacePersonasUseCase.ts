import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IPersonaRepository } from '../../../infrastructure/repository/PersonaRepository';
import { IPersona } from '../../../models/Persona';

@injectable()
export class GetMarketplacePersonasUseCase {
  constructor(@inject(TYPES.PersonaRepository) private personaRepository: IPersonaRepository) {}

  async execute(
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ personas: IPersona[]; total: number }> {
    return await this.personaRepository.findPublic(limit, offset);
  }
}
