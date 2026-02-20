import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { DeFiYieldHarvesterService } from '../services/DeFiYieldHarvesterService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class FinanceController {
  constructor(
    @inject(TYPES.DeFiYieldHarvesterService) private harvester: DeFiYieldHarvesterService
  ) {}

  public async getYields(req: Request, res: Response, next: NextFunction) {
    try {
      const yields = await this.harvester.getAggregatedYields();
      res.json(buildResponse({ yields }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[FinanceController] Failed to fetch yields', error);
      next(error);
    }
  }

  public async harvest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.harvester.harvestAllYields();
      res.json(buildResponse(result, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[FinanceController] Harvest operation failed', error);
      next(error);
    }
  }
}
