import nodemailer from 'nodemailer';
import { injectable } from 'inversify';

import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * Interface for email options, matching the comprehensive version from utils.
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }[];
}

@injectable()
export class EmailService {
  private transporter: any;
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      if (!env.EMAIL_HOST || !env.EMAIL_PORT) {
        logger.warn('SMTP configuration incomplete. Email service disabled.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_PORT === 465,
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // For local/sovereign mail servers
        },
      });
      this.isConfigured = true;
      logger.info('SMTP service correctly configured');
    } catch (error) {
      logger.error(error, 'Error initializing EmailService:');
      this.isConfigured = false;
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.transporter !== null;
  }

  /**
   * Verify SMTP connection configuration
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;
    try {
      await this.transporter.verify();
      logger.info('✅ SMTP connection verified');
      return true;
    } catch (error) {
      logger.error(error, '❌ SMTP connection failed');
      return false;
    }
    // No database connection handling here; skip shutdown of DB.
    // If a DB connection is needed, integrate it with connectToDatabase.
    // Placeholder for future DB cleanup.
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isReady()) {
      logger.error('Email service NOT ready');
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${env.API_TITLE}" <${env.EMAIL_FROM}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      logger.info(`📧 Email sent: ${info.messageId} to ${options.to}`);
      return true;
    } catch (error) {
      logger.error(error, `Failed to send email to ${options.to}`);
      return false;
    }
  }

  /**
   * Comprehensive transcription email generator (merged from utils)
   */
  async sendTranscriptionEmail(
    to: string | string[],
    videoTitle: string,
    videoUrl: string,
    transcript: string,
    videoId: string,
  ): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF0000; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .video-info { background-color: #f5f5f5; padding: 15px; border-left: 4px solid #FF0000; margin-bottom: 20px; }
          .video-info a { color: #FF0000; text-decoration: none; font-weight: bold; }
          .transcript { background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          .thumbnail { max-width: 100%; height: auto; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header"><h1>📹 Transcripción de YouTube</h1></div>
        <div class="video-info">
          <h2>📺 ${videoTitle}</h2>
          <p><strong>URL:</strong> <a href="${videoUrl}" target="_blank">${videoUrl}</a></p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <img class="thumbnail" src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Miniatura">
        </div>
        <div class="transcript">${transcript}</div>
        <div class="footer"><p>Generado por NEXUS V1 • ${new Date().getFullYear()}</p></div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: `📹 Transcripción: ${videoTitle}`,
      html: htmlContent,
    });
  }
}
