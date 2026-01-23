import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags: { [key: string]: string };
  unit: string;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
}

interface PerformanceMetrics {
  responseTime: {
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  errorRate: {
    total: number;
    percentage: number;
    byStatus: { [key: string]: number };
  };
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      inbound: number;
      outbound: number;
    };
  };
  database: {
    connections: number;
    queryTime: {
      avg: number;
      slow: number;
    };
    cacheHitRate: number;
  };
}

interface Alert {
  id: string;
  name: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata: {
    [key: string]: any;
  };
}

@injectable()
export class MonitoringService {
  private readonly redis: RedisClientType;
  private readonly metrics: Map<string, Metric[]> = new Map();
  private readonly alerts: Alert[] = [];
  private readonly maxMetricsPerKey = 1000;
  private readonly maxAlerts = 10000;
  private readonly metricsRetention = 24 * 60 * 60 * 1000; // 24 hours
  private readonly alertRetention = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.redis = getRedisClient();

    this.startMetricsCollection();
    this.startMetricsCleanup();
  }

  /**
   * Record a metric
   */
  public recordMetric(
    name: string,
    value: number,
    tags: { [key: string]: string } = {},
    unit: string = '',
    type: Metric['type'] = 'gauge',
  ): void {
    try {
      const metric: Metric = {
        name,
        value,
        timestamp: new Date(),
        tags,
        unit,
        type,
      };

      // Store in memory
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      const metricList = this.metrics.get(name)!;
      metricList.push(metric);

      // Keep only recent metrics
      if (metricList.length > this.maxMetricsPerKey) {
        metricList.splice(0, metricList.length - this.maxMetricsPerKey);
      }

      // Store in Redis
      const redisKey = `metric:${name}:${Date.now()}`;
      this.redis.setEx(redisKey, this.metricsRetention / 1000, JSON.stringify(metric));

      // Add to time series
      this.redis.lPush(`metrics:${name}:timeseries`, JSON.stringify(metric));
      this.redis.lTrim(`metrics:${name}:timeseries`, 0, this.maxMetricsPerKey - 1);

      // Check for alerts
      this.checkMetricAlerts(metric);
    } catch (error) {
      logger.error('Failed to record metric:', error);
    }
  }

  /**
   * Record response time
   */
  public recordResponseTime(
    duration: number,
    endpoint: string,
    method: string,
    statusCode: number,
  ): void {
    this.recordMetric(
      'response_time',
      duration,
      {
        endpoint,
        method,
        status_code: statusCode.toString(),
      },
      'ms',
      'timer',
    );

    // Record request count
    this.recordMetric(
      'requests',
      1,
      {
        endpoint,
        method,
        status_code: statusCode.toString(),
      },
      '',
      'counter',
    );

    // Record error if applicable
    if (statusCode >= 400) {
      this.recordMetric(
        'errors',
        1,
        {
          endpoint,
          method,
          status_code: statusCode.toString(),
        },
        '',
        'counter',
      );
    }
  }

  /**
   * Record database performance
   */
  public recordDatabasePerformance(queryTime: number, queryType: string, success: boolean): void {
    this.recordMetric(
      'db_query_time',
      queryTime,
      {
        query_type: queryType,
        success: success.toString(),
      },
      'ms',
      'timer',
    );

    if (!success) {
      this.recordMetric(
        'db_errors',
        1,
        {
          query_type: queryType,
        },
        '',
        'counter',
      );
    }
  }

  /**
   * Record resource usage
   */
  public recordResourceUsage(): void {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.recordMetric(
      'memory_usage',
      usage.heapUsed,
      {
        type: 'heap',
      },
      'bytes',
      'gauge',
    );

    this.recordMetric(
      'memory_total',
      usage.heapTotal,
      {
        type: 'heap',
      },
      'bytes',
      'gauge',
    );

    this.recordMetric(
      'cpu_usage',
      cpuUsage.user,
      {
        type: 'user',
      },
      'percent',
      'gauge',
    );
  }

  /**
   * Get performance metrics
   */
  public async getPerformanceMetrics(
    timeRange: 'minute' | 'hour' | 'day' = 'hour',
  ): Promise<PerformanceMetrics> {
    try {
      const now = Date.now();
      let startTime: number;

      switch (timeRange) {
        case 'minute':
          startTime = now - 60 * 1000;
          break;
        case 'hour':
          startTime = now - 60 * 60 * 1000;
          break;
        case 'day':
          startTime = now - 24 * 60 * 60 * 1000;
          break;
      }

      // Get response time metrics
      const responseTimeMetrics = await this.getMetricsInRange('response_time', startTime, now);
      const responseTimes = responseTimeMetrics.map(m => m.value);

      // Get request metrics
      const requestMetrics = await this.getMetricsInRange('requests', startTime, now);
      const errorMetrics = await this.getMetricsInRange('errors', startTime, now);

      // Calculate statistics
      const responseTimeStats = this.calculatePercentiles(responseTimes);
      const totalRequests = requestMetrics.reduce((sum, m) => sum + m.value, 0);
      const totalErrors = errorMetrics.reduce((sum, m) => sum + m.value, 0);

      const metrics: PerformanceMetrics = {
        responseTime: responseTimeStats,
        throughput: {
          requestsPerSecond:
            totalRequests / (timeRange === 'minute' ? 60 : timeRange === 'hour' ? 3600 : 86400),
          requestsPerMinute:
            totalRequests / (timeRange === 'minute' ? 1 : timeRange === 'hour' ? 60 : 1440),
          requestsPerHour:
            totalRequests / (timeRange === 'minute' ? 1 / 60 : timeRange === 'hour' ? 1 : 24),
        },
        errorRate: {
          total: totalErrors,
          percentage: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
          byStatus: this.groupErrorsByStatus(errorMetrics),
        },
        resourceUsage: await this.getResourceUsage(),
        database: await this.getDatabaseMetrics(),
      };

      return metrics;
    } catch (error) {
      logger.error('Failed to get performance metrics:', error);
      return this.getDefaultPerformanceMetrics();
    }
  }

  /**
   * Get metrics in time range
   */
  private async getMetricsInRange(
    name: string,
    startTime: number,
    endTime: number,
  ): Promise<Metric[]> {
    try {
      const key = `metrics:${name}:timeseries`;
      const metricData = await this.redis.lRange(key, 0, -1);

      return metricData
        .map(data => JSON.parse(data))
        .filter(metric => {
          const metricTime = new Date(metric.timestamp).getTime();
          return metricTime >= startTime && metricTime <= endTime;
        });
    } catch (error) {
      logger.error('Failed to get metrics in range:', error);
      return [];
    }
  }

  /**
   * Calculate percentiles
   */
  private calculatePercentiles(values: number[]): {
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } {
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = values.sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Group errors by status
   */
  private groupErrorsByStatus(errorMetrics: Metric[]): { [key: string]: number } {
    const statusCounts: { [key: string]: number } = {};

    errorMetrics.forEach(metric => {
      const status = metric.tags.status_code || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + metric.value;
    });

    return statusCounts;
  }

  /**
   * Get resource usage
   */
  private async getResourceUsage(): Promise<{
    cpu: number;
    memory: number;
    disk: number;
    network: {
      inbound: number;
      outbound: number;
    };
  }> {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      cpu: cpuUsage.user,
      memory: (usage.heapUsed / usage.heapTotal) * 100,
      disk: 0, // Would need to implement disk usage monitoring
      network: {
        inbound: 0, // Would need to implement network monitoring
        outbound: 0,
      },
    };
  }

  /**
   * Get database metrics
   */
  private async getDatabaseMetrics(): Promise<{
    connections: number;
    queryTime: {
      avg: number;
      slow: number;
    };
    cacheHitRate: number;
  }> {
    try {
      const queryTimeMetrics = await this.getMetricsInRange(
        'db_query_time',
        Date.now() - 60000,
        Date.now(),
      );
      const queryTimes = queryTimeMetrics.map(m => m.value);
      const slowQueries = queryTimeMetrics.filter(m => m.value > 1000).length;

      return {
        connections: 0, // Would need to implement connection monitoring
        queryTime: {
          avg:
            queryTimes.length > 0
              ? queryTimes.reduce((sum, t) => sum + t, 0) / queryTimes.length
              : 0,
          slow: slowQueries,
        },
        cacheHitRate: 0, // Would need to implement cache monitoring
      };
    } catch (error) {
      return {
        connections: 0,
        queryTime: { avg: 0, slow: 0 },
        cacheHitRate: 0,
      };
    }
  }

  /**
   * Get default performance metrics
   */
  private getDefaultPerformanceMetrics(): PerformanceMetrics {
    return {
      responseTime: { avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 },
      throughput: { requestsPerSecond: 0, requestsPerMinute: 0, requestsPerHour: 0 },
      errorRate: { total: 0, percentage: 0, byStatus: {} },
      resourceUsage: { cpu: 0, memory: 0, disk: 0, network: { inbound: 0, outbound: 0 } },
      database: { connections: 0, queryTime: { avg: 0, slow: 0 }, cacheHitRate: 0 },
    };
  }

  /**
   * Check metric alerts
   */
  private checkMetricAlerts(metric: Metric): void {
    const alertRules = {
      response_time: {
        warning: 1000,
        critical: 5000,
      },
      error_rate: {
        warning: 5,
        critical: 20,
      },
      memory_usage: {
        warning: 80,
        critical: 95,
      },
      cpu_usage: {
        warning: 80,
        critical: 95,
      },
    };

    const rule = alertRules[metric.name as keyof typeof alertRules];
    if (rule) {
      if (metric.value >= rule.critical) {
        this.createAlert({
          name: `${metric.name} critical`,
          severity: 'critical',
          message: `${metric.name} is ${metric.value}${metric.unit} (critical threshold: ${rule.critical}${metric.unit})`,
          metadata: {
            metric: metric.name,
            value: metric.value,
            threshold: rule.critical,
            tags: metric.tags,
          },
        });
      } else if (metric.value >= rule.warning) {
        this.createAlert({
          name: `${metric.name} warning`,
          severity: 'warning',
          message: `${metric.name} is ${metric.value}${metric.unit} (warning threshold: ${rule.warning}${metric.unit})`,
          metadata: {
            metric: metric.name,
            value: metric.value,
            threshold: rule.warning,
            tags: metric.tags,
          },
        });
      }
    }
  }

  /**
   * Create alert
   */
  private createAlert(
    alertData: Omit<Alert, 'id' | 'timestamp' | 'resolved' | 'resolvedAt'>,
  ): void {
    try {
      const alert: Alert = {
        ...alertData,
        id: this.generateAlertId(),
        timestamp: new Date(),
        resolved: false,
      };

      this.alerts.push(alert);

      // Keep only recent alerts
      if (this.alerts.length > this.maxAlerts) {
        this.alerts.splice(0, this.alerts.length - this.maxAlerts);
      }

      // Store in Redis
      this.redis.setEx(`alert:${alert.id}`, this.alertRetention / 1000, JSON.stringify(alert));

      // Add to recent alerts
      this.redis.lPush('alerts:recent', JSON.stringify(alert));
      this.redis.lTrim('alerts:recent', 0, 999);

      logger.warn('Alert created', {
        id: alert.id,
        name: alert.name,
        severity: alert.severity,
        message: alert.message,
      });
    } catch (error) {
      logger.error('Failed to create alert:', error);
    }
  }

  /**
   * Get recent alerts
   */
  public async getRecentAlerts(limit: number = 100): Promise<Alert[]> {
    try {
      const alertData = await this.redis.lRange('alerts:recent', 0, limit - 1);
      return alertData.map(data => JSON.parse(data));
    } catch (error) {
      logger.error('Failed to get recent alerts:', error);
      return [];
    }
  }

  /**
   * Resolve alert
   */
  public async resolveAlert(alertId: string): Promise<boolean> {
    try {
      // Update in memory
      const alert = this.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
      }

      // Update in Redis
      const cached = await this.redis.get(`alert:${alertId}`);
      if (cached) {
        const updatedAlert = JSON.parse(cached);
        updatedAlert.resolved = true;
        updatedAlert.resolvedAt = new Date();
        await this.redis.setEx(
          `alert:${alertId}`,
          this.alertRetention / 1000,
          JSON.stringify(updatedAlert),
        );
      }

      logger.info('Alert resolved', { alertId });
      return true;
    } catch (error) {
      logger.error('Failed to resolve alert:', { alertId, error });
      return false;
    }
  }

  /**
   * Get metrics overview
   */
  public async getMetricsOverview(): Promise<{
    totalMetrics: number;
    activeAlerts: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
    topMetrics: Array<{
      name: string;
      currentValue: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  }> {
    try {
      const totalMetrics = Array.from(this.metrics.values()).reduce(
        (sum, metrics) => sum + metrics.length,
        0,
      );
      const activeAlerts = this.alerts.filter(a => !a.resolved).length;

      // Determine system health
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (activeAlerts > 10) {
        systemHealth = 'critical';
      } else if (activeAlerts > 3) {
        systemHealth = 'warning';
      }

      // Get top metrics
      const topMetrics: Array<{
        name: string;
        currentValue: number;
        trend: 'up' | 'down' | 'stable';
      }> = [];

      for (const [name, metrics] of this.metrics.entries()) {
        if (metrics.length > 0) {
          const latest = metrics[metrics.length - 1];
          const previous = metrics[Math.max(0, metrics.length - 10)];

          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (latest.value > previous.value * 1.1) {
            trend = 'up';
          } else if (latest.value < previous.value * 0.9) {
            trend = 'down';
          }

          topMetrics.push({
            name,
            currentValue: latest.value,
            trend,
          });
        }
      }

      // Sort by value and take top 10
      topMetrics.sort((a, b) => b.currentValue - a.currentValue);
      topMetrics.splice(10);

      return {
        totalMetrics,
        activeAlerts,
        systemHealth,
        topMetrics,
      };
    } catch (error) {
      logger.error('Failed to get metrics overview:', error);
      return {
        totalMetrics: 0,
        activeAlerts: 0,
        systemHealth: 'healthy',
        topMetrics: [],
      };
    }
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    // Collect resource usage every 30 seconds
    setInterval(() => {
      this.recordResourceUsage();
    }, 30000);
  }

  /**
   * Start metrics cleanup
   */
  private startMetricsCleanup(): void {
    // Clean old metrics every hour
    setInterval(
      () => {
        this.cleanupOldMetrics();
      },
      60 * 60 * 1000,
    );
  }

  /**
   * Clean old metrics
   */
  private cleanupOldMetrics(): void {
    try {
      const cutoff = Date.now() - this.metricsRetention;

      for (const [name, metrics] of this.metrics.entries()) {
        const filtered = metrics.filter(metric => new Date(metric.timestamp).getTime() > cutoff);
        this.metrics.set(name, filtered);
      }

      logger.debug('Old metrics cleaned up');
    } catch (error) {
      logger.error('Failed to cleanup old metrics:', error);
    }
  }
}
