import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { RagService } from './rag.service';
import { SovereignVaultService } from './SovereignVaultService';
import { logger } from '../utils/logger';

export interface KnowledgePack {
  codeContext: string;
  vaultContext: string;
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
    @inject(TYPES.SovereignVaultService) private readonly vault: SovereignVaultService
  ) {}

  /**
   * 🌌 Perform deep recall across all knowledge stacks.
   */
  async recall(query: string, limit: number = 5): Promise<KnowledgePack> {
    logger.info({ query }, '[SKE] Initiating unified neural recall');

    const [codeContext, vaultResults] = await Promise.all([
      this.rag.getProjectContext(query),
      this.vault.query(query, limit)
    ]);

    const vaultContext = vaultResults
      .map(res => `[Source: ${res.source.toUpperCase()}] ${res.content}`)
      .join('\n\n');

    return {
      codeContext,
      vaultContext,
      summary: `Knowledge synthesized from Codebase and ${vaultResults.length} memory fragments.`
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
