import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';
import { MapsService } from '../google/maps.service';
import { logger } from '../../utils/logger';
import { TYPES } from '../../types';

/**
 * NAVIGATOR GEM
 * Specialized Swarm agent for spatial reasoning, tactical radar, and route intelligence.
 */
@injectable()
export class NavigatorGem extends BaseGem {
  constructor(
    @inject(TYPES.Gemini2Service) gemini: Gemini2Service,
    @inject(TYPES.MapsService) private maps: MapsService
  ) {
    super(
      gemini,
      'Navigator-Gem',
      `Eres el Navegador del Nexus AI. Tu especialidad es la inteligencia geoespacial, el radar táctico y la planificación de rutas.

      CAPACIDADES:
      1. Análisis de Puntos de Interés (POI): Identificas lugares estratégicos cercanos a la posición del usuario.
      2. Radar Táctico: Escaneas sectores para detectar oportunidades o riesgos basados en el contexto del proyecto.
      3. Planificación de Rutas: Optimizas trayectorias considerando el tiempo, el modo de transporte y los objetivos activos.

      ESTILO:
      - Preciso, eficiente y consciente del entorno físico.
      - Usa terminología como "sector", "coordenadas", "radar" y "vector de movimiento".`
    );
  }

  /**
   * Scans the local sector for specific strategic points.
   */
  async scanTacticalRadar(location: { lat: number; lng: number }, query: string = 'business'): Promise<string> {
    logger.info(`[NavigatorGem] Scanning tactical radar at ${location.lat}, ${location.lng}`);

    try {
      const poi = await this.maps.getLocalIntelligence(location, query);

      const prompt = `Analiza los siguientes puntos de interés detectados en el sector (${location.lat}, ${location.lng}) para la consulta "${query}":

      ${JSON.stringify(poi, null, 2)}

      Proporciona un informe de radar táctico breve, destacando los 3 lugares más relevantes y por qué son importantes para el usuario actual.`;

      return await this.ask(prompt);
    } catch (error) {
      logger.error('[NavigatorGem] Tactical scan failed', error);
      return '⚠️ Error en el radar táctico. No se pudo escanear el sector local.';
    }
  }

  /**
   * Generates a spatial recommendation based on current location and objective.
   */
  async getSpatialAdvice(location: { lat: number; lng: number }, objective: string): Promise<string> {
    const prompt = `El usuario se encuentra en (${location.lat}, ${location.lng}) y su objetivo es: "${objective}".
    Proporciona una recomendación geoespacial inteligente basada en este contexto. Si es necesario, sugiere puntos de interés específicos.`;

    return await this.ask(prompt);
  }
}
