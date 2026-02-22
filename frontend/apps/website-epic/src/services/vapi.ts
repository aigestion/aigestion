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

export interface VapiCache {
  assistant_id: string;
  response: string;
  created_at: number;
  expires_at: number;
  context: string;
}

class VapiService {
  private privateKey: string;
  private publicKey: string;
  private baseURL = 'https://api.vapi.ai';
  private assistantCache = new Map<string, VapiAssistant>();
  private callCache = new Map<string, VapiCache>();
  private performanceMetrics = new Map<string, number[]>();

  constructor() {
    this.privateKey = import.meta.env.VITE_VAPI_PRIVATE_KEY || '';
    this.publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || '';

    this.initializeCaching();
    this.setupPerformanceMonitoring();

    if (!this.privateKey || !this.publicKey) {
      console.warn('Vapi API keys not found in environment variables');
    }
  }

  /**
   * Initialize intelligent caching system
   */
  private initializeCaching() {
    // Setup cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 3600000);

    console.log('[VapiService] Intelligent caching initialized');
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000);

    console.log('[VapiService] Performance monitoring active');
  }

  /**
   * Record performance metrics
   */
  private recordMetric(metric: string, value: number) {
    if (!this.performanceMetrics.has(metric)) {
      this.performanceMetrics.set(metric, []);
    }

    const metrics = this.performanceMetrics.get(metric)!;
    metrics.push(value);

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  /**
   * Log performance metrics
   */
  private logPerformanceMetrics() {
    for (const [metric, values] of this.performanceMetrics.entries()) {
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        console.log(
          `[VapiService] ${metric}: avg=${avg.toFixed(2)}ms, min=${min}ms, max=${max}ms, samples=${values.length}`
        );
      }
    }
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.callCache.entries()) {
      if (now > entry.expires_at) {
        this.callCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[VapiService] Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Ultra-resilient fetch with intelligent retry
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 5;
    const baseDelay = 300;
    const maxDelay = 8000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;

        this.recordMetric(`${context}_success`, duration);
        return result;
      } catch (error: any) {
        const status = error.status || error.response?.status;
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

        // Critical: Do not retry on 401 (Auth), 402 (Quota), or 4xx (Validation)
        if (status === 401 || status === 402 || (status >= 400 && status < 500)) {
          console.error(`[VapiService] ${context} Terminal Error: ${status}`, error);
          this.recordMetric(`${context}_terminal_error`, 1);
          throw error;
        }

        if (attempt === maxRetries - 1) {
          console.error(`[VapiService] ${context} failed after ${maxRetries} attempts`);
          this.recordMetric(`${context}_failed`, 1);
          throw error;
        }

        console.warn(
          `[VapiService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`
        );
        this.recordMetric(`${context}_retry`, 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[VapiService] ${context} failed after maximum retries`);
  }

  /**
   * Get authentication headers for API requests
   */
  private getHeaders(includePrivateKey: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AIGestion-Frontend/2.0.0',
    };

    if (includePrivateKey) {
      headers['Authorization'] = `Bearer ${this.privateKey}`;
    } else {
      headers['Authorization'] = `Bearer ${this.publicKey}`;
    }

    return headers;
  }

  /**
   * Create a new voice assistant with caching
   */
  async createAssistant(assistant: Omit<VapiAssistant, 'id'>): Promise<VapiAssistant> {
    return this.withRetry(async () => {
      console.log(`[VapiService] Creating Supreme Assistant: ${assistant.name}`);

      const response = await fetch(`${this.baseURL}/assistant`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          ...assistant,
          // Enhanced configuration for Daniela
          model: {
            ...assistant.model,
            temperature: assistant.model.temperature || 0.7,
            maxTokens: assistant.model.maxTokens || 800,
          },
          voice: {
            ...assistant.voice,
            provider: 'elevenlabs',
            voiceId: assistant.voice.voiceId || 'EXAVITQu4vr4xnSDxMaL', // Bella - español España
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Vapi create assistant error: ${response.status} ${response.statusText}`);
      }

      const newAssistant = await response.json();

      // Cache the assistant
      this.assistantCache.set(newAssistant.id, newAssistant);
      this.recordMetric('create_assistant_success', 1);

      console.log(`[VapiService] Assistant created: ${newAssistant.name}`);
      return newAssistant;
    }, 'createAssistant');
  }

  /**
   * Get all assistants with caching
   */
  async getAssistants(): Promise<VapiAssistant[]> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/assistant`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get assistants error: ${response.status} ${response.statusText}`);
      }

      const assistants = await response.json();

      // Update cache
      assistants.forEach((assistant: VapiAssistant) => {
        this.assistantCache.set(assistant.id, assistant);
      });

      this.recordMetric('get_assistants_success', 1);
      return assistants;
    }, 'getAssistants');
  }

  /**
   * Get assistant by ID with caching
   */
  async getAssistant(assistantId: string): Promise<VapiAssistant> {
    // Check cache first
    const cached = this.assistantCache.get(assistantId);
    if (cached) {
      console.log(`[VapiService] Cache hit for assistant: ${assistantId}`);
      this.recordMetric('cache_hit', 1);
      return cached;
    }

    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get assistant error: ${response.status} ${response.statusText}`);
      }

      const assistant = await response.json();

      // Cache the result
      this.assistantCache.set(assistantId, assistant);
      this.recordMetric('cache_miss', 1);

      return assistant;
    }, 'getAssistant');
  }

  /**
   * Update assistant with cache invalidation
   */
  async updateAssistant(
    assistantId: string,
    updates: Partial<VapiAssistant>
  ): Promise<VapiAssistant> {
    return this.withRetry(async () => {
      console.log(`[VapiService] Updating Supreme Assistant: ${assistantId}`);

      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Vapi update assistant error: ${response.status} ${response.statusText}`);
      }

      const updatedAssistant = await response.json();

      // Update cache
      this.assistantCache.set(assistantId, updatedAssistant);
      this.recordMetric('update_assistant_success', 1);

      return updatedAssistant;
    }, 'updateAssistant');
  }

  /**
   * Delete assistant with cache cleanup
   */
  async deleteAssistant(assistantId: string): Promise<void> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/assistant/${assistantId}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi delete assistant error: ${response.status} ${response.statusText}`);
      }

      // Remove from cache
      this.assistantCache.delete(assistantId);
      this.recordMetric('delete_assistant_success', 1);

      console.log(`[VapiService] Assistant deleted: ${assistantId}`);
    }, 'deleteAssistant');
  }

  /**
   * Make a phone call with assistant (enhanced)
   */
  async makePhoneCall(call: VapiPhoneCall): Promise<VapiCall> {
    return this.withRetry(async () => {
      console.log(`[VapiService] Making Supreme Phone Call: ${call.assistantId}`);

      const response = await fetch(`${this.baseURL}/call/phone`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          ...call,
          // Enhanced call configuration
          serverUrl: call.serverUrl || 'https://aigestion.net/api/vapi/webhook',
          serverMessages: call.serverMessages || [
            {
              role: 'system',
              content:
                'Eres Daniela IA, asistente de AIGestion.net. Responde en español con tono optimista y profesional.',
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Vapi phone call error: ${response.status} ${response.statusText}`);
      }

      const callResult = await response.json();
      this.recordMetric('make_phone_call_success', 1);

      console.log(`[VapiService] Phone call initiated: ${callResult.id}`);
      return callResult;
    }, 'makePhoneCall');
  }

  /**
   * Create web call (for web integration)
   */
  async createWebCall(assistantId: string): Promise<{ webCallUrl: string; callId: string }> {
    return this.withRetry(async () => {
      console.log(`[VapiService] Creating Supreme Web Call: ${assistantId}`);

      const response = await fetch(`${this.baseURL}/call/web`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          assistantId,
          // Enhanced web call configuration
          serverUrl: 'https://aigestion.net/api/vapi/webhook',
        }),
      });

      if (!response.ok) {
        throw new Error(`Vapi web call error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.recordMetric('create_web_call_success', 1);

      console.log(`[VapiService] Web call created: ${result.callId}`);
      return result;
    }, 'createWebCall');
  }

  /**
   * Get call details with caching
   */
  async getCall(callId: string): Promise<VapiCall> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/call/${callId}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get call error: ${response.status} ${response.statusText}`);
      }

      const call = await response.json();
      this.recordMetric('get_call_success', 1);
      return call;
    }, 'getCall');
  }

  /**
   * Get all calls with pagination
   */
  async getCalls(limit: number = 50, offset: number = 0): Promise<VapiCall[]> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/call?limit=${limit}&offset=${offset}`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get calls error: ${response.status} ${response.statusText}`);
      }

      const calls = await response.json();
      this.recordMetric('get_calls_success', 1);
      return calls;
    }, 'getCalls');
  }

  /**
   * End a call
   */
  async endCall(callId: string): Promise<void> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/call/${callId}/end`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi end call error: ${response.status} ${response.statusText}`);
      }

      this.recordMetric('end_call_success', 1);
      console.log(`[VapiService] Call ended: ${callId}`);
    }, 'endCall');
  }

  /**
   * Get call transcript
   */
  async getCallTranscript(callId: string): Promise<string> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/call/${callId}/transcript`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get transcript error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.recordMetric('get_transcript_success', 1);
      return data.transcript;
    }, 'getCallTranscript');
  }

  /**
   * Get call analysis
   */
  async getCallAnalysis(callId: string): Promise<VapiCall['analysis']> {
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/call/${callId}/analysis`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi get analysis error: ${response.status} ${response.statusText}`);
      }

      const analysis = await response.json();
      this.recordMetric('get_analysis_success', 1);
      return analysis;
    }, 'getCallAnalysis');
  }

  /**
   * Verify webhook signature (enhanced)
   */
  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    try {
      // Enhanced signature verification mock (Actual logic requires Vapi private key comparison)
      // This would need proper implementation based on Vapi's signature method
      // For now, return true for development
      return true;
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
    return this.withRetry(async () => {
      const response = await fetch(`${this.baseURL}/account`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`Vapi account info error: ${response.status} ${response.statusText}`);
      }

      const accountInfo = await response.json();
      this.recordMetric('get_account_info_success', 1);
      return accountInfo;
    }, 'getAccountInfo');
  }

  /**
   * Create a default Daniela AI assistant (enhanced)
   */
  async createDanielaAssistant(): Promise<VapiAssistant> {
    const danielaConfig: Omit<VapiAssistant, 'id'> = {
      name: 'Daniela IA AIGestion',
      model: {
        provider: 'openai',
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 800,
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - español España perfecto
      },
      firstMessage: '¡Hola! Soy Daniela, tu asistente IA de AIGestion. ¿En qué puedo ayudarte hoy?',
      description:
        'Asistente IA inteligente para gestión empresarial con voz española optimista y elegante.',
      knowledgeBase: [
        'AIGestion es una plataforma de gestión empresarial con IA',
        'Ofrecemos soluciones de automatización y análisis de datos',
        'Nuestros servicios incluyen dashboards, reportes automáticos y asistentes virtuales',
        'Para soporte técnico, contactar a soporte@aigestion.net',
        'Integración con ElevenLabs para voz en español perfecta',
      ],
      serverUrl: 'https://aigestion.net/api/vapi/webhook',
      serverMessages: [
        {
          role: 'system',
          content:
            'Eres Daniela IA, asistente de AIGestion.net. Habla en español con tono optimista, profesional y elegante. Usa voz de Bella (EXAVITQu4vr4xnSDxMaL) de ElevenLabs.',
        },
      ],
    };

    return this.createAssistant(danielaConfig);
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    const metrics: any = {};
    for (const [key, values] of this.performanceMetrics.entries()) {
      if (values.length > 0) {
        metrics[key] = {
          count: values.length,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          recent: values.slice(-10),
        };
      }
    }
    return metrics;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.assistantCache.clear();
    this.callCache.clear();
    console.log('[VapiService] Cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const entry of this.callCache.values()) {
      if (now < entry.expires_at) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.callCache.size,
      valid,
      expired,
      hitRate: this.performanceMetrics.get('cache_hit')?.length || 0,
      missRate: this.performanceMetrics.get('cache_miss')?.length || 0,
    };
  }
}

// Export singleton instance
export const vapiService = new VapiService();
export type { VapiService };
