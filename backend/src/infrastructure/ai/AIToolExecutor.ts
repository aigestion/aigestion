import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { RagService } from '../../services/rag.service';
import { AnalyticsService } from '../../services/analytics.service';
import { StripeTool } from '../../tools/stripe.tool';
import { SearchWebTool } from '../../tools/web-search.tool';
import { logger } from '../../utils/logger';
import { Readable } from 'node:stream';

@injectable()
export class AIToolExecutor {
  constructor(
    @inject(TYPES.RagService) private ragService: RagService,
    @inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService
  ) {}

  public getStaticToolDefinitions(): any[] {
    return [
      {
        name: 'get_revenue_analytics',
        description: 'Get monthly revenue data for the dashboard.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'get_user_growth',
        description: 'Get user growth trends for the last 14 days.',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'search_web',
        description: 'Search the web for real-time information, news, or technical documentation.',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string', description: 'The search query.' } },
          required: ['query'],
        },
      },
      {
        name: 'get_codebase_context',
        description: 'Read the codebase to understand the project architecture or specific details.',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string', description: 'Focus query' } },
        },
      },
      {
        name: 'manage_subscription',
        description: 'Manage user subscriptions, check status, or generate checkout links.',
        parameters: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['get_status', 'create_checkout', 'create_portal'] },
            priceId: { type: 'string' }
          },
          required: ['action'],
        },
      },
    ];
  }

  async handleToolCall(call: any, stream: Readable, userId: string): Promise<string> {
    const { name, args } = call;
    logger.info(`[ToolExecutor] Executing ${name}`, args);

    let result = '';
    try {
      if (name === 'get_revenue_analytics') {
        const data = await this.analyticsService.getDashboardData();
        result = JSON.stringify(data.revenue);
        stream.push(`data: ${JSON.stringify({ type: 'a2ui', component: 'chart', props: { title: 'Revenue', data: data.revenue } })}\n\n`);
      } else if (name === 'search_web') {
        const searchTool = new SearchWebTool();
        const searchResults = await searchTool.execute({ query: args.query });
        result = JSON.stringify(searchResults);
      } else if (name === 'get_codebase_context') {
        result = await this.ragService.getProjectContext(args.query);
      } else if (name === 'manage_subscription') {
        const stripeTool = new StripeTool();
        const res = await stripeTool.execute({ ...args, userId });
        result = JSON.stringify(res);
      }
      
      if (result) {
         stream.push(`data: ${JSON.stringify({ type: 'text', content: `[Tool Result: ${result.substring(0, 100)}...]` })}\n\n`);
      }
      return result;
    } catch (err: any) {
      logger.error(`[ToolExecutor] Error in ${name}:`, err);
      return `Error executing tools: ${err.message}`;
    }
  }
}
