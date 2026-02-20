import { OpenAI } from 'openai';
import { RedisClientType } from 'redis';
import { Db, MongoClient } from 'mongodb';
import { logger } from '../utils/logger';
import { config } from '../config/config';

export interface DanielaStatus {
  status: string;
  version: string;
  services: {
    openai: boolean;
    elevenlabs: boolean;
    redis: boolean;
    mongodb: boolean;
  };
  uptime: number;
  lastActivity: Date;
}

export interface DanielaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

import { OpenAI } from 'openai';
import { RedisClientType } from 'redis';
import { Db, MongoClient } from 'mongodb';
import { injectable, inject } from 'inversify';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { NeuralHealthService } from './NeuralHealthService';
import { DANIELA_SYSTEM_PROMPT } from '../config/prompts/daniela.persona';

export interface DanielaStatus {
  status: string;
  version: string;
  services: {
    ai: boolean;
    elevenlabs: boolean;
    redis: boolean;
    mongodb: boolean;
  };
  uptime: number;
  lastActivity: Date;
}

export interface DanielaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@injectable()
export class DanielaEnhancedService {
  private openaiClient: OpenAI | null = null;
  private elevenlabsClient: any = null;
  private redisClient: RedisClientType | null = null;
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private startTime: Date = new Date();
  private messages: DanielaMessage[] = [];

  constructor(
    @inject(TYPES.AIService) private readonly aiService: AIService,
    @inject(TYPES.NeuralHealthService) private readonly healthService: NeuralHealthService
  ) {
    void this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize Redis Fallback for memory caching
      if (config.redis.enabled) {
        const { createClient } = await import('redis');
        const url = config.redis.url || `redis://${config.redis.host}:${config.redis.port}`;
        this.redisClient = createClient({ url });
        await this.redisClient.connect();
        logger.info('✅ Daniela Memory Hub (Redis) initialized');
      }

      // Initialize Primary Storage (MongoDB)
      if (config.mongo.uri) {
        this.mongoClient = new MongoClient(config.mongo.uri);
        await this.mongoClient.connect();
        this.db = this.mongoClient.db('aigestion');
        logger.info('✅ Daniela Archive Hub (MongoDB) initialized');
      }
    } catch (error) {
      logger.error('❌ Error initializing Daniela cognitive peripherals:', error);
    }
  }

  async getDanielaStatus(): Promise<DanielaStatus> {
    return {
      status: 'enhanced',
      version: 'v2.1-sovereign',
      services: {
        ai: true, // Always true as it uses Gemini-2 via AIService
        elevenlabs: true, // Placeholder for voice
        redis: this.redisClient !== null,
        mongodb: this.mongoClient !== null,
      },
      uptime: Date.now() - this.startTime.getTime(),
      lastActivity: new Date(),
    };
  }

  async processMessage(message: string, userId?: string): Promise<string> {
    try {
      this.messages.push({ role: 'user', content: message, timestamp: new Date() });
      if (this.messages.length > 20) this.messages = this.messages.slice(-20);

      const conversationContext = this.getConversationContext();
      const pulse = this.healthService.getMetrics();

      const prompt = `
        ${DANIELA_SYSTEM_PROMPT}

        [LIVE_SYSTEM_CONTEXT]
        Status: ${pulse.status}
        Sanity Score: ${pulse.sanityScore.toFixed(2)}%
        CPU: ${pulse.cpuUsage.toFixed(2)}%
        Memory: ${pulse.memoryUsage.toFixed(2)}%
        Uptime: ${pulse.uptime.toFixed(0)}s

        [CONVERSATION_HISTORY]
        ${conversationContext}

        [CURRENT_REQUEST]
        ${message}
      `.trim();

      // Dispatch to God-Level Gemini Engine
      const response = await this.aiService.generateContent(prompt, userId || 'god-user', 'god');

      this.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      if (this.redisClient && userId) {
        await this.redisClient.setEx(
          `daniela:conversation:${userId}`,
          3600,
          JSON.stringify(this.messages)
        );
      }

      return response;
    } catch (error) {
      logger.error('Error in Daniela Sovereign Intelligence:', error);
      return '❌ No he podido procesar tu solicitud adecuadamente. Mis sistemas de enlace neural están bajo revisión.';
    }
  }

  private getConversationContext(): string {
    const recentMessages = this.messages.slice(-6);
    return recentMessages.map(msg => {
      const role = msg.role === 'user' ? '👤 Usuario' : '🧠 Daniela';
      return `${role}: ${msg.content}`;
    }).join('\n');
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    const status = await this.getDanielaStatus();
    return {
      status: status.services.ai && status.services.mongodb ? 'healthy' : 'degraded',
      details: {
        ...status,
        metrics: this.healthService.getMetrics(),
        memoryUsage: process.memoryUsage(),
      },
    };
  }

  async shutdown(): Promise<void> {
    try {
      if (this.redisClient) await this.redisClient.quit();
      if (this.mongoClient) await this.mongoClient.close();
      logger.info('🧠 Daniela Sovereign Intel unit offline.');
    } catch (error) {
      logger.error('Error during Daniela shutdown:', error);
    }
  }
}

// Global instance
export const danielaEnhancedService = new DanielaEnhancedService();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await danielaEnhancedService.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await danielaEnhancedService.shutdown();
  process.exit(0);
});
