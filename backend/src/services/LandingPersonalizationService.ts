import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { logger } from '../utils/logger';

export interface Scene {
  id: string;
  title: string;
  subtitle: string;
  video: string;
  duration: number;
}

export interface LandingPersonalization {
  archetype: string;
  scenes: Scene[];
  customMessage?: string;
}

@injectable()
export class LandingPersonalizationService {
  constructor(
    @inject(TYPES.AIService)
    private readonly aiService: AIService,
  ) {}

  public async getPersonalization(source: string | null): Promise<LandingPersonalization> {
    const normalizedSource = source?.toLowerCase() || 'default';
    logger.info(`Generating personalization for source: ${normalizedSource}`);

    switch (normalizedSource) {
      case 'linkedin':
        return {
          archetype: 'PROFESSIONAL_NETWORKING',
          scenes: [
            {
              id: 'strategic-growth',
              title: 'CRECIMIENTO ESTRATÉGICO',
              subtitle: 'Optimización de Redes B2B con IA',
              video: '/videos/cinematic/strategic-growth.mp4',
              duration: 5000,
            },
            {
              id: 'professional-nexus',
              title: 'NEXUS PROFESIONAL',
              subtitle: 'Tu Carrera, Aumentada por Inteligencia Soberana',
              video: '/videos/cinematic/professional-nexus.mp4',
              duration: 4000,
            },
          ],
          customMessage: 'Bienvenido desde LinkedIn. Optimiza tu red con Nexus.',
        };
      case 'mcp':
        return {
          archetype: 'TECH_CAPABILITY',
          scenes: [
            {
              id: 'mcp-integration',
              title: 'INTEGRACIÓN MCP',
              subtitle: 'Protololo de Contexto de Modelo Universal',
              video: '/videos/cinematic/mcp-integration.mp4',
              duration: 4500,
            },
          ],
          customMessage: 'Explora la interoperabilidad total con MCP.',
        };
      case 'google':
      case 'ads':
        return {
          archetype: 'MASS_MARKETING',
          scenes: [
            {
              id: 'nexus-hero',
              title: 'EL SIGUIENTE NIVEL',
              subtitle: 'IA de Clase Mundial al Alcance de Todos',
              video: '/videos/cinematic/nexus-hero.mp4',
              duration: 4000,
            },
          ],
          customMessage: 'Nexus: La IA que ya estás buscando.',
        };
      default: {
        const personalization: LandingPersonalization = {
          archetype: 'SOVEREIGN_DEFAULT',
          scenes: [
            {
              id: 'space-intro',
              title: 'EL FUTURO HA COMENZADO',
              subtitle: 'Transformación Neural Empresarial',
              video: '/videos/cinematic/space-intro.mp4',
              duration: 4000,
            },
            {
              id: 'daniela-ai',
              title: 'DANIELA AI',
              subtitle: 'Conciencia Artificial 8K Ultra-Realista',
              video: '/videos/cinematic/daniela-ai.mp4',
              duration: 5000,
            },
          ],
        };

        // Example of AI enhancement
        try {
          const aiHeadline = await this.aiService.generateContent(
            `Generate a short, premium, futuristic landing page headline for an AI orchestration platform. Source: ${normalizedSource}`,
          );
          if (aiHeadline) {
            personalization.scenes[0].title = aiHeadline.substring(0, 30).toUpperCase();
          }
        } catch (e) {
          logger.warn(
            `AI Headline generation failed, using default: ${e instanceof Error ? e.message : String(e)}`,
          );
        }

        return personalization;
      }
    }
  }
}
