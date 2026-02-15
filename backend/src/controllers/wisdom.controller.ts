import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

/**
 * WISDOM CONTROLLER
 * Provides high-level strategic insights and orchestration for deep reasoning tasks.
 */
@injectable()
export class WisdomController {
  constructor(
    @inject(TYPES.NotebookInsightService) private notebook: any, // Using any for injection demo
    @inject(TYPES.SwarmService) private swarm: any
  ) {}

  /**
   * Generates a "Wisdom Card" based on current system trends.
   */
  public async getWisdomCard(req: Request, res: Response, next: NextFunction) {
    logger.info('[WisdomController] Generating high-level strategic wisdom card.');
    try {
      const { topic } = req.query;

      // Dispatch a 'wisdom' task to the swarm
      const response = await this.swarm.orchestrate({
          id: `wisdom_${Date.now()}`,
          type: 'wisdom',
          payload: topic as string || 'General System Optimization'
      });

      res.json({
          title: 'Sovereign Wisdom Insight',
          insight: response.result,
          status: 'Strategically Verified',
          timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Triggers a deep research notebook generation.
   */
  public async triggerDeepResearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, context } = req.body;
      const result = await this.notebook.generateInsightNotebook(topic, context);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
