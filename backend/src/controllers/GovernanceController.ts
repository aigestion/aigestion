import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { GovernanceService } from '../services/GovernanceService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class GovernanceController {
  constructor(
    @inject(TYPES.GovernanceService) private governanceService: GovernanceService,
    @inject(TYPES.TreasuryService) private treasuryService: any,
  ) {}

  public async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const health = await this.treasuryService.getSovereignHealth();
      const compliance = await this.governanceService.checkMarginCompliance();
      res.json(
        buildResponse(
          { ...health, ...compliance, laws: this.governanceService.getSystemLaws() },
          200,
          (req as any).requestId,
        ),
      );
    } catch (error) {
      logger.error('[GovernanceController] Failed to get health', error);
      next(error);
    }
  }

  public async getRebalancePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await this.governanceService.proposeRebalancePlan();
      res.json(buildResponse(plan, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[GovernanceController] Failed to get rebalance plan', error);
      next(error);
    }
  }

  public async getProposals(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real implementation this would query the Proposal model
      // For now, we interact via the service
      const proposals = await (this.governanceService as any).getActiveProposals();
      res.json(buildResponse(proposals, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[GovernanceController] Failed to get proposals', error);
      next(error);
    }
  }

  public async vetoProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await (this.governanceService as any).vetoProposal(id);
      res.json(buildResponse({ success: result }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[GovernanceController] Failed to veto proposal', error);
      next(error);
    }
  }

  public async getLaws(req: Request, res: Response, next: NextFunction) {
    try {
      const laws = this.governanceService.getSystemLaws();
      res.json(buildResponse(laws, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[GovernanceController] Failed to get laws', error);
      next(error);
    }
  }
}
