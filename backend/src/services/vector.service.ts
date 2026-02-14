import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import { pineconeService } from './pinecone.service';

export interface VectorDocument {
  id: string;
  text: string;
  metadata: Record<string, any>;
  namespace?: string;
}

/**
 * UNIFIED VECTOR REGISTRY (God Mode)
 * Orchastrates semantic memory across the Sovereign Ecosystem.
 */
@injectable()
export class VectorService {
  /**
   * Synchronize document with Semantic Memory
   */
  async upsert(doc: VectorDocument): Promise<boolean> {
    try {
      const namespace = doc.namespace || 'documentation';
      logger.info({ docId: doc.id, namespace }, '[VectorService] Indexing to Semantic Memory');

      await pineconeService.upsertDocument(
        doc.id,
        doc.text,
        {
          ...doc.metadata,
          source: 'vector-service-upload',
        },
        namespace
      );

      return true;
    } catch (error) {
      logger.error({ error, docId: doc.id }, '[VectorService] Upsert fault in semantic layer');
      return false;
    }
  }

  /**
   * Execute semantic interaction (Search)
   */
  async search(query: string, limit: number = 5, namespace: string = 'documentation') {
    try {
      logger.info({ query, limit, namespace }, '[VectorService] Querying Quantum Registry');

      const matches = await pineconeService.search(query, {
        topK: limit,
        namespace,
      });

      // Format for standardized response
      return matches.map(match => ({
        id: match.id,
        text: match.metadata?.text || '',
        score: match.score || 0,
        metadata: match.metadata || {},
      }));
    } catch (error) {
      logger.error({ error, query }, '[VectorService] Search fault in quantum registry');
      return [];
    }
  }

  /**
   * Perform deep cleanup of a memory segment
   */
  async clearMemory(namespace: string): Promise<void> {
    await pineconeService.purgeNamespace(namespace);
  }
}

export const vectorService = new VectorService();
