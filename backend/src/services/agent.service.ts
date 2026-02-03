import { Service } from 'typedi';
import { Logger } from '../utils/logger';
import { VectorService } from './vector.service';
import { SemanticRouterService } from './ai-router.service';

@Service()
export class AgentService {
  constructor(
    private vectorService: VectorService,
    private semanticRouter: SemanticRouterService
  ) {}

  public async processQuery(userId: string, query: string, context?: any): Promise<any> {
    Logger.info(`Agent processing query for user ${userId}: ${query}`);

    // 1. Retrieve Long-Term Memory (Context)
    const memory = await this.vectorService.search(userId, query);
    const relevantContext = memory.map(m => m.content).join('\n');

    Logger.debug(`Retrieved ${memory.length} memory fragments`);

    // 2. Decide Strategy via Semantic Router
    const route = await this.semanticRouter.routeQuery(query);
    
    // 3. Execute Action (Placeholder for now)
    // Here we would switch based on 'route' (e.g. valid tool call, simple chat, etc.)
    
    return {
      query,
      route,
      context: relevantContext,
      response: `[Agent] Processed via vector memory. Route: ${route.type}`
    };
  }

  public async saveExperience(userId: string, content: string, metadata?: any): Promise<void> {
    await this.vectorService.upsert(userId, content, metadata);
    Logger.info(`Agent saved new experience for user ${userId}`);
  }
}
