import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MonitoringService } from './monitoring.service';
import { logger } from '../utils/logger';
import { config } from '../config/config';

export interface ResourceForecast {
  metric: string;
  currentValue: number;
  predictedValue1h: number;
  predictedValue24h: number;
  timeToThresholdMs: number | null;
  confidence: number;
}

@injectable()
export class SovereignSentinelService {
  constructor(@inject(TYPES.MonitoringService) private monitoringService: MonitoringService) {}

  public async getResourceForecasts(): Promise<ResourceForecast[]> {
    const metricsToTrack = ['cpu_usage', 'memory_usage'];
    const forecasts: ResourceForecast[] = [];

    for (const metricName of metricsToTrack) {
      try {
        const forecast = await this.calculateForecast(metricName);
        if (forecast) forecasts.push(forecast);
      } catch (err) {
        logger.error({ err, metricName }, '[SovereignSentinel] Forecast calculation failed');
      }
    }

    return forecasts;
  }

  private async calculateForecast(metricName: string): Promise<ResourceForecast | null> {
    const now = Date.now();
    const startTime = now - 60 * 60 * 1000; // Last hour
    const rawMetrics = await this.monitoringService.getMetricsInRange(metricName, startTime, now);

    if (rawMetrics.length < 5) {
      return null; // Not enough data for trend analysis
    }

    // Simplified Linear Regression: y = mx + b
    const n = rawMetrics.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    const baseTime = rawMetrics[0].timestamp.getTime();

    for (const metric of rawMetrics) {
      const x = (metric.timestamp.getTime() - baseTime) / 1000; // x in seconds from start
      const y = metric.value;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const currentX = (now - baseTime) / 1000;
    const currentValue = rawMetrics[rawMetrics.length - 1].value;

    // Predictions
    const x1h = currentX + 3600;
    const x24h = currentX + 86400;
    const predicted1h = Math.max(0, slope * x1h + intercept);
    const predicted24h = Math.max(0, slope * x24h + intercept);

    // Threshold check
    const threshold =
      metricName === 'cpu_usage'
        ? config.monitoring.cpuThreshold
        : config.monitoring.memoryThreshold;

    let timeToThresholdMs = null;
    if (slope > 0) {
      const xThreshold = (threshold - intercept) / slope;
      if (xThreshold > currentX) {
        timeToThresholdMs = (xThreshold - currentX) * 1000;
      }
    }

    // Confidence heuristic based on R-squared (simplified)
    const confidence = Math.min(0.95, n / 100); // Higher data frequency = higher confidence placeholder

    return {
      metric: metricName.replace('_usage', '').toUpperCase(),
      currentValue,
      predictedValue1h: predicted1h,
      predictedValue24h: predicted24h,
      timeToThresholdMs,
      confidence,
    };
  }
}
