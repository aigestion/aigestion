import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NeuralHealthService } from '../services/NeuralHealthService';
import { PredictiveHealingService } from '../services/PredictiveHealingService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class NeuralHealthController {
  constructor(
    @inject(TYPES.NeuralHealthService) private healthService: NeuralHealthService,
    @inject(TYPES.PredictiveHealingService) private healingService: PredictiveHealingService
  ) {}

  public async getNeuralScore(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = (this.healthService as any).getLatestMetrics();
      res.json(buildResponse(metrics, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[NeuralHealthController] Failed to get neutral score', error);
      next(error);
    }
  }

  public async triggerPhoenix(req: Request, res: Response, next: NextFunction) {
    try {
      logger.warn(`🚨 [NeuralHealthController] MANUAL PHOENIX PROTOCOL TRIGGERED BY God Mode`);
      await (this.healingService as any).triggerPhoenixProtocol();
      res.json(buildResponse({ status: 'PHOENIX_INITIATED' }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[NeuralHealthController] Failed to trigger Phoenix Protocol', error);
      next(error);
    }
  }
}
