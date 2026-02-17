import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { WalletWatchtowerService } from '../services/finance/wallet-watchtower.service';
import { CoinGeckoService } from '../services/coingecko.service';
import { buildResponse, buildError } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class FinanceController {
  constructor(
    @inject(TYPES.WalletWatchtowerService) private watchtower: WalletWatchtowerService,
    @inject(TYPES.CoinGeckoService) private coingecko: CoinGeckoService
  ) {}

  /**
   * Get current portfolio status
   */
  public getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId;
    try {
      const portfolio = await this.watchtower.getPortfolioParams();
      if (!portfolio) {
        return res.status(404).json(buildError('Portfolio data not available', 'PORTFOLIO_NOT_CONFIGURED', 404, requestId));
      }
      return res.json(buildResponse(portfolio, 200, requestId));
    } catch (error: any) {
      logger.error('[FinanceController] Failed to fetch portfolio', error);
      return res.status(500).json(buildError(error.message, 'FINANCE_ERROR', 500, requestId));
    }
  };

  /**
   * Get market intelligence snapshot
   */
  public getMarketSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId;
    try {
      const prices = await this.coingecko.getPrices();
      const global = await this.coingecko.getGlobalMetrics();

      const snapshot = {
        prices,
        global,
        timestamp: new Date()
      };

      return res.json(buildResponse(snapshot, 200, requestId));
    } catch (error: any) {
      logger.error('[FinanceController] Failed to fetch market snapshot', error);
      return res.status(500).json(buildError(error.message, 'MARKET_ERROR', 500, requestId));
    }
  };
}
