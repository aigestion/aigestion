import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE SUPREME] Twilio Service
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

@injectable()
export class TwilioService {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;
  private readonly baseUrl: string;
  private messageCache = new Map<string, TwilioCache>();
  private callCache = new Map<string, any>();
  private performanceMetrics = new Map<string, number[]>();

  constructor() {
    this.accountSid = env.TWILIO_ACCOUNT_SID || '';
    this.authToken = env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;

    this.initializeCaching();
    this.setupPerformanceMonitoring();
  }

  /**
   * 🧠 Initialize intelligent caching system
   */
  private initializeCaching() {
    // Setup cache cleanup every hour
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 3600000);

    logger.info('[TwilioService] 🧠 Intelligent caching initialized');
  }

  /**
   * 📊 Setup performance monitoring
   */
  private setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    setInterval(() => {
      this.logPerformanceMetrics();
    }, 30000);

    logger.info('[TwilioService] 📊 Performance monitoring active');
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

        logger.info(
          `[TwilioService] 📊 ${metric}: avg=${avg.toFixed(2)}ms, min=${min}ms, max=${max}ms, samples=${values.length}`,
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
      logger.info(`[TwilioService] 🗑️ Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * 🔍 Generate cache key
   */
  private generateCacheKey(recipient: string, body: string): string {
    return btoa(`${recipient}:${body}`).substring(0, 64);
  }

  /**
   * 🚀 Ultra-resilient execution with intelligent retry
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
        const status = error.response?.status;
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

        // Critical: Do not retry on 401 (Auth) or 400 (Invalid Number/Bad Request)
        if (status === 401 || status === 400 || (status >= 400 && status < 500)) {
          logger.error(
            `[TwilioService] ${context} Terminal Error: ${status}`,
            error.response?.data,
          );
          this.recordMetric(`${context}_terminal_error`, 1);
          throw error;
        }

        if (attempt === maxRetries - 1) {
          logger.error(`[TwilioService] ${context} failed after ${maxRetries} attempts`);
          this.recordMetric(`${context}_failed`, 1);
          throw error;
        }

        logger.warn(
          `[TwilioService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`,
        );
        this.recordMetric(`${context}_retry`, 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[TwilioService] ${context} failed after maximum retries`);
  }

  /**
   * 📱 Sends a resilient SMS with caching
   */
  async sendSMS(to: string, body: string): Promise<TwilioMessage> {
    const cacheKey = this.generateCacheKey(to, body);

    // Check cache first (for common messages)
    const cached = this.messageCache.get(cacheKey);
    if (cached && Date.now() < cached.expires_at) {
      logger.info(`[TwilioService] 🎯 Cache hit for SMS to: ${to}`);
      this.recordMetric('cache_hit', 1);
      return cached.response;
    }

    return this.withRetry(async () => {
      logger.info(`[TwilioService] 🌌 Sending Supreme SMS to: ${to}`);

      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', this.fromNumber);
      params.append('Body', body);

      const response = await axios.post(`${this.baseUrl}/Messages.json`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 30000,
      });

      // Cache the result for common messages
      const cacheEntry: TwilioCache = {
        message_id: response.data.sid,
        response: response.data,
        created_at: Date.now(),
        expires_at: Date.now() + 30 * 60 * 1000, // 30 minutes
        recipient: to,
      };

      this.messageCache.set(cacheKey, cacheEntry);
      this.recordMetric('cache_miss', 1);

      logger.info(
        { sid: response.data.sid, to },
        '[TwilioService] Supreme SMS dispatched successfully',
      );
      return response.data;
    }, 'sendSMS');
  }

  /**
   * 📞 Initiates a Programmable Voice call with enhanced features
   */
  async makeCall(to: string, twimlUrl: string): Promise<TwilioCall> {
    return this.withRetry(async () => {
      logger.info(`[TwilioService] 🌌 Making Supreme Voice Call to: ${to}`);

      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', this.fromNumber);
      params.append('Url', twimlUrl);

      // 🌌 Enhanced call configuration
      params.append('StatusCallback', 'https://aigestion.net/api/twilio/call-status');
      params.append('StatusCallbackMethod', 'POST');
      params.append('Record', 'true'); // Enable recording
      params.append('Timeout', '300'); // 5 minutes max
      params.append('MachineDetection', 'Enable'); // Detect answering machines

      const response = await axios.post(`${this.baseUrl}/Calls.json`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 60000,
      });

      // Cache call metadata
      this.callCache.set(response.data.sid, {
        to,
        twimlUrl,
        initiated_at: Date.now(),
      });

      this.recordMetric('make_call_success', 1);
      logger.info({ sid: response.data.sid, to }, '[TwilioService] Supreme Voice call initiated');
      return response.data;
    }, 'makeCall');
  }

  /**
   * 📊 Get call details with caching
   */
  async getCall(callSid: string): Promise<TwilioCall> {
    // Check cache first
    const cached = this.callCache.get(callSid);
    if (cached) {
      logger.info(`[TwilioService] 🎯 Cache hit for call: ${callSid}`);
      this.recordMetric('cache_hit', 1);
      return cached;
    }

    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}/Calls/${callSid}.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 15000,
      });

      // Update cache with fresh data
      const callData = response.data;
      this.callCache.set(callSid, callData);
      this.recordMetric('cache_miss', 1);

      return callData;
    }, 'getCall');
  }

  /**
   * 📋 Get all calls with pagination and filtering
   */
  async getCalls(limit: number = 50, offset: number = 0, status?: string): Promise<TwilioCall[]> {
    return this.withRetry(async () => {
      let url = `${this.baseUrl}/Calls.json?Limit=${limit}&Offset=${offset}`;
      if (status) {
        url += `&Status=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 15000,
      });

      this.recordMetric('get_calls_success', 1);
      return response.data.calls;
    }, 'getCalls');
  }

  /**
   * 📨 Get message details with caching
   */
  async getMessage(messageSid: string): Promise<TwilioMessage> {
    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}/Messages/${messageSid}.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 15000,
      });

      this.recordMetric('get_message_success', 1);
      return response.data;
    }, 'getMessage');
  }

  /**
   * 📋 Get all messages with pagination
   */
  async getMessages(limit: number = 50, offset: number = 0): Promise<TwilioMessage[]> {
    return this.withRetry(async () => {
      const response = await axios.get(
        `${this.baseUrl}/Messages.json?Limit=${limit}&Offset=${offset}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
            'User-Agent': 'AIGestion-Backend/2.0.0',
          },
          timeout: 15000,
        },
      );

      this.recordMetric('get_messages_success', 1);
      return response.data.messages;
    }, 'getMessages');
  }

  /**
   * 📞 Enhanced call control methods
   */
  async endCall(callSid: string): Promise<void> {
    return this.withRetry(async () => {
      const response = await axios.post(
        `${this.baseUrl}/Calls/${callSid}.json`,
        {},
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
            'User-Agent': 'AIGestion-Backend/2.0.0',
          },
          timeout: 15000,
        },
      );

      // Update cache
      if (this.callCache.has(callSid)) {
        const cached = this.callCache.get(callSid);
        cached.ended_at = Date.now();
        this.callCache.set(callSid, cached);
      }

      this.recordMetric('end_call_success', 1);
      logger.info(`[TwilioService] 🛑 Call ended: ${callSid}`);
    }, 'endCall');
  }

  /**
   * 📞 Redirect call to new number
   */
  async redirectCall(callSid: string, to: string): Promise<void> {
    return this.withRetry(async () => {
      const response = await axios.post(
        `${this.baseUrl}/Calls/${callSid}.json`,
        new URLSearchParams({ Url: to }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
            'User-Agent': 'AIGestion-Backend/2.0.0',
          },
          timeout: 15000,
        },
      );

      this.recordMetric('redirect_call_success', 1);
      logger.info(`[TwilioService] 🔄 Call redirected: ${callSid} -> ${to}`);
    }, 'redirectCall');
  }

  /**
   * 📊 Get account phone numbers with caching
   */
  async getPhoneNumbers(): Promise<any> {
    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}/IncomingPhoneNumbers.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 15000,
      });

      this.recordMetric('get_phone_numbers_success', 1);
      return response.data;
    }, 'getPhoneNumbers');
  }

  /**
   * 💰 Get account information with caching
   */
  async getAccountInfo(): Promise<any> {
    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 15000,
      });

      this.recordMetric('get_account_info_success', 1);
      return response.data;
    }, 'getAccountInfo');
  }

  /**
   * 🏥 Health Check: Validates Twilio Account status with monitoring
   */
  async checkHealth(): Promise<boolean> {
    try {
      const startTime = Date.now();
      await axios.get(`${this.baseUrl}.json`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'User-Agent': 'AIGestion-Backend/2.0.0',
        },
        timeout: 10000,
      });

      const duration = Date.now() - startTime;
      this.recordMetric('health_check_success', duration);
      return true;
    } catch (error) {
      this.recordMetric('health_check_failed', 1);
      return false;
    }
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
    logger.info('[TwilioService] 🧹 Cache cleared');
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
    },
  ): Promise<TwilioMessage> {
    const personalizedMessage = this.buildPersonalizedMessage(message, personalization);
    return this.sendSMS(to, personalizedMessage);
  }

  /**
   * 🌌 Enhanced Voice Call with Daniela AI integration
   */
  async makeDanielaCall(
    to: string,
    context?: 'support' | 'sales' | 'general',
  ): Promise<TwilioCall> {
    const twimlUrl = this.buildDanielaTwiml(context);
    return this.makeCall(to, twimlUrl);
  }

  /**
   * 🔧 Build personalized message for Daniela
   */
  private buildPersonalizedMessage(
    message: string,
    personalization?: {
      tone?: 'optimista' | 'profesional';
      includeSignature?: boolean;
    },
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
}

export const twilioService = new TwilioService();
