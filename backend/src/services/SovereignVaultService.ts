import { injectable, inject } from 'inversify';
import axios from 'axios';
import { TYPES } from '../types';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { pineconeService } from './pinecone.service';
import { supabaseService } from './supabase.service';
import { vertexAIService } from './google/vertex-ai.service';

export interface VaultResult {
  content: string;
  source: 'local' | 'cloud' | 'sovereign';
  score: number;
  metadata: Record<string, any>;
}

@injectable()
export class SovereignVaultService {
  private readonly chromaUrl: string;

  constructor() {
    this.chromaUrl = process.env.CHROMA_URL || 'http://localhost:8000';
  }

  /**
   * 🌌 Unified Semantic Recall
   * Queries Local (Chroma), Cloud (Pinecone), and Sovereign (Supabase) in parallel.
   */
  async query(text: string, limit: number = 3): Promise<VaultResult[]> {
    logger.info({ query: text }, '[SovereignVault] Unified recall triggered');

    try {
      // Generate embeddings ONCE for all queries
      const embedding = await vertexAIService.generateEmbeddings(text);

      const [local, cloud, sovereign] = await Promise.all([
        this.queryLocal(text, embedding, limit),
        this.queryCloud(text, embedding, limit),
        this.querySovereign(text, embedding, limit),
      ]);

      const allResults = [...local, ...cloud, ...sovereign];

      // Multi-source Reranking by Score
      return allResults.sort((a, b) => b.score - a.score).slice(0, limit * 2);
    } catch (error: any) {
      logger.error({ error: error.message }, '[SovereignVault] Query failed');
      return [];
    }
  }

  private async queryLocal(
    text: string,
    embedding: number[],
    limit: number,
  ): Promise<VaultResult[]> {
    try {
      // Direct call to ChromaDB Port 8000
      const response = await axios.get(`${this.chromaUrl}/api/v1/heartbeat`);
      if (response.status === 200) {
        // Placeholder: ChromaDB implementation would use the embedding vector here
        // For now, we return empty but log the health status
        return [];
      }
      return [];
    } catch (err) {
      logger.warn('[SovereignVault] Local ChromaDB unreachable');
      return [];
    }
  }

  private async queryCloud(
    text: string,
    embedding: number[],
    limit: number,
  ): Promise<VaultResult[]> {
    try {
      // Pinecone search using pre-generated embeddings could be optimized,
      // but current pineconeService.search re-ranks/generates.
      // We use the text for now as search accepts string, but ideally would accept vector.
      const results = await pineconeService.search(text, limit);
      return results.map(res => ({
        content: res.metadata?.text || '',
        source: 'cloud',
        score: res.score || 0,
        metadata: res.metadata || {},
      }));
    } catch (err) {
      logger.warn('[SovereignVault] Cloud retrieval failed');
      return [];
    }
  }

  private async querySovereign(
    text: string,
    embedding: number[],
    limit: number,
  ): Promise<VaultResult[]> {
    try {
      // Supabase Hybrid Search using real embeddings
      const results = await supabaseService.hybridSearch(undefined, text, embedding, 0.3, limit);

      return results.map((res: any) => ({
        content: res.content || '',
        source: 'sovereign',
        score: res.rank || 0.5,
        metadata: { title: res.title, ...res.metadata },
      }));
    } catch (err) {
      logger.warn('[SovereignVault] Sovereign retrieval failed');
      return [];
    }
  }

  /**
   * 📥 Multi-Vault Ingestion
   */
  async ingest(filename: string, content: string, tags: string[] = []): Promise<void> {
    logger.info({ filename }, '[SovereignVault] Synchronized ingestion started');

    await Promise.all([
      pineconeService.upsertDocument(filename, content, { filename, tags }),
      supabaseService.upsertDocument({
        title: filename,
        content,
        metadata: { tags },
      }),
      // Local Chroma ingestion would go here
    ]);
  }
}
