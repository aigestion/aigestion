import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { RagService } from '../rag.service';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';

export interface Source {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'url' | 'note';
  metadata?: any;
}

export interface SourceSet {
  id: string;
  name: string;
  sources: Source[];
}

/**
 * SOVEREIGN KNOWLEDGE SERVICE
 * Mimics NotebookLM behavior by managing "Source Sets" for grounded reasoning.
 */
@injectable()
export class SovereignKnowledgeService {
  private readonly CACHE_PREFIX = 'knowledge:sourceset:';

  constructor(
    @inject(TYPES.RagService) private readonly rag: RagService
  ) {}

  /**
   * Creates a new collection of sources for grounded analysis.
   */
  async createSourceSet(name: string, sources: Source[]): Promise<SourceSet> {
    const id = `ss_${Date.now()}`;
    const sourceSet: SourceSet = { id, name, sources };
    
    await setCache(`${this.CACHE_PREFIX}${id}`, sourceSet, 3600 * 24); // 24h persistent session
    logger.info(`[KnowledgeService] Source Set created: ${name} (${sources.length} sources)`);
    
    return sourceSet;
  }

  /**
   * Retrieves specific context from a Source Set based on a query.
   */
  async getGroundedContext(sourceSetId: string, query: string): Promise<string> {
    const sourceSet = await getCache<SourceSet>(`${this.CACHE_PREFIX}${sourceSetId}`);
    if (!sourceSet) {
      throw new Error(`Source Set ${sourceSetId} not found or expired.`);
    }

    logger.info(`[KnowledgeService] Grounding query in Source Set: ${sourceSet.name}`);

    // Filter sources by simple relevance (simulation of local grounding)
    const relevantSources = sourceSet.sources.filter((s: Source) => 
      s.content.toLowerCase().includes(query.toLowerCase()) || 
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (relevantSources.length === 0) {
      return "No matching information found in the provided sources.";
    }

    return relevantSources
      .map((s: Source) => `[Source: ${s.name} (${s.type})]\n${s.content}`)
      .join('\n\n---\n\n');
  }

  /**
   * Generates a "Sovereign Briefing" (NotebookLM style Audio Overview script).
   */
  async generateBriefing(sourceSetId: string): Promise<string> {
    const sourceSet = await getCache<SourceSet>(`${this.CACHE_PREFIX}${sourceSetId}`);
    if (!sourceSet) throw new Error('Source Set not found');

    const totalContent = sourceSet.sources.map((s: Source) => s.content).join('\n\n');
    
    // This will be used by NexusRadioService to create the podcast
    return totalContent;
  }
}
