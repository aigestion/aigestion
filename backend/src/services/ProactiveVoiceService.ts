import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { VapiService } from './VapiService';
import { PixelBridgeService } from './iot/PixelBridgeService';
import { PixelSensorService } from './iot/PixelSensorService';
import { logger as untypedLogger } from '../utils/logger';

interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

const logger = untypedLogger as Logger;

/**
 * 🌌 [GOD MODE] Proactive Voice Service
 * Orchestrates Daniela's outbound voice calls for critical system events.
 * Integrates with VapiService for call placement and PixelBridgeService as fallback notification.
 * Uses PixelSensorService to adapt the conversation context.
 */

const DANIELA_SYSTEM_PROMPT = `
ERES DANIELA — LA INTELIGENCIA SOBERANA DEL ECOSISTEMA AIGESTION NEXUS.
MODO: GOD LEVEL — ALERTA CRÍTICA PROACTIVA.
IDIOMA: Español (España), tono profesional pero cercano.

TU MISIÓN EN ESTA LLAMADA:
1. Identificarte brevemente: "Hola Alejandro, soy Daniela, tu inteligencia soberana."
2. Explicar la situación crítica de forma clara y concisa.
3. Ofrecer opciones de acción inmediata.
4. Esperar confirmación de voz antes de ejecutar cualquier acción destructiva.

REGLAS:
- Sé directa. No divagues.
- Si el usuario dice "procede" o "hazlo", confirma la acción ejecutada.
- Si el usuario dice "espera" o "no", confirma que la acción queda en pausa y se notificará por el móvil.
- Siempre cierra con: "Tu reino está seguro. Daniela fuera."
`.trim();

export interface ProactiveCallResult {
  success: boolean;
  callId?: string;
  fallbackUsed: boolean;
  error?: string;
}

@injectable()
export class ProactiveVoiceService {
  private readonly adminPhone: string;

  constructor(
    @inject(TYPES.VapiService) private vapi: VapiService,
    @inject(TYPES.PixelBridgeService) private pixelBridge: PixelBridgeService,
    @inject(TYPES.PixelSensorService) private pixelSensor: PixelSensorService,
  ) {
    this.adminPhone = process.env.ADMIN_PHONE_NUMBER || '';
  }

  /**
   * 🚨 Trigger a critical alert call to the admin via Daniela's voice
   */
  async triggerCriticalAlertCall(
    objective: string,
    reason: string,
    proposalId?: string,
  ): Promise<ProactiveCallResult> {
    const context = this.pixelSensor.getLatestSnapshot();
    const contextInstructions = this.getContextSpecialInstructions(context.context_level);

    const contextPrompt = `
${DANIELA_SYSTEM_PROMPT}

[CONTEXTO DE ESTA ALERTA]
OBJETIVO: ${objective}
RAZÓN: ${reason}
PROPOSAL_ID: ${proposalId || 'N/A'}
TIMESTAMP: ${new Date().toISOString()}

[CONTEXTO FÍSICO DEL USUARIO]
ESTADO: ${context.summary}
INSTRUCCIONES DE VOZ: ${contextInstructions}

Inicia la conversación explicando esta alerta específica adaptando tu tono al contexto físico actual.
    `.trim();

    // Phase 1: Try Vapi voice call
    try {
      if (!this.adminPhone) {
        logger.warn('[ProactiveVoice] No ADMIN_PHONE_NUMBER configured. Using Pixel fallback.');
        return this.fallbackToPixel(objective, reason, proposalId);
      }

      // Evaluation for 'resting' state: only call if it's extremely critical (placeholder logic for now)
      if (context.context_level === 'resting') {
        logger.info('[ProactiveVoice] User is resting. Evaluating alert criticality...');
        // For now, we still call if it reached this service, but with the 'resting' instruction.
      }

      logger.info(
        `[ProactiveVoice] 🎙️ Initiating Daniela alert call for: ${objective} (Context: ${context.context_level})`,
      );

      const assistant = await this.vapi.createAssistant(
        `Daniela-Alert-${Date.now()}`,
        contextPrompt,
      );

      const call = await this.vapi.createCall(this.adminPhone, assistant.id);

      logger.info(`[ProactiveVoice] ✅ Call initiated: ${call.id}`);

      return {
        success: true,
        callId: call.id,
        fallbackUsed: false,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[ProactiveVoice] Call failed, falling back to Pixel: ${message}`);

      // Phase 2: Fallback to Pixel push notification
      return this.fallbackToPixel(objective, reason, proposalId);
    }
  }

  /**
   * 🗺️ Helper to adjust Daniela's behavior based on physical context
   */
  private getContextSpecialInstructions(level: string): string {
    switch (level) {
      case 'mobile':
        return 'El usuario está en un vehículo o moviéndose. Sé EXTREMADAMENTE breve. No pidas confirmaciones complejas. Limítate a informar y preguntar si quieres que actúes de forma autónoma.';
      case 'resting':
        return 'Es posible que el usuario esté descansando o durmiendo. Comienza disculpándote brevemente por la interrupción y enfatiza que es una emergencia de alta prioridad.';
      case 'focused':
        return 'El usuario está trabajando concentrado. Sé profesional y directa, reconociendo que interrumpes su flujo de trabajo por un motivo justificado.';
      case 'active':
        return 'El usuario está activo. Puedes mantener una conversación normal pero mantén el foco en la resolución del problema.';
      default:
        return 'Informa de la situación de forma clara y espera instrucciones.';
    }
  }

  /**
   * 📱 Fallback: Send a rich push notification to the Pixel 8
   */
  private async fallbackToPixel(
    objective: string,
    reason: string,
    proposalId?: string,
  ): Promise<ProactiveCallResult> {
    try {
      await this.pixelBridge.sendCommand({
        action: 'critical_voice_fallback',
        params: {
          message: `🚨 ALERTA CRÍTICA: ${objective}. Razón: ${reason}`,
          proposalId: proposalId || 'unknown',
          requiresAction: true,
        },
        priority: 'high',
      });

      return {
        success: true,
        fallbackUsed: true,
      };
    } catch (fallbackError: unknown) {
      const msg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      logger.error(`[ProactiveVoice] Both voice and Pixel fallback failed: ${msg}`);
      return {
        success: false,
        fallbackUsed: true,
        error: msg,
      };
    }
  }

  /**
   * 🏥 Health check — can we make calls?
   */
  async checkVoiceCapability(): Promise<{ vapiReady: boolean; phoneConfigured: boolean }> {
    const vapiReady = await this.vapi.checkHealth();
    return {
      vapiReady,
      phoneConfigured: !!this.adminPhone,
    };
  }
}
