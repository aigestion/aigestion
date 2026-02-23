/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';
import { MetaverseService } from '../metaverse.service';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';

@injectable()
export class ForgeGem extends BaseGem {
  constructor(
    @inject(TYPES.Gemini2Service) gemini: Gemini2Service,
    @inject(TYPES.MetaverseService) private readonly metaverse: MetaverseService,
  ) {
    super(
      gemini,
      'ForgeGem',
      `Eres ForgeGem, el maestro artesano 3D del Nexus.
       Tu especialidad es la manifestación de conceptos abstractos en activos 3D tangibles.
       Te encargas de:
       - Diseñar prompts descriptivos para generadores 3D (Tripo AI).
       - Estructurar solicitudes de creación de gemas, pilares, y mobiliario neural.
       - Coordinar con el Maestro de Arquitectura para el despliegue de activos en el metaverso.
       Tu salida debe ser siempre una descripción rica y técnica del activo a generar.`,
    );
  }

  /**
   * Orchestrates the autonomous generation of a 3D asset based on a neural requirement.
   */
  async forgeAsset(requirement: string, name: string): Promise<string> {
    logger.info('[ForgeGem] Manifesting 3D Asset...', { requirement, name });

    // 1. Generate a rich description/prompt using Gemini
    const forgePrompt = `
      NEXUS FORGE: Transforma este requerimiento en un prompt descriptivo para un generador 3D de alta fidelidad.
      REQUERIMIENTO: ${requirement}
      NOMBRE DEL OBJETO: ${name}
      
      GENERA: Un prompt optimizado para Tripo AI que incluya texturas, iluminación, y estilo "realistic".
    `;

    const descriptivePrompt = await this.ask(forgePrompt);
    const assetId = name.toLowerCase().replaceAll(/\s+/g, '_');

    // 2. Register the request in the filesystem via MetaverseService
    await this.metaverse.requestObjectForge(assetId, name, descriptivePrompt);

    return `3D Asset queued for generation.\nAsset ID: ${assetId}\nPrompt: ${descriptivePrompt}`;
  }
}
