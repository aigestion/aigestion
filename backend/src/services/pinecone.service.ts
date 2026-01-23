import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { vertexAIService } from './google/vertex-ai.service';

@injectable()
export class PineconeService {
  private client: Pinecone | null = null;
  private indexName = 'aigestion-docs';

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (env.PINECONE_API_KEY) {
      try {
        this.client = new Pinecone({
          apiKey: env.PINECONE_API_KEY,
        });
        logger.info('[PineconeService] Client initialized');
      } catch (error) {
        logger.error('[PineconeService] Failed to initialize client', error);
      }
    } else {
      logger.warn('[PineconeService] PINECONE_API_KEY not set. Service disabled.');
    }
  }

  /**
   * Upserts document embeddings into Pinecone
   */
  async upsertDocument(id: string, text: string, metadata: any): Promise<void> {
    await this.upsertDocBatch([{ id, text, metadata }]);
  }

  /**
   * Upserts a batch of documents into Pinecone
   */
  async upsertDocBatch(documents: { id: string; text: string; metadata: any }[]): Promise<void> {
    if (!this.client) {
      logger.warn('[PineconeService] Client not initialized. Skipping batch upsert.');
      return;
    }

    try {
      const index = this.client.index(this.indexName);
      const records: PineconeRecord[] = [];

      for (const doc of documents) {
        // Generate Embeddings using Vertex AI
        const embedding = await vertexAIService.generateEmbeddings(doc.text);

        if (embedding.length === 0) {
          logger.error(`[PineconeService] Failed to generate embeddings for document ${doc.id}`);
          continue;
        }

        records.push({
          id: doc.id,
          values: embedding,
          metadata: {
            ...doc.metadata,
            text: doc.text.substring(0, 2000), // Store more text for context
            timestamp: new Date().toISOString(),
          },
        });
      }

      if (records.length > 0) {
        // Pinecone recommends batches of ~100
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await index.upsert(batch);
        }
        logger.info(`[PineconeService] Successfully upserted batch of ${records.length} documents`);
      }
    } catch (error) {
      logger.error('[PineconeService] Error in batch upsert to Pinecone:', error);
      throw error;
    }
  }

  /**
   * Searches for similar documents
   */
  async search(queryText: string, topK: number = 5): Promise<any[]> {
    if (!this.client) {
      logger.warn('[PineconeService] Client not initialized. Returning empty results.');
      return [];
    }

    try {
      const embedding = await vertexAIService.generateEmbeddings(queryText);
      const index = this.client.index(this.indexName);

      const queryResponse = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
      });

      return queryResponse.matches || [];
    } catch (error) {
      logger.error('[PineconeService] Error searching Pinecone:', error);
      throw error;
    }
  }
}
export const pineconeService = new PineconeService();
