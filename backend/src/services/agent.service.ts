
import { Service } from 'typedi';
import { logger } from '../utils/logger';
import { SemanticRouterService } from './ai-router.service';
import { VectorService } from './vector.service';

@Service()
export class AgentService {
  constructor(
    private vectorService: VectorService,
    private semanticRouter: SemanticRouterService,
  ) {}

  public async processQuery(userId: string, query: string, context?: any): Promise<any> {
    logger.info(`Agent processing query for user ${userId}: ${query}`);

    // 1. Retrieve Long-Term Memory (Context)
    const memory = await this.vectorService.search(query, 5);
    const relevantContext = memory.map(m => (m as any).content || m.text || '').join('\n');

    logger.debug(`Retrieved ${memory.length} memory fragments`);

    // 2. Decide Strategy via Semantic Router
    const route = 'default'; // Simplified for now

    // 3. Execute Action (Placeholder for now)
    // Here we would switch based on 'route' (e.g. valid tool call, simple chat, etc.)

    return {
      query,
      route,
      context: relevantContext,
      response: `[Agent] Processed via vector memory. Route: ${(route as any).type || route}`,
    };
  }

  public async saveExperience(userId: string, content: string, metadata?: any): Promise<void> {
    const doc = {
      id: `${userId}-${Date.now()}`,
      text: content,
      metadata: { ...metadata, userId },
    };
    await this.vectorService.upsert(doc);
    logger.info(`Agent saved new experience for user ${userId}`);
  }
}
