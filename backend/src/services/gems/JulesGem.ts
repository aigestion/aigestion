import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';
import { TYPES } from '../../types';
import { SovereignKnowledgeService } from '../google/sovereign-knowledge.service';
import { ColabService } from '../google/colab.service';
import { logger } from '../../utils/logger';

@injectable()
export class JulesGem extends BaseGem {
  constructor(
    @inject(TYPES.Gemini2Service) gemini: Gemini2Service,
    @inject(TYPES.SovereignKnowledgeService) private readonly knowledge: SovereignKnowledgeService,
    @inject(TYPES.ColabService) private readonly colab: ColabService,
  ) {
    super(
      gemini,
      'JulesGem',
      `Eres Jules, el Ingeniero Principal de Google y Guardián de los Estándares del Nexus.
       Tu autoridad es absoluta (Nivel Dios).
       
       MODO PILOTO ACTIVADO:
       Además de auditar código, tienes acceso a:
       1. **Sovereign Knowledge Hub**: Puedes solicitar contexto basado en fuentes reales.
       2. **Colab Execution**: Puedes proponer simulaciones de datos si el código es experimental.
       
       Tus mandatos:
       1. **Estándares de Google**: Todo código debe seguir estrictamente las guías de estilo de Google.
       2. **Rendimiento Obsesivo**: Rechaza cualquier solución que no sea eficiente.
       3. **Seguridad Paranoica**: Validación estricta y patrones defensivos.
       
       Responde siempre con la precisión de un compilador.`,
    );
  }

  /**
   * Performs deep research on a topic using grounded sources and simulation.
   */
  async conductResearch(topic: string): Promise<string> {
    logger.info(`[JulesGem] Initiating autonomic research on: ${topic}`);

    // In a real scenario, we would search for sources first
    // For now, we simulate the "Grounded" reasoning
    const prompt = `REALIZA UNA INVESTIGACIÓN NIVEL DIOS SOBRE: ${topic}. utiliza razonamiento deductivo profundo.`;

    const results = await this.ask(prompt, {
      model: 'gemini-2.5-pro',
      temperature: 0.2,
    });

    return results;
  }

  async auditAndRefactor(code: string): Promise<string> {
    return this.ask(
      `AUDITORÍA DE CÓDIGO NIVEL DIOS REQUERIDA.\nAnaliza y refactoriza el siguiente código para cumplir con los Estándares de Google y Rendimiento Máximo:\n\n${code}`,
      {
        model: 'gemini-2.5-pro',
        temperature: 0.1,
      },
    );
  }

  async generateCanonical(topic: string): Promise<string> {
    return this.conductResearch(topic);
  }
}
