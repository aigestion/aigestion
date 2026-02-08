import fs from 'fs/promises';
import { inject, injectable } from 'inversify';
import path from 'path';
import { env } from '../config/env.schema';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { AIService } from './ai.service';
import { AnalyticsService } from './analytics.service';
import { ElevenLabsService } from './elevenlabs.service';
import { MetaverseService } from './metaverse.service';
import { QwenTTSService } from './qwen-tts.service';

interface ConversationMessage {
  id: string;
  text: string;
  speaker: 'daniela' | 'client';
  timestamp: Date;
  emotion?: string;
  confidence?: number;
}

interface EmotionalAnalysis {
  emotion: string;
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}

interface ConversationContext {
  messages: ConversationMessage[];
  emotionalHistory: EmotionalAnalysis[];
  clientProfile: {
    preferences: string[];
    previousTopics: string[];
    interactionStyle: string;
  };
}

interface SuggestedAction {
  id: string;
  text: string;
  type: 'response' | 'action' | 'question';
  priority: 'high' | 'medium' | 'low';
  context: string;
}

@injectable()
export class EnhancedVoiceService {
  private conversationContexts = new Map<string, ConversationContext>();

  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService,
    @inject(TYPES.MetaverseService) private metaverseService: MetaverseService,
    @inject(TYPES.ElevenLabsService) private elevenLabsService: ElevenLabsService,
    @inject(TYPES.QwenTTSService) private qwenTTSService: QwenTTSService,
  ) {}

  /**
   * Process conversation with emotional analysis and contextual responses
   */
  async processConversation(payload: {
    audio?: Buffer;
    text?: string;
    sessionId: string;
    userId: string;
  }): Promise<{
    transcription?: string;
    emotionalAnalysis?: EmotionalAnalysis;
    response: string;
    audioResponse?: Buffer;
    suggestedActions: SuggestedAction[];
    context: ConversationContext;
  }> {
    try {
      // Get or create conversation context
      const context = this.getOrCreateContext(payload.sessionId, payload.userId);

      // Process input (audio or text)
      let transcription = payload.text;
      if (payload.audio) {
        transcription = await this.transcribeAudio(payload.audio);
      }

      if (!transcription) {
        throw new Error('No input provided');
      }

      // Analyze emotion and sentiment
      const emotionalAnalysis = await this.analyzeEmotion(transcription, context);

      // Add message to context
      context.messages.push({
        id: Date.now().toString(),
        text: transcription,
        speaker: 'client',
        timestamp: new Date(),
        emotion: emotionalAnalysis.emotion,
        confidence: emotionalAnalysis.confidence,
      });

      // Generate contextual response
      const response = await this.generateContextualResponse(
        transcription,
        emotionalAnalysis,
        context,
      );

      // Convert response to audio
      const audioResponse = await this.textToSpeech(response);

      // Generate suggested actions
      const suggestedActions = await this.generateSuggestedActions(
        transcription,
        emotionalAnalysis,
        context,
      );

      // Add Daniela's response to context
      context.messages.push({
        id: (Date.now() + 1).toString(),
        text: response,
        speaker: 'daniela',
        timestamp: new Date(),
        emotion: 'professional',
      });

      // Update emotional history
      context.emotionalHistory.push(emotionalAnalysis);

      // Update conversation context
      this.conversationContexts.set(payload.sessionId, context);

      return {
        transcription,
        emotionalAnalysis,
        response,
        audioResponse,
        suggestedActions,
        context,
      };
    } catch (error) {
      logger.error(error, '[EnhancedVoiceService] Error processing conversation');
      throw error;
    }
  }

  /**
   * Transcribe audio to text using enhanced speech recognition
   */
  private async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // Implementation with Google Cloud Speech-to-Text or similar
      // For now, return mock transcription
      logger.info('[EnhancedVoiceService] Transcribing audio...');

      // TODO: Implement actual speech-to-text
      return 'Audio transcribed successfully';
    } catch (error) {
      logger.error(error, '[EnhancedVoiceService] Error transcribing audio');
      throw error;
    }
  }

  /**
   * Analyze emotional content of the message
   */
  private async analyzeEmotion(
    text: string,
    context: ConversationContext,
  ): Promise<EmotionalAnalysis> {
    try {
      const prompt = `
        Analiza el siguiente mensaje y determina la emoción principal del hablante.
        Considera el contexto de la conversación previa si existe.

        Mensaje: "${text}"
        Contexto previo: ${context.messages
          .slice(-3)
          .map(m => m.text)
          .join(' | ')}

        Responde en formato JSON:
        {
          "emotion": "happy|concerned|excited|professional|neutral",
          "confidence": 0.0-1.0,
          "sentiment": "positive|negative|neutral",
          "suggestions": ["suggestion1", "suggestion2"]
        }
      `;

      const analysisText = await this.aiService.generateContent(prompt);

      try {
        const analysis = JSON.parse(analysisText);
        return {
          emotion: analysis.emotion || 'neutral',
          confidence: analysis.confidence || 0.5,
          sentiment: analysis.sentiment || 'neutral',
          suggestions: analysis.suggestions || [],
        };
      } catch {
        // Fallback if JSON parsing fails
        return {
          emotion: 'neutral',
          confidence: 0.5,
          sentiment: 'neutral',
          suggestions: [],
        };
      }
    } catch (error) {
      logger.error(error, '[EnhancedVoiceService] Error analyzing emotion');
      return {
        emotion: 'neutral',
        confidence: 0.5,
        sentiment: 'neutral',
        suggestions: [],
      };
    }
  }

  /**
   * Generate contextual response based on emotion and conversation history
   */
  private async generateContextualResponse(
    text: string,
    emotionalAnalysis: EmotionalAnalysis,
    context: ConversationContext,
  ): Promise<string> {
    try {
      const systemPrompt = `
        Eres Daniela, una asistente de IA futurista y empática de AIGestion.

        Directrices:
        - Adapta tu tono según la emoción detectada: ${emotionalAnalysis.emotion}
        - Mantén un perfil profesional pero cercano
        - Usa el contexto de la conversación para respuestas coherentes
        - Sé proactiva y ofrece soluciones cuando sea apropiado
        - Mantén las respuestas concisas pero informativas

        Emoción detectada: ${emotionalAnalysis.emotion} (${emotionalAnalysis.confidence}% de confianza)
        Sentimiento: ${emotionalAnalysis.sentiment}
      `;

      const conversationHistory = context.messages.map(msg => ({
        role: msg.speaker === 'daniela' ? ('assistant' as const) : ('user' as const),
        content: msg.text,
      }));

      const response = await this.aiService.streamChat({
        prompt: text,
        history: conversationHistory,
        userId: context.messages[0]?.id || 'unknown',
        userRole: 'premium',
      });

      // For now, return a mock response
      // TODO: Implement actual streaming response handling
      return this.generateResponseBasedOnEmotion(text, emotionalAnalysis);
    } catch (error) {
      logger.error(error, '[EnhancedVoiceService] Error generating response');
      return 'Entendido. ¿En qué más puedo ayudarte?';
    }
  }

  /**
   * Generate response based on emotional analysis
   */
  private generateResponseBasedOnEmotion(text: string, analysis: EmotionalAnalysis): string {
    const responses = {
      happy: [
        '¡Me alegra escuchar eso! ¿Hay algo específico en lo que pueda ayudarte para mantener este momento positivo?',
        '¡Excelente! Tu energía es contagiosa. ¿Qué proyecto emocionante tienes en mente?',
      ],
      concerned: [
        'Entiendo tu preocupación. Estoy aquí para ayudarte a encontrar la mejor solución.',
        'Detecto que podría haber algún desafío. Permíteme ayudarte a analizar la situación.',
      ],
      excited: [
        '¡Siento tu entusiasmo! Acompáñame en esta emocionante jornada tecnológica.',
        'Tu energía es fantástica. ¿Qué innovación te tiene tan motivado?',
      ],
      professional: [
        'Comprendido. Procederé con análisis profesional de tu solicitud.',
        'Recibido. Analizando los parámetros para proporcionar la respuesta óptima.',
      ],
      neutral: [
        'Entendido. ¿En qué puedo asistirte específicamente?',
        'Recibido. Estoy lista para ayudarte con lo que necesites.',
      ],
    };

    const emotionResponses =
      responses[analysis.emotion as keyof typeof responses] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  }

  /**
   * Convert text to speech using ElevenLabs or Qwen3
   */
  public async textToSpeech(
    text: string,
    provider: 'elevenlabs' | 'qwen' = 'qwen',
  ): Promise<Buffer> {
    try {
      const tempPath = path.join(process.cwd(), 'uploads', 'voice', `${Date.now()}.mp3`);

      let audioPath: string;
      if (provider === 'qwen') {
        audioPath = await this.qwenTTSService.textToSpeech(text, tempPath);
      } else {
        // Fallback to ElevenLabs if needed
        audioPath = await this.elevenLabsService.textToSpeech(
          text,
          env.ELEVENLABS_VOICE_ID || '',
          tempPath,
        );
      }

      const audioBuffer = await fs.readFile(audioPath);

      // Cleanup temp file (optional, depends on if we want to stream or cache)
      // await fs.unlink(audioPath);

      return audioBuffer;
    } catch (error) {
      logger.error(error, '[EnhancedVoiceService] Error converting text to speech');
      // If one fails, try the other as fallback
      if (provider === 'qwen' && env.ELEVENLABS_API_KEY) {
        logger.info('[EnhancedVoiceService] Falling back to ElevenLabs...');
        return this.textToSpeech(text, 'elevenlabs');
      }
      throw error;
    }
  }

  /**
   * Generate suggested actions based on context
   */
  private async generateSuggestedActions(
    text: string,
    emotionalAnalysis: EmotionalAnalysis,
    context: ConversationContext,
  ): Promise<SuggestedAction[]> {
    const actions: SuggestedAction[] = [];

    // Analyze text for common patterns
    if (text.toLowerCase().includes('dashboard') || text.toLowerCase().includes('mostrar')) {
      actions.push({
        id: 'dashboard',
        text: 'Mostrar dashboard principal',
        type: 'action',
        priority: 'high',
        context: 'visualization',
      });
    }

    if (text.toLowerCase().includes('analizar') || text.toLowerCase().includes('métrica')) {
      actions.push({
        id: 'analytics',
        text: 'Analizar métricas de rendimiento',
        type: 'action',
        priority: 'high',
        context: 'analytics',
      });
    }

    if (emotionalAnalysis.emotion === 'concerned') {
      actions.push({
        id: 'support',
        text: '¿Necesitas ayuda técnica?',
        type: 'question',
        priority: 'medium',
        context: 'support',
      });
    }

    // Add contextual suggestions based on conversation history
    if (context.messages.length > 3) {
      actions.push({
        id: 'summary',
        text: 'Resumir nuestra conversación',
        type: 'response',
        priority: 'low',
        context: 'summary',
      });
    }

    return actions.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Get or create conversation context
   */
  private getOrCreateContext(sessionId: string, userId: string): ConversationContext {
    if (!this.conversationContexts.has(sessionId)) {
      this.conversationContexts.set(sessionId, {
        messages: [],
        emotionalHistory: [],
        clientProfile: {
          preferences: [],
          previousTopics: [],
          interactionStyle: 'professional',
        },
      });
    }
    return this.conversationContexts.get(sessionId)!;
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(sessionId: string): Promise<ConversationContext | null> {
    return this.conversationContexts.get(sessionId) || null;
  }

  /**
   * Clear conversation context
   */
  async clearConversation(sessionId: string): Promise<void> {
    this.conversationContexts.delete(sessionId);
  }
}
