import { Request, Response } from 'express';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TreasuryService } from '../services/TreasuryService';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

@controller('/api/treasury')
export class TreasuryController {
  constructor(
    @inject(TYPES.TreasuryService) private treasuryService: TreasuryService
  ) {}

  @httpGet('/overview')
  public async getOverview(@request() req: Request, @response() res: Response) {
    try {
      // In a real app, we'd get userId from session/token. For now, using a mock or query param for demo.
      const userId = (req.query.userId as string) || 'default_sovereign_user';
      const overview = await this.treasuryService.getTreasuryOverview(userId);
      return res.json(overview);
    } catch (error) {
      logger.error('[TreasuryController] Error fetching overview:', error);
      return res.status(500).json({ error: 'Failed to fetch treasury overview' });
    }
  }

  @httpPost('/purchase')
  public async purchaseBond(@request() req: Request, @response() res: Response) {
    try {
      const { amount, tier } = req.body;
      const userId = req.body.userId || 'default_sovereign_user';

      if (!amount || !tier) {
        return res.status(400).json({ error: 'Missing amount or tier' });
      }

      const bond = await this.treasuryService.issueBond({ userId, amount, tier });
      return res.status(201).json(bond);
    } catch (error) {
      logger.error('[TreasuryController] Error purchasing bond:', error);
      return res.status(500).json({ error: 'Failed to purchase bond' });
    }
  }
}
