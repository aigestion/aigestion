import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';
import { BackupRestoreService } from './backup-restore.service';
import {
  CENTRAL_LOGGING_SERVICE_NAME,
  CentralizedLoggingService,
} from './centralized-logging.service';
import { MalwareScannerService } from './malware-scanner.service';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { HealthService } from './health.service';
import { MonitoringService } from './monitoring.service';
import { ThreatIntelligenceService } from './threat-intelligence.service';
import { TwoFactorService } from './two-factor.service';
import { UserBehaviorService } from './user-behavior.service';
import { WAFService } from './waf.service';

interface SecurityDashboardData {
  overview: {
    systemHealth: 'healthy' | 'warning' | 'critical';
    totalAlerts: number;
    criticalAlerts: number;
    activeThreats: number;
    lastScan: Date;
  };
  waf: {
    stats: any;
    recentBlocks: number;
    topAttacks: Array<{
      rule: string;
      count: number;
      severity: string;
    }>;
    blockedIPs: string[];
  };
  malware: {
    stats: any;
    quarantinedFiles: number;
    recentDetections: Array<{
      file: string;
      threat: string;
      timestamp: Date;
    }>;
  };
  twoFactor: {
    stats: any;
    enabledUsers: number;
    recentVerifications: number;
  };
  threatIntel: {
    stats: any;
    recentAlerts: Array<{
      type: string;
      severity: string;
      indicator: string;
      timestamp: Date;
    }>;
  };
  behavior: {
    stats: any;
    highRiskUsers: number;
    recentAnomalies: Array<{
      userId: string;
      type: string;
      severity: string;
      timestamp: Date;
    }>;
  };
  logs: {
    stats: any;
    recentErrors: Array<{
      timestamp: Date;
      level: string;
      service: string;
      message: string;
    }>;
    recentCritical: Array<{
      timestamp: Date;
      message: string;
      service: string;
    }>;
  };
  monitoring: {
    performance: any;
    alerts: Array<{
      name: string;
      severity: string;
      message: string;
      timestamp: Date;
    }>;
  };
  backup: {
    stats: any;
    recentJobs: Array<{
      id: string;
      type: string;
      status: string;
      size: number;
      timestamp: Date;
    }>;
  };
}

@injectable()
export class SecurityDashboardService {
  private readonly redis: RedisClientType;
  private readonly wafService: WAFService;
  private readonly malwareScanner: MalwareScannerService;
  private readonly twoFactorService: TwoFactorService;
  private readonly threatIntelService: ThreatIntelligenceService;
  private readonly behaviorService: UserBehaviorService;
  private readonly loggingService: CentralizedLoggingService;
  private readonly monitoringService: MonitoringService;
  private readonly backupService: BackupRestoreService;

  constructor() {
    this.redis = getRedisClient();

    // Initialize services via container to ensure singleton usage
    this.wafService = container.get<WAFService>(TYPES.WAFService);
    this.malwareScanner = container.get<MalwareScannerService>(TYPES.MalwareScannerService);
    this.twoFactorService = container.get<TwoFactorService>(TYPES.TwoFactorService);
    this.threatIntelService = container.get<ThreatIntelligenceService>(
      TYPES.ThreatIntelligenceService
    );
    this.behaviorService = container.get<UserBehaviorService>(UserBehaviorService);
    this.loggingService = container.get<CentralizedLoggingService>(CENTRAL_LOGGING_SERVICE_NAME);
    this.monitoringService = container.get<MonitoringService>(TYPES.MonitoringService);
    this.backupService = container.get<BackupRestoreService>(TYPES.BackupRestoreService);
  }

  /**
   * Get complete security dashboard data
   */
  public async getDashboardData(): Promise<SecurityDashboardData> {
    try {
      const [overview, waf, malware, twoFactor, threatIntel, behavior, logs, monitoring] =
        await Promise.all([
          this.getOverviewData(),
          this.getWAFData(),
          this.getMalwareData(),
          this.getTwoFactorData(),
          this.getThreatIntelData(),
          this.getBehaviorData(),
          this.getLogData(),
          this.getMonitoringData(),
        ]);

      const backupData = await this.backupService.getStats();

      return {
        overview,
        waf,
        malware,
        twoFactor,
        threatIntel,
        behavior,
        logs,
        monitoring,
        backup: {
          stats: backupData,
          recentJobs: backupData.recentBackups,
        },
      };
    } catch (error) {
      logger.error('Failed to get dashboard data:', error);
      return this.getDefaultDashboardData();
    }
  }

  /**
   * Get overview data integrated with HealthService
   */
  private async getOverviewData(): Promise<{
    systemHealth: 'healthy' | 'warning' | 'critical';
    totalAlerts: number;
    criticalAlerts: number;
    activeThreats: number;
    lastScan: Date;
  }> {
    try {
      const healthService = container.get<HealthService>(HealthService);
      const health = await healthService.getDetailedHealth();

      const behaviorStats = await this.behaviorService.getStats();
      const threatAlerts = await this.threatIntelService.getRecentAlerts(50);
      const criticalThreats = threatAlerts.filter(alert => alert.severity === 'critical').length;

      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (health.status === 'degraded' || behaviorStats.highRiskUsers > 5 || criticalThreats > 3) {
        systemHealth = 'critical';
      } else if (behaviorStats.highRiskUsers > 0 || criticalThreats > 0) {
        systemHealth = 'warning';
      }

      return {
        systemHealth,
        totalAlerts: behaviorStats.totalAnomalies + threatAlerts.length,
        criticalAlerts: criticalThreats,
        activeThreats: threatAlerts.length,
        lastScan: new Date(),
      };
    } catch (error) {
      logger.error('Failed to get overview data:', error);
      return {
        systemHealth: 'healthy',
        totalAlerts: 0,
        criticalAlerts: 0,
        activeThreats: 0,
        lastScan: new Date(),
      };
    }
  }

  /**
   * Get WAF data
   */
  private async getWAFData(): Promise<{
    stats: any;
    recentBlocks: number;
    topAttacks: Array<{
      rule: string;
      count: number;
      severity: string;
    }>;
    blockedIPs: string[];
  }> {
    try {
      const stats = this.wafService.getMetrics();
      const recentAlerts = await this.threatIntelService.getRecentAlerts(50);
      const recentBlocks = recentAlerts.filter(alert => alert.action === 'block').length;

      const topAttacks = Object.entries(stats.topAttacks)
        .map(([_, attack]: [string, any]) => ({
          rule: attack.rule,
          count: attack.count,
          severity: this.getRuleSeverity(attack.rule),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        stats,
        recentBlocks,
        topAttacks,
        blockedIPs: [], // Would get from recent WAF blocks
      };
    } catch (error) {
      logger.error('Failed to get WAF data:', error);
      return {
        stats: { totalRequests: 0, blockedRequests: 0, warnings: 0, rulesTriggered: {} },
        recentBlocks: 0,
        topAttacks: [],
        blockedIPs: [],
      };
    }
  }

  /**
   * Get malware data
   */
  private async getMalwareData(): Promise<{
    stats: any;
    quarantinedFiles: number;
    recentDetections: Array<{
      file: string;
      threat: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const stats = this.malwareScanner.getScanStats();
      const quarantinedFiles = await this.malwareScanner.getQuarantinedFiles();

      const recentDetections = quarantinedFiles
        .sort((a, b) => b.quarantinedAt.getTime() - a.quarantinedAt.getTime())
        .slice(0, 10)
        .map(file => ({
          file: file.originalPath,
          threat: file.threat,
          timestamp: file.quarantinedAt,
        }));

      return {
        stats,
        quarantinedFiles: quarantinedFiles.length,
        recentDetections,
      };
    } catch (error) {
      logger.error('Failed to get malware data:', error);
      return {
        stats: { totalScans: 0, infectedFiles: 0, quarantinedFiles: 0, averageScanTime: 0 },
        quarantinedFiles: 0,
        recentDetections: [],
      };
    }
  }

  /**
   * Get 2FA data
   */
  private async getTwoFactorData(): Promise<{
    stats: any;
    enabledUsers: number;
    recentVerifications: number;
  }> {
    try {
      const stats = await this.twoFactorService.getStats();

      return {
        stats,
        enabledUsers: stats.enabledUsers,
        recentVerifications: stats.recentVerifications,
      };
    } catch (error) {
      logger.error('Failed to get 2FA data:', error);
      return {
        stats: { totalUsers: 0, enabledUsers: 0, methodDistribution: {}, recentVerifications: 0 },
        enabledUsers: 0,
        recentVerifications: 0,
      };
    }
  }

  /**
   * Get threat intelligence data
   */
  private async getThreatIntelData(): Promise<{
    stats: any;
    recentAlerts: Array<{
      type: string;
      severity: string;
      indicator: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const stats = await this.threatIntelService.getStats();
      const recentAlerts = await this.threatIntelService.getRecentAlerts(50);

      return {
        stats,
        recentAlerts: recentAlerts.map(alert => ({
          type: alert.type,
          severity: alert.severity,
          indicator: alert.indicator,
          timestamp: alert.timestamp,
        })),
      };
    } catch (error) {
      logger.error('Failed to get threat intel data:', error);
      return {
        stats: {
          totalFeeds: 0,
          activeFeeds: 0,
          totalAlerts: 0,
          alertsBySeverity: {},
          alertsByType: {},
          recentAlerts: 0,
        },
        recentAlerts: [],
      };
    }
  }

  /**
   * Get behavior analysis data
   */
  private async getBehaviorData(): Promise<{
    stats: any;
    highRiskUsers: number;
    recentAnomalies: Array<{
      userId: string;
      type: string;
      severity: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const stats = await this.behaviorService.getStats();
      const recentAnomalies = await this.behaviorService.getRecentAnomalies(50);

      return {
        stats,
        highRiskUsers: stats.highRiskUsers,
        recentAnomalies: recentAnomalies.map(anomaly => ({
          userId: anomaly.userId,
          type: anomaly.type,
          severity: anomaly.severity,
          timestamp: anomaly.detectedAt,
        })),
      };
    } catch (error) {
      logger.error('Failed to get behavior data:', error);
      return {
        stats: {
          totalProfiles: 0,
          enabledUsers: 0,
          anomaliesByType: {},
          anomaliesBySeverity: {},
          averageRiskScore: 0,
          highRiskUsers: 0,
        },
        highRiskUsers: 0,
        recentAnomalies: [],
      };
    }
  }

  /**
   * Get log data
   */
  private async getLogData(): Promise<{
    stats: any;
    recentErrors: Array<{
      timestamp: Date;
      level: string;
      service: string;
      message: string;
    }>;
    recentCritical: Array<{
      timestamp: Date;
      message: string;
      service: string;
    }>;
  }> {
    try {
      const stats = await this.loggingService.getStats('hour');
      const recentErrors = await this.loggingService.getRecentErrors(20);
      const recentCritical = recentErrors.filter(log => log.level === 'critical').slice(0, 10);

      return {
        stats,
        recentErrors: recentErrors.map(log => ({
          timestamp: log.timestamp,
          level: log.level,
          service: log.service,
          message: log.message,
        })),
        recentCritical: recentCritical.map(log => ({
          timestamp: log.timestamp,
          message: log.message,
          service: log.service,
        })),
      };
    } catch (error) {
      logger.error('Failed to get log data:', error);
      return {
        stats: {
          totalLogs: 0,
          logsByLevel: {},
          logsByService: {},
          errorRate: 0,
          averageResponseTime: 0,
        },
        recentErrors: [],
        recentCritical: [],
      };
    }
  }

  /**
   * Get monitoring data
   */
  private async getMonitoringData(): Promise<{
    performance: any;
    alerts: Array<{
      name: string;
      severity: string;
      message: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const performance = await this.monitoringService.getPerformanceMetrics('hour');
      const alerts = await this.monitoringService.getRecentAlerts(20);

      return {
        performance,
        alerts: alerts.map(alert => ({
          name: alert.name,
          severity: alert.severity,
          message: alert.message,
          timestamp: alert.timestamp,
        })),
      };
    } catch (error) {
      logger.error('Failed to get monitoring data:', error);
      return {
        performance: this.getDefaultPerformanceMetrics(),
        alerts: [],
      };
    }
  }

  /**
   * Get rule severity
   */
  private getRuleSeverity(ruleName: string): string {
    const severityMap: { [key: string]: string } = {
      SQL_INJECTION: 'critical',
      XSS_ATTACK: 'critical',
      COMMAND_INJECTION: 'critical',
      PATH_TRAVERSAL: 'high',
      SSRF_ATTACK: 'high',
      FILE_INCLUSION: 'high',
      BUFFER_OVERFLOW: 'medium',
      HEADER_INJECTION: 'medium',
      PARAMETER_POLLUTION: 'low',
    };

    return severityMap[ruleName] || 'medium';
  }

  /**
   * Get default performance metrics
   */
  private getDefaultPerformanceMetrics(): any {
    return {
      responseTime: { avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 },
      throughput: { requestsPerSecond: 0, requestsPerMinute: 0, requestsPerHour: 0 },
      errorRate: { total: 0, percentage: 0, byStatus: {} },
      resourceUsage: { cpu: 0, memory: 0, disk: 0, network: { inbound: 0, outbound: 0 } },
      database: { connections: 0, queryTime: { avg: 0, slow: 0 }, cacheHitRate: 0 },
    };
  }

  /**
   * Get default dashboard data
   */
  private getDefaultDashboardData(): SecurityDashboardData {
    return {
      overview: {
        systemHealth: 'healthy',
        totalAlerts: 0,
        criticalAlerts: 0,
        activeThreats: 0,
        lastScan: new Date(),
      },
      waf: {
        stats: { totalRequests: 0, blockedRequests: 0, warnings: 0, rulesTriggered: {} },
        recentBlocks: 0,
        topAttacks: [],
        blockedIPs: [],
      },
      malware: {
        stats: { totalScans: 0, infectedFiles: 0, quarantinedFiles: 0, averageScanTime: 0 },
        quarantinedFiles: 0,
        recentDetections: [],
      },
      twoFactor: {
        stats: { totalUsers: 0, enabledUsers: 0, methodDistribution: {}, recentVerifications: 0 },
        enabledUsers: 0,
        recentVerifications: 0,
      },
      threatIntel: {
        stats: {
          totalFeeds: 0,
          activeFeeds: 0,
          totalAlerts: 0,
          alertsBySeverity: {},
          alertsByType: {},
          recentAlerts: 0,
        },
        recentAlerts: [],
      },
      behavior: {
        stats: {
          totalProfiles: 0,
          enabledUsers: 0,
          anomaliesByType: {},
          anomaliesBySeverity: {},
          averageRiskScore: 0,
          highRiskUsers: 0,
        },
        highRiskUsers: 0,
        recentAnomalies: [],
      },
      logs: {
        stats: {
          totalLogs: 0,
          logsByLevel: {},
          logsByService: {},
          errorRate: 0,
          averageResponseTime: 0,
        },
        recentErrors: [],
        recentCritical: [],
      },
      monitoring: {
        performance: this.getDefaultPerformanceMetrics(),
        alerts: [],
      },
      backup: {
        stats: {
          totalBackups: 0,
          successfulBackups: 0,
          failedBackups: 0,
          totalSize: 0,
          averageSize: 0,
          backupsByType: {},
          recentBackups: [],
        },
        recentJobs: [],
      },
    };
  }

  /**
   * Get real-time security metrics
   */
  public async getRealTimeMetrics(): Promise<{
    timestamp: Date;
    threatsBlocked: number;
    scansCompleted: number;
    authenticationAttempts: number;
    activeSessions: number;
    systemLoad: {
      cpu: number;
      memory: number;
      disk: number;
    };
  }> {
    try {
      const performance = await this.monitoringService.getPerformanceMetrics('minute');
      const wafStats = this.wafService.getMetrics();
      const malwareStats = this.malwareScanner.getScanStats();

      return {
        timestamp: new Date(),
        threatsBlocked: wafStats.blockedRequests,
        scansCompleted: malwareStats.totalScans,
        authenticationAttempts: 0, // Would track from auth service
        activeSessions: 0, // Would track from session service
        systemLoad: performance.resourceUsage,
      };
    } catch (error) {
      logger.error('Failed to get real-time metrics:', error);
      return {
        timestamp: new Date(),
        threatsBlocked: 0,
        scansCompleted: 0,
        authenticationAttempts: 0,
        activeSessions: 0,
        systemLoad: { cpu: 0, memory: 0, disk: 0 },
      };
    }
  }

  /**
   * Get security incidents
   */
  public async getSecurityIncidents(limit: number = 50): Promise<
    Array<{
      id: string;
      type: string;
      severity: string;
      title: string;
      description: string;
      timestamp: Date;
      status: 'open' | 'investigating' | 'resolved' | 'closed';
      assignedTo?: string;
      tags: string[];
    }>
  > {
    try {
      // This would integrate with an incident management system
      // For now, return recent alerts as incidents
      const threats = await this.threatIntelService.getRecentAlerts(limit);
      const wafBlocks = this.wafService.getMetrics();
      const malwareDetections = await this.malwareScanner.getQuarantinedFiles();

      const incidents = [
        ...threats.map(threat => ({
          id: threat.id,
          type: 'threat_detected',
          severity: threat.severity,
          title: `Threat Detected: ${threat.type}`,
          description: threat.description,
          timestamp: threat.timestamp,
          status: 'open' as const,
          tags: [threat.type, threat.severity],
        })),
        ...Array.from({ length: Math.min(10, wafBlocks.blockedRequests) }, (_, index) => ({
          id: `waf_block_${index}`,
          type: 'waf_block',
          severity: 'medium' as const,
          title: 'WAF Block',
          description: `Request blocked by WAF: ${wafBlocks.topAttacks[index]?.rule || 'Unknown'}`,
          timestamp: new Date(),
          status: 'resolved' as const,
          tags: ['waf', 'security'],
        })),
        ...malwareDetections.slice(0, 10).map((file, index) => ({
          id: `malware_${index}`,
          type: 'malware_detected',
          severity: 'high' as const,
          title: 'Malware Detected',
          description: `Malware found in: ${file.originalPath}`,
          timestamp: file.quarantinedAt,
          status: 'open' as const,
          tags: ['malware', 'security'],
        })),
      ]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return incidents;
    } catch (error) {
      logger.error('Failed to get security incidents:', error);
      return [];
    }
  }

  /**
   * Get security score
   */
  public async getSecurityScore(): Promise<{
    overall: number;
    categories: {
      waf: number;
      malware: number;
      authentication: number;
      monitoring: number;
      backup: number;
    };
    recommendations: string[];
  }> {
    try {
      const overview = await this.getOverviewData();
      const wafMetrics = this.wafService.getMetrics(); // Renamed from wafStats
      const malwareStats = this.malwareScanner.getScanStats();
      const twoFactorStats = await this.twoFactorService.getStats();
      const monitoringOverview = this.monitoringService.getMetricsOverview();
      const backupStats = await this.backupService.getStats();

      // Calculate scores for each category
      const wafScore = this.calculateCategoryScore(wafMetrics); // Corrected variable name
      const malwareScore = this.calculateCategoryScore(malwareStats);
      const authScore = this.calculateCategoryScore(twoFactorStats);
      const monitoringScore = this.calculateCategoryScore(monitoringOverview);
      const backupScore = this.calculateCategoryScore(backupStats);

      const overall = Math.round(
        (wafScore + malwareScore + authScore + monitoringScore + backupScore) / 5
      );

      const recommendations = this.generateRecommendations({
        waf: wafScore,
        malware: malwareScore,
        auth: authScore,
        monitoring: monitoringScore,
        backup: backupScore,
      });

      return {
        overall,
        categories: {
          waf: wafScore,
          malware: malwareScore,
          authentication: authScore,
          monitoring: monitoringScore,
          backup: backupScore,
        },
        recommendations,
      };
    } catch (error) {
      logger.error('Failed to get security score:', error);
      return {
        overall: 0,
        categories: {
          waf: 0,
          malware: 0,
          authentication: 0,
          monitoring: 0,
          backup: 0,
        },
        recommendations: [],
      };
    }
  }

  /**
   * Calculate category score
   */
  private calculateCategoryScore(stats: any): number {
    // Simple scoring algorithm - would be more sophisticated in production
    let score = 50; // Base score

    if (stats.totalRequests > 0) {
      const blockRate = stats.blockedRequests / stats.totalRequests;
      if (blockRate > 0.05) score -= 20;
      if (blockRate > 0.1) score -= 30;
    }

    if (stats.enabledUsers > 0) {
      score += 20;
    }

    if (stats.totalScans > 0) {
      const infectionRate = stats.infectedFiles / stats.totalScans;
      if (infectionRate === 0) score += 20;
      if (infectionRate < 0.01) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(scores: {
    waf: number;
    malware: number;
    auth: number;
    monitoring: number;
    backup: number;
  }): string[] {
    const recommendations: string[] = [];

    if (scores.waf < 70) {
      recommendations.push('Consider enabling more WAF rules or adjusting sensitivity');
    }
    if (scores.malware < 70) {
      recommendations.push('Update malware signatures and scan more frequently');
    }
    if (scores.auth < 70) {
      recommendations.push('Encourage users to enable 2FA for better security');
    }
    if (scores.monitoring < 70) {
      recommendations.push('Set up more comprehensive monitoring and alerting');
    }
    if (scores.backup < 70) {
      recommendations.push('Ensure regular backups are scheduled and tested');
    }

    return recommendations;
  }

  /**
   * Export dashboard data
   */
  public async exportDashboardData(format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const data = await this.getDashboardData();

      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      } else {
        // Convert to CSV
        const csvData = this.convertToCSV(data);
        return csvData;
      }
    } catch (error) {
      logger.error('Failed to export dashboard data:', error);
      return '';
    }
  }

  /**
   * Convert to CSV format
   */
  private convertToCSV(data: SecurityDashboardData): string {
    const headers = ['Category', 'Metric', 'Value', 'Timestamp', 'Status'];

    const rows = [
      headers,
      ['Overview', 'System Health', data.overview.systemHealth, new Date().toISOString(), ''],
      ['Overview', 'Total Alerts', data.overview.totalAlerts, new Date().toISOString(), ''],
      ['Overview', 'Critical Alerts', data.overview.criticalAlerts, new Date().toISOString(), ''],
      ['Overview', 'Active Threats', data.overview.activeThreats, new Date().toISOString(), ''],
      ['WAF', 'Blocked Requests', data.waf.stats.blockedRequests, new Date().toISOString(), ''],
      ['WAF', 'Total Requests', data.waf.stats.totalRequests, new Date().toISOString(), ''],
      ['Malware', 'Quarantined Files', data.malware.quarantinedFiles, new Date().toISOString(), ''],
      ['Malware', 'Total Scans', data.malware.stats.totalScans, new Date().toISOString(), ''],
      ['2FA', 'Enabled Users', data.twoFactor.enabledUsers, new Date().toISOString(), ''],
      [
        'Threat Intel',
        'Total Alerts',
        data.threatIntel.stats.totalAlerts,
        new Date().toISOString(),
        '',
      ],
      ['Behavior', 'High Risk Users', data.behavior.highRiskUsers, new Date().toISOString(), ''],
      ['Logs', 'Total Logs', data.logs.stats.totalLogs, new Date().toISOString(), ''],
      ['Logs', 'Error Rate', `${data.logs.stats.errorRate}%`, new Date().toISOString(), ''],
      ['Monitoring', 'Active Alerts', data.monitoring.alerts.length, new Date().toISOString(), ''],
      ['Backup', 'Total Backups', data.backup.stats.totalBackups, new Date().toISOString(), ''],
      [
        'Backup',
        'Success Rate',
        `${((data.backup.stats.successfulBackups / data.backup.stats.totalBackups) * 100).toFixed(
          1
        )}%`,
        new Date().toISOString(),
        '',
      ],
    ];

    return rows.map(row => row.join(',')).join('\n');
  }
}
