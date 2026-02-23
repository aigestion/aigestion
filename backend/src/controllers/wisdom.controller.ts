import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { ColabService } from '../services/google/colab.service';

/**
 * WISDOM CONTROLLER (GOD MODE)
 * Provides high-level strategic insights and orchestration for deep reasoning tasks.
 */
@injectable()
export class WisdomController {
  constructor(
    @inject(TYPES.ColabService) private readonly colab: ColabService,
    @inject(TYPES.SwarmService) private readonly swarm: any,
  ) {}

  /**
   * Generates a "Wisdom Card" based on current system trends.
   */
  public async getWisdomCard(req: Request, res: Response, next: NextFunction) {
    logger.info('[WisdomController] 🌌 Generating high-level strategic wisdom card.');
    try {
      const { topic } = req.query;

      // Dispatch a 'wisdom' task to the swarm
      const response = await this.swarm.orchestrate({
        id: `wisdom_${Date.now()}`,
        type: 'wisdom',
        payload: (topic as string) || 'General System Optimization',
      });

      res.json({
        title: 'Sovereign Wisdom Insight',
        insight: response.result,
        status: 'Strategically Verified',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Triggers a deep research notebook generation and execution task.
   */
  public async triggerDeepResearch(req: Request, res: Response, next: NextFunction) {
    logger.info('[WisdomController] 🚀 Triggering Deep Research Mission.');
    try {
      const { topic, context } = req.body;
      const result = await this.colab.runDeepResearch(topic, context);
      res.json({
        message: 'Deep Research Mission Dispatched',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Processes outputs from an executed notebook to extract wisdom.
   */
  public async processWisdom(req: Request, res: Response, next: NextFunction) {
    const { fileId } = req.params;
    logger.info(`[WisdomController] 🧐 Processing extracted wisdom for: ${fileId}`);
    try {
      const wisdom = await this.colab.fetchAndProcessWisdom(fileId);
      res.json({
        fileId,
        wisdom,
        status: 'Wisdom Indexed',
      });
    } catch (error) {
      next(error);
    }
  }
}
