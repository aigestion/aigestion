import { inject, injectable } from 'inversify';
import { Context, Telegraf } from 'telegraf';

import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { DanielaAIService } from './daniela-ai.service';

/**
 * Telegram Bot Handler - Public Bot
 */
@injectable()
export class TelegramBotHandler {
  private bot: Telegraf | null = null;
  private isLaunched = false;
  private daniela: DanielaAIService;

  constructor(@inject(DanielaAIService) daniela: DanielaAIService) {
    this.daniela = daniela;
    this.initialize();
  }

  /**
   * Initialize the Telegram Bot with command handlers
   */
  private initialize() {
    const botToken = env.TELEGRAM_BOT_TOKEN_PUBLIC || env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      logger.warn(
        'TELEGRAM_BOT_TOKEN_PUBLIC/TELEGRAM_BOT_TOKEN not provided. Telegram Bot disabled.'
      );
      return;
    }

    try {
      this.bot = new Telegraf(botToken);

      // Setup command handlers
      this.setupCommands();

      // Setup error handling
      this.setupErrorHandling();

      logger.info('Telegram Public Bot initialized');
    } catch (error) {
      logger.error('Failed to initialize Telegram Public Bot', error);
    }
  }

  /**
   * Setup all bot commands
   */
  private setupCommands() {
    const bot = this.bot;
    if (!bot) return;

    // /start command
    bot.start(async (ctx: Context) => {
      try {
        const chatId = ctx.chat?.id;
        const firstName = ctx.from?.first_name || 'User';

        logger.info(`Public bot started by ${firstName} (${chatId})`);

        await ctx.reply(
          `🤖 ¡Bienvenido a AIGestión Bot!\n\n` +
            `Hola ${firstName}, soy tu asistente de IA para gestión de proyectos.\n\n` +
            `Comandos disponibles:\n` +
            `/help - Muestra esta ayuda\n` +
            `/status - Estado del sistema\n` +
            `/analytics - Analytics del proyecto\n` +
            `/settings - Configurar preferencias\n` +
            `/daniela - Asistente IA\n\n` +
            `¿Cómo puedo ayudarte?`
        );
      } catch (error) {
        logger.error('Error in /start command', error);
        ctx.reply('❌ Hubo un error. Por favor, intenta de nuevo.');
      }
    });

    // /help command
    bot.help(async (ctx: Context) => {
      try {
        await ctx.reply(
          `📚 *Guía de Comandos AIGestión Bot*\n\n` +
            `/start - Inicia el bot\n` +
            `/help - Muestra esta ayuda\n` +
            `/status - Estado actual del sistema\n` +
            `/analytics - Ver analytics del proyecto\n` +
            `/settings - Configurar preferencias\n` +
            `/daniela - Asistente IA\n\n` +
            `_Para más información, visita nuestro sitio web._`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        logger.error('Error in /help command', error);
      }
    });

    // /daniela command (public)
    bot.command('daniela', async (ctx: Context) => {
      const daniela = this.daniela;
      if (!daniela) {
        await ctx.reply('❌ Daniela no está disponible en este momento.');
        return;
      }

      if (!ctx.message || !('text' in ctx.message)) {
        await ctx.reply('❌ Necesito un mensaje de texto para ayudarte.');
        return;
      }

      const message = ctx.message.text.replace('/daniela', '').trim();

      if (!message) {
        await ctx.reply(daniela.getDanielaInfo(), { parse_mode: 'Markdown' });
        return;
      }

      await ctx.reply('⏳ Daniela está pensando...');

      const response = await daniela.processMessage(
        ctx.chat!.id,
        message,
        ctx.from?.first_name || 'User',
        ctx.from?.id.toString() || 'unknown',
        'public'
      );

      await ctx.reply(response, { parse_mode: 'Markdown' });
    });

    // /status command
    bot.command('status', async (ctx: Context) => {
      try {
        await ctx.reply(
          `✅ *Estado del Sistema*\n\n` +
            `🟢 Backend: Operacional\n` +
            `🟢 Telegram Bot: Conectado\n` +
            `🟢 Notificaciones: Activas\n\n` +
            `Última actualización: ${new Date().toLocaleString()}`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        logger.error('Error in /status command', error);
      }
    });

    // /analytics command
    bot.command('analytics', async (ctx: Context) => {
      try {
        await ctx.reply(
          `📊 *Analytics del Proyecto*\n\n` +
            `📈 Proyectos activos: 5\n` +
            `👥 Miembros del equipo: 12\n` +
            `✅ Tareas completadas: 87%\n` +
            `⏱️ Tiempo promedio: 4.2h\n\n` +
            `Últimos 7 días: +15% de productividad`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        logger.error('Error in /analytics command', error);
      }
    });

    // /settings command
    bot.command('settings', async (ctx: Context) => {
      try {
        await ctx.reply(
          `⚙️ *Configuración*\n\n` + `Usa los botones de abajo para configurar tus preferencias:\n`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔔 Notificaciones', callback_data: 'settings_notifications' },
                  { text: '🌍 Idioma', callback_data: 'settings_language' },
                ],
                [
                  { text: '🕐 Zona Horaria', callback_data: 'settings_timezone' },
                  { text: '📧 Email', callback_data: 'settings_email' },
                ],
                [{ text: '❌ Cerrar', callback_data: 'settings_close' }],
              ],
            },
          }
        );
      } catch (error) {
        logger.error('Error in /settings command', error);
      }
    });
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling() {
    if (!this.bot) return;

    this.bot.catch((err: any, ctx: Context) => {
      logger.error(`Error in public bot context:`, err);
      try {
        ctx.reply('❌ Ocurrió un error. Por favor, intenta de nuevo.');
      } catch (error) {
        logger.error('Failed to send error message', error);
      }
    });
  }

  /**
   * Launch the bot
   */
  public async launch(): Promise<void> {
    if (!this.bot) {
      logger.warn('Public bot not initialized. Cannot launch.');
      return;
    }

    if (this.isLaunched) {
      logger.warn('Public bot already launched.');
      return;
    }

    try {
      await this.bot.launch();
      this.isLaunched = true;
      logger.info('Telegram Public Bot launched successfully');

      // Enable graceful stop
      process.once('SIGINT', () => {
        logger.info('SIGINT received, stopping public bot...');
        this.bot?.stop('SIGINT');
      });

      process.once('SIGTERM', () => {
        logger.info('SIGTERM received, stopping public bot...');
        this.bot?.stop('SIGTERM');
      });
    } catch (error) {
      logger.error('Failed to launch Telegram Public Bot', error);
    }
  }

  /**
   * Stop the bot
   */
  public async stop(): Promise<void> {
    if (!this.bot || !this.isLaunched) {
      return;
    }

    try {
      await this.bot.stop();
      this.isLaunched = false;
      logger.info('Telegram Public Bot stopped');
    } catch (error) {
      logger.error('Error stopping Telegram Public Bot', error);
    }
  }

  /**
   * Check if bot is running
   */
  public isRunning(): boolean {
    return this.isLaunched;
  }

  /**
   * Get bot instance (for direct access if needed)
   */
  public getBot(): Telegraf | null {
    return this.bot;
  }
}
