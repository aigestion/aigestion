import type { Request, Response, NextFunction } from 'express';
import { UsageRecord } from '../models/UsageRecord';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

/**
 * Get a snapshot of the current billing status
 * Composes actual AI costs + estimated infra costs
 */
export const getBillingSnapshot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        // 1. Calculate Actual AI Costs from UsageRecord
        const aiCostData = await UsageRecord.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: '$costEstimate' } } }
        ]);

        const aiTotal = aiCostData[0]?.total || 0;

        // 2. Compose full snapshot
        // For GCP/GitHub, in a real env we might query APIs, but here we can derive from usage or constants
        const snapshot = {
            updatedAt: new Date().toISOString(),
            googleCloudUSD: parseFloat((aiTotal * 0.4).toFixed(2)), // Assume 40% of AI cost is infra overhead
            githubActionsUSD: 8.75, // Fixed baseline for CI/CD & deployment
            otherUSD: 5.00,
            ivaRate: 0.21,
            totalUSD: parseFloat(( (aiTotal + 20) * 1.21 ).toFixed(2)),
            currency: 'EUR',
            totalEUR: parseFloat(( (aiTotal + 20) * 1.21 * 0.92 ).toFixed(2)) // USD to EUR conversion
        };

        res.json(snapshot); // Frontend expects raw object based on fetchBillingData implementation
    } catch (err) {
        logger.error(err, 'Error in billing snapshot');
        res.status(500).json({ error: 'Internal server error' });
    }
};
