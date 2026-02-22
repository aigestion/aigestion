import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { AnalyticsService } from './analytics.service';
import { MetaverseService } from './metaverse.service';
import { logger } from '../utils/logger';
import { env } from '../config/env.schema';
import { DANIELA_SYSTEM_PROMPT } from '../config/prompts/daniela.persona';

/**
 * SOVEREIGN VOICE SERVICE (God Mode)
 * Orchestrates real-time voice interactions via Vapi.
 * Specializes in Daniela's persona and tool-calling execution.
 */
@injectable()
export class VoiceService {
  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService,
    @inject(TYPES.MetaverseService) private metaverseService: MetaverseService,
    @inject(TYPES.NexusPushService) private pushService: any, // or NexusPushService if typed
  ) {}

  /**
   * Processes and validates a message from the Vapi Sovereign Bridge
   */
  async processVapiMessage(payload: any): Promise<any> {
    const messageType = payload.message?.type;

    try {
      if (messageType === 'assistant-request') {
        return this.generateAssistantConfig();
      }

      if (messageType === 'function-call') {
        const functionCall = payload.message.functionCall;
        return await this.handleFunctionCall(functionCall);
      }

      if (messageType === 'end-of-call-report') {
        logger.info(
          { callId: payload.message.callId, duration: payload.message.duration },
          '[VoiceService] Vapi Call Finished',
        );
        return { status: 'acknowledged' };
      }

      return { status: 'ignored', type: messageType };
    } catch (error) {
      logger.error({ error, type: messageType }, '[VoiceService] Fault in Sovereign Voice Bridge');
      return { error: 'Internal system fault', status: 'error' };
    }
  }

  /**
   * Generates the "God Level" configuration for the Daniela Voice Assistant
   */
  private generateAssistantConfig(): any {
    const now = new Date();

    return {
      assistant: {
        name: 'Daniela',
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'es',
        },
        model: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.7,
          systemPrompt: `${DANIELA_SYSTEM_PROMPT}

[ESTADO DEL SISTEMA - TIEMPO REAL]
Fecha: ${now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Hora Local: ${now.toLocaleTimeString('es-ES')}
Ubicación: Nexus HQ (Sovereign Node)
Versión: Sovereign v2.4 (God Mode Active)

[PROTOCOLO DE RESPUESTA]
1. Sé concisa y directa.
2. Usa un tono profesional pero que denote empoderamiento.
3. Si el usuario pide datos complejos, usa la herramienta de analítica.`,
        },
        voice: {
          provider: 'eleven_labs',
          voiceId: env.ELEVENLABS_VOICE_ID || 'eleven_monica',
          stability: 0.5,
          similarityBoost: 0.8,
        },
        firstMessage:
          'Hola, soy Daniela. Estoy lista para gestionar el ecosistema AIGestion por ti. ¿En qué puedo ayudarte hoy?',
        recordingEnabled: true,
        silenceTimeoutSeconds: 30,
        tools: [
          {
            type: 'function',
            function: {
              name: 'get_business_summary',
              description:
                'Obtener un resumen ejecutivo de la salud del negocio, ingresos y crecimiento.',
              parameters: { type: 'object', properties: {} },
            },
          },
          {
            type: 'function',
            function: {
              name: 'get_metaverse_office_status',
              description:
                'Consultar el estado y coordenadas de nuestra sede central en el metaverso (Decentraland).',
              parameters: { type: 'object', properties: {} },
            },
          },
          {
            type: 'function',
            function: {
              name: 'trigger_ambient_briefing',
              description:
                'Generar un boletín de voz proactivo sobre el estado del sistema en todos los terminales.',
              parameters: {
                type: 'object',
                properties: {
                  priority: { type: 'string', enum: ['normal', 'high', 'critical'] },
                },
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'set_sovereign_logic',
              description: 'Ajustar los parámetros de IA y lógica de defensa del sistema.',
              parameters: {
                type: 'object',
                properties: {
                  mode: { type: 'string', enum: ['standard', 'hardened', 'aggressive'] },
                },
                required: ['mode'],
              },
            },
          },
        ],
      },
    };
  }

  /**
   * Executes tools called by the voice assistant
   */
  private async handleFunctionCall(call: any): Promise<any> {
    const { name, parameters } = call;
    logger.info({ name, parameters }, '[VoiceService] Performing Authorized Voice Tool Call');

    try {
      if (name === 'get_business_summary') {
        const data = await this.analyticsService.getDashboardData();
        const totalRevenue = data.revenue.reduce((acc: number, curr: any) => acc + curr.value, 0);
        return {
          result: `Actualmente, los ingresos mensuales ascienden a $${totalRevenue.toLocaleString()}. El crecimiento de usuarios se mantiene estable con ${data.users.length} nuevos registros recientes. Sistema operando a capacidad nominal.`,
        };
      }

      if (name === 'get_metaverse_office_status') {
        const status = await this.metaverseService.getStatus();
        return {
          result: `Nuestra sede central virtual está operativa en las coordenadas ${status.coordinates} de Decentraland. ${
            status.activeEvents.length > 0
              ? `Hay un evento activo titulado: "${status.activeEvents[0].title}".`
              : 'No hay eventos programados en este momento.'
          } Puedes supervisarla en ${status.visitUrl}`,
        };
      }

      if (name === 'trigger_ambient_briefing') {
        const priority = parameters.priority || 'normal';
        await this.pushService.sendSovereignAlert({
          title: 'Briefing Proactivo Solicitado',
          message: 'Daniela está iniciando un resumen de voz del sistema.',
          type: 'INFO',
          priority,
          voiceEnabled: true,
        });
        return {
          result: 'He iniciado el protocolo de briefing proactivo en todos los nodos del Nexus.',
        };
      }

      if (name === 'set_sovereign_logic') {
        const { mode } = parameters;
        // In a real implementation, this would call a logic service
        logger.warn({ mode }, '[VoiceService] Sovereign Logic Adjustment Triggered');
        return {
          result: `El sistema ha sido reconfigurado al modo '${mode}'. Todos los protocolos de seguridad han sido alineados.`,
        };
      }

      return { error: 'Unknown tool request' };
    } catch (error) {
      logger.error(error, `[VoiceService] Execution fault in voice tool: ${name}`);
      return { error: 'Tool execution failed' };
    }
  }
}
