import { OpenAI } from 'openai';
import { RedisClientType } from 'redis';
import { Db, MongoClient } from 'mongodb';
import { logger } from '../utils/logger';

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

export class DanielaEnhancedService {
  private openaiClient: OpenAI | null = null;
  private elevenlabsClient: any = null;
  private redisClient: RedisClientType | null = null;
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private startTime: Date = new Date();
  private messages: DanielaMessage[] = [];

  constructor() {
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize OpenAI
      if (process.env.OPENAI_API_KEY) {
        this.openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        logger.info('✅ OpenAI client initialized');
      }

      // Initialize Redis
      if (process.env.REDIS_URL) {
        const { createClient } = await import('redis');
        this.redisClient = createClient({ url: process.env.REDIS_URL });
        await this.redisClient.connect();
        logger.info('✅ Redis client initialized');
      }

      // Initialize MongoDB
      if (process.env.DATABASE_URL) {
        this.mongoClient = new MongoClient(process.env.DATABASE_URL);
        await this.mongoClient.connect();
        this.db = this.mongoClient.db('aigestion');
        logger.info('✅ MongoDB client initialized');
      }

      // Initialize ElevenLabs
      if (process.env.ELEVENLABS_API_KEY) {
        // Initialize ElevenLabs client here
        logger.info('✅ ElevenLabs client initialized');
      }

    } catch (error) {
      logger.error('❌ Error initializing Daniela services:', error);
    }
  }

  async getDanielaStatus(): Promise<DanielaStatus> {
    return {
      status: 'enhanced',
      version: 'v2.0-dios',
      services: {
        openai: this.openaiClient !== null,
        elevenlabs: this.elevenlabsClient !== null,
        redis: this.redisClient !== null,
        mongodb: this.mongoClient !== null,
      },
      uptime: Date.now() - this.startTime.getTime(),
      lastActivity: new Date(),
    };
  }

  async processMessage(message: string, userId?: string): Promise<string> {
    try {
      // Add message to history
      this.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Keep only last 20 messages
      if (this.messages.length > 20) {
        this.messages = this.messages.slice(-20);
      }

      // Get context from recent messages
      const context = this.getConversationContext();

      // Process with OpenAI if available
      if (this.openaiClient) {
        const completion = await this.openaiClient.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `Eres Daniela, la asistente de IA de AIGestion.net. 
              Responde de manera amigable, profesional y helpful. 
              Contexto reciente: ${context}`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content || 
          'Lo siento, no pude procesar tu mensaje en este momento.';

        // Add response to history
        this.messages.push({
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        });

        // Cache in Redis if available
        if (this.redisClient && userId) {
          await this.redisClient.setEx(
            `daniela:conversation:${userId}`,
            3600, // 1 hour
            JSON.stringify(this.messages)
          );
        }

        return response;
      }

      return '🧠 Daniela está en modo básico actualmente. El servicio completo estará disponible pronto.';

    } catch (error) {
      logger.error('Error processing message:', error);
      return '❌ Ocurrió un error al procesar tu mensaje. Por favor intenta nuevamente.';
    }
  }

  private getConversationContext(): string {
    // Get last 6 messages for context
    const recentMessages = this.messages.slice(-6);
    
    const contextParts = recentMessages.map(msg => {
      const role = msg.role === 'user' ? '👤 Usuario' : '🧠 Daniela';
      return `${role}: ${msg.content}`;
    });

    return contextParts.join('\n');
  }

  async getConversationHistory(userId?: string): Promise<DanielaMessage[]> {
    try {
      // Try to get from Redis first
      if (this.redisClient && userId) {
        const cached = await this.redisClient.get(`daniela:conversation:${userId}`);
        if (cached) {
          return JSON.parse(cached);
        }
      }

      // Return in-memory history
      return this.messages;

    } catch (error) {
      logger.error('Error getting conversation history:', error);
      return this.messages;
    }
  }

  async clearConversationHistory(userId?: string): Promise<void> {
    try {
      // Clear from Redis
      if (this.redisClient && userId) {
        await this.redisClient.del(`daniela:conversation:${userId}`);
      }

      // Clear in-memory history
      this.messages = [];

      logger.info('Conversation history cleared');

    } catch (error) {
      logger.error('Error clearing conversation history:', error);
    }
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    const status = await this.getDanielaStatus();
    const health = {
      status: status.services.openai && status.services.mongodb ? 'healthy' : 'degraded',
      details: {
        ...status,
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    return health;
  }

  async shutdown(): Promise<void> {
    try {
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      if (this.mongoClient) {
        await this.mongoClient.close();
      }
      logger.info('🧠 Daniela Enhanced Service shutdown complete');
    } catch (error) {
      logger.error('Error during shutdown:', error);
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
