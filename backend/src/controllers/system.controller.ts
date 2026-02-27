/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import type { Request, Response, NextFunction } from 'express';
import os from 'node:os';
import { inject, injectable } from 'inversify';

import { SystemMetricsService } from '../services/system-metrics.service';
import { getCache, setCache } from '../utils/redis';
import { TYPES } from '../types';

@injectable()
export class SystemController {
  constructor(@inject(TYPES.SystemMetricsService) private metricsService: SystemMetricsService) {}

  /**
   * Get system metrics (CPU, Memory, Disk, Network)
   */
  async getSystemMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cacheKey = 'system:metrics:real';
      const cachedData = await getCache<string>(cacheKey);

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
  async getCPUUsage(_req: Request, res: Response, next: NextFunction) {
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
  async getMemoryUsage(_req: Request, res: Response, next: NextFunction) {
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
  async getDiskUsage(_req: Request, res: Response, next: NextFunction) {
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
  async getNetworkStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
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

      await Promise.resolve();
      res.json({ interfaces });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🛠️ DX Terminal Gateway: Execute maintenance scripts
   * WARNING: Strictly restricted to allowed scripts
   */
  async executeCommand(req: Request, res: Response, next: NextFunction) {
    try {
      const { command } = req.body;
      const allowedCommands = ['project_clean', 'db_backup_redis', 'verify_system_health'];

      if (!allowedCommands.includes(command)) {
        res.status(403).json({ error: 'Command not allowed for remote execution' });
        return;
      }

      const { exec } = await import('node:child_process');
      const { promisify } = await import('node:util');
      const execAsync = promisify(exec);

      logger.info({ command }, '[DX Gateway] Executing maintenance command');

      // Map friendly names to actual scripts
      const scriptMap: Record<string, string> = {
        project_clean: 'npm run clean',
        db_backup_redis: 'npm run db:backup:redis',
        verify_system_health: 'npm run health:check',
      };

      const { stdout, stderr } = await execAsync(scriptMap[command]);

      res.json({
        message: `Command ${command} executed`,
        output: stdout,
        error: stderr,
      });
    } catch (error) {
      next(error);
    }
  }
}
