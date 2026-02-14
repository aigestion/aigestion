import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { vertexAIService } from './google/vertex-ai.service';

/**
 * SOVEREIGN PINECONE SERVICE (God Mode)
 * Optimized for high-throughput vector operations and resilience.
 */
@injectable()
export class PineconeService {
  private client: Pinecone | null = null;
  private readonly indexName: string;

  constructor() {
    this.indexName = env.PINECONE_INDEX_NAME || 'aigestion-docs';
    this.initialize();
  }

  private initialize() {
    if (env.PINECONE_API_KEY) {
      try {
        this.client = new Pinecone({
          apiKey: env.PINECONE_API_KEY,
        });
        logger.info({ indexName: this.indexName }, '[PineconeService] Client synchronized with Sovereign Hive');
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
        logger.warn(`[PineconeService] ${context} error (attempt ${attempt + 1}). Retrying in ${delay}ms...`, error.message);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw lastError;
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
  async upsertDocument(id: string, text: string, metadata: any, namespace: string = 'default'): Promise<void> {
    await this.upsertDocBatch([{ id, text, metadata }], namespace);
  }

  /**
   * GOD MODE: High-throughput batch upsert with parallel embedding generation
   */
  async upsertDocBatch(
    documents: { id: string; text: string; metadata: Record<string, any> }[],
    namespace: string = 'documentation'
  ): Promise<void> {
    if (!this.client) return;

    try {
      const index = this.client.index(this.indexName);
      const ns = index.namespace(namespace);

      logger.info(`[PineconeService] Generating embeddings for ${documents.length} docs...`);
      const embeddings = await vertexAIService.generateEmbeddingsBatch(documents.map(d => d.text));

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

      // Pinecone standard: batch in 100s
      const batchSize = 100;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await this.withRetry(() => ns.upsert(batch), `BatchUpsert[${i}]`);
      }

      logger.info(`[PineconeService] Successfully synchronized ${records.length} vectors to namespace: ${namespace}`);
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
    } = {}
  ): Promise<any[]> {
    if (!this.client) return [];

    const { topK = 5, namespace = 'documentation', filter } = params;

    try {
      const embedding = await vertexAIService.generateEmbeddings(queryText);
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

      return queryResponse.matches || [];
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
