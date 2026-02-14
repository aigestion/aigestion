import { Telegraf } from 'telegraf';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * SOVEREIGN TELEGRAM SERVICE (God Mode)
 * Engineered for resilient global notifications and system alerts.
 */
@injectable()
export class TelegramService {
  private bot: Telegraf | null = null;
  private defaultChatId: string | undefined;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const token = env.TELEGRAM_BOT_TOKEN_DEV || env.TELEGRAM_BOT_TOKEN;
    if (token) {
      try {
        this.bot = new Telegraf(token);
        this.defaultChatId = env.TELEGRAM_CHAT_ID;
        logger.info('[TelegramService] Client synchronized with Sovereign Hive');
      } catch (error) {
        logger.error('[TelegramService] Resilience fault during initialization', error);
      }
    } else {
      logger.warn('[TelegramService] TELEGRAM_BOT_TOKEN missing. Communications restricted.');
    }
  }

  /**
   * Resilient execution wrapper with exponential backoff
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        // Don't retry on 4xx validation errors (e.g., chat not found)
        if (error.response?.error_code >= 400 && error.response?.error_code < 500) {
          logger.error(
            `[TelegramService] ${context} Terminal Error: ${error.response?.error_code}`,
            error.message,
          );
          throw error;
        }

        if (attempt === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(
          `[TelegramService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`,
        );
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[TelegramService] ${context} failed after maximum retries`);
  }

  /**
   * Get health and diagnostics for the sovereign bot
   */
  async checkHealth() {
    if (!this.bot) return { status: 'disabled' };
    try {
      const me = await this.bot.telegram.getMe();
      return {
        status: 'ready',
        botInfo: {
          username: me.username,
          firstName: me.first_name,
          canJoinGroups: me.can_join_groups,
        },
      };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }

  /**
   * Send a resilient text message with MarkdownV2 support
   */
  async sendMessage(message: string, chatId?: string | number): Promise<void> {
    const targetChatId = chatId || this.defaultChatId;

    if (!this.bot || !targetChatId) {
      logger.warn('[TelegramService] Cannot send message: Bot not synchronized or Chat ID missing');
      return;
    }

    await this.withRetry(async () => {
      await this.bot!.telegram.sendMessage(targetChatId, message, {
        parse_mode: 'Markdown',
      });
      logger.info({ targetChatId }, '[TelegramService] Sovereign alert dispatched');
    }, 'sendMessage');
  }

  /**
   * Send a video file to the quantum registry
   */
  async sendVideo(videoPath: string, caption?: string, chatId?: string | number): Promise<void> {
    const targetChatId = chatId || this.defaultChatId;

    if (!this.bot || !targetChatId) return;

    await this.withRetry(async () => {
      await this.bot!.telegram.sendVideo(
        targetChatId,
        { source: videoPath },
        { caption, parse_mode: 'Markdown' },
      );
      logger.info({ targetChatId }, '[TelegramService] Visual log synchronized');
    }, 'sendVideo');
  }

  /**
   * Get bot instance for direct access (advanced)
   */
  getBotInstance(): Telegraf | null {
    return this.bot;
  }
}

export const telegramService = new TelegramService();
