import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { RagService } from './rag.service';
import { SovereignVaultService } from './SovereignVaultService';
import { KnowledgeGraphService } from './knowledge-graph.service';
import { logger } from '../utils/logger';

export interface KnowledgePack {
  codeContext: string;
  vaultContext: string;
  graphContext: string;
  summary: string;
}

/**
 * 🧠 SOVEREIGN KNOWLEDGE ENGINE (SKE)
 * The unified brain of the AI Swarm.
 * Orchestrates deep codebase analysis and long-term semantic recall.
 */
@injectable()
export class SovereignKnowledgeEngine {
  constructor(
    @inject(TYPES.RagService) private readonly rag: RagService,
    @inject(TYPES.SovereignVaultService) private readonly vault: SovereignVaultService,
    @inject(TYPES.KnowledgeGraphService) private readonly graph: KnowledgeGraphService
  ) {}

  /**
   * 🌌 Perform deep recall across all knowledge stacks.
   * Knowledge depth is governed by the user's subscription tier.
   */
  async recall(query: string, tier: string = 'free'): Promise<KnowledgePack> {
    const tierLimits: Record<string, number> = {
      free: 2,
      basic: 5,
      premium: 10,
      elite: 20
    };

    const limit = tierLimits[tier] || tierLimits.free;
    logger.info({ query, tier, limit }, '[SKE] Initiating tier-aware neural recall');

    const [codeContext, vaultResults, graphResults] = await Promise.all([
      this.rag.getProjectContext(query),
      this.vault.query(query, limit),
      this.graph.hybridSearch(query, limit)
    ]);

    const vaultContext = vaultResults
      .map(res => `[Source: ${res.source.toUpperCase()}] ${res.content}`)
      .join('\n\n');

    const graphContext = graphResults
      .map(node => `[Graph Node: ${node.id}] ${node.neighbors.length} relations found.`)
      .join('\n');

    return {
      codeContext,
      vaultContext,
      graphContext,
      summary: `Knowledge synthesized from Codebase, ${vaultResults.length} memory fragments, and Knowledge Graph (Tier: ${tier.toUpperCase()}).`
    };
  }

  /**
   * 📥 Ingest information into the permanent record.
   */
  async learn(title: string, content: string, tags: string[] = []): Promise<void> {
    logger.info({ title }, '[SKE] Learning new information');
    await this.vault.ingest(title, content, tags);
  }
}
