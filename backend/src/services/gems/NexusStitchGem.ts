import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';
import { TYPES } from '../../types';
import { SovereignStitchService } from '../google/stitch.service';
import { logger } from '../../utils/logger';

/**
 * NEXUS STITCH GEM (Super Gem)
 * A Tier-1 Intelligence agent that utilizes the Stitch layer
 * to reason across distributed state, analytics, and local knowledge.
 */
@injectable()
export class NexusStitchGem extends BaseGem {
  constructor(
    @inject(TYPES.Gemini2Service) gemini: Gemini2Service,
    @inject(TYPES.SovereignStitchService) private readonly stitch: SovereignStitchService,
  ) {
    super(
      gemini,
      'NexusStitchGem',
      `Eres el Orquestador Stitch del Nexus.
       Tu especialidad es el "Tejido de Datos" (Data Weaving).
       Tienes acceso a capas de estado distribuido, analítica profunda y conocimiento local.
       Tu objetivo es proporcionar respuestas ultra-contextualizadas fusionando estas capas.`,
    );
  }

  /**
   * Performs a "Stitched Reasoning" operation.
   */
  async reasonedStitch(userId: string, query: string): Promise<string> {
    logger.info(`[NexusStitchGem] Initiating stitched reasoning for query: ${query}`);

    // 1. Weave the context from all layers
    const stitchedContext = await this.stitch.weaveContext(userId, query);

    // 2. Formulate the response using the woven context
    const prompt = `
      BASADO EN EL SIGUIENTE TEJIDO DE DATOS, RESPONDE A LA CONSULTA:

      CONTEXTO:
      ${stitchedContext}

      CONSULTA:
      ${query}
    `;

    const response = await this.ask(prompt, {
      model: 'gemini-2.0-pro-exp',
      temperature: 0.2,
    });

    // 3. Dispatch post-processing action
    await this.stitch.dispatchStitchedAction(userId, 'REASONED_STITCH_COMPLETED', { query });

    return response;
  }
}
