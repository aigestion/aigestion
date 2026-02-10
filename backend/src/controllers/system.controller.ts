import type { Request, Response } from 'express';
import os from 'os';
import { inject, injectable } from 'inversify';

import { SystemMetricsService } from '../services/system-metrics.service';
import { logger } from '../utils/logger';
import { getCache, setCache } from '../utils/redis';
import { TYPES } from '../types';

@injectable()
export class SystemController {
  constructor(@inject(TYPES.SystemMetricsService) private metricsService: SystemMetricsService) {}

  /**
   * Get system metrics (CPU, Memory, Disk, Network)
   */
  async getSystemMetrics(_req: Request, res: Response, next: any): Promise<void> {
    try {
      const cacheKey = 'system:metrics:real';
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      const metrics = await this.metricsService.getSystemMetrics();

      await setCache(cacheKey, JSON.stringify(metrics), 2);
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get CPU usage
   */
  async getCPUUsage(_req: Request, res: Response, next: any) {
    try {
      const cpuUsage = await this.metricsService.getCPUUsage();
      const cpus = os.cpus();

      res.json({
        usage: cpuUsage,
        cores: cpus.length,
        model: cpus[0]?.model || 'Unknown',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get memory usage
   */
  async getMemoryUsage(_req: Request, res: Response, next: any) {
    try {
      const usagePercent = await this.metricsService.getMemoryUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;

      res.json({
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: usagePercent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get disk usage
   */
  async getDiskUsage(_req: Request, res: Response, next: any) {
    try {
      const usage = await this.metricsService.getDiskUsage();
      res.json({ usage });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get network stats
   */
  async getNetworkStats(_req: Request, res: Response, next: any) {
    try {
      const networkInterfaces = os.networkInterfaces();
      const interfaces = Object.entries(networkInterfaces).map(([name, addrs]) => ({
        name,
        addresses: addrs?.map(addr => ({
          address: addr.address,
          family: addr.family,
          internal: addr.internal,
        })),
      }));

      res.json({ interfaces });
    } catch (error) {
      next(error);
    }
  }
}
