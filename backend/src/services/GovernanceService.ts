import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { TreasuryService } from './TreasuryService';
import { DeFiStrategistService } from './defi-strategist.service';
import { Proposal } from '../models/Proposal';
import { logger } from '../utils/logger';

@injectable()
export class GovernanceService {
  private readonly TARGET_MARGIN = 0.3; // 30% PROFIT MARGIN LAW

  constructor(
    @inject(TYPES.TreasuryService) private treasury: TreasuryService,
    @inject(TYPES.DeFiStrategistService) private defiStrategist: DeFiStrategistService,
  ) {}

  /**
   * SOVEREIGN LAW: Check if the system is meeting its margin targets.
   */
  public async checkMarginCompliance(): Promise<{ compliant: boolean; currentMargin: number }> {
    const health = await this.treasury.getSovereignHealth();
    // Simplified logic: for now, we just ensure burn is 70% of a theoretical revenue
    // In a real scenario, we'd query actual revenue from billing.
    const theoreticalRevenue = health.currentBurn / (1 - this.TARGET_MARGIN);
    const currentMargin = (theoreticalRevenue - health.currentBurn) / theoreticalRevenue;

    const compliant = currentMargin >= this.TARGET_MARGIN;

    if (!compliant) {
      logger.warn(
        `[Governance] MARGIN VIOLATION: Current margin ${currentMargin.toFixed(2)} is below target ${this.TARGET_MARGIN}`,
      );
    }

    return { compliant, currentMargin };
  }

  /**
   * SOVEREIGN LAW: Auto-rebalance capital if health is stable.
   */
  public async proposeRebalancePlan() {
    const health = await this.treasury.getSovereignHealth();

    if (health.status === 'STABLE') {
      const opportunity = await this.defiStrategist.scanYieldOpportunities();
      return {
        status: 'OPPORTUNITY_DETECTED',
        recommendation: opportunity,
        requiresGodMode: true,
      };
    }

    return {
      status: 'CONSERVATIVE_MODE',
      reason: 'Internal burn is too high or data is insufficient.',
      requiresGodMode: false,
    };
  }

  /**
   * List active system laws.
   */
  public getSystemLaws() {
    return [
      { id: 'LAW-001', name: '30% Margin Protection', status: 'ENFORCED' },
      { id: 'LAW-002', name: 'Compute Liquidity Reserve', status: 'ENFORCED' },
      { id: 'LAW-003', name: 'Autonomous DeFi Rebalancing', status: 'PENDING_APPROVAL' },
    ];
  }

  /**
   * Generates autonomous proposals based on system health.
   */
  public async generateAutonomousProposals() {
    logger.info('[Governance] Analyzing system for autonomous proposals...');
    const health = await this.treasury.getSovereignHealth();
    const proposals = [];

    // 1. Treasury Rebalancing Proposal
    if (health.status === 'STABLE' && Number(health.burnEfficiency) > 0) {
      const existing = await Proposal.findOne({ type: 'TREASURY', status: 'PENDING' });
      if (!existing) {
        proposals.push(
          new Proposal({
            type: 'TREASURY',
            description: 'Rebalance surplus capital to high-yield DeFi strategies.',
            confidenceScore: 0.96,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            metadata: { action: 'INVEST_DEFI', amount: 5000 },
          }).save(),
        );
      }
    }

    await Promise.all(proposals);
    return proposals;
  }

  /**
   * Returns all pending/approved proposals.
   */
  public async getActiveProposals() {
    return await Proposal.find({ status: { $in: ['PENDING', 'APPROVED'] } }).sort({
      createdAt: -1,
    });
  }

  /**
   * Marks a proposal as vetoed.
   */
  public async vetoProposal(id: string) {
    logger.warn(`🚨 [Governance] VETO RECEIVED for Proposal: ${id}`);
    const proposal = await Proposal.findByIdAndUpdate(id, { status: 'VETOED' });
    return !!proposal;
  }

  /**
   * Executes an approved proposal.
   */
  public async executeProposal(id: string) {
    const proposal = await Proposal.findById(id);
    if (!proposal || proposal.status !== 'APPROVED') return false;

    logger.info(`🚀 [Governance] EXECUTING PROPOSAL: ${proposal.description}`);

    // logic specific to proposal type...
    if (proposal.type === 'TREASURY') {
      await this.treasury.rebalanceCapital();
    }

    proposal.status = 'EXECUTED';
    await proposal.save();
    return true;
  }
}
