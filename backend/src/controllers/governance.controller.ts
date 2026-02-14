import { Request, Response } from 'express';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { GovernanceService } from '../services/GovernanceService';
import { TreasuryService } from '../services/TreasuryService';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

@controller('/api/governance')
export class GovernanceController {
  constructor(
    @inject(TYPES.GovernanceService) private governance: GovernanceService,
    @inject(TYPES.TreasuryService) private treasury: TreasuryService
  ) {}

  @httpGet('/health')
  public async getHealth(@request() req: Request, @response() res: Response) {
    try {
      const health = await this.treasury.getSovereignHealth();
      const compliance = await this.governance.checkMarginCompliance();
      
      return res.json({
        ...health,
        ...compliance,
        laws: this.governance.getSystemLaws()
      });
    } catch (error) {
      logger.error('[GovernanceController] Error fetching health:', error);
      return res.status(500).json({ error: 'Failed to fetch sovereign health' });
    }
  }

  @httpGet('/rebalance-plan')
  public async getRebalancePlan(@request() req: Request, @response() res: Response) {
    try {
        const plan = await this.governance.proposeRebalancePlan();
        return res.json(plan);
    } catch (error) {
        logger.error('[GovernanceController] Error fetching rebalance plan:', error);
        return res.status(500).json({ error: 'Failed to fetch rebalance plan' });
    }
  }
}
