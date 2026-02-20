import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { PredictiveBIService } from '../services/PredictiveBIService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class PredictiveBIController {
  constructor(
    @inject(TYPES.PredictiveBIService) private biService: PredictiveBIService
  ) {}

  public async getProjections(req: Request, res: Response, next: NextFunction) {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const [revenue, ltv] = await Promise.all([
        this.biService.getRevenueForecast(months),
        this.biService.getLTVProjection()
      ]);

      res.json(buildResponse({
        revenue,
        ltv,
        timestamp: new Date().toISOString()
      }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PredictiveBIController] Failed to get projections', error);
      next(error);
    }
  }

  public async getChurnRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req as any).user?.id || req.headers['x-user-id'];

      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID required' });
      }

      const risk = await this.biService.calculateChurnRisk(userId);
      res.json(buildResponse(risk, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PredictiveBIController] Failed to get churn risk', error);
      next(error);
    }
  }
}
