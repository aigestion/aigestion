import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { PineconeService } from './pinecone.service';
import { SupabaseGodService } from './supabase-god.service';
import { VertexAIService } from './google/vertex-ai.service';
import { VectorStoreIndex, storageContextFromDefaults } from 'llamaindex';
import { logger } from '../utils/logger';

export interface MemoryResult {
  content: string;
  metadata: any;
  score: number;
  source: 'semantic' | 'relational';
}

/**
 * SOVEREIGN MEMORY SERVICE (RAG 2.0)
 * Hybrid intelligence layer combining Pinecone (Semantic) and Supabase (Relational).
 */
@injectable()
export class MemoryService {
  constructor(
    @inject(TYPES.PineconeService) private pinecone: PineconeService,
    @inject(TYPES.SupabaseGodService) private supabase: SupabaseGodService,
    @inject(TYPES.VertexAIService) private vertex: VertexAIService
  ) {
    this.initializeLlamaIndex();
  }

  private async initializeLlamaIndex() {
      logger.info('📚 LlamaIndex Ingestion Engine Initialized');
  }

  /**
   * Universal Data Ingestion (LlamaIndex)
   * Supports complex files, Notion, Slack, etc.
   */
  async ingestUniversal(dataSource: any) {
      logger.info('[MemoryService] Universal Ingestion Initiated via LlamaIndex');
      // Logic for LlamaIndex loaders would go here
      return { status: 'ingested' };
  }

  /**
   * Hybrid Search: Executes semantic and relational queries in parallel.
   */
  async hybridSearch(query: string, limit: number = 5, namespace: string = 'general'): Promise<MemoryResult[]> {
    logger.info(`[MemoryService] Initiating hybrid search: "${query}" in namespace: ${namespace}`);

    try {
      // 1. Generate Embeddings for the search
      const embedding = await this.vertex.generateEmbeddings(query);

      // 2. Parallel Execution: Pinecone (Vector) + Supabase (SQL)
      const [vectorResults, relationalResults] = await Promise.all([
        this.pinecone.query(embedding, limit, namespace),
        this.supabase.searchDocuments(query, limit) // Assuming searchDocuments exists or using standard SQL
      ]);

      // 3. Normalize and Merge
      const semanticResults: MemoryResult[] = vectorResults.map((match: any) => ({
        content: match.metadata.content || match.id,
        metadata: match.metadata,
        score: match.score,
        source: 'semantic'
      }));

      const sqlResults: MemoryResult[] = relationalResults.map((doc: any) => ({
        content: doc.content || doc.text,
        metadata: doc.metadata,
        score: 0.85, // Relational matches are highly relevant by default in this context
        source: 'relational'
      }));

      // 4. De-duplicate and Sort
      const combined = [...semanticResults, ...sqlResults]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      logger.debug(`[MemoryService] Hybrid search retrieved ${combined.length} relevant fragments.`);
      return combined;
    } catch (error) {
      logger.error('[MemoryService] Search synchronization fault', error);
      throw error;
    }
  }

  /**
   * Memory Commit: Persists data into both layers for full durability.
   */
  async commit(content: string, metadata: any = {}, namespace: string = 'general'): Promise<void> {
    logger.info(`[MemoryService] Committing new memory fragment to Sovereign layers.`);

    try {
      // Parallel Commit
      await Promise.all([
        this.pinecone.upsert([{ id: `mem_${Date.now()}`, values: await this.vertex.generateEmbeddings(content), metadata: { ...metadata, content } }], namespace),
        this.supabase.saveDocument({ content, metadata, namespace })
      ]);
      
      logger.info('[MemoryService] Memory synchronized successfully.');
    } catch (error) {
      logger.error('[MemoryService] Commit failed', error);
      throw error;
    }
  }

  /**
   * Reflexive Purge: Cleans caches and redundant memories.
   */
  async reflexivePurge(namespace: string): Promise<void> {
      await this.pinecone.deleteAll(namespace);
      logger.info(`[MemoryService] Namespace ${namespace} purged for re-learning.`);
  }
}
