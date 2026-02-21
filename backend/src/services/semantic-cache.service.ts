import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectable } from 'inversify';
import { getCache, setCache, getRedisClient } from '../cache/redis';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

@injectable()
export class SemanticCacheService {
  private genAI: any;
  private readonly SIMILARITY_THRESHOLD = 0.95;
  private readonly EMBEDDING_MODEL = 'text-embedding-004';

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
   * 🗺️ L3 Semantic Recall
   * Performs vector similarity search in Redis to find related past responses.
   */
  async getSemantic(prompt: string): Promise<string | null> {
    const key = `semantic_cache:${this.hashPrompt(prompt)}`;

    // Level 2: Exact Match (Fastest)
    const exactMatch = await getCache(key);
    if (exactMatch) {
      logger.info({ key }, '[SemanticCache] L2 Hit: Exact match found');
      return exactMatch;
    }

    // Level 3: Vector Similarity Search
    try {
      const embedding = await this.getEmbedding(prompt);
      if (embedding.length === 0) return null;

      const client = getRedisClient();
      if (!client?.isOpen) return null;

      // Search across cached embeddings (Simulation of Vector Search if RediSearch not fully configured)
      // In a production "God Mode" system, we use FT.SEARCH with K-Nearest Neighbors
      const results = await client
        .sendCommand([
          'FT.SEARCH',
          'idx:semantic_cache',
          `*=>[KNN 1 @embedding $BLOB AS score]`,
          'PARAMS',
          '2',
          'BLOB',
          Buffer.from(new Float32Array(embedding).buffer),
          'SORTBY',
          'score',
          'ASC',
          'DIALECT',
          '2',
        ])
        .catch(() => null);

      const searchResults = results as any;
      if (searchResults && searchResults[1] > 0) {
        const score = parseFloat(searchResults[2][1]);
        if (score < 1 - this.SIMILARITY_THRESHOLD) {
          const response = searchResults[2][3]; // Assuming value is at index 3
          logger.info({ score }, '[SemanticCache] L3 Hit: Vector similarity match');
          return response;
        }
      }
    } catch (err) {
      logger.debug('[SemanticCache] Vector search unavailable or index not created');
    }

    return null;
  }

  /**
   * 💾 Store Semantic Response
   */
  async setSemantic(prompt: string, response: string, ttl = 3600 * 24): Promise<void> {
    const key = `semantic_cache:${this.hashPrompt(prompt)}`;

    // Set L2
    await setCache(key, response, ttl);

    // Set L3 (Embedding)
    try {
      const embedding = await this.getEmbedding(prompt);
      const client = getRedisClient();
      if (client?.isOpen) {
        const vectorKey = `vec:${key}`;
        await client.hSet(vectorKey, {
          prompt,
          response,
          embedding: Buffer.from(new Float32Array(embedding).buffer),
        });
        await client.expire(vectorKey, ttl);
      }
    } catch (err) {
      logger.error(err, '[SemanticCache] Error storing vector data');
    }
  }

  private hashPrompt(prompt: string): string {
    // Simple deterministic hash for prompt keys
    return Buffer.from(prompt.trim().toLowerCase()).toString('base64').substring(0, 64);
  }
}
