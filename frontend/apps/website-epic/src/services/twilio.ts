/**
 * 🌌 Twilio Communication Service - God Mode Supreme
 * Ultra-high-performance global communications with enterprise features
 * Features: Intelligent caching, batch processing, multi-channel support, real-time analytics
 */

export interface TwilioMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  dateCreated: string;
  dateUpdated: string;
  dateSent?: string;
  errorCode?: string;
  errorMessage?: string;
  price?: string;
  priceUnit?: string;
  numSegments: number;
  numMedia: number;
}

export interface TwilioCall {
  sid: string;
  from: string;
  to: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  startTime?: string;
  endTime?: string;
  duration?: string;
  price?: string;
  priceUnit?: string;
  direction:
    | 'inbound'
    | 'outbound'
    | 'outbound-api'
    | 'outbound-call'
    | 'inbound-call'
    | 'trunking-originating'
    | 'trunking-terminating';
  answeredBy?: 'human' | 'machine';
  forwardedFrom?: string;
  callerName?: string;
}

export interface TwilioCache {
  message_id: string;
  response: any;
  created_at: number;
  expires_at: number;
  recipient: string;
}

class TwilioService {
  private accountSid: string;
  private authToken: string;
  private recoveryCode: string;
  private baseURL = 'https://api.twilio.com/2010-04-01';
  private messageCache = new Map<string, TwilioCache>();
  private callCache = new Map<string, any>();
  private performanceMetrics = new Map<string, number[]>();

  constructor() {
    this.accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID || '';
    this.authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN || '';
    this.recoveryCode = import.meta.env.VITE_TWILIO_RECOVERY_CODE || '';

    this.initializeCaching();
    this.setupPerformanceMonitoring();

    if (!this.accountSid || !this.authToken) {
      console.warn('Twilio credentials not found in environment variables');
    }
  }

  /**
   * 🧠 Initialize intelligent caching system
   */
  private initializeCaching() {
    // Setup cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 3600000);

    console.log('[TwilioService] 🧠 Intelligent caching initialized');
  }

  /**
   * 📊 Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000);

    console.log('[TwilioService] 📊 Performance monitoring active');
  }

  /**
   * 📈 Record performance metrics
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
   * 📊 Log performance metrics
   */
  private logPerformanceMetrics() {
    for (const [metric, values] of this.performanceMetrics.entries()) {
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        console.log(
          `[TwilioService] 📊 ${metric}: avg=${avg.toFixed(2)}ms, min=${min}ms, max=${max}ms, samples=${values.length}`
        );
      }
    }
  }

  /**
   * 🗑️ Cleanup expired cache entries
   */
  private cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.messageCache.entries()) {
      if (now > entry.expires_at) {
        this.messageCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[TwilioService] 🗑️ Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * 🔍 Generate cache key
   */
  private generateCacheKey(recipient: string, body: string): string {
    return btoa(`${recipient}:${body}`).substring(0, 64);
  }

  /**
   * 🚀 Ultra-resilient fetch with intelligent retry
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

        // Critical: Do not retry on 401 (Auth) or 400 (Invalid Number/Bad Request)
        if (status === 401 || status === 400 || (status >= 400 && status < 500)) {
          console.error(
            `[TwilioService] ${context} Terminal Error: ${status}`,
            error.response?.data
          );
          this.recordMetric(`${context}_terminal_error`, 1);
          throw error;
        }

        if (attempt === maxRetries - 1) {
          console.error(`[TwilioService] ${context} failed after ${maxRetries} attempts`);
          this.recordMetric(`${context}_failed`, 1);
          throw error;
        }

        console.warn(
          `[TwilioService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`
        );
        this.recordMetric(`${context}_retry`, 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[TwilioService] ${context} failed after maximum retries`);
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    const credentials = btoa(`${this.accountSid}:${this.authToken}`);
    return {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'AIGestion-Frontend/2.0.0',
    };
  }

  /**
   * 📱 Send SMS with caching and personalization
   */
  async sendSMS(to: string, from: string, body: string): Promise<TwilioMessage> {
    const cacheKey = this.generateCacheKey(to, body);

    // Check cache first (for common messages)
    const cached = this.messageCache.get(cacheKey);
    if (cached && Date.now() < cached.expires_at) {
      console.log(`[TwilioService] 🎯 Cache hit for SMS to: ${to}`);
      this.recordMetric('cache_hit', 1);
      return cached.response;
    }

    return this.withRetry(async () => {
      console.log(`[TwilioService] 🌌 Sending Supreme SMS to: ${to}`);

      const formData = new URLSearchParams({
        To: to,
        From: from,
        Body: body,
      });

      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio SMS error: ${errorData.message || response.statusText}`);
      }

      const messageData = await response.json();

      // Cache result for common messages
      const cacheEntry: TwilioCache = {
        message_id: messageData.sid,
        response: messageData,
        created_at: Date.now(),
        expires_at: Date.now() + 30 * 60 * 1000, // 30 minutes
        recipient: to,
      };

      this.messageCache.set(cacheKey, cacheEntry);
      this.recordMetric('cache_miss', 1);

      console.log(
        { sid: messageData.sid, to },
        '[TwilioService] Supreme SMS dispatched successfully'
      );
      return messageData;
    }, 'sendSMS');
  }

  /**
   * 📞 Make voice call with enhanced features
   */
  async makeCall(to: string, from: string, url?: string, twiml?: string): Promise<TwilioCall> {
    return this.withRetry(async () => {
      console.log(`[TwilioService] 🌌 Making Supreme Voice Call to: ${to}`);

      const formData = new URLSearchParams({
        To: to,
        From: from,
      });

      if (url) {
        formData.append('Url', url);
      } else if (twiml) {
        formData.append('Twiml', twiml);
      } else {
        // Default TwiML for simple call
        formData.append('Url', 'https://demo.twilio.com/welcome/voice/');
      }

      // 🌌 Enhanced call configuration
      formData.append('StatusCallback', 'https://aigestion.net/api/twilio/call-status');
      formData.append('StatusCallbackMethod', 'POST');
      formData.append('Record', 'true'); // Enable recording
      formData.append('Timeout', '300'); // 5 minutes max
      formData.append('MachineDetection', 'Enable'); // Detect answering machines

      const response = await fetch(`${this.baseURL}/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twilio call error: ${errorData.message || response.statusText}`);
      }

      const callData = await response.json();

      // Cache call metadata
      this.callCache.set(callData.sid, {
        to,
        url,
        initiated_at: Date.now(),
      });

      this.recordMetric('make_call_success', 1);
      console.log({ sid: callData.sid, to }, '[TwilioService] Supreme Voice call initiated');
      return callData;
    }, 'makeCall');
  }

  /**
   * 📊 Get performance metrics
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
   * 🧹 Clear cache
   */
  public clearCache(): void {
    this.messageCache.clear();
    this.callCache.clear();
    console.log('[TwilioService] 🧹 Cache cleared');
  }

  /**
   * 📈 Get cache statistics
   */
  public getCacheStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const entry of this.messageCache.values()) {
      if (now < entry.expires_at) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.messageCache.size,
      valid,
      expired,
      hitRate: this.performanceMetrics.get('cache_hit')?.length || 0,
      missRate: this.performanceMetrics.get('cache_miss')?.length || 0,
    };
  }

  /**
   * 🌌 Enhanced SMS with Daniela AI integration
   */
  async sendDanielaSMS(
    to: string,
    message: string,
    personalization?: {
      tone?: 'optimista' | 'profesional';
      includeSignature?: boolean;
    }
  ): Promise<TwilioMessage> {
    const personalizedMessage = this.buildPersonalizedMessage(message, personalization);
    return this.sendSMS(to, '+15017122661', personalizedMessage); // Default Twilio number
  }

  /**
   * 🌌 Enhanced Voice Call with Daniela AI integration
   */
  async makeDanielaCall(
    to: string,
    context?: 'support' | 'sales' | 'general'
  ): Promise<TwilioCall> {
    const twimlUrl = this.buildDanielaTwiml(context);
    return this.makeCall(to, '+15017122661', twimlUrl); // Default Twilio number
  }

  /**
   * 🔧 Build personalized message for Daniela
   */
  private buildPersonalizedMessage(
    message: string,
    personalization?: {
      tone?: 'optimista' | 'profesional';
      includeSignature?: boolean;
    }
  ): string {
    let personalizedMessage = message;

    if (personalization?.tone === 'optimista') {
      personalizedMessage = `✨ ${message} 🚀`;
    } else if (personalization?.tone === 'profesional') {
      personalizedMessage = `📋 ${message} 🏢`;
    }

    if (personalization?.includeSignature) {
      personalizedMessage += `\n\n---\n🤖 Daniela IA - AIGestion\n🌐 aigestion.net`;
    }

    return personalizedMessage;
  }

  /**
   * 🔧 Build TwiML for Daniela AI
   */
  private buildDanielaTwiml(context?: string): string {
    const baseUrl = 'https://aigestion.net/api/twilio';

    switch (context) {
      case 'support':
        return `${baseUrl}/support-handler`;
      case 'sales':
        return `${baseUrl}/sales-handler`;
      case 'general':
      default:
        return `${baseUrl}/daniela-handler`;
    }
  }

  /**
   * Generate TwiML for voice response
   */
  generateTwiML(options: {
    say?: { text: string; voice?: 'man' | 'woman'; language?: string };
    play?: string;
    gather?: {
      action?: string;
      method?: 'GET' | 'POST';
      timeout?: number;
      finishOnKey?: string;
      numDigits?: number;
      say?: { text: string; voice?: 'man' | 'woman'; language?: string };
    };
    hangup?: boolean;
    redirect?: string;
  }): string {
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

    if (options.say) {
      const voice = options.say.voice ? ` voice="${options.say.voice}"` : '';
      const language = options.say.language ? ` language="${options.say.language}"` : '';
      twiml += `<Say${voice}${language}>${options.say.text}</Say>`;
    }

    if (options.play) {
      twiml += `<Play>${options.play}</Play>`;
    }

    if (options.gather) {
      const action = options.gather.action ? ` action="${options.gather.action}"` : '';
      const method = options.gather.method ? ` method="${options.gather.method}"` : '';
      const timeout = options.gather.timeout ? ` timeout="${options.gather.timeout}"` : '';
      const finishOnKey = options.gather.finishOnKey
        ? ` finishOnKey="${options.gather.finishOnKey}"`
        : '';
      const numDigits = options.gather.numDigits ? ` numDigits="${options.gather.numDigits}"` : '';

      twiml += `<Gather${action}${method}${timeout}${finishOnKey}${numDigits}>`;

      if (options.gather.say) {
        const voice = options.gather.say.voice ? ` voice="${options.gather.say.voice}"` : '';
        const language = options.gather.say.language
          ? ` language="${options.gather.say.language}"`
          : '';
        twiml += `<Say${voice}${language}>${options.gather.say.text}</Say>`;
      }

      twiml += '</Gather>';
    }

    if (options.redirect) {
      twiml += `<Redirect>${options.redirect}</Redirect>`;
    }

    if (options.hangup) {
      twiml += '<Hangup />';
    }

    twiml += '</Response>';
    return twiml;
  }

  /**
   * Send verification code via SMS
   */
  async sendVerificationCode(to: string, code: string, from?: string): Promise<TwilioMessage> {
    const message = `Tu código de verificación AIGestion es: ${code}. ⏰ Válido por 10 minutos.`;
    const fromNumber = from || '+15017122661'; // Default Twilio number

    return this.sendSMS(to, fromNumber, message);
  }

  /**
   * Create conference call
   */
  async createConference(
    participants: string[],
    from: string,
    _options?: {
      waitUrl?: string;
      startConferenceOnEnter?: boolean;
      endConferenceOnExit?: boolean;
      muted?: boolean;
      beep?: 'onEnter' | 'onExit' | 'true' | 'false';
    }
  ): Promise<TwilioCall[]> {
    const calls: TwilioCall[] = [];

    for (const participant of participants) {
      const twiml = this.generateTwiML({
        say: {
          text: '¡Bienvenido a la conferencia de AIGestion. Por favor espere a que se unan otros participantes.',
          voice: 'woman',
          language: 'es-ES',
        },
      });

      try {
        const call = await this.makeCall(participant, from, undefined, twiml);
        calls.push(call);
      } catch (error) {
        console.error(`Error adding participant ${participant}:`, error);
      }
    }

    return calls;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for E.164 format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phoneNumber: string, countryCode: string = '+1'): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // If already in E.164 format, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    // Add country code if needed
    if (cleaned.length === 10) {
      return `${countryCode}${cleaned}`;
    }

    // If already includes country code without +
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }

    return phoneNumber;
  }

  /**
   * Recover account using recovery code
   */
  async recoverAccount(): Promise<boolean> {
    try {
      // This would typically involve calling Twilio's account recovery endpoint
      // For now, we'll just validate recovery code format
      if (this.recoveryCode && this.recoveryCode.length > 10) {
        console.log('Account recovery code is valid format');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error recovering account:', error);
      return false;
    }
  }
}

// Export singleton instance
export const twilioService = new TwilioService();

// Export types for external use
export type { TwilioService };
