import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIBond, IAIBond } from '../models/AIBond';
import { BigQueryService } from './google/bigquery.service';
import { logger } from '../utils/logger';

@injectable()
export class TreasuryService {
  private readonly RESERVE_THRESHOLD = 50000; // $50k Reserve target

  constructor(@inject(TYPES.BigQueryService) private bq: BigQueryService) {}
  /**
   * Issue a new AI Bond for a user
   */
  public async issueBond(params: {
    userId: string;
    amount: number;
    tier: 'silver' | 'gold' | 'sovereign';
  }): Promise<IAIBond> {
    logger.info(`[Treasury] Issuing ${params.tier} bond for user ${params.userId}`);

    const discountRates = {
      silver: 0.1, // 10% discount
      gold: 0.2, // 20% discount
      sovereign: 0.35, // 35% discount (Sovereign Level)
    };

    const discountRate = discountRates[params.tier];
    const initialValue = params.amount / (1 - discountRate);

    const bond = new AIBond({
      userId: params.userId,
      purchaseAmount: params.amount,
      creditBalance: initialValue,
      initialValue: initialValue,
      discountRate,
      tier: params.tier,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
    });

    return await bond.save();
  }

  /**
   * Deduct credit from active bonds
   */
  public async redeemCredit(userId: string, cost: number): Promise<number> {
    const bonds = await AIBond.find({
      userId,
      status: 'active',
      creditBalance: { $gt: 0 },
    }).sort({ timestamp: 1 });

    let remainingCost = cost;

    for (const bond of bonds) {
      if (remainingCost <= 0) break;

      const deduction = Math.min(bond.creditBalance, remainingCost);
      bond.creditBalance -= deduction;
      remainingCost -= deduction;

      if (bond.creditBalance <= 0) {
        bond.status = 'depleted';
      }

      await bond.save();
      logger.info(
        `[Treasury] Redeemed ${deduction} from Bond ${bond._id}. Remaining cost: ${remainingCost}`,
      );
    }

    return remainingCost; // Amount still owed if bonds don't cover everything
  }

  /**
   * Get user treasury overview
   */
  public async getTreasuryOverview(userId: string) {
    const bonds = await AIBond.find({ userId });
    const activeBalance = bonds
      .filter(b => b.status === 'active')
      .reduce((sum, b) => sum + b.creditBalance, 0);

    const totalSaved = bonds.reduce((sum, b) => sum + (b.initialValue - b.purchaseAmount), 0);

    return {
      activeBalance,
      totalSaved,
      bondCount: bonds.length,
      bonds: bonds.map(b => ({
        id: b._id,
        tier: b.tier,
        balance: b.creditBalance,
        status: b.status,
        expires: b.expiryDate,
      })),
    };
  }

  /**
   * SOVEREIGN RESERVE: Track system-wide health and token burn.
   */
  public async getSovereignHealth() {
    logger.info('[Treasury] Analyzing Sovereign Financial Health...');

    // Querying BigQuery for actual AI usage vs revenue
    const metrics = await this.bq.runDeepTrendQuery(`
      SELECT 
        SUM(cost) as total_burn,
        COUNT(*) as mission_count
      FROM \`aigestion.telemetry.swarm_tasks\`
      WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    `);

    return {
      reserveTarget: this.RESERVE_THRESHOLD,
      currentBurn: metrics[0]?.total_burn || 0,
      burnEfficiency:
        metrics[0]?.mission_count > 0
          ? (metrics[0].total_burn / metrics[0].mission_count).toFixed(4)
          : 0,
      status: metrics[0]?.total_burn > this.RESERVE_THRESHOLD ? 'WARNING: HIGH_BURN' : 'STABLE',
    };
  }

  /**
   * REBALANCE CAPITAL: Move funds to compute or DeFi.
   */
  public async rebalanceCapital() {
    const health = await this.getSovereignHealth();
    logger.info(`[Treasury] Rebalancing capital based on health: ${health.status}`);

    if (health.currentBurn < this.RESERVE_THRESHOLD * 0.5) {
      // We have surplus capital -> Invest in DeFi (Call coming in Phase 13.2)
      return { action: 'INVEST_DEFI', amount: 5000 };
    }

    return { action: 'CONSERVE_COMPUTE', amount: 0 };
  }
}
