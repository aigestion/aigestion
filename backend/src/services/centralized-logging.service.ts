import crypto from 'crypto';
import fs from 'fs/promises';
import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import path from 'path';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';
import { SelfHealingService } from './self-healing.service';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
export const CENTRAL_LOGGING_SERVICE_NAME = 'CentralizedLoggingService';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  service: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  message: string;
  metadata: {
    [key: string]: any;
  };
  stack?: string;
  duration?: number;
  tags: string[];
}

interface LogQuery {
  level?: string;
  service?: string;
  userId?: string;
  sessionId?: string;
  startTime?: Date;
  endTime?: Date;
  tags?: string[];
  limit?: number;
  offset?: number;
  search?: string;
}

interface LogStats {
  totalLogs: number;
  logsByLevel: { [key: string]: number };
  logsByService: { [key: string]: number };
  errorRate: number;
  averageResponseTime: number;
  topErrors: Array<{
    message: string;
    count: number;
    level: string;
    service: string;
  }>;
  recentActivity: Array<{
    timestamp: Date;
    level: string;
    service: string;
    message: string;
  }>;
}

@injectable()
export class CentralizedLoggingService {
  private readonly redis: RedisClientType;
  private readonly logBuffer: LogEntry[] = [];
  private readonly bufferSize = 1000;
  private readonly flushInterval = 5000; // 5 seconds
  private readonly logRetention = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly logDirectory = 'logs';
  private readonly maxLogFiles = 100;

  constructor() {
    this.redis = getRedisClient();

    this.initializeLogging();
    this.startLogFlush();
    this.startLogRotation();
  }

  private async initializeLogging() {
    try {
      // Create log directory
      await fs.mkdir(this.logDirectory, { recursive: true });

      // Create daily log files
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDirectory, `nexus-${today}.log`);

      // Check if log file exists
      try {
        await fs.access(logFile);
      } catch {
        // Create new log file with header
        const header = `# NEXUS V1 Centralized Log - ${today}\n`;
        await fs.writeFile(logFile, header);
      }

      logger.info('Centralized logging service initialized');
    } catch (error) {
      logger.error('Failed to initialize centralized logging:', error);
    }
  }

  /**
   * Log an entry
   */
  public async log(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const logEntry: LogEntry = {
        ...entry,
        id: this.generateLogId(),
        timestamp: new Date(),
      };

      // Add to buffer
      this.logBuffer.push(logEntry);

      // Buffer management
      if (this.logBuffer.length >= this.bufferSize) {
        await this.flushLogs();
      }

      // Critical logs are flushed immediately
      if (entry.level === 'critical') {
        await this.flushLogs();
        await this.sendAlert(logEntry);
      }
    } catch (error) {
      logger.error('Failed to log entry:', error);
    }
  }

  /**
   * Query logs
   */
  public async queryLogs(query: LogQuery): Promise<{
    logs: LogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const cacheKey = this.generateQueryCacheKey(query);
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        const result = JSON.parse(cached);
        return result;
      }

      // Query from file system (simplified implementation)
      const logs = await this.queryLogsFromFile(query);
      const total = logs.length;
      const limit = query.limit || 100;
      const offset = query.offset || 0;
      const paginatedLogs = logs.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      const result = {
        logs: paginatedLogs,
        total,
        hasMore,
      };

      // Cache result
      await this.redis.setEx(cacheKey, 60, JSON.stringify(result));

      return result;
    } catch (error) {
      logger.error('Failed to query logs:', error);
      return { logs: [], total: 0, hasMore: false };
    }
  }

  /**
   * Get log statistics
   */
  public async getStats(timeRange: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<LogStats> {
    try {
      const now = new Date();
      let startTime: Date;

      switch (timeRange) {
        case 'hour':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'day':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const query: LogQuery = {
        startTime,
        endTime: now,
        limit: 10000,
      };

      const { logs } = await this.queryLogs(query);

      const stats: LogStats = {
        totalLogs: logs.length,
        logsByLevel: {},
        logsByService: {},
        errorRate: 0,
        averageResponseTime: 0,
        topErrors: [],
        recentActivity: [],
      };

      // Calculate statistics
      logs.forEach(log => {
        // Count by level
        stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1;

        // Count by service
        stats.logsByService[log.service] = (stats.logsByService[log.service] || 0) + 1;

        // Calculate error rate
        if (log.level === 'error' || log.level === 'critical') {
          stats.errorRate++;
        }

        // Calculate average response time
        if (log.duration) {
          stats.averageResponseTime += log.duration;
        }
      });

      // Finalize calculations
      stats.errorRate = logs.length > 0 ? (stats.errorRate / logs.length) * 100 : 0;
      stats.averageResponseTime = logs.length > 0 ? stats.averageResponseTime / logs.length : 0;

      // Top errors
      const errorLogs = logs.filter(log => log.level === 'error' || log.level === 'critical');
      const errorCounts = new Map<
        string,
        { count: number; level: string; service: string; message: string }
      >();

      errorLogs.forEach(log => {
        const key = `${log.service}:${log.message}`;
        const existing = errorCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          errorCounts.set(key, {
            count: 1,
            level: log.level,
            service: log.service,
            message: log.message,
          });
        }
      });

      stats.topErrors = Array.from(errorCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Recent activity
      stats.recentActivity = logs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20)
        .map(log => ({
          timestamp: log.timestamp,
          level: log.level,
          service: log.service,
          message: log.message,
        }));

      return stats;
    } catch (error) {
      logger.error('Failed to get log stats:', error);
      return {
        totalLogs: 0,
        logsByLevel: {},
        logsByService: {},
        errorRate: 0,
        averageResponseTime: 0,
        topErrors: [],
        recentActivity: [],
      };
    }
  }

  /**
   * Search logs
   */
  public async searchLogs(
    searchTerm: string,
    options: Partial<LogQuery> = {}
  ): Promise<LogEntry[]> {
    try {
      const query: LogQuery = {
        search: searchTerm,
        limit: 100,
        ...options,
      };

      const { logs } = await this.queryLogs(query);
      return logs;
    } catch (error) {
      logger.error('Failed to search logs:', error);
      return [];
    }
  }

  /**
   * Export logs
   */
  public async exportLogs(query: LogQuery, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const { logs } = await this.queryLogs({ ...query, limit: 10000 });

      if (format === 'csv') {
        const headers = [
          'id',
          'timestamp',
          'level',
          'service',
          'userId',
          'message',
          'ipAddress',
          'duration',
        ];
        const csvData = logs.map(log => [
          log.id,
          log.timestamp.toISOString(),
          log.level,
          log.service,
          log.userId || '',
          log.message.replace(/"/g, '""'), // Escape quotes
          log.ipAddress || '',
          log.duration || '',
        ]);

        return [headers, ...csvData].map(row => row.join(',')).join('\n');
      }

      return JSON.stringify(logs, null, 2);
    } catch (error) {
      logger.error('Failed to export logs:', error);
      return '';
    }
  }

  /**
   * Flush buffer to persistent storage
   */
  private async flushLogs(): Promise<void> {
    try {
      if (this.logBuffer.length === 0) {
        return;
      }

      const logsToFlush = [...this.logBuffer];
      this.logBuffer.length = 0; // Clear buffer

      // Write to daily log file
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDirectory, `nexus-${today}.log`);

      const logLines = logsToFlush.map(
        log =>
          `${log.timestamp.toISOString()} [${log.level.toUpperCase()}] ${log.service}: ${
            log.message
          } ` +
          `${log.userId ? `[user:${log.userId}]` : ''} ${
            log.ipAddress ? `[ip:${log.ipAddress}]` : ''
          } ` +
          `${log.duration ? `[duration:${log.duration}ms]` : ''} ` +
          `${
            Object.keys(log.metadata).length > 0 ? `[metadata:${JSON.stringify(log.metadata)}]` : ''
          }`
      );

      await fs.appendFile(logFile, logLines.join('\n') + '\n');

      // Store in Redis for quick access
      for (const log of logsToFlush) {
        const redisKey = `log:${log.service}:${log.id}`;
        await this.redis.setEx(redisKey, 24 * 60 * 60, JSON.stringify(log));

        // Add to service index
        await this.redis.lPush(`logs:${log.service}:recent`, JSON.stringify(log));
        await this.redis.lTrim(`logs:${log.service}:recent`, 0, 999); // Keep last 1000

        // Add to level index if error or critical
        if (log.level === 'error' || log.level === 'critical') {
          await this.redis.lPush('logs:errors:recent', JSON.stringify(log));
          await this.redis.lTrim('logs:errors:recent', 0, 999);
        }
      }

      logger.debug(`Flushed ${logsToFlush.length} logs to storage`);
    } catch (error) {
      logger.error('Failed to flush logs:', error);
    }
  }

  /**
   * Query logs from file system
   */
  private async queryLogsFromFile(query: LogQuery): Promise<LogEntry[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logDirectory, `nexus-${today}.log`);

      const content = await fs.readFile(logFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

      const logs: LogEntry[] = [];

      for (const line of lines) {
        try {
          const log = this.parseLogLine(line);
          if (this.matchesQuery(log, query)) {
            logs.push(log);
          }
        } catch (error) {
          // Skip malformed lines
        }
      }

      // Sort by timestamp (newest first)
      logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return logs;
    } catch (error) {
      logger.error('Failed to query logs from file:', error);
      return [];
    }
  }

  /**
   * Parse log line
   */
  private parseLogLine(line: string): LogEntry {
    const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);
    const levelMatch = line.match(/\[(DEBUG|INFO|WARN|ERROR|CRITICAL)\]/);
    const serviceMatch = line.match(/\] ([^:]+):/);
    const messageMatch = line.match(/: (.+?)(?: \[|$)/);

    const userIdMatch = line.match(/\[user:([^\]]+)\]/);
    const ipMatch = line.match(/\[ip:([^\]]+)\]/);
    const durationMatch = line.match(/\[duration:(\d+)ms\]/);
    const metadataMatch = line.match(/\[metadata:([^\]]+)\]/);

    return {
      id: crypto.randomBytes(16).toString('hex'),
      timestamp: timestampMatch ? new Date(timestampMatch[1]) : new Date(),
      level: (levelMatch?.[1] || 'info').toLowerCase() as any,
      service: serviceMatch?.[1] || 'unknown',
      message: messageMatch?.[1] || line,
      userId: userIdMatch?.[1],
      ipAddress: ipMatch?.[1],
      duration: durationMatch ? parseInt(durationMatch[1]) : undefined,
      metadata: metadataMatch ? JSON.parse(metadataMatch[1]) : {},
      tags: [],
      sessionId: undefined,
      requestId: undefined,
      userAgent: undefined,
      stack: undefined,
    };
  }

  /**
   * Check if log matches query
   */
  private matchesQuery(log: LogEntry, query: LogQuery): boolean {
    if (query.level && log.level !== query.level) return false;
    if (query.service && log.service !== query.service) return false;
    if (query.userId && log.userId !== query.userId) return false;
    if (query.startTime && log.timestamp < query.startTime) return false;
    if (query.endTime && log.timestamp > query.endTime) return false;
    if (query.search && !log.message.toLowerCase().includes(query.search.toLowerCase()))
      return false;
    if (query.tags && query.tags.length > 0 && !query.tags.some(tag => log.tags.includes(tag)))
      return false;

    return true;
  }

  /**
   * Generate query cache key
   */
  private generateQueryCacheKey(query: LogQuery): string {
    const key = `query:${JSON.stringify(query)}`;
    return crypto.createHash('md5').update(key).digest('hex');
  }

  /**
   * Generate log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send alert for critical logs
   */
  private async sendAlert(log: LogEntry): Promise<void> {
    try {
      // This would integrate with your alerting system (Sentry, PagerDuty, etc.)
      logger.error('CRITICAL ALERT', {
        id: log.id,
        service: log.service,
        message: log.message,
        userId: log.userId,
        ipAddress: log.ipAddress,
        metadata: log.metadata,
      });

      // Store alert for monitoring
      await this.redis.setEx(
        `alert:${log.id}`,
        24 * 60 * 60, // 24 hours
        JSON.stringify({
          ...log,
          alertLevel: 'critical',
          sentAt: new Date(),
        }),
      );

      // Automated Self-Healing Trigger
      try {
        const selfHealing = container.get<SelfHealingService>(TYPES.SelfHealingService);
        await selfHealing.diagnoseAndRepair(JSON.stringify(log));
      } catch (e) {
        logger.error('[CentralizedLogging] Failed to trigger self-healing diagnostic:', e);
      }
    } catch (error) {
      logger.error('Failed to send alert:', error);
    }
  }

  /**
   * Start log flush interval
   */
  private startLogFlush(): void {
    setInterval(() => {
      this.flushLogs();
    }, this.flushInterval);
  }

  /**
   * Start log rotation
   */
  private startLogRotation(): void {
    setInterval(
      async () => {
        await this.rotateLogs();
      },
      24 * 60 * 60 * 1000
    ); // Daily
  }

  /**
   * Rotate old log files
   */
  private async rotateLogs(): Promise<void> {
    try {
      const files = await fs.readdir(this.logDirectory);
      const logFiles = files.filter(file => file.startsWith('nexus-') && file.endsWith('.log'));

      // Sort by date (oldest first)
      logFiles.sort((a, b) => {
        const dateA = a.split('-')[1].split('.')[0];
        const dateB = b.split('-')[1].split('.')[0];
        return dateA.localeCompare(dateB);
      });

      // Remove old files beyond retention period
      const cutoffDate = new Date(Date.now() - this.logRetention);

      for (const file of logFiles) {
        if (logFiles.length > this.maxLogFiles) {
          const filePath = path.join(this.logDirectory, file);
          await fs.unlink(filePath);
          logger.info(`Rotated old log file: ${file}`);
          logFiles.shift(); // Remove from array
        }

        // Check file date
        const fileDate = file.split('-')[1].split('.')[0];
        const fileDateTime = new Date(fileDate);

        if (fileDateTime < cutoffDate) {
          const filePath = path.join(this.logDirectory, file);
          await fs.unlink(filePath);
          logger.info(`Rotated expired log file: ${file}`);
        }
      }

      logger.info('Log rotation completed');
    } catch (error) {
      logger.error('Failed to rotate logs:', error);
    }
  }

  /**
   * Get recent logs for a service
   */
  public async getRecentLogs(service: string, limit: number = 100): Promise<LogEntry[]> {
    try {
      const logData = await this.redis.lRange(`logs:${service}:recent`, 0, limit - 1);
      return logData.map(data => JSON.parse(data));
    } catch (error) {
      logger.error('Failed to get recent logs:', error);
      return [];
    }
  }

  /**
   * Get recent error logs
   */
  public async getRecentErrors(limit: number = 100): Promise<LogEntry[]> {
    try {
      const errorData = await this.redis.lRange('logs:errors:recent', 0, limit - 1);
      return errorData.map(data => JSON.parse(data));
    } catch (error) {
      logger.error('Failed to get recent errors:', error);
      return [];
    }
  }
}
