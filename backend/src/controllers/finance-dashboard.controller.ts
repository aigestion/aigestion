
import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { PriceAlertService } from '../services/finance/price-alert.service';
import { WalletWatchtowerService } from '../services/finance/wallet-watchtower.service';

@controller('/finance')
export class FinanceDashboardController {
  constructor(
    @inject(TYPES.DeFiStrategistService) private strategist: DeFiStrategistService,
    @inject(TYPES.PriceAlertService) private sniper: PriceAlertService,
    @inject(TYPES.WalletWatchtowerService) private watchtower: WalletWatchtowerService,
  ) {}

  @httpGet('/strategy')
  async getStrategy(req: Request, res: Response) {
    try {
      const strategy = await this.strategist.scanYieldOpportunities();
      return res.json({
        success: true,
        data: strategy,
      });
    } catch (error) {
      logger.error('Failed to get finance strategy', error);
      return res.status(500).json({ success: false, error: 'Strategy unavailable' });
    }
  }

  @httpGet('/alerts')
  async getAlerts(req: Request, res: Response) {
    try {
      const history = this.sniper.getRecentAlerts();
      return res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      logger.error('Failed to get alert history', error);
      return res.status(500).json({ success: false, error: 'Alerts unavailable' });
    }
  }

  @httpGet('/portfolio')
  async getPortfolio(req: Request, res: Response) {
    try {
      const portfolio = await this.watchtower.getPortfolioParams();
      return res.json({
        success: true,
        data: portfolio,
      });
    } catch (error) {
      logger.error('Failed to get portfolio', error);
      return res.status(500).json({ success: false, error: 'Portfolio unavailable' });
    }
  }
}
