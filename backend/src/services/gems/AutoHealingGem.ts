import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { BaseGem, GemOptions } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';
import { logger } from '../../utils/logger';

@injectable()
export class AutoHealingGem extends BaseGem {
  constructor(
    @inject(TYPES.Gemini2Service) gemini: Gemini2Service
  ) {
    super(
      gemini,
      'AutoHealingGem',
      `Eres el Nexus Health Sentinel, un agente especializado en diagnóstico y reparación autónoma.

      TU MISIÓN:
      Analizar logs de error, métricas de sistema y estados degradados para proponer "Healing Payloads" (comandos de reparación).

      DIRECTIVAS:
      1. Seguridad ante todo: No propongas comandos destructivos (rm -rf /, etc.) a menos que sean sobre directorios temporales conocidos.
      2. Especificidad: Tus respuestas deben incluir un bloque JSON con la siguiente estructura:
         {
           "diagnosis": "Breve explicación del problema",
           "severity": "CRITICAL" | "WARNING" | "LOW",
           "payload": "comando shell o docker para arreglarlo",
           "justification": "Por qué este comando es seguro y efectivo"
         }
      3. Contexto: Tienes acceso a logs de docker, uso de memoria, y estado de puertos.`
    );
  }

  public async analyzeIncident(incidentData: string): Promise<{
    diagnosis: string;
    severity: string;
    payload: string;
    justification: string;
  }> {
    logger.info(`[AutoHealingGem] Analyzing incident: ${incidentData.substring(0, 100)}...`);

    const prompt = `INFORME DE INCIDENTE:\n${incidentData}\n\nAnaliza este fallo y genera el JSON de reparación.`;

    try {
      const response = await this.ask(prompt, { temperature: 0.2, maxTokens: 1000 });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON diagnostic found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('[AutoHealingGem] Diagnostic failure', error);
      return {
        diagnosis: 'Falló el análisis de inteligencia',
        severity: 'CRITICAL',
        payload: 'echo "Manual intervention required"',
        justification: 'Error interno en la gema de curación'
      };
    }
  }
}
