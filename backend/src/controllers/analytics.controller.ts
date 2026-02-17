import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import os from 'node:os';

import { TYPES } from '../types';
import { AnalyticsService } from '../services/analytics.service';

import { User } from '../models/User';
import { getCache, setCache } from '../utils/redis';
import { stats } from '../utils/stats';

@injectable()
export class AnalyticsController {
  constructor(@inject(TYPES.AnalyticsService) private analyticsService: AnalyticsService) {}

  public async getAnalyticsOverview(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const overview = await this.analyticsService.getOverview();
      res.json(overview);
    } catch (error) {
      next(error);
    }
  }

  public async getUserActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const range = req.query.range || '24h';
      const totalUsers = await User.countDocuments();
      const activity = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        users: Math.floor(totalUsers * (0.1 + Math.random() * 0.2)),
        sessions: Math.floor(totalUsers * (0.15 + Math.random() * 0.3)),
      }));

      res.json({ range, data: activity });
    } catch (error) {
      next(error);
    }
  }

  public getSystemUsage(_req: Request, res: Response, next: NextFunction): void {
    try {
      const freeMem = os.freemem();
      const totalMem = os.totalmem();
      const loadAvg = os.loadavg()[0];

      const usage = {
        cpu: Array.from({ length: 60 }, () =>
          Number.parseFloat((loadAvg * 10 + Math.random() * 5).toFixed(1)),
        ),
        memory: Array.from({ length: 60 }, () =>
          Number.parseFloat((((totalMem - freeMem) / totalMem) * 100).toFixed(1)),
        ),
        network: Array.from({ length: 60 }, () =>
          Number.parseFloat((Math.random() * 10).toFixed(1)),
        ),
      };

      res.json(usage);
    } catch (error) {
      next(error);
    }
  }

  public getErrorRates(_req: Request, res: Response, next: NextFunction): void {
    try {
      const errors = {
        total: stats.errorCount,
        byType: {
          '4xx': Math.floor(stats.errorCount * 0.7),
          '5xx': Math.floor(stats.errorCount * 0.3),
          timeout: 0,
        },
        trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 2)),
      };

      res.json(errors);
    } catch (error) {
      next(error);
    }
  }

  public async getDashboardData(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const revenue = months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 20000 + Math.random() * 10000,
      }));

      const days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
      let previous = 1000;
      const users = days.map(day => {
        previous = Math.floor(previous * (1 + (Math.random() * 0.1 - 0.02)));
        return { name: day, value: previous };
      });

      const conversions = [
        { name: 'Visitors', value: 12000 + Math.floor(Math.random() * 2000) },
        { name: 'Signups', value: 4500 + Math.floor(Math.random() * 500) },
        { name: 'Active', value: 3200 + Math.floor(Math.random() * 300) },
        { name: 'Paying', value: 850 + Math.floor(Math.random() * 100) },
      ];

      res.json({ revenue, users, conversions });
    } catch (error) {
      next(error);
    }
  }

  public async getGodModeAnalytics(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await this.analyticsService.getGodModeData();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public async exportReport(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      let csv = `Report Generated,${timestamp}\n\n`;
      csv += 'SECTION,METRICS\n';
      csv += `Total Users,${await User.countDocuments()}\n`;
      csv += `Total Requests,${stats.totalRequests}\n`;
      csv += `Error Rate,${((stats.errorCount / (stats.totalRequests || 1)) * 100).toFixed(2)}%\n\n`;
      csv += 'hour,users,sessions\n';
      for (let i = 0; i < 24; i++) {
        const users = Math.floor(Math.random() * 1000);
        csv += `${i}:00,${users},${Math.floor(users * 1.5)}\n`;
      }

      res.header('Content-Type', 'text/csv');
      res.attachment(`analytics_report_${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}
