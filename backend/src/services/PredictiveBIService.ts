import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Subscription } from '../models/subscription.model';
import { UsageRecord } from '../models/UsageRecord';
import { logger } from '../utils/logger';

@injectable()
export class PredictiveBIService {
  constructor() {
    logger.info('📊 Predictive BI Service Active: Strategic Intelligence Layer Online');
  }

  /**
   * Forecasts MRR (Monthly Recurring Revenue) for the next N months
   */
  public async getRevenueForecast(months: number = 12) {
    try {
      // Fetch active subscriptions with plan details
      const activeSubscriptions = await Subscription.find({ status: 'active' }).populate('planDetails');
      
      // Calculate current MRR
      // Note: Real implementation would handle multiple currencies and billing cycles
      const currentMRR = activeSubscriptions.reduce((sum, sub: any) => {
        const price = sub.planDetails?.price || 0;
        return sum + price;
      }, 0);

      const forecast = [];
      const growthRate = 0.05; // 5% simulated organic growth per month

      for (let i = 0; i < months; i++) {
        forecast.push({
          month: i + 1,
          mrr: currentMRR * Math.pow(1 + growthRate, i),
          date: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toISOString().slice(0, 7)
        });
      }

      return {
        currentMRR,
        growthRate,
        forecast
      };
    } catch (error) {
      logger.error('[PredictiveBI] Revenue forecast failed', error);
      throw error;
    }
  }

  /**
   * Detects churn risk by analyzing token velocity drops
   */
  public async calculateChurnRisk(userId: string) {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [recentUsage, historicalUsage] = await Promise.all([
        UsageRecord.aggregate([
          { $match: { userId, timestamp: { $gte: sevenDaysAgo } } },
          { $group: { _id: null, avg: { $avg: '$totalTokens' } } }
        ]),
        UsageRecord.aggregate([
          { $match: { userId, timestamp: { $gte: thirtyDaysAgo, $lt: sevenDaysAgo } } },
          { $group: { _id: null, avg: { $avg: '$totalTokens' } } }
        ])
      ]);

      const recentAvg = recentUsage[0]?.avg || 0;
      const historicalAvg = historicalUsage[0]?.avg || 0;

      // Risk if usage dropped by more than 40%
      const velocityDrop = historicalAvg > 0 ? (historicalAvg - recentAvg) / historicalAvg : 0;
      const riskLevel = velocityDrop > 0.4 ? 'high' : velocityDrop > 0.1 ? 'medium' : 'low';

      return {
        userId,
        riskLevel,
        velocityDrop,
        metrics: {
          recentAvg,
          historicalAvg
        }
      };
    } catch (error) {
      logger.error('[PredictiveBI] Churn risk calculation failed', error);
      throw error;
    }
  }

  /**
   * Projects User Lifetime Value (LTV)
   */
  public async getLTVProjection() {
    // LTV = (Average Revenue Per User) / (Churn Rate)
    // Simplified for demo purposes
    return {
      averageRetentionMonths: 18,
      estimatedLTV: 450, // USD
      confidence: 0.85
    };
  }
}
