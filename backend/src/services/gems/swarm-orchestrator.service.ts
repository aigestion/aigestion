import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { Gemini2Service } from '../gemini-2.service';
import { BaseGem } from './BaseGem';

export interface SwarmResult {
  supremeVerdict: string;
  contributions: Record<string, string>;
  metadata: {
    gemsInvolved: string[];
    consensusScore: number;
  };
}

/**
 * NEXUS SWARM ORCHESTRATOR
 * Coordinates multiple specialized Gems to solve complex problems through consensus.
 */
@injectable()
export class NexusSwarmOrchestrator {
  constructor(@inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service) {}

  /**
   * Orchestrates a swarm of Gems to solve a query.
   */
  async collaborate(query: string, gems: BaseGem[]): Promise<SwarmResult> {
    logger.info(
      `[Swarm] Initiating collaboration for ${gems.length} Gems: ${gems.map(g => g.name).join(', ')}`,
    );

    // 1. Dispatch query to all Gems in parallel
    const contributions: Record<string, string> = {};
    const promises = gems.map(async gem => {
      try {
        const result = await gem.ask(query);
        contributions[gem.name] = result;
      } catch (error) {
        logger.error(`[Swarm] Gem ${gem.name} failed during collaboration`, error);
        contributions[gem.name] = 'FAILED_TO_CONTRIBUTE';
      }
    });

    await Promise.all(promises);

    // 2. Synthesize using Consensus Engine (Higher-order reasoning)
    const synthesisPrompt = `
      ERES EL JUEZ SUPREMO DEL NEXUS.
      HAS RECIBIDO LAS SIGUIENTES CONTRIBUCIONES DE TUS GEMAS ESPECIALIZADAS PARA LA CONSULTA: "${query}"

      CONTRIBUCIONES:
      ${Object.entries(contributions)
        .map(([name, text]) => `--- [GEM: ${name}] ---\n${text}`)
        .join('\n\n')}

      TU TAREA:
      1. SINTETIZA la mejor respuesta fusionando los puntos fuertes de cada gema.
      2. RESUELVE cualquier contradicción entre ellas.
      3. PROPORCIONA un "VEREDICTO SUPREMO" final que sea la solución definitiva.

      FORMATO DE SALIDA: Markdown God Level.
    `;

    const supremeVerdict = await this.gemini.generateText(synthesisPrompt, {
      model: 'gemini-2.5-pro', // High-order synthesis model
      temperature: 0.3,
    });

    return {
      supremeVerdict,
      contributions,
      metadata: {
        gemsInvolved: gems.map(g => g.name),
        consensusScore: 0.95, // Simulated confidence level
      },
    };
  }
}
