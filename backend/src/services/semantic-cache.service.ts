import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectable } from 'inversify';
import { getCache, setCache } from '../cache/redis';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

@injectable()
export class SemanticCacheService {
  private genAI: any;
  private readonly SIMILARITY_THRESHOLD = 0.95;
  private readonly EMBEDDING_MODEL = 'embedding-001';

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');
  }

  /**
   * Generates a semantic embedding for the given text.
   */
  async getEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.EMBEDDING_MODEL });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      logger.error(error, '[SemanticCache] Error generating embedding');
      return [];
    }
  }

  /**
   * Tries to find a cached response for a similar prompt.
   * Currently uses simple key-based lookup (L2) as fallback,
   * but prepared for Vector Search.
   */
  async getSemantic(prompt: string): Promise<string | null> {
    const key = `semantic_cache:${this.hashPrompt(prompt)}`;

    // First try exact match in Redis (L2)
    const exactMatch = await getCache(key);
    if (exactMatch) {
      logger.info({ key }, '[SemanticCache] Exact Match Hit');
      return exactMatch;
    }

    // TODO: Implement Vector Search (L3) once RedisVL or standard RediSearch is confirmed
    return null;
  }

  /**
   * Caches a response semantically.
   */
  async setSemantic(prompt: string, response: string, ttl = 3600 * 24): Promise<void> {
    const key = `semantic_cache:${this.hashPrompt(prompt)}`;
    await setCache(key, response, ttl);

    // In a full implementation, we would store the embedding in a Redis Vector Index here
    // await this.storeVector(prompt, response, await this.getEmbedding(prompt));
  }

  private hashPrompt(prompt: string): string {
    // Simple deterministic hash for prompt keys
    return Buffer.from(prompt.trim().toLowerCase()).toString('base64').substring(0, 64);
  }
}
