import { injectable } from 'inversify';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

export interface DoraMetrics {
  deploymentFrequency: number;
  leadTimeForChanges: number; // in hours
  changeFailureRate: number; // percentage
  timeToRestoreService: number; // in hours
}

@injectable()
export class DoraMetricsService {
  private readonly METRICS_KEY = 'nexus:dora_metrics';

  /**
   * Records a deployment event.
   */
  async recordDeployment(): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    await client.hIncrBy(this.METRICS_KEY, 'deployments_count', 1);
    await client.hSet(this.METRICS_KEY, 'last_deployment_at', new Date().toISOString());
    logger.info('[DoraMetrics] Deployment recorded.');
  }

  /**
   * Records a service failure and restoration time.
   */
  async recordFailureAndRestoration(failureTime: Date, restorationTime: Date): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    const restorationDuration =
      (restorationTime.getTime() - failureTime.getTime()) / (1000 * 60 * 60);
    await client.hIncrBy(this.METRICS_KEY, 'failures_count', 1);
    // Average calculation would be more complex, but here's a simple store
    await client.lPush(`${this.METRICS_KEY}:restoration_durations`, restorationDuration.toString());
    logger.info(
      `[DoraMetrics] Failure recorded. Restoration took ${restorationDuration.toFixed(2)} hours.`,
    );
  }

  /**
   * Retrieves current DORA metrics.
   */
  async getMetrics(): Promise<DoraMetrics> {
    const client = getRedisClient();
    if (!client?.isOpen)
      return {
        deploymentFrequency: 0,
        leadTimeForChanges: 0,
        changeFailureRate: 0,
        timeToRestoreService: 0,
      };

    const stats = await client.hGetAll(this.METRICS_KEY);
    // Basic simulation of mapping stored raw data to DORA definitions
    return {
      deploymentFrequency: Number.parseInt(stats.deployments_count || '0'),
      leadTimeForChanges: 2.5, // Mocked for now
      changeFailureRate:
        (Number.parseInt(stats.failures_count || '0') /
          Number.parseInt(stats.deployments_count || '1')) *
        100,
      timeToRestoreService: 1.2, // Mocked for now
    };
  }
}
