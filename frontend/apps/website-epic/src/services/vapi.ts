/**
 * Vapi Voice AI API Service
 * Provides voice AI assistant capabilities with phone integration
 */

export interface VapiAssistant {
  id: string;
  name: string;
  model: {
    provider: 'openai' | 'anthropic' | 'google';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  voice: {
    provider: 'elevenlabs' | 'playht' | 'deepgram';
    voiceId: string;
  };
  firstMessage: string;
  description?: string;
  knowledgeBase?: string[];
  serverUrl?: string;
  serverMessages?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export interface VapiCall {
  id: string;
  assistantId: string;
  phoneNumber?: string;
  customerNumber?: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed' | 'ended';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  cost?: number;
  transcript?: string;
  summary?: string;
  analysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    topics: string[];
    keyPoints: string[];
  };
}

export interface VapiPhoneCall {
  assistantId: string;
  phoneNumber: string;
  customerNumber?: string;
  serverUrl?: string;
  serverMessages?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export interface VapiWebhookEvent {
  type: 'call.started' | 'call.ended' | 'call.transcript' | 'call.analysis' | 'call.error';
  call: VapiCall;
  timestamp: string;
}

class VapiService {
  private privateKey: string;
  private publicKey: string;
  private baseURL = 'https://api.vapi.ai';

  constructor() {
    this.privateKey = import.meta.env.VITE_VAPI_PRIVATE_KEY || '';
    this.publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '';

    if (!this.privateKey || !this.publicKey) {
      console.warn('Vapi API keys not found in environment variables');
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getHeaders(includePrivateKey: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includePrivateKey) {
      headers['Authorization'] = `Bearer ${this.privateKey}`;
    } else {
      headers['Authorization'] = `Bearer ${this.publicKey}`;
    }

    return headers;
  }

  /**
   * Create a new voice assistant
   */
  async createAssistant(assistant: Omit<VapiAssistant, 'id'>): Promise<VapiAssistant> {
    try {
      const response = await fetch(`${this.baseURL}/assistant`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(assistant),
      });

      if (!response.ok) {
        throw new Error(`Vapi create assistant error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Vapi assistant:', error);
      throw error;
    }
  }

  /**
   * Get all assistants
   */
  async getAssistants(): Promise<VapiAssistant[]> {
    try {
      const response = await fetch(`${this.baseURL}/assistant`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get assistants error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Vapi assistants:', error);
      throw error;
    }
  }

  /**
   * Get assistant by ID
   */
  async getAssistant(assistantId: string): Promise<VapiAssistant> {
    try {
      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get assistant error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching assistant ${assistantId}:`, error);
      throw error;
    }
  }

  /**
   * Update assistant
   */
  async updateAssistant(
    assistantId: string,
    updates: Partial<VapiAssistant>
  ): Promise<VapiAssistant> {
    try {
      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Vapi update assistant error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating assistant ${assistantId}:`, error);
      throw error;
    }
  }

  /**
   * Delete assistant
   */
  async deleteAssistant(assistantId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi delete assistant error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting assistant ${assistantId}:`, error);
      throw error;
    }
  }

  /**
   * Make a phone call with assistant
   */
  async makePhoneCall(call: VapiPhoneCall): Promise<VapiCall> {
    try {
      const response = await fetch(`${this.baseURL}/call/phone`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(call),
      });

      if (!response.ok) {
        throw new Error(`Vapi phone call error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making phone call:', error);
      throw error;
    }
  }

  /**
   * Get call details
   */
  async getCall(callId: string): Promise<VapiCall> {
    try {
      const response = await fetch(`${this.baseURL}/call/${callId}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get call error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching call ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Get all calls
   */
  async getCalls(limit: number = 50, offset: number = 0): Promise<VapiCall[]> {
    try {
      const response = await fetch(`${this.baseURL}/call?limit=${limit}&offset=${offset}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get calls error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw error;
    }
  }

  /**
   * End a call
   */
  async endCall(callId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/call/${callId}/end`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi end call error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error ending call ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Get call transcript
   */
  async getCallTranscript(callId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/call/${callId}/transcript`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get transcript error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.transcript;
    } catch (error) {
      console.error(`Error fetching transcript for call ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Get call analysis
   */
  async getCallAnalysis(callId: string): Promise<VapiCall['analysis']> {
    try {
      const response = await fetch(`${this.baseURL}/call/${callId}/analysis`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get analysis error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching analysis for call ${callId}:`, error);
      throw error;
    }
  }

  /**
   * Create web call (for web integration)
   */
  async createWebCall(assistantId: string): Promise<{ webCallUrl: string; callId: string }> {
    try {
      const response = await fetch(`${this.baseURL}/call/web`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ assistantId }),
      });

      if (!response.ok) {
        throw new Error(`Vapi web call error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating web call:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    // Note: In a real implementation, you would verify the signature using your private key
    // This is a placeholder for the verification logic
    try {
      // This would need proper implementation based on Vapi's signature method
      return true; // Placeholder
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Parse webhook event
   */
  parseWebhookEvent(payload: string): VapiWebhookEvent {
    try {
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error parsing webhook event:', error);
      throw new Error('Invalid webhook payload');
    }
  }

  /**
   * Get account usage and limits
   */
  async getAccountInfo(): Promise<{
    credits: number;
    usedCredits: number;
    remainingCredits: number;
    plan: string;
    limits: {
      maxAssistants: number;
      maxCallsPerMonth: number;
      maxMinutesPerMonth: number;
    };
  }> {
    try {
      const response = await fetch(`${this.baseURL}/account`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi account info error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Create a default Daniela AI assistant
   */
  async createDanielaAssistant(): Promise<VapiAssistant> {
    const danielaConfig: Omit<VapiAssistant, 'id'> = {
      name: 'Daniela AI',
      model: {
        provider: 'openai',
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 1000,
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
      },
      firstMessage: '¡Hola! Soy Daniela, tu asistente IA de AIGestion. ¿En qué puedo ayudarte hoy?',
      description: 'Asistente IA inteligente para gestión empresarial y soporte al cliente',
      knowledgeBase: [
        'AIGestion es una plataforma de gestión empresarial con IA',
        'Ofrecemos soluciones de automatización y análisis',
        'Nuestros servicios incluyen dashboards, análisis de datos y asistentes virtuales',
        'Para soporte técnico, contactar a support@aigestion.net',
      ],
    };

    return this.createAssistant(danielaConfig);
  }
}

// Export singleton instance
export const vapiService = new VapiService();

// Export types for external use
export type { VapiService };
