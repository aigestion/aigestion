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
    this.initIndex().catch(err => logger.error(err, '[SemanticCache] Failed to auto-init index'));
  }

  /**
   * 🏗️ Initialize Vector Index
   * Creates the RediSearch index if it doesn't exist.
   */
  async initIndex(): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    try {
      await client.sendCommand([
        'FT.CREATE',
        'idx:semantic_cache',
        'ON',
        'HASH',
        'PREFIX',
        '1',
        'vec:semantic_cache:',
        'SCHEMA',
        'prompt',
        'TEXT',
        'SORTABLE',
        'response',
        'TEXT',
        'NOINDEX',
        'embedding',
        'VECTOR',
        'HNSW',
        '6',
        'TYPE',
        'FLOAT32',
        'DIM',
        '768', // text-embedding-004 is 768
        'DISTANCE_METRIC',
        'COSINE',
      ]);
      logger.info('[SemanticCache] Vector index created successfully');
    } catch (err: any) {
      if (err.message.includes('Index already exists')) {
        logger.debug('[SemanticCache] Vector index already exists');
      } else {
        logger.error(err, '[SemanticCache] Error creating vector index');
      }
    }
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
      logger.error(error, '[SemanticCache] Error generating embedding - Fallback to L2');
      return [];
    }
  }

  /**
   * 🗺️ L3 Semantic Recall
   * Performs vector similarity search in Redis to find related past responses.
   */
  async getSemantic(prompt: string): Promise<string | null> {
    const key = `semantic_cache:${this.hashPrompt(prompt)}`;

    // Level 2: Exact Match (Fastest) — Circuit Breaker for L3
    const exactMatch = await getCache<string>(key);
    if (exactMatch && typeof exactMatch === 'string') {
      logger.info({ key }, '[SemanticCache] L2 Hit: Exact match found');
      return exactMatch;
    }

    // Level 3: Vector Similarity Search (KNN)
    try {
      const embedding = await this.getEmbedding(prompt);
      if (embedding.length === 0) return null; // Circuit break if embedding fails

      const client = getRedisClient();
      if (!client?.isOpen) return null;

      const vectorBlob = Buffer.from(new Float32Array(embedding).buffer);

      const results = (await client.sendCommand([
        'FT.SEARCH',
        'idx:semantic_cache',
        `*=>[KNN 1 @embedding $BLOB AS score]`,
        'PARAMS',
        '2',
        'BLOB',
        vectorBlob,
        'SORTBY',
        'score',
        'ASC',
        'RETURN',
        '1',
        'response',
        'DIALECT',
        '2',
      ])) as any;

      // searchResults[0] = total results count
      // searchResults[1] = key
      // searchResults[2] = ["response", "the actual response text", "score", "0.001"]
      if (results && results[0] > 0) {
        const fields = results[2];
        const scoreIndex = fields.indexOf('score');
        const responseIndex = fields.indexOf('response');

        const score = parseFloat(fields[scoreIndex + 1]);
        if (score < 1 - this.SIMILARITY_THRESHOLD) {
          const response = fields[responseIndex + 1];
          logger.info({ score }, '[SemanticCache] L3 Hit: Vector similarity match');
          return response;
        }
      }
    } catch (err) {
      logger.debug('[SemanticCache] Vector search failed or index missing - Fallback active');
    }

    return null;
  }

  /**
   * 💾 Store Semantic Response
   */
  async setSemantic(prompt: string, response: string, ttl = 3600 * 24): Promise<void> {
    const key = this.hashPrompt(prompt);
    const cacheKey = `semantic_cache:${key}`;

    // Set L2 (Direct key)
    await setCache(cacheKey, response, ttl);

    // Set L3 (Vector Store)
    try {
      const embedding = await this.getEmbedding(prompt);
      const client = getRedisClient();
      if (client?.isOpen && embedding.length > 0) {
        const vectorKey = `vec:semantic_cache:${key}`;
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
    return Buffer.from(prompt.trim().toLowerCase()).toString('hex').substring(0, 32);
  }
}
