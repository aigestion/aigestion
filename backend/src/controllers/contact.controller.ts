import type { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import axios from 'axios';
import { TYPES } from '../types';
import { EmailService } from '../services/email.service';
import { GodNotificationService } from '../services/god-notification.service';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { buildResponse, buildError } from '../common/response-builder';

@injectable()
export class ContactController {
  constructor(
    @inject(TYPES.EmailService) private emailService: EmailService,
    @inject(TYPES.GodNotificationService) private godNotification: GodNotificationService
  ) {}

  /**
   * Handle contact form submission
   */
  public async handleSubmission(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || 'unknown';
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      res.status(400).json(buildError('Faltan campos obligatorios (nombre, email, mensaje)', 'VALIDATION_ERROR', 400, requestId));
      return;
    }

    logger.info({ name, email, subject, requestId }, 'Recibiendo solicitud de contacto');

    try {
      // 1. Notificar a n8n (Seguimiento CRM)
      if (env.N8N_CONTACT_WEBHOOK_URL) {
        try {
          await axios.post(env.N8N_CONTACT_WEBHOOK_URL, {
            source: 'website-epic',
            timestamp: new Date().toISOString(),
            requestId,
            name,
            email,
            subject: subject || 'Nueva consulta desde la Web',
            message,
          });
          logger.info('Transmisión a n8n completada con éxito');
        } catch (n8nError) {
          logger.error({ error: n8nError }, 'Fallo al transmitir a n8n (no crítico)');
        }
      }

      // 2. Alerta "God Mode" (Telegram/WhatsApp si es urgente)
      await this.godNotification.broadcastGodAlert(
        `Nuevo Lead: ${name}`,
        `Asunto: ${subject || 'Contacto General'}\nEmail: ${email}\n\nMensaje:\n${message}`,
        'medium'
      );

      // 3. Email de agradecimiento al cliente (si el servicio está listo)
      if (this.emailService.isReady()) {
        await this.emailService.sendEmail({
          to: email,
          subject: `Confirmación de Recepción - AIGestion Nexus`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
              <h1 style="color: #00f5ff;">PROTOCOL_ESTABLISHED.nexus</h1>
              <p>Hola <strong>${name}</strong>,</p>
              <p>Hemos recibido tu transmisión de datos. El Nexus ha procesado tu solicitud y Daniela se pondrá en contacto contigo en breve.</p>
              <hr style="border: 0.5px solid #333;" />
              <p style="font-size: 10px; color: #666;">ID de Operación: ${requestId}</p>
            </div>
          `
        });
      }

      res.json(buildResponse({ message: 'Transmisión completada con éxito. El Nexus ha recibido tus datos.' }, 200, requestId));
    } catch (error) {
      logger.error({ error, requestId }, 'Error procesando solicitud de contacto');
      res.status(500).json(buildError('Fallo en la matriz de comunicaciones. Reinténtalo más tarde.', 'INTERNAL_ERROR', 500, requestId));
    }
  }
}
