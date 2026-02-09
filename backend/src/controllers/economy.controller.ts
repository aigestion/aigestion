import { Request, Response } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { EconomyService, AssetPrice } from '../services/economy.service';
import { logger } from '../utils/logger';

@controller('/v1/economy')
export class EconomyController {
  constructor(@inject(TYPES.EconomyService) private economyService: EconomyService) {}

  @httpGet('/prices')
  async getPrices(req: Request, res: Response): Promise<void> {
    try {
      const prices = await this.economyService.getEconomyUpdate();
      res.status(200).json({ success: true, data: prices });
    } catch (error) {
      logger.error('[EconomyController] Error fetching prices:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch prices' });
    }
  }

  @httpGet('/advice')
  async getAdvice(req: Request, res: Response): Promise<void> {
    try {
      const advice = await this.economyService.getInvestmentAdvice();
      res.status(200).json({ success: true, data: advice });
    } catch (error) {
      logger.error('[EconomyController] Error fetching advice:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch advice' });
    }
  }

  @httpGet('/portfolio')
  async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      // For the prototype, we use 'god_mode' as the userId.
      // In production, this would come from req.user.id
      const stats = await this.economyService.getPortfolioStats('god_mode');
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      logger.error('[EconomyController] Error fetching portfolio:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch portfolio' });
    }
  }

  @httpGet('/history/:symbol')
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const symbol = req.params.symbol as string;
      const history = await this.economyService.getHistoricalPrices(symbol);
      res.status(200).json({ success: true, data: history });
    } catch (error) {
      logger.error(`[EconomyController] Error fetching history for ${req.params.symbol}:`, error);
      res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
  }
}
