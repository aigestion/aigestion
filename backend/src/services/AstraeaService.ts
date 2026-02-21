import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { VapiService } from './VapiService';
import { NavigatorGem } from './gems/NavigatorGem';
import { logger as untypedLogger } from '../utils/logger';

interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

const logger = untypedLogger as Logger;

/**
 * 🌌 ASTRAEA SERVICE
 * The sovereign bridge between Voice (Vapi) and Spatial Intelligence (NavigatorGem).
 */

export interface AstraeaSession {
  status: string;
  assistantId: string;
  spatialContext: string;
}

@injectable()
export class AstraeaService {
  constructor(
    @inject(TYPES.VapiService) private vapi: VapiService,
    @inject(TYPES.NavigatorGem) private navigator: NavigatorGem,
  ) {}

  /**
   * 🚀 Prepare and start a voice session with spatial context
   */
  async startSovereignSession(
    userId: string,
    location?: { lat: number; lng: number },
  ): Promise<AstraeaSession> {
    logger.info(`[AstraeaService] 📡 Starting sovereign session for user ${userId}`);

    let spatialContext = 'No dispongo de telemetría GPS en este momento.';

    if (location) {
      const radarReport = await this.navigator.scanTacticalRadar(location);
      spatialContext = `COORDENADAS_ACTUALES: [${location.lat}, ${location.lng}].
      REPORTE_RADAR: ${radarReport}`;
    }

    const sovereignPrompt = `
      ESTÁS EN MODO ASTRAEA (CONEXIÓN NEURAL ACTIVA).
      USUARIO_ID: ${userId}

      [CONTEXTO_ESPACIAL_TIEMPO_REAL]
      ${spatialContext}

      Aclara al usuario que tienes acceso a su radar táctico y puedes guiarle en el sector.
    `.trim();

    const assistant = await this.vapi.createAssistant('Astraea', sovereignPrompt);
    return {
      status: 'active',
      assistantId: assistant.id,
      spatialContext,
    };
  }

  /**
   * 📞 Induce a real phone call via Twilio/Vapi bridge
   */
  async induceCall(userId: string, phoneNumber: string): Promise<{ callId: string }> {
    const session = await this.startSovereignSession(userId);
    const call = await this.vapi.createCall(phoneNumber, session.assistantId);
    return { callId: call.id };
  }
}
