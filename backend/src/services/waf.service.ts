import { injectable } from 'inversify';
import { wafManagement } from '../middleware/waf.middleware';
import { logger } from '../utils/logger';

interface WAFEvent {
  id: string;
  timestamp: Date;
  type: 'block' | 'warning' | 'info';
  rule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  userAgent: string;
  path: string;
  method: string;
  payload?: string;
  context: string;
}

interface WAFMetrics {
  totalRequests: number;
  blockedRequests: number;
  warnings: number;
  blockRate: number;
  topAttacks: Array<{
    rule: string;
    count: number;
    percentage: number;
  }>;
  topIPs: Array<{
    ip: string;
    count: number;
    blocked: boolean;
  }>;
  timeSeriesData: Array<{
    timestamp: Date;
    requests: number;
    blocks: number;
    warnings: number;
  }>;
}

@injectable()
export class WAFService {
  private events: WAFEvent[] = [];
  private maxEvents = 10000; // Keep last 10k events
  private timeSeriesData: Array<{
    timestamp: Date;
    requests: number;
    blocks: number;
    warnings: number;
  }> = [];
  private ipStats = new Map<string, { count: number; blocked: boolean; lastSeen: Date }>();

  constructor() {
    // Initialize time series data
    this.initializeTimeSeries();

    // Clean up old data periodically
    setInterval(() => this.cleanupOldData(), 5 * 60 * 1000); // Every 5 minutes
  }

  private initializeTimeSeries() {
    // Initialize with last 24 hours of data
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      this.timeSeriesData.push({
        timestamp,
        requests: 0,
        blocks: 0,
        warnings: 0,
      });
    }
  }

  public logEvent(event: Partial<WAFEvent>): void {
    const fullEvent: WAFEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      type: event.type || 'info',
      rule: event.rule || 'unknown',
      severity: event.severity || 'medium',
      ip: event.ip || 'unknown',
      userAgent: event.userAgent || 'unknown',
      path: event.path || 'unknown',
      method: event.method || 'unknown',
      payload: event.payload,
      context: event.context || 'unknown',
    };

    // Add to events array
    this.events.push(fullEvent);

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Update IP statistics
    this.updateIPStats(fullEvent.ip, fullEvent.type === 'block');

    // Update time series data
    this.updateTimeSeriesData(fullEvent.type);

    // Log based on severity
    switch (fullEvent.severity) {
      case 'critical':
        logger.error('WAF Critical Event', fullEvent);
        break;
      case 'high':
        logger.warn('WAF High Severity Event', fullEvent);
        break;
      case 'medium':
        logger.warn('WAF Medium Severity Event', fullEvent);
        break;
      default:
        logger.info('WAF Event', fullEvent);
    }
  }

  private generateEventId(): string {
    return `waf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateIPStats(ip: string, blocked: boolean): void {
    const existing = this.ipStats.get(ip);
    if (existing) {
      existing.count++;
      existing.blocked = existing.blocked || blocked;
      existing.lastSeen = new Date();
    } else {
      this.ipStats.set(ip, {
        count: 1,
        blocked,
        lastSeen: new Date(),
      });
    }
  }

  private updateTimeSeriesData(type: 'block' | 'warning' | 'info'): void {
    const now = new Date();
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

    // Find or create current hour entry
    let currentData = this.timeSeriesData.find(
      d => d.timestamp.getTime() === currentHour.getTime(),
    );

    if (!currentData) {
      currentData = {
        timestamp: currentHour,
        requests: 0,
        blocks: 0,
        warnings: 0,
      };
      this.timeSeriesData.push(currentData);

      // Keep only last 24 hours
      this.timeSeriesData = this.timeSeriesData.filter(
        d => d.timestamp.getTime() > now.getTime() - 24 * 60 * 60 * 1000,
      );
    }

    currentData.requests++;
    if (type === 'block') currentData.blocks++;
    if (type === 'warning') currentData.warnings++;
  }

  private cleanupOldData(): void {
    const now = new Date();
    const cutoff = now.getTime() - 24 * 60 * 60 * 1000; // 24 hours ago

    // Clean up old IP stats
    for (const [ip, stats] of this.ipStats.entries()) {
      if (stats.lastSeen.getTime() < cutoff) {
        this.ipStats.delete(ip);
      }
    }
  }

  public getMetrics(): WAFMetrics {
    const stats = wafManagement.getStats();
    const rules = wafManagement.getRules();
    const rulesTriggered = stats.rulesTriggered;

    // Calculate top attacks
    const topAttacks = Object.entries(rulesTriggered)
      .map(([rule, count]) => ({
        rule,
        count,
        percentage: stats.totalRequests > 0 ? (count / stats.totalRequests) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate top IPs
    const topIPs = Array.from(this.ipStats.entries())
      .map(([ip, stats]) => ({
        ip,
        count: stats.count,
        blocked: stats.blocked,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return {
      totalRequests: stats.totalRequests,
      blockedRequests: stats.blockedRequests,
      warnings: stats.warnings,
      blockRate: stats.totalRequests > 0 ? (stats.blockedRequests / stats.totalRequests) * 100 : 0,
      topAttacks,
      topIPs,
      timeSeriesData: this.timeSeriesData,
    };
  }

  public getEvents(filters?: {
    type?: 'block' | 'warning' | 'info';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    rule?: string;
    ip?: string;
    limit?: number;
    offset?: number;
  }): { events: WAFEvent[]; total: number } {
    let filteredEvents = [...this.events];

    // Apply filters
    if (filters?.type) {
      filteredEvents = filteredEvents.filter(e => e.type === filters.type);
    }
    if (filters?.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }
    if (filters?.rule) {
      filteredEvents = filteredEvents.filter(e => e.rule === filters.rule);
    }
    if (filters?.ip) {
      filteredEvents = filteredEvents.filter(e => e.ip === filters.ip);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = filteredEvents.length;
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    return {
      events: filteredEvents.slice(offset, offset + limit),
      total,
    };
  }

  public getIPReputation(ip: string): {
    reputation: 'good' | 'suspicious' | 'malicious';
    score: number;
    details: {
      totalRequests: number;
      blockedRequests: number;
      lastSeen: Date;
      rulesTriggered: string[];
    };
  } {
    const ipStats = this.ipStats.get(ip);
    if (!ipStats) {
      return {
        reputation: 'good',
        score: 100,
        details: {
          totalRequests: 0,
          blockedRequests: 0,
          lastSeen: new Date(),
          rulesTriggered: [],
        },
      };
    }

    const ipEvents = this.events.filter(e => e.ip === ip);
    const blockedRequests = ipEvents.filter(e => e.type === 'block').length;
    const rulesTriggered = [...new Set(ipEvents.map(e => e.rule))];

    // Calculate reputation score (0-100)
    let score = 100;
    if (ipStats.blocked) score -= 50;
    score -= (blockedRequests / ipStats.count) * 30; // Penalty for high block rate
    score -= Math.min(rulesTriggered.length * 5, 20); // Penalty for multiple rules

    let reputation: 'good' | 'suspicious' | 'malicious';
    if (score >= 80) reputation = 'good';
    else if (score >= 50) reputation = 'suspicious';
    else reputation = 'malicious';

    return {
      reputation,
      score: Math.max(0, Math.round(score)),
      details: {
        totalRequests: ipStats.count,
        blockedRequests,
        lastSeen: ipStats.lastSeen,
        rulesTriggered,
      },
    };
  }

  public blockIP(ip: string, reason: string, duration: number = 24 * 60 * 60 * 1000): void {
    // This would integrate with your IP blocking system
    logger.warn('IP blocked by WAF service', {
      ip,
      reason,
      duration,
      timestamp: new Date().toISOString(),
    });

    // Update IP stats to mark as blocked
    const stats = this.ipStats.get(ip);
    if (stats) {
      stats.blocked = true;
    }

    // Log event
    this.logEvent({
      type: 'block',
      rule: 'MANUAL_BLOCK',
      severity: 'high',
      ip,
      context: `Manual block: ${reason}`,
      path: '/blocked',
      method: 'BLOCK',
    });
  }

  public unblockIP(ip: string, reason: string): void {
    logger.info('IP unblocked by WAF service', {
      ip,
      reason,
      timestamp: new Date().toISOString(),
    });

    // Update IP stats to mark as unblocked
    const stats = this.ipStats.get(ip);
    if (stats) {
      stats.blocked = false;
    }
  }

  public exportEvents(format: 'json' | 'csv' = 'json'): string {
    const events = this.getEvents({ limit: 10000 }).events;

    if (format === 'csv') {
      const headers = [
        'id',
        'timestamp',
        'type',
        'rule',
        'severity',
        'ip',
        'path',
        'method',
        'context',
      ];
      const csvData = events.map(event => [
        event.id,
        event.timestamp.toISOString(),
        event.type,
        event.rule,
        event.severity,
        event.ip,
        event.path,
        event.method,
        event.context,
      ]);

      return [headers, ...csvData].map(row => row.join(',')).join('\n');
    }

    return JSON.stringify(events, null, 2);
  }

  public getDashboardData(): {
    overview: WAFMetrics;
    recentEvents: WAFEvent[];
    topThreats: Array<{ rule: string; count: number; severity: string }>;
    threatMap: Array<{ country: string; count: number }>;
  } {
    const overview = this.getMetrics();
    const recentEvents = this.getEvents({ limit: 50 }).events;

    const topThreats = overview.topAttacks.map(attack => ({
      rule: attack.rule,
      count: attack.count,
      severity: this.getRuleSeverity(attack.rule),
    }));

    // Simple threat map (would integrate with GeoIP in production)
    const threatMap = Array.from(this.ipStats.entries())
      .map(([ip, stats]) => ({
        country: this.getCountryFromIP(ip), // Placeholder function
        count: stats.count,
      }))
      .filter(item => item.country !== 'unknown')
      .reduce(
        (acc, item) => {
          const existing = acc.find(x => x.country === item.country);
          if (existing) {
            existing.count += item.count;
          } else {
            acc.push(item);
          }
          return acc;
        },
        [] as Array<{ country: string; count: number }>,
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      overview,
      recentEvents,
      topThreats,
      threatMap,
    };
  }

  private getRuleSeverity(ruleName: string): string {
    const rules = wafManagement.getRules();
    const rule = rules.find(r => r.name === ruleName);
    return rule?.severity || 'medium';
  }

  private getCountryFromIP(ip: string): string {
    // Placeholder - would integrate with GeoIP database
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return 'private';
    }
    if (ip === '127.0.0.1' || ip === '::1') {
      return 'localhost';
    }
    return 'unknown';
  }
}
