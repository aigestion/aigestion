import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger as untypedLogger } from '../utils/logger';

interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

const logger = untypedLogger as Logger;

/**
 * 🌌 [GOD MODE] Vapi Service
 * Resilient integration with Vapi.ai for sovereign voice orchestration.
 */

export interface VapiCall {
  id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended';
  type: 'inbound' | 'outbound';
  toNumber: string;
  fromNumber?: string;
}

export interface VapiAssistant {
  id: string;
  name: string;
  model: {
    provider: string;
    model: string;
    messages: { role: string; content: string }[];
  };
}

@injectable()
export class VapiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = env.VAPI_API_KEY || '';
    this.baseUrl = env.VAPI_API_URL || 'https://api.vapi.ai';
  }

  /**
   * 🚀 Create an outbound call using Vapi
   */
  async createCall(toNumber: string, assistantId: string): Promise<VapiCall> {
    try {
      logger.info(`[VapiService] 🌌 Initiating voice call to: ${toNumber}`);

      const response = await axios.post(
        `${this.baseUrl}/call/phone`,
        {
          phoneNumberId: env.VAPI_PHONE_NUMBER_ID,
          assistantId: assistantId,
          customer: { number: toNumber },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data as VapiCall;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      logger.error('[VapiService] Call creation failed', data || message);
      throw error;
    }
  }

  /**
   * 🤖 Create a new assistant configuration
   */
  async createAssistant(name: string, systemPrompt: string): Promise<VapiAssistant> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/assistant`,
        {
          name,
          model: {
            provider: 'openai',
            model: 'gpt-3.5-turbo', // Default resilient model
            messages: [{ role: 'system', content: systemPrompt }],
          },
          transcriber: { provider: 'deepgram', model: 'nova-2', language: 'es' },
          voice: { provider: 'elevenlabs', voiceId: 'daniela' }, // Placeholder for Nexus voice
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data as VapiAssistant;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      logger.error('[VapiService] Assistant creation failed', data || message);
      throw error;
    }
  }

  /**
   * 📋 Update an existing assistant's configuration (System Prompt flow)
   */
  async updateAssistant(assistantId: string, config: Partial<VapiAssistant>): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/assistant/${assistantId}`, config, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      logger.info(`[VapiService] Assistant ${assistantId} updated with new sovereign context`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      logger.error('[VapiService] Assistant update failed', data || message);
    }
  }

  /**
   * 🏥 Health Check
   */
  async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/me`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return true;
    } catch (error) {
      logger.error('[VapiService] Health check failed', error);
      return false;
    }
  }
}
