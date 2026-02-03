/**
 * Voice AI God Mode Integration - AIGestion.net
 * Sistema completo nivel dios con voz española optimista, elegante y clara
 * Configuración gratuita optimizada al máximo
 */

import { elevenLabsGodModeConfig } from './elevenlabs-config';
import { vapiGodModeConfig } from './vapi-config';
import { twilioGodModeConfig } from './twilio-config';

// Perfiles de voz españoles optimizados
export const spanishVoiceProfiles = {
  daniela: {
    name: 'Daniela IA',
    description: 'Asistente principal - Voz optimista, elegante y clara',
    personality: { tone: 'optimista', energy: 'media', warmth: 85, clarity: 95 },
    language: { primary: 'es-ES', accent: 'neutral', formality: 'semiformal' },
  },
  soporte: {
    name: 'Soporte Técnico',
    description: 'Asistente especializado - Voz profesional y clara',
    personality: { tone: 'profesional', energy: 'baja', warmth: 70, clarity: 98 },
    language: { primary: 'es-ES', accent: 'neutral', formality: 'semiformal' },
  },
};

// Sistema principal Voice AI God Mode
export class VoiceAIGodMode {
  private config = {
    elevenlabs: elevenLabsGodModeConfig,
    vapi: vapiGodModeConfig,
    twilio: twilioGodModeConfig,
  };

  async initialize(): Promise<void> {
    console.log('🚀 Inicializando Voice AI God Mode para AIGestion.net...');
    await this.validateConfigurations();
    await this.optimizeForFreeUsage();
    console.log('✅ Voice AI God Mode listo - Voz española optimista y elegante');
  }

  private async validateConfigurations(): Promise<void> {
    // Validar ElevenLabs
    if (!this.config.elevenlabs.api_key) {
      throw new Error('API Key de ElevenLabs no configurada');
    }

    // Validar Vapi
    if (!this.config.vapi.api_keys.public) {
      throw new Error('API Keys de Vapi no configuradas');
    }

    // Validar Twilio
    if (!this.config.twilio.account.sid) {
      throw new Error('Credenciales de Twilio no configuradas');
    }
  }

  private async optimizeForFreeUsage(): Promise<void> {
    // Optimizar ElevenLabs para plan gratuito
    this.config.elevenlabs.optimization.output_format = 'mp3_22050_32';
    this.config.elevenlabs.optimization.compression = 'high';
    this.config.elevenlabs.optimization.caching = true;

    // Optimizar Vapi
    this.config.vapi.assistants.primary.model.max_tokens = 600;

    // Optimizar Twilio
    this.config.twilio.messaging.optimization.max_length = 160;
    this.config.twilio.voice.call_routing.business_hours.sunday = {
      start: 'closed',
      end: 'closed'
    };
  }

  async generateSpanishMessage(text: string): Promise<string> {
    const optimized = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\sáéíóúñü¿¡.,!?]/g, '')
      .trim();

    return optimized.length > 200 ? optimized.substring(0, 197) + '...' : optimized;
  }

  getDanielaConfig() {
    return {
      voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella - perfecta para español de España
      settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.65,
        use_speaker_boost: true,
      },
      messages: {
        greeting: '¡Hola! Soy Daniela, tu asistente de AIGestion. ¿En qué puedo ayudarte?',
        help: 'Puedo ayudarte con análisis de datos, automatización y optimización.',
        thanks: '¡Gracias por usar AIGestion! Estoy aquí para lo que necesites.',
      }
    };
  }

  getOptimizationStats() {
    return {
      elevenlabs: {
        monthly_limit: 10000,
        daily_limit: 333,
        cost_per_char: 0.0001,
      },
      vapi: {
        free_minutes: 100,
        max_duration: 300,
        cost_per_minute: 0.05,
      },
      twilio: {
        free_sms: 100,
        cost_per_sms: 0.0079,
        cost_per_minute: 0.013,
      }
    };
  }
}

export const voiceAIGodMode = new VoiceAIGodMode();
