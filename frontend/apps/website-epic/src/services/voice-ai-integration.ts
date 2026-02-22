/**
 * Voice AI Integration Service
 * Combines ElevenLabs, Vapi, and Twilio for complete voice AI functionality
 */

import { elevenLabsService, ElevenLabsTTSRequest } from './elevenlabs';
import { TwilioMessage, twilioService } from './twilio';
import { VapiAssistant, vapiService } from './vapi';

export interface VoiceAIConfig {
  elevenLabs: {
    defaultVoiceId: string;
    modelId: string;
    voiceSettings: {
      stability: number;
      similarity_boost: number;
      style: number;
      use_speaker_boost: boolean;
    };
  };
  vapi: {
    defaultAssistantId?: string;
    model: {
      provider: 'openai' | 'anthropic' | 'google';
      model: string;
      temperature: number;
      maxTokens: number;
    };
  };
  twilio: {
    defaultFromNumber: string;
    accountSid: string;
  };
}

export interface VoiceMessage {
  id: string;
  text: string;
  voiceUrl?: string;
  duration?: number;
  timestamp: string;
  platform: 'elevenlabs' | 'vapi' | 'twilio';
  status: 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export interface VoiceCallSession {
  id: string;
  assistantId: string;
  phoneNumber: string;
  status: 'initiated' | 'active' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  transcript?: string;
  summary?: string;
  messages: VoiceMessage[];
  cost?: number;
  metadata?: Record<string, any>;
}

class VoiceAIIntegrationService {
  private config: VoiceAIConfig;
  private activeSessions: Map<string, VoiceCallSession> = new Map();

  constructor() {
    this.config = {
      elevenLabs: {
        defaultVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
        modelId: 'eleven_monolingual_v1',
        voiceSettings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      },
      vapi: {
        model: {
          provider: 'openai',
          model: 'gpt-4-turbo-preview',
          temperature: 0.7,
          maxTokens: 1000,
        },
      },
      twilio: {
        defaultFromNumber: '+15017122661', // Default Twilio number
        accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
      },
    };
  }

  /**
   * Initialize the voice AI system
   */
  async initialize(): Promise<void> {
    try {
      // Test API connections
      await this.testConnections();

      // Create default Daniela assistant if not exists
      await this.ensureDanielaAssistant();

      console.log('Voice AI Integration initialized successfully');
    } catch (error) {
      console.error('Error initializing Voice AI Integration:', error);
      throw error;
    }
  }

  /**
   * Test all API connections
   */
  private async testConnections(): Promise<void> {
    const tests = [
      {
        name: 'ElevenLabs',
        test: () => elevenLabsService.getVoices(),
      },
      {
        name: 'Vapi',
        test: () => vapiService.getAssistants(),
      },
      {
        name: 'Twilio',
        test: () => twilioService.getAccountInfo(),
      },
    ];

    for (const { name, test } of tests) {
      try {
        await test();
        console.log(`✅ ${name} API connection successful`);
      } catch (error) {
        console.error(`❌ ${name} API connection failed:`, error);
        throw new Error(`${name} API connection failed`);
      }
    }
  }

  /**
   * Ensure Daniela assistant exists
   */
  private async ensureDanielaAssistant(): Promise<VapiAssistant> {
    try {
      const assistants = await vapiService.getAssistants();
      let danielaAssistant = assistants.find(a => a.name === 'Daniela AI');

      if (!danielaAssistant) {
        danielaAssistant = await vapiService.createDanielaAssistant();
        this.config.vapi.defaultAssistantId = danielaAssistant.id;
        console.log('✅ Created Daniela AI assistant');
      } else {
        this.config.vapi.defaultAssistantId = danielaAssistant.id;
        console.log('✅ Found existing Daniela AI assistant');
      }

      return danielaAssistant;
    } catch (error) {
      console.error('Error ensuring Daniela assistant:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  async textToSpeech(text: string, options?: Partial<ElevenLabsTTSRequest>): Promise<VoiceMessage> {
    const messageId = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const request: ElevenLabsTTSRequest = {
        text,
        voice_id: options?.voice_id || this.config.elevenLabs.defaultVoiceId,
        model_id: options?.model_id || this.config.elevenLabs.modelId,
        voice_settings: options?.voice_settings || this.config.elevenLabs.voiceSettings,
      };

      const startTime = Date.now();
      const response = await elevenLabsService.textToSpeech(request);
      const duration = Date.now() - startTime;

      // Convert audio to blob URL for playback
      const blob = elevenLabsService.audioBufferToBlob(response.audio);
      const voiceUrl = URL.createObjectURL(blob);

      const voiceMessage: VoiceMessage = {
        id: messageId,
        text,
        voiceUrl,
        duration,
        timestamp: new Date().toISOString(),
        platform: 'elevenlabs',
        status: 'completed',
        metadata: {
          voiceId: request.voice_id,
          modelId: request.model_id,
          voiceSettings: request.voice_settings,
          contentType: response.content_type,
        },
      };

      return voiceMessage;
    } catch (error) {
      console.error('Error in text-to-speech:', error);

      return {
        id: messageId,
        text,
        timestamp: new Date().toISOString(),
        platform: 'elevenlabs',
        status: 'failed',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  /**
   * Start a voice call session with AI assistant
   */
  async startVoiceCall(phoneNumber: string, assistantId?: string): Promise<VoiceCallSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assistant = assistantId || this.config.vapi.defaultAssistantId;

    if (!assistant) {
      throw new Error('No assistant ID provided and no default assistant configured');
    }

    try {
      // Start Vapi call
      const vapiCall = await vapiService.makePhoneCall({
        assistantId: assistant,
        phoneNumber,
      });

      const session: VoiceCallSession = {
        id: sessionId,
        assistantId: assistant,
        phoneNumber,
        status: 'initiated',
        startTime: new Date().toISOString(),
        messages: [],
        metadata: {
          vapiCallId: vapiCall.id,
        },
      };

      this.activeSessions.set(sessionId, session);

      // Start monitoring the call
      this.monitorCallSession(sessionId, vapiCall.id);

      return session;
    } catch (error) {
      console.error('Error starting voice call:', error);
      throw error;
    }
  }

  /**
   * Monitor a call session for updates
   */
  private async monitorCallSession(sessionId: string, vapiCallId: string): Promise<void> {
    const checkInterval = setInterval(async () => {
      try {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
          clearInterval(checkInterval);
          return;
        }

        const call = await vapiService.getCall(vapiCallId);

        if (call.status === 'completed' || call.status === 'ended' || call.status === 'failed') {
          session.status = call.status === 'completed' ? 'completed' : 'failed';
          session.endTime = call.endedAt || new Date().toISOString();
          session.duration = call.duration || 0;
          session.transcript = call.transcript || '';
          session.summary = call.summary || '';
          session.cost = call.cost || 0;

          clearInterval(checkInterval);
          console.log(`Call session ${sessionId} completed`);
        } else if (call.status === 'in-progress' && session.status === 'initiated') {
          session.status = 'active';
        }
      } catch (error) {
        console.error(`Error monitoring call session ${sessionId}:`, error);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Send SMS with voice message
   */
  async sendVoiceSMS(
    to: string,
    message: string,
    includeVoiceLink: boolean = true
  ): Promise<TwilioMessage> {
    try {
      let fullMessage = message;

      if (includeVoiceLink) {
        // Generate voice version of the message
        const voiceMessage = await this.textToSpeech(message);

        // Create a temporary endpoint for the voice file
        const voiceLink = `https://aigestion.net/api/voice/${voiceMessage.id}`;
        fullMessage = `${message}\n\n🎵 Escucha este mensaje en voz: ${voiceLink}`;
      }

      return await twilioService.sendSMS(to, this.config.twilio.defaultFromNumber, fullMessage);
    } catch (error) {
      console.error('Error sending voice SMS:', error);
      throw error;
    }
  }

  /**
   * Send WhatsApp message with voice
   */
  async sendVoiceWhatsApp(
    to: string,
    message: string,
    includeVoiceClip: boolean = true
  ): Promise<TwilioMessage> {
    try {
      const whatsappMessage = {
        to,
        from: `whatsapp:${this.config.twilio.defaultFromNumber}`,
        body: message,
      };

      if (includeVoiceClip) {
        // Generate voice version and upload as media
        // In a real implementation, you would upload the voice file to a storage service
        // and include the URL in the mediaUrl array
        // For now, we'll just send the text message
        console.log('Voice clip generation skipped for demo');
      }

      return await twilioService.sendWhatsApp(whatsappMessage);
    } catch (error) {
      console.error('Error sending voice WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Get active call sessions
   */
  getActiveSessions(): VoiceCallSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): VoiceCallSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * End a call session
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    try {
      if (session.metadata?.vapiCallId) {
        await vapiService.endCall(session.metadata.vapiCallId);
      }

      session.status = 'completed';
      session.endTime = new Date().toISOString();

      if (session.startTime) {
        const start = new Date(session.startTime).getTime();
        const end = new Date().getTime();
        session.duration = Math.floor((end - start) / 1000);
      }
    } catch (error) {
      console.error(`Error ending session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Create a custom voice assistant
   */
  async createCustomAssistant(config: {
    name: string;
    description: string;
    firstMessage: string;
    voiceId?: string;
    knowledgeBase?: string[];
  }): Promise<VapiAssistant> {
    try {
      const assistantConfig = {
        name: config.name,
        description: config.description,
        firstMessage: config.firstMessage,
        model: this.config.vapi.model,
        voice: {
          provider: 'elevenlabs' as const,
          voiceId: config.voiceId || this.config.elevenLabs.defaultVoiceId,
        },
        knowledgeBase: config.knowledgeBase || [],
      };

      return await vapiService.createAssistant(assistantConfig);
    } catch (error) {
      console.error('Error creating custom assistant:', error);
      throw error;
    }
  }

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<{
    elevenLabs: { voicesAvailable: number; userQuota?: any };
    vapi: { assistantsCount: number; activeCalls: number; accountInfo?: any };
    twilio: { phoneNumbersCount: number; accountStatus: string };
    integration: { activeSessions: number; totalMessages: number };
  }> {
    try {
      const [voices, assistants, calls, phoneNumbers, accountInfo] = await Promise.all([
        elevenLabsService.getVoices(),
        vapiService.getAssistants(),
        vapiService.getCalls(10),
        twilioService.getPhoneNumbers(),
        twilioService.getAccountInfo(),
      ]);

      return {
        elevenLabs: {
          voicesAvailable: voices.length,
        },
        vapi: {
          assistantsCount: assistants.length,
          activeCalls: calls.filter(c => c.status === 'in-progress').length,
        },
        twilio: {
          phoneNumbersCount: phoneNumbers.length,
          accountStatus: accountInfo.status,
        },
        integration: {
          activeSessions: this.activeSessions.size,
          totalMessages: Array.from(this.activeSessions.values()).reduce(
            (total, session) => total + session.messages.length,
            0
          ),
        },
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }

  /**
   * Play voice message in browser
   */
  async playVoiceMessage(voiceMessage: VoiceMessage): Promise<void> {
    if (!voiceMessage.voiceUrl) {
      throw new Error('Voice message has no audio URL');
    }

    try {
      const audio = new Audio(voiceMessage.voiceUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing voice message:', error);
      throw error;
    }
  }

  /**
   * Download voice message
   */
  downloadVoiceMessage(voiceMessage: VoiceMessage, filename?: string): void {
    if (!voiceMessage.voiceUrl) {
      throw new Error('Voice message has no audio URL');
    }

    const a = document.createElement('a');
    a.href = voiceMessage.voiceUrl;
    a.download = filename || `voice_${voiceMessage.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Revoke object URLs to prevent memory leaks
    this.activeSessions.forEach(session => {
      session.messages.forEach(message => {
        if (message.voiceUrl) {
          URL.revokeObjectURL(message.voiceUrl);
        }
      });
    });

    this.activeSessions.clear();
  }
}

// Export singleton instance
export const voiceAIIntegration = new VoiceAIIntegrationService();

// Export types for external use
export type { VoiceAIIntegrationService };
