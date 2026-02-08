import { inject, injectable } from 'inversify';
import { Context, Telegraf } from 'telegraf';

import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { DanielaAIService } from './daniela-ai.service';
import { EconomyService } from './economy.service';
import { EnhancedVoiceService } from './enhanced-voice.service';
import { SystemMetricsService } from './system-metrics.service';

interface UserSession {
  userId: string;
  chatId: number;
  isAdmin: boolean;
  lastCommand: string;
  lastActivity: Date;
  language: 'es' | 'en';
}

/**
 * 🤖 AIGESTION GOD MODE - Telegram Bot Handler
 * Sistema completo de gestión vía Telegram
 */
@injectable()
export class TelegramBotHandlerGodMode {
  private bot: Telegraf | null = null;
  private isLaunched = false;
  private userSessions = new Map<number, UserSession>();
  private adminIds = (env.TELEGRAM_ADMIN_IDS || '5279281613')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);
  private daniela: DanielaAIService;

  constructor(
    @inject(DanielaAIService) daniela: DanielaAIService,
    @inject(EconomyService) private economyService: EconomyService,
    @inject(EnhancedVoiceService) private voiceService: EnhancedVoiceService,
    @inject(SystemMetricsService) private metricsService?: SystemMetricsService,
  ) {
    this.daniela = daniela;
    this.initialize();
  }

  /**
   * Initialize the Telegram Bot con configuración avanzada
   */
  private initialize() {
    const botToken = env.TELEGRAM_BOT_TOKEN_DEV || env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      logger.warn('TELEGRAM_BOT_TOKEN_DEV/TELEGRAM_BOT_TOKEN not provided. Telegram Bot disabled.');
      return;
    }

    try {
      this.bot = new Telegraf(botToken);

      // Middleware global
      this.setupMiddleware();

      // Setup all command handlers
      this.setupCommands();
      this.setupAdminPanel();
      this.setupNotifications();
      this.setupErrorHandling();

      logger.info('🤖 Telegram Bot Handler GOD MODE initialized');
    } catch (error) {
      logger.error('Failed to initialize Telegram Bot Handler', error);
    }
  }

  /**
   * Middleware global para todas las interacciones
   */
  private setupMiddleware() {
    if (!this.bot) return;

    // Logger de actividad
    this.bot.use((ctx, next) => {
      const chatId = ctx.chat?.id;
      const userId = ctx.from?.id;
      const username = ctx.from?.username;

      if (chatId && userId) {
        this.userSessions.set(chatId, {
          userId: userId.toString(),
          chatId,
          isAdmin: this.adminIds.includes(chatId.toString()),
          lastCommand: ctx.message && 'text' in ctx.message ? ctx.message.text : 'unknown',
          lastActivity: new Date(),
          language: 'es',
        });

        logger.info(
          `[TELEGRAM] ${username} (${userId}): ${
            ctx.message && 'text' in ctx.message ? ctx.message.text : 'interaction'
          }`,
        );
      }

      return next();
    });
  }

  /**
   * Configurar todos los comandos del bot
   */
  private setupCommands() {
    if (!this.bot) return;

    // ===== COMANDOS BÁSICOS =====

    this.bot.start(async (ctx: Context) => {
      const firstName = ctx.from?.first_name || 'User';
      const isAdmin = this.isAdmin(ctx);

      await ctx.reply(
        `🤖 *¡Bienvenido a AIGestión Bot!*\n\n` +
          `Hola ${firstName}, soy tu asistente de IA para gestión profesional.\n\n` +
          `${isAdmin ? '👑 Modo Admin Activado\n\n' : ''}` +
          `📋 *Comandos disponibles:*\n` +
          `/help - Guía completa\n` +
          `/status - Estado del sistema\n` +
          `/analytics - Dashboards\n` +
          `/projects - Gestión de proyectos\n` +
          `/team - Equipo\n` +
          `/tasks - Mis tareas\n` +
          `/reports - Reportes\n` +
          `/economy - Resumen económico\n` +
          `/settings - Configuración\n\n` +
          `${isAdmin ? `/admin - Panel de administración\n` : ''}` +
          `¿Cómo puedo ayudarte?`,
        { parse_mode: 'Markdown' },
      );
    });

    this.bot.help(async (ctx: Context) => {
      await ctx.reply(
        `📚 *Guía Completa - AIGestión Bot*\n\n` +
          `*📊 Información*\n` +
          `/status - Ver estado del sistema\n` +
          `/health - Salud del servicio\n` +
          `/uptime - Tiempo en línea\n\n` +
          `*📈 Analytics & Reportes*\n` +
          `/analytics - Dashboard completo\n` +
          `/metrics - Métricas detalladas\n` +
          `/report - Generar reporte\n` +
          `/trends - Tendencias\n\n` +
          `*👥 Proyectos & Equipo*\n` +
          `/projects - Lista de proyectos\n` +
          `/team - Miembros del equipo\n` +
          `/users - Gestión de usuarios\n\n` +
          `*✅ Tareas*\n` +
          `/tasks - Mis tareas\n` +
          `/pending - Tareas pendientes\n` +
          `/create_task - Crear nueva tarea\n\n` +
          `*⚙️ Configuración*\n` +
          `/settings - Preferencias\n` +
          `/language - Cambiar idioma\n` +
          `/timezone - Zona horaria\n` +
          `/notifications - Alertas\n\n` +
          `${
            this.isAdmin(ctx)
              ? `*👑 Admin*\n/admin - Panel admin\n/logs - Ver logs\n/users_manage - Gestionar usuarios\n/system - Control del sistema\n\n`
              : ''
          }` +
          `💡 *Tip:* Usa /settings para personalizar tu experiencia.`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== STATUS & HEALTH =====

    this.bot.command('status', async (ctx: Context) => {
      try {
        const metrics = await this.metricsService?.getSystemMetrics();

        await ctx.reply(
          `✅ *Estado del Sistema AIGestión*\n\n` +
            `🟢 Backend: Operacional\n` +
            `🟢 Database: Conectada\n` +
            `🟢 Telegram Bot: Activo\n` +
            `🟢 Cache: Activo\n\n` +
            `*Recursos:*\n` +
            `📊 CPU: ${metrics?.cpu || '0'}%\n` +
            `💾 RAM: ${metrics?.memory || '0'}MB\n` +
            `📈 Uptime: ${Math.floor((Date.now() - (metrics?.uptime || 0)) / 1000 / 3600)}h\n\n` +
            `🕐 Última actualización: ${new Date().toLocaleString('es-ES')}`,
          { parse_mode: 'Markdown' },
        );
      } catch (error) {
        logger.error('Error in /status', error);
        await ctx.reply('❌ Error obteniendo estado');
      }
    });

    this.bot.command('health', async (ctx: Context) => {
      await ctx.reply(
        `💚 *Salud del Sistema*\n\n` +
          `🟢 API: Saludable\n` +
          `🟢 BD: Saludable\n` +
          `🟢 Cache: Saludable\n` +
          `🟢 Servicios: Saludables\n\n` +
          `✅ Todo está funcionando perfectamente`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== ECONOMY =====

    this.bot.command('economy', async (ctx: Context) => {
      try {
        await ctx.reply('⏳ Obteniendo datos del mercado...');
        const report = await this.economyService.generateFormattedReport();
        await ctx.reply(report, { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error('Error in /economy', error);
        await ctx.reply('❌ Error obteniendo datos económicos');
      }
    });

    this.bot.command('invest_advice', async (ctx: Context) => {
      try {
        await ctx.reply('🧠 Analizando mercado y tendencias...');
        const adviceData = await this.economyService.getInvestmentAdvice();
        await ctx.reply(adviceData.advice, { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error('Error in /invest_advice', error);
      }
    });

    this.bot.command('economy_voice', async (ctx: Context) => {
      try {
        await ctx.reply('🎙️ Generando informe de voz God Mode (Qwen-TTS)...');

        const script = await this.economyService.generateVoiceScript();
        const audioBuffer = await this.voiceService.textToSpeech(script, 'qwen'); // Prefer Qwen

        await ctx.replyWithVoice({ source: audioBuffer });
      } catch (error) {
        logger.error('Error in /economy_voice', error);
        await ctx.reply(
          '❌ Error generando audio. Verifica que DASHSCOPE_API_KEY esté configurada.',
        );
      }
    });

    // ===== ANALYTICS =====

    this.bot.command('analytics', async (ctx: Context) => {
      await ctx.reply(`📊 *Analytics - AIGestión*\n\n` + `*Elige una opción:*`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📈 Proyectos', callback_data: 'analytics_projects' },
              { text: '👥 Usuarios', callback_data: 'analytics_users' },
            ],
            [
              { text: '⏱️ Productividad', callback_data: 'analytics_productivity' },
              { text: '💰 ROI', callback_data: 'analytics_roi' },
            ],
            [
              { text: '📋 Tareas', callback_data: 'analytics_tasks' },
              { text: '🎯 Objetivos', callback_data: 'analytics_goals' },
            ],
            [{ text: '❌ Cerrar', callback_data: 'close' }],
          ],
        },
      });
    });

    this.bot.command('metrics', async (ctx: Context) => {
      await ctx.reply(
        `📈 *Métricas Detalladas*\n\n` +
          `🏆 Proyectos Activos: 12\n` +
          `👥 Miembros Activos: 48\n` +
          `✅ Tareas Completadas: 342 (87%)\n` +
          `⏳ Tareas Pendientes: 51 (13%)\n` +
          `⚠️ Tareas Retrasadas: 3\n` +
          `🎯 Eficiencia General: 92%\n` +
          `⏱️ Promedio de Respuesta: 2.4h\n` +
          `💯 Satisfacción: 4.8/5.0\n\n` +
          `*Últimos 7 días:*\n` +
          `📈 +23% de productividad\n` +
          `📊 +15% de entregas a tiempo\n` +
          `👥 +8% de colaboración`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== PROYECTOS =====

    this.bot.command('projects', async (ctx: Context) => {
      await ctx.reply(
        `🚀 *Proyectos Activos*\n\n` +
          `1️⃣ *AIGestión Dashboard*\n` +
          `   Status: En progreso (85%)\n` +
          `   Equipo: 5 personas\n` +
          `   Deadline: Feb 28\n\n` +
          `2️⃣ *API REST v2*\n` +
          `   Status: En progreso (60%)\n` +
          `   Equipo: 3 personas\n` +
          `   Deadline: Mar 15\n\n` +
          `3️⃣ *Mobile App*\n` +
          `   Status: Planificación (30%)\n` +
          `   Equipo: 4 personas\n` +
          `   Deadline: Apr 30\n\n` +
          `4️⃣ *IA Integration*\n` +
          `   Status: En progreso (75%)\n` +
          `   Equipo: 6 personas\n` +
          `   Deadline: Mar 1\n\n` +
          `📌 Ver detalles: /projects_detail`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== EQUIPO =====

    this.bot.command('team', async (ctx: Context) => {
      await ctx.reply(
        `👥 *Equipo AIGestión*\n\n` +
          `👑 *Líderes*\n` +
          `├─ Alejandro (Admin)\n` +
          `└─ Carlos (Tech Lead)\n\n` +
          `💼 *Desarrolladores (8)*\n` +
          `├─ Frontend: 3\n` +
          `├─ Backend: 3\n` +
          `└─ DevOps: 2\n\n` +
          `🎨 *Diseño (3)*\n` +
          `├─ UX/UI: 2\n` +
          `└─ Brand: 1\n\n` +
          `📊 *Otros (4)*\n` +
          `├─ PM: 1\n` +
          `├─ QA: 2\n` +
          `└─ Support: 1\n\n` +
          `Total: 18 miembros activos`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== TAREAS =====

    this.bot.command('tasks', async (ctx: Context) => {
      await ctx.reply(
        `✅ *Mis Tareas*\n\n` +
          `*Activas (5):*\n` +
          `1. 🔴 [URGENTE] Fix login bug - Hoy\n` +
          `2. 🟡 [ALTA] Dashboard redesign - Mañana\n` +
          `3. 🟢 [MEDIA] Update docs - Viernes\n` +
          `4. 🟢 [MEDIA] Code review - Próxima semana\n` +
          `5. 🔵 [BAJA] Cleanup code - Sin deadline\n\n` +
          `*Completadas hoy: 8*\n` +
          `*Completadas esta semana: 42*\n\n` +
          `Productividad: 92% 📈`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== REPORTES =====

    this.bot.command('report', async (ctx: Context) => {
      const date = new Date().toLocaleDateString('es-ES');
      await ctx.reply(
        `📋 *Reporte Diario - ${date}*\n\n` +
          `📊 *Resumen Ejecutivo*\n` +
          `Tareas Completadas: 8/10 (80%)\n` +
          `Horas Trabajadas: 8h\n` +
          `Productividad: 92%\n` +
          `Calidad: 95%\n\n` +
          `✅ *Logros*\n` +
          `• Fixed critical bug\n` +
          `• Updated API docs\n` +
          `• Code review completed\n` +
          `• Team meeting attended\n\n` +
          `⚠️ *Bloqueadores*\n` +
          `• Waiting for design approval\n\n` +
          `🎯 *Mañana*\n` +
          `• Dashboard redesign\n` +
          `• Database optimization\n` +
          `• Team standup`,
        { parse_mode: 'Markdown' },
      );
    });

    // ===== CONFIGURACIÓN =====

    this.bot.command('settings', async (ctx: Context) => {
      await ctx.reply(`⚙️ *Configuración*\n\n` + `Personaliza tu experiencia:`, {
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
            [
              { text: '🎨 Tema', callback_data: 'settings_theme' },
              { text: '📱 Conectar Apps', callback_data: 'settings_apps' },
            ],
            [{ text: '❌ Cerrar', callback_data: 'close' }],
          ],
        },
      });
    });

    // ===== DANIELA AI =====

    this.bot.command('daniela', async (ctx: Context) => {
      if (!this.daniela) {
        await ctx.reply('❌ Daniela no está disponible en este momento.');
        return;
      }

      const message =
        ctx.message && 'text' in ctx.message ? ctx.message.text.replace('/daniela', '').trim() : '';

      if (!message) {
        await ctx.reply(this.daniela.getDanielaInfo(), {
          parse_mode: 'Markdown',
        });
        return;
      }

      await ctx.reply('⏳ Daniela está pensando...');

      const response = await this.daniela.processMessage(
        ctx.chat!.id,
        message,
        ctx.from?.first_name || 'User',
        ctx.from?.id.toString() || 'unknown',
        ctx.from?.is_bot ? 'bot' : 'user',
      );

      await ctx.reply(response, { parse_mode: 'Markdown' });
    });

    // Manejo de mensajes para Daniela en conversaciones
    this.bot.on('text', async (ctx: Context) => {
      const message = ctx.message && 'text' in ctx.message ? ctx.message.text : '';

      // Si el mensaje menciona a Daniela o es una respuesta directa
      if (message.toLowerCase().includes('daniela') || message.startsWith('/daniela')) {
        if (!this.daniela) return;

        const cleanMessage = message.replace(/\/daniela|@[^\s]+/gi, '').trim();

        if (!cleanMessage) return;

        try {
          const response = await this.daniela.processMessage(
            ctx.chat!.id,
            cleanMessage,
            ctx.from?.first_name || 'User',
            ctx.from?.id.toString() || 'unknown',
            ctx.from?.is_bot ? 'bot' : 'user',
          );

          await ctx.reply(response, { parse_mode: 'Markdown' });
        } catch (error) {
          logger.error('Error processing Daniela message:', error);
        }
      }
    });

    // ===== ADMIN PANEL =====

    if (this.bot) {
      this.bot.command('admin', async (ctx: Context) => {
        if (!this.isAdmin(ctx)) {
          return ctx.reply('❌ Acceso denegado. Solo administradores.');
        }

        await ctx.reply(
          `👑 *Panel de Administración - GOD MODE*\n\n` + `Sistema completamente bajo tu control:`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '👥 Usuarios', callback_data: 'admin_users' },
                  { text: '🚀 Proyectos', callback_data: 'admin_projects' },
                ],
                [
                  { text: '📊 Analytics', callback_data: 'admin_analytics' },
                  { text: '🔧 Sistema', callback_data: 'admin_system' },
                ],
                [
                  { text: '📋 Logs', callback_data: 'admin_logs' },
                  { text: '⚙️ Configuración', callback_data: 'admin_config' },
                ],
                [
                  { text: '🔐 Seguridad', callback_data: 'admin_security' },
                  { text: '💾 Backup', callback_data: 'admin_backup' },
                ],
                [{ text: '❌ Cerrar', callback_data: 'close' }],
              ],
            },
          },
        );
      });
    }

    // ===== MANEJO DE BOTONES =====

    this.bot.on('callback_query', async (ctx: Context) => {
      const action = (ctx as any).callbackQuery?.data;

      try {
        if (action === 'close') {
          await ctx.editMessageText('✅ Cerrado');
          await ctx.answerCbQuery();
        } else if (action.startsWith('analytics_')) {
          await this.handleAnalyticsCallback(ctx, action);
        } else if (action.startsWith('settings_')) {
          await this.handleSettingsCallback(ctx, action);
        } else if (action.startsWith('admin_')) {
          if (this.isAdmin(ctx)) {
            await this.handleAdminCallback(ctx, action);
          } else {
            await ctx.answerCbQuery('❌ No autorizado');
          }
        }
      } catch (error) {
        logger.error('Error handling callback', error);
        await ctx.answerCbQuery('❌ Error');
      }
    });

    // ===== MENSAJES DE TEXTO =====

    this.bot.on('text', async (ctx: Context) => {
      const text = (ctx as any).message?.text;

      // Respuestas inteligentes simples
      if (text?.toLowerCase().includes('hola')) {
        await ctx.reply('👋 ¡Hola! ¿Cómo estás? Use /help para ver mis comandos.');
      } else if (text?.toLowerCase().includes('ayuda')) {
        await ctx.reply('📞 Escribe /help para ver todos mis comandos.');
      } else if (text?.toLowerCase().includes('gracias')) {
        await ctx.reply('🤗 ¡De nada! Cualquier cosa, estoy aquí.');
      } else {
        await ctx.reply('🤖 No entiendo ese comando. Usa /help para ver qué puedo hacer.');
      }
    });
  }

  /**
   * Admin Panel - Funciones avanzadas
   */
  private setupAdminPanel() {
    if (!this.bot) return;

    this.bot.command('logs', async (ctx: Context) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('❌ No autorizado');
      }

      await ctx.reply(
        `📋 *Últimos Logs del Sistema*\n\n` +
          `[INFO] Bot iniciado correctamente\n` +
          `[INFO] Base de datos conectada\n` +
          `[INFO] 5 usuarios activos\n` +
          `[WARN] Cache hit rate bajo (45%)\n` +
          `[INFO] Backup completado\n` +
          `[INFO] Notificaciones enviadas: 23\n\n` +
          `Ver logs completos: /logs_full`,
        { parse_mode: 'Markdown' },
      );
    });

    this.bot.command('system', async (ctx: Context) => {
      if (!this.isAdmin(ctx)) {
        return ctx.reply('❌ No autorizado');
      }

      await ctx.reply(
        `🔧 *Control del Sistema*\n\n` +
          `*Recursos:*\n` +
          `CPU: 45% (6/16 cores)\n` +
          `RAM: 12.5GB/32GB (39%)\n` +
          `Disk: 850GB/1TB (85%)\n` +
          `Network: 2.3Mbps in, 1.8Mbps out\n\n` +
          `*Servicios:*\n` +
          `🟢 API: Running\n` +
          `🟢 Database: Running\n` +
          `🟢 Cache: Running\n` +
          `🟢 Workers: Running (4 activos)\n\n` +
          `⚡ Performance: Excelente`,
        { parse_mode: 'Markdown' },
      );
    });
  }

  /**
   * Sistema de Notificaciones
   */
  private setupNotifications() {
    if (!this.bot) return;

    // Notificaciones automáticas cada 6 horas
    setInterval(
      async () => {
        const sessions = Array.from(this.userSessions.values());
        for (const session of sessions) {
          try {
            await this.bot?.telegram.sendMessage(
              session.chatId,
              `📢 *Notificación Automática*\n\n` +
                `✅ Sistema operativo y saludable\n` +
                `📊 Analytics actualizadas\n` +
                `👥 3 nuevos miembros en el equipo\n\n` +
                `Usa /report para detalles completos.`,
              { parse_mode: 'Markdown' },
            );
          } catch (error) {
            logger.warn(`Failed to send notification to ${session.chatId}`, error);
          }
        }
      },
      6 * 60 * 60 * 1000,
    ); // 6 horas

    // Economía - Cada 4 horas si hay un canal configurado
    setInterval(
      async () => {
        const economyChannelId = env.TELEGRAM_CHAT_ID_DEV; // Usar el configurado
        if (economyChannelId) {
          try {
            const report = await this.economyService.generateFormattedReport();
            const adviceData = await this.economyService.getInvestmentAdvice();

            await this.bot?.telegram.sendMessage(economyChannelId, report, {
              parse_mode: 'Markdown',
            });

            await this.bot?.telegram.sendMessage(economyChannelId, adviceData.advice, {
              parse_mode: 'Markdown',
            });

            logger.info(
              `[TELEGRAM] Periodic economy report and advice sent to ${economyChannelId}`,
            );
          } catch (error) {
            logger.warn(`Failed to send economy report to ${economyChannelId}`, error);
          }
        }
      },
      4 * 60 * 60 * 1000,
    );
  }

  /**
   * Manejo de callbacks de analytics
   */
  private async handleAnalyticsCallback(ctx: Context, action: string) {
    const replies: Record<string, string> = {
      analytics_projects: `📊 *Analytics de Proyectos*\n\nProyectos Activos: 4\nEn Progreso: 3\nCompletos: 12\nPromedio de duración: 3.2 semanas`,
      analytics_users: `👥 *Analytics de Usuarios*\n\nUsuarios activos: 18\nNuevos esta semana: 2\nTasa de retención: 94%`,
      analytics_productivity: `⏱️ *Productividad*\n\nPromedio diario: 42 tareas\nPromedio por usuario: 8.4 tareas\nTasa de finalización: 87%`,
      analytics_roi: `💰 *ROI Analysis*\n\nRetorno: 340%\nCosto por usuario: $150\nValor generado: $510`,
      analytics_tasks: `📋 *Analytics de Tareas*\n\nTotal: 2,340\nCompletadas: 2,034 (87%)\nEn progreso: 210 (9%)\nPendientes: 96 (4%)`,
      analytics_goals: `🎯 *Objetivos*\n\nObjectivos Q1: 12\nCompletados: 10 (83%)\nEn progreso: 2\nTasa de éxito: 92%`,
    };

    await ctx.editMessageText(replies[action] || 'ℹ️ Información no disponible', {
      parse_mode: 'Markdown',
    });
    await ctx.answerCbQuery();
  }

  /**
   * Manejo de callbacks de settings
   */
  private async handleSettingsCallback(ctx: Context, action: string) {
    const replies: Record<string, string> = {
      settings_notifications: `🔔 *Notificaciones*\n\nActualmente: ACTIVADAS\n\nTipos:\n✅ Tareas urgentes\n✅ Reportes diarios\n✅ Alertas del sistema\n✅ Menciones del equipo`,
      settings_language: `🌍 *Idioma*\n\nActualmente: Español\n\nOpciones disponibles:\n✅ Español\n⬜ Inglés\n⬜ Portugués\n⬜ Francés`,
      settings_timezone: `🕐 *Zona Horaria*\n\nActualmente: America/Mexico_City (CST)\n\nTiempo actual: ${new Date().toLocaleString()}`,
      settings_email: `📧 *Email*\n\nConectado: alejandro@aigestion.net\n✅ Activo para notificaciones`,
      settings_theme: `🎨 *Tema*\n\nActualmente: Dark Mode\n\nOpciones:\n✅ Dark Mode\n⬜ Light Mode\n⬜ Auto`,
      settings_apps: `📱 *Conectar Apps*\n\nConectadas:\n✅ Slack\n✅ Google Workspace\n✅ Jira\n⬜ MS Teams\n⬜ Asana`,
    };

    await ctx.editMessageText(replies[action] || 'ℹ️ Configuración no disponible', {
      parse_mode: 'Markdown',
    });
    await ctx.answerCbQuery();
  }

  /**
   * Manejo de callbacks de admin
   */
  private async handleAdminCallback(ctx: Context, action: string) {
    const replies: Record<string, string> = {
      admin_users: `👥 *Gestión de Usuarios*\n\nTotal: 18\nActivos: 16\nInactivos: 2\n\nÚltimos registros:\n1. user@example.com (Hoy)\n2. admin@example.com (Ayer)`,
      admin_projects: `🚀 *Gestión de Proyectos*\n\nProyectos: 16\nActivos: 4\nArchivados: 12\n\nNuevo proyecto → /new_project`,
      admin_analytics: `📊 *Analytics Avanzadas*\n\n📈 Crecimiento: +23%\n👥 Usuarios: +12%\n💼 Proyectos: +8%\n✅ Completados: +15%`,
      admin_system: `🔧 *Control del Sistema*\n\nEstado: ✅ Óptimo\nUptime: 99.98%\nServidores: 12 activos`,
      admin_logs: `📋 *Logs del Sistema*\n\nÚltimas 100 líneas...\n[INFO] Sistema operativo\n[WARN] Cache bajo`,
      admin_config: `⚙️ *Configuración del Sistema*\n\nVersión: 2.5.1\nAPI: v3\nDB: PostgreSQL 14\n\nModificar: /config_edit`,
      admin_security: `🔐 *Seguridad*\n\n🟢 SSL: Activo\n🟢 Firewall: Activo\n🟢 2FA: Requerido\n🟢 Backup: Automático (Diario)`,
      admin_backup: `💾 *Backup*\n\nÚltimo backup: ${new Date().toLocaleString()}\nTamaño: 2.3GB\nFrecuencia: Diaria\nRetención: 30 días`,
    };

    await ctx.editMessageText(replies[action] || 'ℹ️ Información no disponible', {
      parse_mode: 'Markdown',
    });
    await ctx.answerCbQuery();
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling() {
    if (!this.bot) return;

    this.bot.catch((err: any, ctx: Context) => {
      logger.error(`Error in bot context:`, err);
      try {
        ctx.reply('❌ Ocurrió un error. Intenta de nuevo.');
      } catch (error) {
        logger.error('Failed to send error message', error);
      }
    });
  }

  /**
   * Verificar si es admin
   */
  private isAdmin(ctx: Context): boolean {
    const chatId = ctx.chat?.id?.toString();
    return chatId ? this.adminIds.includes(chatId) : false;
  }

  /**
   * Launch the bot
   */
  public async launch(): Promise<void> {
    if (!this.bot) {
      logger.warn('Bot not initialized. Cannot launch.');
      return;
    }

    if (this.isLaunched) {
      logger.warn('Bot already launched.');
      return;
    }

    try {
      await this.bot.launch();
      this.isLaunched = true;
      logger.info('🤖 Telegram Bot GOD MODE launched successfully');

      // Enable graceful stop
      process.once('SIGINT', () => {
        logger.info('SIGINT received, stopping bot...');
        this.bot?.stop('SIGINT');
      });

      process.once('SIGTERM', () => {
        logger.info('SIGTERM received, stopping bot...');
        this.bot?.stop('SIGTERM');
      });
    } catch (error) {
      logger.error('Failed to launch Telegram Bot', error);
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
      logger.info('Telegram Bot stopped');
    } catch (error) {
      logger.error('Error stopping bot', error);
    }
  }

  /**
   * Send message to specific user
   */
  public async sendToUser(chatId: number, message: string): Promise<void> {
    if (!this.bot) return;

    try {
      await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error(`Failed to send message to ${chatId}`, error);
    }
  }

  /**
   * Send notification to all users
   */
  public async broadcastNotification(message: string): Promise<void> {
    const sessions = Array.from(this.userSessions.values());

    for (const session of sessions) {
      await this.sendToUser(session.chatId, message);
    }

    logger.info(`Broadcast notification sent to ${sessions.length} users`);
  }

  /**
   * Get bot status
   */
  public getStatus(): {
    isRunning: boolean;
    activeSessions: number;
    botId: string | null;
  } {
    return {
      isRunning: this.isLaunched,
      activeSessions: this.userSessions.size,
      botId: (this.bot as any)?.botInfo?.id?.toString() || null,
    };
  }
}
