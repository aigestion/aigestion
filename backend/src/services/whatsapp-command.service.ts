import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { WhatsAppService } from './whatsapp.service';
import { SwarmService } from './swarm.service';
import { logger } from '../utils/logger';

@injectable()
export class WhatsAppCommandService {
  constructor(
    @inject(TYPES.WhatsAppService) private readonly whatsapp: WhatsAppService,
    @inject(TYPES.SwarmService) private readonly swarm: SwarmService,
  ) {}

  /**
   * Main entry point for incoming WhatsApp messages
   */
  /**
   * Send a high-priority alert to a specific number (or default admin)
   */
  async sendAlert(message: string, to: string = process.env.WHATSAPP_ADMIN_PHONE || '') {
    if (!to) {
      logger.warn('[WhatsAppCommand] No admin phone configured for alert.');
      return;
    }

    logger.info(`[WhatsAppCommand] Sending Alert to ${to}`);
    try {
      await this.whatsapp.sendMessage(to, message);
    } catch (error) {
      logger.error('[WhatsAppCommand] Failed to send alert', error);
    }
  }

  async handleIncoming(from: string, text: string) {
    logger.info(`[WhatsAppCommand] Incoming message from ${from}: ${text}`);

    try {
      const lowerText = text.toLowerCase().trim();

      // 1. Direct command routing
      if (lowerText === 'status') {
        const state = await this.swarm.getGodState();
        const reply =
          `🌌 *Sovereign Swarm Status*\n\n` +
          `✅ State: ${state.status}\n` +
          `🤖 Active Agents: ${state.activeAgents.join(', ')}\n` +
          `💰 Treasury: ${state.treasury.status}\n` +
          `⏱️ Uptime: ${Math.round(state.uptime / 3600)}h ${Math.round((state.uptime % 3600) / 60)}m`;

        return await this.whatsapp.sendMessage(from, reply);
      }

      if (lowerText.startsWith('deploy')) {
        await this.whatsapp.sendMessage(from, '🚀 Iniciando comando de despliegue soberano...');
        // logic for deployment could go here
        return;
      }

      // 2. Default: AI Swarm Mission
      await this.whatsapp.sendMessage(from, '🧠 Consultando a la Inteligencia Colectiva...');
      const response = await this.swarm.createMission(text, `whatsapp-${from}`);

      const cleanResult = response.result.toString().substring(0, 1600); // WhatsApp limit is ~4096, but 1600 is safer for preview
      const reply = `🤖 *Swarm Resolution (${response.agentName})*\n\n${cleanResult}`;

      return await this.whatsapp.sendMessage(from, reply);
    } catch (error: any) {
      logger.error(`[WhatsAppCommand] Error handling message: ${error.message}`);
      await this.whatsapp.sendMessage(from, '⚠️ Error en el Nexo Soberano. Reintente más tarde.');
    }
  }
}
