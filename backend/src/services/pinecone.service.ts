import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { vertexAIService } from './google/vertex-ai.service';
import { getCache, setCache } from '../cache/redis';
import crypto from 'crypto';

/**
 * SOVEREIGN PINECONE SERVICE (God Mode)
 * Optimized for high-throughput vector operations and resilience.
 */
@injectable()
export class PineconeService {
  private client: Pinecone | null = null;
  private readonly indexName: string;
  private readonly EMBEDDING_CACHE_TTL = 3600 * 24 * 7; // 1 week for embeddings
  private readonly SEARCH_CACHE_TTL = 300; // 5 minutes for search results
  private vertexAIService: any;

  constructor(@inject(TYPES.VertexAIService) vAI?: any) {
    this.indexName = env.PINECONE_INDEX_NAME || 'aigestion-docs';
    this.vertexAIService = vAI || vertexAIService;
    this.initialize();
  }

  private initialize() {
    if (env.PINECONE_API_KEY) {
      try {
        this.client = new Pinecone({
          apiKey: env.PINECONE_API_KEY,
        });
        logger.info(
          { indexName: this.indexName },
          '[PineconeService] Client synchronized with Sovereign Hive',
        );
      } catch (error) {
        logger.error('[PineconeService] Resilience fault during initialization', error);
      }
    } else {
      logger.warn('[PineconeService] PINECONE_API_KEY missing. Vector capabilities restricted.');
    }
  }

  /**
   * Resilient execution wrapper with exponential backoff
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    let lastError: any;
    const maxRetries = 3;
    const baseDelay = 500;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        // Don't retry on 4xx validation errors
        if (error.status >= 400 && error.status < 500) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(
          `[PineconeService] ${context} error (attempt ${attempt + 1}). Retrying in ${delay}ms...`,
          error.message,
        );
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw lastError;
  }

  /**
   * Generates or retrieves cached embeddings for the given text.
   * [GOD MODE] Prevents redundant API calls to Vertex AI.
   */
  private async getCachedEmbeddings(text: string): Promise<number[]> {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    const cacheKey = `embedding:${hash}`;

    const cached = await getCache<number[]>(cacheKey);
    if (cached) {
      logger.debug({ hash }, '[PineconeService] Embedding Cache Hit');
      return cached as number[];
    }

    const embedding = await this.vertexAIService.generateEmbeddings(text);
    if (embedding.length > 0) {
      await setCache(cacheKey, embedding, this.EMBEDDING_CACHE_TTL);
    }
    return embedding;
  }

  /**
   * Generates a stable hash for cache keys.
   */
  private generateHash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generates or retrieves cached embeddings for a batch of texts.
   */
  private async getCachedEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = new Array(texts.length);
    const individualCacheKeys = texts.map(t => `embedding:${this.generateHash(t)}`);

    const cachedResults = await Promise.all(individualCacheKeys.map(key => getCache(key)));

    const missingIndices: number[] = [];
    const missingTexts: string[] = [];

    cachedResults.forEach((res, idx) => {
      if (res) {
        results[idx] = res as number[];
      } else {
        missingIndices.push(idx);
        missingTexts.push(texts[idx]);
      }
    });

    if (missingTexts.length === 0) {
      return results;
    }

    logger.info(
      { missing: missingTexts.length, total: texts.length },
      '[PineconeService] Cache Miss: Generating partial embeddings',
    );
    const newEmbeddings = await this.vertexAIService.generateEmbeddingsBatch(missingTexts);

    await Promise.all(
      newEmbeddings.map(async (emb: number[], i: number) => {
        const actualIdx = missingIndices[i];
        results[actualIdx] = emb;
        await setCache(individualCacheKeys[actualIdx], emb, this.EMBEDDING_CACHE_TTL);
      }),
    );

    return results;
  }

  /**
   * Get health and statistics for the sovereign index
   */
  async getHealth() {
    if (!this.client) return { status: 'disabled' };
    try {
      const stats = await this.client.index(this.indexName).describeIndexStats();
      return {
        status: 'ready',
        stats,
      };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }

  /**
   * Upserts a single document (wrapper for batch)
   */
  async upsertDocument(
    id: string,
    text: string,
    metadata: any,
    namespace: string = 'default',
  ): Promise<void> {
    await this.upsertDocBatch([{ id, text, metadata }], namespace);
  }

  /**
   * GOD MODE: High-throughput batch upsert with parallel embedding generation
   */
  async upsertDocBatch(
    documents: { id: string; text: string; metadata: Record<string, any> }[],
    namespace: string = 'documentation',
  ): Promise<void> {
    if (!this.client) return;

    try {
      const index = this.client.index(this.indexName);
      const ns = index.namespace(namespace);

      logger.info(
        `[PineconeService] Synchronizing ${documents.length} docs to namespace: ${namespace}...`,
      );
      const embeddings = await this.getCachedEmbeddingsBatch(documents.map(d => d.text));

      const records: PineconeRecord[] = documents.map((doc, idx) => ({
        id: doc.id,
        values: embeddings[idx],
        metadata: {
          ...doc.metadata,
          text: doc.text.substring(0, 4000), // Sovereign context expansion
          updatedAt: new Date().toISOString(),
          wordCount: doc.text.split(/\s+/).length,
        },
      }));

      logger.info(
        {
          recordsCount: records.length,
          firstRecordId: records[0]?.id,
          embeddingLength: records[0]?.values?.length,
        },
        '[PineconeService] Preparing records for upsert',
      );

      if (records.length === 0) {
        logger.warn('[PineconeService] No records to upsert.');
        return;
      }

      // Pinecone standard: batch in 100s
      const batchSize = 100;
      const tasks: Promise<any>[] = [];

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = [...records.slice(i, i + batchSize)]; // Ensure fresh array
        if (batch.length > 0) {
          tasks.push(
            this.withRetry(async () => {
              return await ns.upsert({ records: batch });
            }, `BatchUpsert[${i}]`),
          );
        }
      }

      // Parallel upsert for maximum throughput
      if (tasks.length > 0) {
        await Promise.all(tasks);
      }

      logger.info(`[PineconeService] Successfully synchronized ${records.length} vectors.`);
    } catch (error) {
      logger.error('[PineconeService] Critical fail during batch synchronization', error);
      throw error;
    }
  }

  /**
   * SOVEREIGN SEARCH: Advanced semantic retrieval
   */
  async search(
    queryText: string,
    params: {
      topK?: number;
      namespace?: string;
      filter?: Record<string, any>;
    } = {},
  ): Promise<any[]> {
    if (!this.client) return [];

    const { topK = 5, namespace = 'documentation', filter } = params;

    // [SUPREME CACHE] Check if search result is cached
    const searchHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ queryText, topK, namespace, filter }))
      .digest('hex');
    const searchCacheKey = `search_cache:${searchHash}`;

    const cachedResults = await getCache(searchCacheKey);
    if (cachedResults) {
      logger.debug('[PineconeService] Search Cache Hit');
      return cachedResults as any[];
    }

    try {
      const embedding = await this.getCachedEmbeddings(queryText);
      const ns = this.client.index(this.indexName).namespace(namespace);

      const queryResponse = (await this.withRetry(
        () =>
          ns.query({
            vector: embedding,
            topK,
            filter,
            includeMetadata: true,
          }),
        'SemanticSearch',
      )) as any;

      const results = queryResponse.matches || [];

      // Store in cache
      if (results.length > 0) {
        await setCache(searchCacheKey, results, this.SEARCH_CACHE_TTL);
      }

      return results;
    } catch (error) {
      logger.error('[PineconeService] Search fault in sovereign registry', error);
      throw error;
    }
  }

  /**
   * MAINTENANCE: Clear a specific namespace
   */
  async purgeNamespace(namespace: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.index(this.indexName).namespace(namespace).deleteAll();
      logger.info({ namespace }, '[PineconeService] Namespace purged successfully');
    } catch (error) {
      logger.error('[PineconeService] Purge fault', error);
    }
  }
}

export const pineconeService = new PineconeService();
