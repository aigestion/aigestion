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
  async upsertDocBatch(
    documents: { id: string; text: string; metadata: any }[],
    namespace: string = 'default'
  ): Promise<void> {
    if (!this.client) {
      logger.warn('[PineconeService] Client not initialized. Skipping batch upsert.');
      return;
    }

    try {
      const index = this.client.index(this.indexName);
      const ns = index.namespace(namespace);

      // Generate Embeddings in parallel
      const records: PineconeRecord[] = await Promise.all(
        documents.map(async (doc) => {
          const embedding = await vertexAIService.generateEmbeddings(doc.text);
          if (embedding.length === 0) {
            throw new Error(`Failed to generate embeddings for document ${doc.id}`);
          }
          return {
            id: doc.id,
            values: embedding,
            metadata: {
              ...doc.metadata,
              text: doc.text.substring(0, 3000), // Increased context length
              timestamp: new Date().toISOString(),
            },
          } as PineconeRecord;
        })
      );

      if (records.length > 0) {
        // Pinecone recommends batches of ~100
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await ns.upsert(batch);
        }
        logger.info(
          `[PineconeService] Successfully upserted ${records.length} documents into namespace: ${namespace}`
        );
      }
    } catch (error) {
      logger.error('[PineconeService] Error in batch upsert to Pinecone:', error);
      throw error;
    }
  }

  /**
   * Searches for similar documents
   */
  async search(
    queryText: string,
    topK: number = 5,
    namespace: string = 'default',
    filter?: object
  ): Promise<any[]> {
    if (!this.client) {
      logger.warn('[PineconeService] Client not initialized. Returning empty results.');
      return [];
    }

    try {
      const embedding = await vertexAIService.generateEmbeddings(queryText);
      const index = this.client.index(this.indexName);
      const ns = index.namespace(namespace);

      const queryResponse = await ns.query({
        vector: embedding,
        topK,
        filter,
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
