import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { AppError } from '../utils/errors';
import { UsageRecord } from '../models/UsageRecord';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

// Generative UI Schema shared with Frontend
type GenerativeUISchema =
  | { type: 'card'; title?: string; content: string; variant?: 'default' | 'glass' | 'outline' }
  | { type: 'stat'; label: string; value: string | number; trend?: 'up' | 'down' | 'neutral' }
  | { type: 'list'; items: string[]; title?: string }
  | { type: 'container'; direction: 'row' | 'column'; children: GenerativeUISchema[] };

@injectable()
export class UsageController {
  public async getCurrentUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || req.headers['x-user-id'];

      if (!userId) {
        return next(new AppError('User ID unknown', 401, 'UNAUTHORIZED'));
      }

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const result = await UsageRecord.aggregate([
        { $match: { userId: userId, createdAt: { $gte: firstDayOfMonth } } },
        {
          $group: {
            _id: null,
            totalTokens: { $sum: '$totalTokens' },
            estimatedCost: { $sum: '$costEstimate' },
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = result[0] || { totalTokens: 0, estimatedCost: 0, count: 0 };
      const cost =
        typeof stats.estimatedCost === 'number' ? stats.estimatedCost.toFixed(4) : '0.00';

      const schema: GenerativeUISchema = {
        type: 'container',
        direction: 'column',
        children: [
          {
            type: 'container',
            direction: 'row',
            children: [
              { type: 'stat', label: 'Total Tokens (MTH)', value: stats.totalTokens, trend: 'up' },
              { type: 'stat', label: 'Est. Cost', value: `$${cost}`, trend: 'neutral' },
            ],
          },
          {
            type: 'card',
            title: 'Current Plan Status',
            content:
              'You are on the Metered Plan. Usage is calculated daily and billed at the end of the month.',
            variant: 'glass',
          },
        ],
      };

      res.json(buildResponse(schema, 200, (req as any).requestId));
    } catch (err) {
      logger.error(err, 'Error fetching current usage');
      next(err);
    }
  }
}
