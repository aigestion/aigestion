import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import { vectorService } from './vector.service';

export enum ModelComplexity {
  SIMPLE = 'simple',
  COMPLEX = 'complex',
}

export interface AIRoute {
  model: string;
  provider: 'openai' | 'anthropic' | 'google';
}

@injectable()
export class SemanticRouterService {
  /**
   * Classify query complexity
   * In a production scenario, this might use embeddings or a small local model.
   * For this implementation, we use a heuristic-based approach.
   */
  private classifyQuery(query: string): ModelComplexity {
    const complexKeywords = [
      'analyze',
      'architect',
      'performance',
      'optimize',
      'debug',
      'explain deeply',
      'security audit',
      'refactor',
    ];

    const wordCount = query.split(' ').length;
    const hasComplexKeyword = complexKeywords.some(kw => query.toLowerCase().includes(kw));

    if (wordCount > 30 || hasComplexKeyword) {
      return ModelComplexity.COMPLEX;
    }

    return ModelComplexity.SIMPLE;
  }

  /**
   * Get the optimal route for a given query
   */
  async getOptimalRoute(query: string): Promise<AIRoute> {
    const complexity = this.classifyQuery(query);

    // Phase 14: Enhanced Context Awareness
    const memoryContext = await vectorService.search(query, 1);
    const hasLongTermContext = memoryContext.length > 0;

    if (complexity === ModelComplexity.COMPLEX || hasLongTermContext) {
      logger.debug(
        { complexity, hasLongTermContext },
        'Routing to high-intelligence model (GPT-4/Claude-3)'
      );
      return {
        model: process.env.AI_MODEL_COMPLEX || 'gpt-4-turbo-preview',
        provider: 'openai',
      };
    }

    logger.debug({ complexity }, 'Routing to cost-efficient model (GPT-3.5/Haiku)');
    return {
      model: process.env.AI_MODEL_SIMPLE || 'gpt-3.5-turbo',
      provider: 'openai',
    };
  }
}

export const aiRouter = new SemanticRouterService();
