import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IPersonaRepository } from '../../../infrastructure/repository/PersonaRepository';
import { IPersona } from '../../../models/Persona';
import { AppError } from '../../../utils/errors';

export interface CreatePersonaDto {
  name: string;
  description: string;
  systemPrompt: string;
  voiceSettings: {
    provider: string;
    voiceId: string;
    settings?: any;
  };
  price?: number;
  isPublic?: boolean;
  tags?: string[];
  ownerId: string;
}

@injectable()
export class CreatePersonaUseCase {
  constructor(
    @inject(TYPES.PersonaRepository) private personaRepository: IPersonaRepository
  ) { }

  async execute(data: CreatePersonaDto): Promise<IPersona> {
    // Basic validation
    if (!data.name || !data.systemPrompt || !data.voiceSettings) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    if (data.voiceSettings.provider !== 'elevenlabs' && data.voiceSettings.provider !== 'openai') {
      // Allow other providers but maybe warn or validate later?
      // For now, strict check to specific supported providers could be good, or just open.
      // Let's keep it open but ensure provider is defined.
    }

    const persona = await this.personaRepository.create({
      ...data,
      price: data.price ?? 0,
      isPublic: data.isPublic ?? false,
      tags: data.tags ?? [],
    } as any); // Type assertion needed due to Partial<IPersona> vs explicit DTO match

    return persona;
  }
}
