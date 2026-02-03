import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { TelegramService } from './telegram.service';
import { WhatsAppService } from './whatsapp.service';
import { EmailService } from './email.service';
import { logger } from '../utils/logger';
import { env } from '../config/env.schema';
import { DANIELA_IDENTITY } from '../config/prompts/daniela.persona';

@injectable()
export class GodNotificationService {
  constructor(
    @inject(TYPES.TelegramService) private telegram: TelegramService,
    @inject(TYPES.WhatsAppService) private whatsapp: WhatsAppService,
    @inject(TYPES.EmailService) private email: EmailService,
  ) {}

  /**
   * Sends a high-priority alert through all enabled sovereign channels.
   */
  async broadcastGodAlert(title: string, message: string, urgency: 'low' | 'medium' | 'high' = 'medium') {
    const formattedMessage = this.formatMessage(title, message, urgency);

    logger.info(`[GodNotificationService] Broadcasting alert: ${title} (${urgency})`);

    const tasks: Promise<any>[] = [];

    // 1. Telegram (Immediate)
    tasks.push(this.telegram.sendMessage(formattedMessage));

    // 2. WhatsApp (Direct, for high urgency)
    if (urgency === 'high' && env.WHATSAPP_PHONE_NUMBER) {
      tasks.push(this.whatsapp.sendMessage(env.WHATSAPP_PHONE_NUMBER, formattedMessage));
    }

    // 3. Email (Formal record)
    if (urgency !== 'low') {
      const emailTo = env.EMAIL_FROM || 'admin@nexusv1.net';
      const emailSubject = `[${DANIELA_IDENTITY.brand} ALERT] ${title}`;
      const emailHtml = `<pre style="font-family: monospace; font-size: 14px;">${formattedMessage}</pre>`;

      tasks.push(this.email.sendEmail(emailTo, emailSubject, emailHtml));
    }

    await Promise.allSettled(tasks);
  }

  /**
   * Applies Daniela's persona to the notification content.
   */
  private formatMessage(title: string, message: string, urgency: string): string {
    const icon = urgency === 'high' ? '🚨' : urgency === 'medium' ? '⚡' : 'ℹ️';
    return `
${icon} *${title.toUpperCase()}*
-------------------
${message}

--
${DANIELA_IDENTITY.name} | ${DANIELA_IDENTITY.title}
${DANIELA_IDENTITY.brand} Sovereign Operations
    `.trim();
  }
}
