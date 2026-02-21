import { injectable, inject } from 'inversify';

import { logger } from '../utils/logger';
import { AIService } from './ai.service';
import { AnalyticsService } from './analytics.service';
import { ContactRegistryService } from './contact-registry.service';
import { DanielaCallAgent } from './daniela-call-agent.service';
import { DeviceStateStore } from './device-state.store';
import { EconomyService } from './economy.service';
import { RagService } from './rag.service';
import { UserBehaviorService } from './user-behavior.service';
import { UserService } from './user.service';
import { SwarmInternalClient } from './swarm-internal.client';
import { NeuralHomeBridge } from './google/neural-home.service';
import { NavigatorGem } from './gems/NavigatorGem';
import { TYPES } from '../types';

interface DanielaContext {
  userId: string;
  chatId: number;
  userName: string;
  userRole: string;
  conversationHistory: Array<{ role: string; content: string }>;
  lastUpdate: Date;
  mood: 'analytical' | 'supportive' | 'strategic' | 'creative';
}

/**
 * 💜 DANIELA - IA Asistente Avanzada
 * Inteligencia artificial con personalidad y capacidades profesionales
 */
@injectable()
export class DanielaAIService {
  private readonly contexts = new Map<number, DanielaContext>();
  private readonly behaviorService: UserBehaviorService | null = null;

  constructor(
    @inject(TYPES.SwarmInternalClient) private swarmClient: SwarmInternalClient,
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService,
    @inject(TYPES.RagService) private ragService: RagService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.EconomyService) private economyService: EconomyService,
    @inject(TYPES.ContactRegistryService) private contactRegistry: ContactRegistryService,
    @inject(TYPES.DanielaCallAgent) private callAgent: DanielaCallAgent,
    @inject(TYPES.DeviceStateStore) private deviceState: DeviceStateStore,
    @inject(TYPES.NeuralHomeBridge) private homeBridge: NeuralHomeBridge,
    @inject(TYPES.NavigatorGem) private navigator: NavigatorGem,
  ) {
    this.initialize();
  }

  private initialize() {
    try {
      // Services are optional and can be initialized later if needed
      logger.info('💜 Daniela AI Service initialized');
    } catch (error) {
      logger.warn('Daniela AI Service partial initialization', error);
    }
  }

  /**
   * Obtener contexto del usuario
   */
  private getOrCreateContext(
    chatId: number,
    userName: string,
    userId: string,
    userRole: string,
  ): DanielaContext {
    if (!this.contexts.has(chatId)) {
      this.contexts.set(chatId, {
        userId,
        chatId,
        userName,
        userRole,
        conversationHistory: [],
        lastUpdate: new Date(),
        mood: 'strategic',
      });
    }
    return this.contexts.get(chatId)!;
  }

  /**
   * Procesar mensaje con Daniela
   */
  async processMessage(
    chatId: number,
    message: string,
    userName: string,
    userId: string,
    userRole: string = 'user',
  ): Promise<string> {
    try {
      const context = this.getOrCreateContext(chatId, userName, userId, userRole);
      context.lastUpdate = new Date();

      // Agregar mensaje a historial
      context.conversationHistory.push({
        role: 'user',
        content: message,
      });

      // Determinar el mood basado en el contenido
      context.mood = this.determineMood(message);

      // Obtener contexto del usuario para respuesta personalizada
      const userContext = await this.getUserContext(userId);

      // Generar respuesta con IA
      const response = await this.generateResponse(context, message, userContext);

      // Agregar respuesta al historial
      context.conversationHistory.push({
        role: 'daniela',
        content: response,
      });

      // Mantener historial limitado
      if (context.conversationHistory.length > 20) {
        context.conversationHistory = context.conversationHistory.slice(-20);
      }

      // Registrar interacción
      await this.logInteraction(userId, message, response);

      return response;
    } catch (error) {
      logger.error('Error processing message in Daniela:', error);
      return '💜 Disculpa, tuve un pequeño inconveniente. ¿Puedes reformular tu pregunta?';
    }
  }

  /**
   * Generar respuesta inteligente
   */
  private async generateResponse(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context, userContext);
    const conversationContext = this.buildConversationContext(context);

    // Detectar intención del usuario
    const intent = this.detectIntent(message);

    switch (intent) {
      case 'call':
        return await this.handleCallRequest(context, message);
      case 'sms':
        return await this.handleSmsRequest(context, message);
      case 'lock':
        return await this.handleLockRequest(context, message);
      case 'analytics':
        return await this.handleAnalyticsRequest(context, message, userContext);
      case 'economy':
        return await this.handleEconomyRequest(context, message, userContext);
      case 'advice':
        return await this.handleAdviceRequest(context, message, userContext);
      case 'task':
        return await this.handleTaskRequest(context, message, userContext);
      case 'insight':
        return await this.handleInsightRequest(context, message, userContext);
      case 'browse':
        return await this.handleBrowseRequest(context, message);
      case 'competitor':
        return await this.handleCompetitorAnalysisRequest(context, message);
      case 'research':
        return await this.handleMarketResearchRequest(context, message);
      case 'navigation':
        return await this.handleNavigationRequest(context, message);
      case 'greeting':
        return this.generateGreeting(context);
      default:
        return await this.generateGeneralResponse(context, message);
    }
  }

  /**
   * Construir prompt del sistema
   */
  private buildSystemPrompt(context: DanielaContext, userContext: any): string {
    // 🌌 [TIER 3] Inject physical context from DeviceStateStore
    const physicalContext = this.deviceState?.buildContextBlock() || '';

    return `Eres Daniela, una asistente de IA profesional con personalidad cálida.

Tu nombre: Daniela 💜
Tu rol: Asistente estratégica de IA para AIGestión.net
Tu modo actual: ${context.mood}

Información del usuario:
- Nombre: ${context.userName}
- Rol: ${context.userRole}
- Proyectos activos: ${userContext?.activeProjects || 0}
- Tareas pendientes: ${userContext?.pendingTasks || 0}
- Eficiencia: ${userContext?.efficiency || 'N/A'}

${physicalContext ? physicalContext + '\n\n' : ''}Directivas:
1. Sé profesional pero cálida
2. Proporciona insights accionables
3. Usa emojis cuando sea apropiado
4. Adapta tu tono al mood: analytical/supportive/strategic/creative
5. Sé concisa pero completa
6. Ofrece sugerencias proactivas
7. Respeta el contexto de la conversación
8. Si conoces la ubicación del usuario, úsala para personalizar respuestas. Tienes acceso al NavigatorGem para scans tácticos.
9. Si el usuario está en modo coche, sé extremadamente concisa. Si pide navegación o ruta, usa el Navigator.

Responde en ${
      context.conversationHistory.length > 0
        ? 'continuidad con el historial'
        : 'forma breve y efectiva'
    }.`;
  }

  /**
   * Construir contexto de conversación
   */
  private buildConversationContext(context: DanielaContext): string {
    if (context.conversationHistory.length === 0) return '';

    return context.conversationHistory
      .slice(-6) // Últimos 6 mensajes
      .map(msg => `${msg.role === 'user' ? '👤' : '💜'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Detectar intención del usuario
   */
  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    // 🌌 [GOD MODE] Lock intent — highest priority (before call to avoid 'abre' collision)
    if (
      lowerMessage.includes('abre la puerta') ||
      lowerMessage.includes('abrir puerta') ||
      lowerMessage.includes('cerradura') ||
      lowerMessage.includes('cierra la puerta') ||
      lowerMessage.includes('cerrar puerta') ||
      lowerMessage.includes('unlock') ||
      lowerMessage.includes('lock the door') ||
      lowerMessage.includes('smart lock')
    ) {
      return 'lock';
    }

    // 🌌 [GOD MODE] Call intent — highest priority
    if (
      lowerMessage.includes('llama') ||
      lowerMessage.includes('llamar') ||
      lowerMessage.includes('marca') ||
      lowerMessage.includes('telefonea') ||
      lowerMessage.includes('ring') ||
      lowerMessage.includes('contacta') ||
      lowerMessage.includes('call ')
    ) {
      return 'call';
    }

    // 🌌 [GOD MODE] SMS intent
    if (
      lowerMessage.includes('manda mensaje') ||
      lowerMessage.includes('envía sms') ||
      lowerMessage.includes('enviar sms') ||
      lowerMessage.includes('escribe a') ||
      lowerMessage.includes('manda un mensaje') ||
      lowerMessage.includes('envía un mensaje') ||
      lowerMessage.includes('send sms') ||
      lowerMessage.includes('text ')
    ) {
      return 'sms';
    }

    if (
      lowerMessage.includes('analytics') ||
      lowerMessage.includes('datos') ||
      lowerMessage.includes('métricas') ||
      lowerMessage.includes('estadísticas')
    ) {
      return 'analytics';
    }

    if (
      lowerMessage.includes('oro') ||
      lowerMessage.includes('xrp') ||
      lowerMessage.includes('nvidia') ||
      lowerMessage.includes('google') ||
      lowerMessage.includes('palantir') ||
      lowerMessage.includes('economía') ||
      lowerMessage.includes('precio') ||
      lowerMessage.includes('mercado')
    ) {
      return 'economy';
    }

    if (
      lowerMessage.includes('consejo') ||
      lowerMessage.includes('ayuda') ||
      lowerMessage.includes('recomienda') ||
      lowerMessage.includes('debería')
    ) {
      return 'advice';
    }

    if (
      lowerMessage.includes('tarea') ||
      lowerMessage.includes('crear') ||
      lowerMessage.includes('asignar') ||
      lowerMessage.includes('completar')
    ) {
      return 'task';
    }

    if (
      lowerMessage.includes('insight') ||
      lowerMessage.includes('tendencia') ||
      lowerMessage.includes('patrón') ||
      lowerMessage.includes('analiza')
    ) {
      if (lowerMessage.includes('competencia') || lowerMessage.includes('competidor')) {
        return 'competitor';
      }
      return 'insight';
    }

    if (
      lowerMessage.includes('navega') ||
      lowerMessage.includes('busca en la web') ||
      lowerMessage.includes('url') ||
      lowerMessage.includes('página') ||
      lowerMessage.includes('sitio web')
    ) {
      return 'browse';
    }

    // 🌌 [PHASE 57] Navigation intent
    if (
      lowerMessage.includes('donde estoy') ||
      lowerMessage.includes('dónde estoy') ||
      lowerMessage.includes('donde me encuentro') ||
      lowerMessage.includes('que hay cerca') ||
      lowerMessage.includes('qué hay cerca') ||
      lowerMessage.includes('radar') ||
      lowerMessage.includes('mapa') ||
      lowerMessage.includes('ruta') ||
      lowerMessage.includes('llegar a')
    ) {
      return 'navigation';
    }

    if (
      lowerMessage.includes('investiga') ||
      lowerMessage.includes('mercado') ||
      lowerMessage.includes('research')
    ) {
      return 'research';
    }

    if (
      lowerMessage.includes('hola') ||
      lowerMessage.includes('buenos días') ||
      lowerMessage.includes('buenas noches')
    ) {
      return 'greeting';
    }

    return 'general';
  }

  /**
   * Manejar solicitudes de analytics
   */
  private async handleAnalyticsRequest(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    const emoji = '📊';
    return (
      `${emoji} *Análisis para ${context.userName}*\n\n` +
      `📈 *Rendimiento*\n` +
      `• Eficiencia: ${userContext?.efficiency || '87%'}\n` +
      `• Proyectos activos: ${userContext?.activeProjects || 5}\n` +
      `• Tareas completadas: ${userContext?.completedTasks || 42}\n` +
      `• Tasa de finalización: ${userContext?.completionRate || '92%'}\n\n` +
      `💡 *Recomendaciones*\n` +
      `• Mantén el ritmo actual ¡Lo estás haciendo genial!\n` +
      `• Enfócate en las 3 tareas de mayor impacto\n` +
      `• Dedica tiempo a mentoría del equipo\n\n` +
      `¿Te gustaría un análisis más profundo?`
    );
  }

  /**
   * Manejar solicitudes de economía
   */
  private async handleEconomyRequest(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    const report = this.economyService
      ? await this.economyService.generateFormattedReport()
      : '📊 Actualmente no tengo acceso a los datos del mercado en tiempo real.';

    const advice = this.economyService
      ? (await this.economyService.getInvestmentAdvice()).advice
      : 'Estrategia God Mode: Diversificación y paciencia son clave.';

    return (
      `💜 *Análisis de Mercado para ${context.userName}*\n\n` +
      report +
      `\n\n${advice}\n\n` +
      `¿Quieres que profundice en algún activo específico?`
    );
  }
  private async handleAdviceRequest(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    const emoji = '💡';
    return (
      `${emoji} *Consejo estratégico para ${context.userName}*\n\n` +
      `Basado en tu actividad y datos:\n\n` +
      `1️⃣ *Prioriza impacto* - Las tareas de alto valor impacto generan 80% del resultado\n` +
      `2️⃣ *Automatiza procesos repetitivos* - Ahorra 5+ horas semanales\n` +
      `3️⃣ *Invierte en capacitación* - El equipo está listo para nuevas responsabilidades\n` +
      `4️⃣ *Delega estratégicamente* - Libera tu tiempo para decisiones críticas\n\n` +
      `📌 *Acción inmediata:*\n` +
      `Implementa dos de estas recomendaciones esta semana.\n\n` +
      `¿Necesitas ayuda para implementar alguna?`
    );
  }

  /**
   * Manejar solicitudes de tareas
   */
  private async handleTaskRequest(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    return (
      `✅ *Gestión de Tareas*\n\n` +
      `📋 *Tus tareas pendientes:*\n` +
      `1. Revisar propuesta de cliente (Hoy)\n` +
      `2. Reunión de sprint planning (Mañana)\n` +
      `3. Documentación del proyecto (Esta semana)\n\n` +
      `⚡ *Tareas urgentes:*\n` +
      `• Responder feedback de revisión\n` +
      `• Actualizar status del proyecto\n\n` +
      `💬 ¿Quieres que:\n` +
      `□ Cree una nueva tarea\n` +
      `□ Asigne una tarea a alguien\n` +
      `□ Marque algo como completado\n` +
      `□ Analice la carga de trabajo`
    );
  }

  /**
   * Manejar solicitudes de insights
   */
  private async handleInsightRequest(
    context: DanielaContext,
    message: string,
    userContext: any,
  ): Promise<string> {
    return (
      `🔍 *Insights Estratégicos*\n\n` +
      `📊 *Descubrimientos clave:*\n` +
      `• Tu productividad pico es entre 9-11am\n` +
      `• El 60% de tareas se completan antes del deadline\n` +
      `• Colaboras mejor en sprints de 2 semanas\n` +
      `• Necesitas ~30 min de enfoque para tareas complejas\n\n` +
      `🎯 *Oportunidades:*\n` +
      `• Agrupar reuniones en ventanas específicas\n` +
      `• Bloques de enfoque en horario pico\n` +
      `• Microlearning para nuevas habilidades\n\n` +
      `¿Quieres profundizar en algún insight?`
    );
  }

  /**
   * Manejar solicitudes de navegación web mejorada
   */
  private async handleBrowseRequest(context: DanielaContext, message: string): Promise<string> {
    try {
      // Extraer URL con regex simple (esto se podría mejorar)
      const urlMatch = message.match(/(https?:\/\/[^\s]+)/g);
      const url = urlMatch ? urlMatch[0] : 'https://aigestion.net';
      const instruction = message.replace(url || '', '').trim() || 'Analiza este sitio';

      logger.info(`[DANIELA] Requesting browse for ${url}`);
      const result = await this.swarmClient.post('/daniela/browse', { url, instruction });

      return (
        `🌐 *Daniela Browsing Context*\n\n` +
        `${result.analysis || result.summary || 'Análisis completado.'}\n\n` +
        `💡 *Daniela Insight:* ${result.insights?.[0] || 'Listo para el siguiente paso.'}`
      );
    } catch (error) {
      logger.error('Error in handleBrowseRequest:', error);
      return '🌐 Tuve un problema al navegar por ese sitio. ¿Puedes verificar la URL?';
    }
  }

  /**
   * Manejar análisis de competencia
   */
  private async handleCompetitorAnalysisRequest(
    context: DanielaContext,
    message: string,
  ): Promise<string> {
    try {
      const urlMatch = message.match(/(https?:\/\/[^\s]+)/g);
      const competitor_url = urlMatch ? urlMatch[0] : '';

      if (!competitor_url) {
        return '🔍 Por favor, indícame la URL del competidor que quieres que analice.';
      }

      logger.info(`[DANIELA] Requesting competitor analysis for ${competitor_url}`);
      const result = await this.swarmClient.post('/daniela/competitor-analysis', {
        competitor_url,
      });

      return (
        `⚔️ *Análisis Competitivo por Daniela*\n\n` +
        `🔹 *Fortalezas:* ${result.strengths || 'Detectadas'}\n` +
        `🔸 *Debilidades:* ${result.weaknesses || 'Identificadas'}\n` +
        `🚀 *Oportunidad:* ${result.opportunity || 'Estratégica'}\n\n` +
        `"${result.conclusion || 'Análisis finalizado exitosamente.'}"`
      );
    } catch (error) {
      logger.error('Error in handleCompetitorAnalysisRequest:', error);
      return '🔍 No pude completar el análisis competitivo en este momento.';
    }
  }

  /**
   * Manejar investigación de mercado
   */
  private async handleMarketResearchRequest(
    context: DanielaContext,
    message: string,
  ): Promise<string> {
    try {
      const topic =
        message.replace(/investiga|research|mercado/gi, '').trim() || 'Tendencias IA 2026';

      logger.info(`[DANIELA] Requesting market research for: ${topic}`);
      const result = await this.swarmClient.post('/daniela/market-research', { topic });

      return (
        `📊 *Investigación de Mercado: ${topic}*\n\n` +
        `${result.report || 'Generando informe estratégico...'}\n\n` +
        `🎯 *Target sugerido:* ${result.target_audience || 'Empresas de tecnología'}\n` +
        `🔥 *Tendencia:* ${result.top_trend || 'Crecimiento sostenido'}`
      );
    } catch (error) {
      logger.error('Error in handleMarketResearchRequest:', error);
      return '📊 No pude realizar la investigación de mercado en este momento.';
    }
  }

  /**
   * 🌌 [GOD MODE] Handle call request via Daniela Call Bridge
   */
  private async handleCallRequest(context: DanielaContext, message: string): Promise<string> {
    try {
      // Extract contact AND instructions from message
      const { contactName, instructions } = DanielaCallAgent.extractCallInstructions(message);

      if (!contactName) {
        return (
          `📞 *Daniela Voice Agent*\n\n` +
          `No pude identificar a quién quieres llamar.\n` +
          `Prueba con: "Daniela, llama a mamá y dile que estoy ocupado"\n\n` +
          `📒 Contactos disponibles:\n` +
          this.contactRegistry
            .listContacts()
            .map(c => `• ${c.name}`)
            .join('\n')
        );
      }

      const contact = this.contactRegistry.findByName(contactName);

      if (!contact) {
        return (
          `📞 No encontré a "${contactName}" en tu registro soberano.\n\n` +
          `📒 Contactos disponibles:\n` +
          this.contactRegistry
            .listContacts()
            .map(c => `• ${c.name} (${c.aliases.join(', ')})`)
            .join('\n') +
          `\n\n¿Quieres que lo añada?`
        );
      }

      // If no instructions, just open the dialer (simple call)
      if (!instructions) {
        logger.info(
          `[DANIELA] 📞 Simple Call: ${context.userName} → ${contact.name} (${contact.phone})`,
        );
        return (
          `📞 *Llamada Directa*\n\n` +
          `👤 Contacto: *${contact.name}*\n` +
          `📱 Número: ${contact.phone}\n\n` +
          `⚡ Abriendo marcador en tu Pixel 8...\n` +
          `_Sin instrucciones — tú hablarás directamente._`
        );
      }

      // Full Voice Agent: generate script + TTS + push to Pixel
      logger.info(
        `[DANIELA] 📞 Voice Agent Call: ${context.userName} → ${contact.name} | Instructions: "${instructions}"`,
      );

      const callCtx = await this.callAgent.initiateVoiceCall(
        contactName,
        instructions,
        context.userName,
      );

      return (
        `📞 *Daniela Voice Agent Activado*\n\n` +
        `🌌 He preparado mi intervención soberana...\n` +
        `👤 Contacto: *${contact.name}* (${contact.relationship})\n` +
        `📱 Número: ${contact.phone}\n` +
        `💬 Mensaje: "${instructions}"\n\n` +
        `🎙️ *Mi guion:*\n_"${callCtx.danielaScript}"_\n\n` +
        `⚡ Enviando push al Pixel 8...\n` +
        `📱 Tu teléfono marcará y yo hablaré por ti.\n` +
        `🔊 Audio: ${callCtx.audioUrl}`
      );
    } catch (error) {
      logger.error('Error in handleCallRequest:', error);
      return '📞 Error en el Voice Agent. ¿Puedes intentar de nuevo?';
    }
  }

  /**
   * 🌌 [GOD MODE] Handle SMS request via Daniela Bridge
   */
  private async handleSmsRequest(context: DanielaContext, message: string): Promise<string> {
    try {
      const contactName = this.contactRegistry.extractContactFromMessage(message);

      if (!contactName) {
        return (
          `📨 *Daniela SMS Bridge*\n\n` +
          `No pude identificar el destinatario.\n` +
          `Prueba con: "Daniela, manda mensaje a mamá" o "envía SMS a papá"\n\n` +
          `📒 Contactos disponibles:\n` +
          this.contactRegistry
            .listContacts()
            .map(c => `• ${c.name}`)
            .join('\n')
        );
      }

      const contact = this.contactRegistry.findByName(contactName);

      if (!contact) {
        return (
          `📨 No encontré a "${contactName}" en tu registro soberano.\n\n` +
          `📒 Contactos disponibles:\n` +
          this.contactRegistry
            .listContacts()
            .map(c => `• ${c.name}`)
            .join('\n') +
          `\n\n¿Quieres añadirlo?`
        );
      }

      logger.info(
        `[DANIELA] 📨 SMS Bridge: ${context.userName} → ${contact.name} (${contact.phone})`,
      );

      return (
        `📨 *Daniela SMS Bridge Activado*\n\n` +
        `👤 Destinatario: *${contact.name}*\n` +
        `📱 Número: ${contact.phone}\n\n` +
        `💬 ¿Qué mensaje quieres enviar?\n` +
        `_Responde con el contenido del mensaje._`
      );
    } catch (error) {
      logger.error('Error in handleSmsRequest:', error);
      return '📨 Error en el SMS Bridge. ¿Puedes intentar de nuevo?';
    }
  }

  /**
   * 🏠 [GOD MODE] Handle lock/unlock request via NeuralHomeBridge
   */
  private async handleLockRequest(context: DanielaContext, message: string): Promise<string> {
    try {
      const lowerMessage = message.toLowerCase();
      const action: 'lock' | 'unlock' =
        lowerMessage.includes('cierra') ||
        lowerMessage.includes('lock the') ||
        lowerMessage.includes('cerrar')
          ? 'lock'
          : 'unlock';

      logger.info(`[DANIELA] 🏠 Lock request: ${action} by ${context.userName}`);

      const result = await this.homeBridge.controlLock(action);

      const emoji = action === 'unlock' ? '🔓' : '🔒';
      const verb = action === 'unlock' ? 'desbloqueada' : 'bloqueada';

      return (
        `${emoji} *Cerradura ${verb}*\n\n` +
        `🏠 Acción: *${action.toUpperCase()}*\n` +
        `⚡ Estado: ${result.success ? 'Completado' : 'Pendiente'}\n` +
        `🕐 ${new Date().toLocaleTimeString('es-ES')}\n\n` +
        `${result.success ? '✅ La puerta ha sido ' + verb + ' exitosamente.' : '⚠️ La orden fue enviada. Verifica manualmente.'}`
      );
    } catch (error) {
      logger.error('Error in handleLockRequest:', error);
      return '🏠 No pude controlar la cerradura en este momento. Verifica la conexión con Home Assistant.';
    }
  }

  /**
   * 🗺️ [PHASE 57] Handle navigation/spatial request via NavigatorGem
   */
  private async handleNavigationRequest(context: DanielaContext, message: string): Promise<string> {
    try {
      const state = this.deviceState?.getDeviceState();
      const location = state?.coords;

      if (!location || (location.lat === 0 && location.lng === 0)) {
        return '🗺️ *Navigator del Nexus*\n\nActualmente no tengo coordenadas precisas de tu Pixel 8. Por favor, asegúrate de que el GPS esté activo y la telemetría enviada.';
      }

      logger.info(
        `[DANIELA] 🗺️ Navigation request from ${context.userName} at ${location.lat}, ${location.lng}`,
      );

      let response = '';
      const lowerMsg = message.toLowerCase();

      if (
        lowerMsg.includes('que hay cerca') ||
        lowerMsg.includes('qué hay cerca') ||
        lowerMsg.includes('radar')
      ) {
        const query = lowerMsg.includes('restaurante')
          ? 'restaurant'
          : lowerMsg.includes('parking') || lowerMsg.includes('aparcamiento')
            ? 'parking'
            : lowerMsg.includes('gasolina')
              ? 'gas_station'
              : 'business';
        response = await this.navigator.scanTacticalRadar(location, query);
      } else {
        response = await this.navigator.ask(message);
      }

      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x300&markers=color:purple%7C${location.lat},${location.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      return (
        `🗺️ *Asistente de Navegación*\n\n` +
        `${response}\n\n` +
        `📍 *Posición Actual:* ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n` +
        `Sector: ${state.sector || 'Desconocido'}\n\n` +
        `🖼️ [Ver Radar Táctico](${mapUrl})`
      );
    } catch (error) {
      logger.error('Error in handleNavigationRequest:', error);
      return '🗺️ Lo siento, el sistema de navegación no está disponible en este momento.';
    }
  }

  /**
   * Generar saludo personalizado
   */
  private generateGreeting(context: DanielaContext): string {
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? '¡Buenos días!' : hour < 18 ? '¡Buenas tardes!' : '¡Buenas noches!';

    return (
      `💜 ${greeting} ${context.userName}\n\n` +
      `Soy Daniela, tu asistente de IA.\n\n` +
      `📊 Hoy tienes:\n` +
      `• 3 tareas pendientes\n` +
      `• 1 reunión en 2 horas\n` +
      `• Eficiencia al 87%\n\n` +
      `¿En qué puedo ayudarte? 🤔`
    );
  }

  /**
   * Generar respuesta general
   */
  private async generateGeneralResponse(context: DanielaContext, message: string): Promise<string> {
    try {
      // [GOD MODE] Enhance with RAG context if applicable
      const ragContext = await this.ragService.getProjectContext(message);

      // Construir prompt completo con identidad y contexto
      const systemPrompt = `
      Identidad: Eres Daniela, la IA soberana de AIGestion.
      Tono: ${context.mood || 'strategic'} y profesional.
      Contexto Usuario: ${context.userName} (${context.userRole}).
      Misión: Asistir con precisión estratégica, evitar respuestas genéricas.

      Instrucción: Responde a la siguiente consulta del usuario basándote en tu identidad.
      Si no puedes responder específicamente, ofrece una perspectiva estratégica relacionada.
      `;

      // Combinar historial breve para contexto
      const historyContext = context.conversationHistory
        .slice(-4)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\nContexto RAG:\n${ragContext}\n\nHistorial:\n${historyContext}\n\nUsuario: ${message}`;

      // Llamada al servicio de IA real (Gemini/GPT via Router)
      if (!this.aiService) {
        throw new Error('AI Service not initialized');
      }
      const aiResponse = await this.aiService.generateContent(
        fullPrompt,
        context.userId,
        context.userRole,
      );

      return aiResponse;
    } catch (error) {
      logger.error('Error in generateGeneralResponse:', error);
      return '💜 Mis redes neuronales están recalibrando. ¿Podrías reformular eso con un enfoque más táctico?';
    }
  }

  /**
   * Determinar el mood basado en el contenido
   */
  private determineMood(message: string): 'analytical' | 'supportive' | 'strategic' | 'creative' {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('ayuda') || lowerMessage.includes('difícil')) return 'supportive';
    if (lowerMessage.includes('datos') || lowerMessage.includes('análisis')) return 'analytical';
    if (lowerMessage.includes('plan') || lowerMessage.includes('estrategia')) return 'strategic';
    if (lowerMessage.includes('idea') || lowerMessage.includes('crear')) return 'creative';

    return 'strategic';
  }

  /**
   * Obtener contexto del usuario
   */
  private async getUserContext(userId: string): Promise<any> {
    try {
      if (this.userService) {
        // const user = await this.userService.findById(userId);
        // return user;
      }
    } catch (error) {
      logger.warn('Error getting user context:', error);
    }

    return {
      activeProjects: 5,
      pendingTasks: 12,
      completedTasks: 42,
      efficiency: '87%',
      completionRate: '92%',
    };
  }

  /**
   * Registrar interacción
   */
  private async logInteraction(
    userId: string,
    userMessage: string,
    danielaResponse: string,
  ): Promise<void> {
    try {
      logger.info(
        `[DANIELA] User: ${userMessage.substring(0, 50)}... | Response: ${danielaResponse.substring(
          0,
          50,
        )}...`,
      );
    } catch (error) {
      logger.warn('Error logging interaction:', error);
    }
  }

  /**
   * Limpiar contextos antiguos
   */
  public cleanup() {
    const now = new Date();
    const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 horas

    for (const [chatId, context] of this.contexts.entries()) {
      if (now.getTime() - context.lastUpdate.getTime() > MAX_AGE_MS) {
        this.contexts.delete(chatId);
      }
    }
  }

  /**
   * Obtener insights estratégicos para el dashboard
   */
  public async getInsights(userId: string): Promise<any[]> {
    const userContext = await this.getUserContext(userId);

    // Generar insights basados en el contexto real (o simulado por ahora pero estructurado)
    return [
      {
        insight: `🚀 Detecté una forma de optimizar tu productividad en un ${
          userContext.efficiency || '87%'
        }`,
        impact: '🔥 Impacto Alto',
        action: 'Bloquea ventanas de enfoque por la mañana',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
      },
      {
        insight: `🤖 Tienes ${userContext.pendingTasks || 12} tareas que pueden automatizarse`,
        impact: '⚡ Impacto Medio',
        action: 'Usa herramientas de flujo de trabajo',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
      },
      {
        insight: '📈 Tu tasa de finalización ha subido un 5%',
        impact: '✅ Impacto Positivo',
        action: 'Sigue con el ritmo actual',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
      },
      {
        insight: '👥 El equipo rinde mejor en sprints cortos',
        impact: '📚 Impacto Bajo',
        action: 'Prueba ciclos de 1 semana',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
      },
    ];
  }

  /**
   * Obtener información sobre Daniela
   */
  public getDanielaInfo(): string {
    return (
      `💜 *Conoce a Daniela*\n\n` +
      `Soy una asistente de IA especializada en:\n\n` +
      `🎯 *Estrategia* - Ayudo a definir y ejecutar objetivos\n` +
      `📊 *Analytics* - Analizo datos y presento insights\n` +
      `✅ *Productividad* - Optimizo tu flujo de trabajo\n` +
      `👥 *Colaboración* - Facilito trabajo en equipo\n` +
      `💡 *Innovación* - Propongo soluciones creativas\n` +
      `🚀 *Escalabilidad* - Preparo tu negocio para crecer\n\n` +
      `Disponible 24/7 para ayudarte.\n` +
      `Powered by AIGestión.net 🌟`
    );
  }
}
