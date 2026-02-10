import { Request, Response } from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { SovereignSentinelService } from '../services/SovereignSentinelService';
import { logger } from '../utils/logger';

@controller('/sovereign/sentinel')
export class SentinelController {
  constructor(
    @inject(TYPES.SovereignSentinelService) private sentinelService: SovereignSentinelService
  ) {}

  @httpGet('/forecast')
  public async getForecast(@response() res: Response) {
    try {
      const forecasts = await this.sentinelService.getResourceForecasts();
      return res.json({
        success: true,
        timestamp: new Date(),
        forecasts
      });
    } catch (error) {
      logger.error('[SentinelController] Forecast failed:', error);
      return res.status(500).json({ error: 'Failed to generate resource forecast' });
    }
  }
}
