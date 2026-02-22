import { injectable, inject } from 'inversify';
import axios from 'axios';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { NexusPushService } from '../nexus-push.service';
import { TelegramService } from '../telegram.service';

export interface PixelCommand {
  action: string;
  params?: Record<string, any>;
  priority?: 'normal' | 'high';
}

@injectable()
export class PixelBridgeService {
  private taskerWebhookUrl: string | undefined;

  constructor(
    @inject(TYPES.NexusPushService) private pushService: NexusPushService,
    @inject(TYPES.TelegramService) private telegramService: TelegramService,
    @inject(TYPES.Config) private config: any,
  ) {
    this.taskerWebhookUrl = process.env.PIXEL_TASKER_WEBHOOK_URL;
    logger.info('[PixelBridge] 📱 Sovereign Pixel Bridge Service initialized');
  }

  /**
   * Sends a sovereign command to the Pixel 8 via Tasker Webhook.
   */
  async sendCommand(command: PixelCommand): Promise<boolean> {
    if (!this.taskerWebhookUrl) {
      logger.warn('[PixelBridge] PIXEL_TASKER_WEBHOOK_URL not configured. Falling back to Push.');
      return this.fallbackToPush(command);
    }

    try {
      logger.info({ action: command.action }, '[PixelBridge] Sending command to Pixel');
      const response = await axios.post(this.taskerWebhookUrl, {
        source: 'nexus_god_mode',
        timestamp: Date.now(),
        ...command,
      });

      return response.status === 200;
    } catch (error) {
      logger.error(error, '[PixelBridge] Failed to send command to Tasker. Falling back to Push.');
      return this.fallbackToPush(command);
    }
  }

  /**
   * Fallback to Firebase Push if webhook fails or is not configured.
   */
  private async fallbackToPush(command: PixelCommand): Promise<boolean> {
    // Assuming we send to the admin user (Alejandro)
    // In a real scenario, we'd look up the admin's userId
    const adminId = 'admin';
    const pushSuccess = await this.pushService.sendToUser(adminId, {
      title: '🌌 NEXUS COMMAND',
      body: `Action: ${command.action}`,
      data: {
        command: JSON.stringify(command),
        source: 'pixel_bridge_fallback',
      },
      priority: command.priority || 'normal',
    });

    // Ultimate Fallback: Sovereign Hive (Telegram) if it's a God Mode alert
    if (!pushSuccess && command.action === 'god_mode_alert') {
      logger.info('[PixelBridge] 🐝 Sovereign fallback: Dispatching to Telegram Hive');
      await this.telegramService.sendMessage(
        `🚨 *GOD MODE ALERT*\n\nAction: \`${command.action}\`\nPriority: \`${command.priority}\`\nMessage: ${command.params?.message || 'No additional data.'}`,
      );
      return true; // Consider success if delivered to Telegram
    }

    return pushSuccess;
  }

  /**
   * Triggers a "God Mode" alert on the Pixel.
   */
  async triggerGodModeAlert(message: string): Promise<boolean> {
    return this.sendCommand({
      action: 'god_mode_alert',
      params: { message },
      priority: 'high',
    });
  }
}
