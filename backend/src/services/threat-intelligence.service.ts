import axios from 'axios';
import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

interface ThreatIndicator {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  source: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  tags: string[];
  firstSeen: Date;
  lastSeen: Date;
  isActive: boolean;
}

interface ThreatFeed {
  name: string;
  url: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  format: 'json' | 'txt' | 'csv';
  enabled: boolean;
  lastUpdated: Date;
  updateInterval: number; // minutes
}

interface ThreatAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicator: string;
  description: string;
  source: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  action: 'block' | 'warn' | 'monitor';
}

@injectable()
export class ThreatIntelligenceService {
  private readonly redis: RedisClientType;
  private readonly cacheTimeout = 60 * 60; // 1 hour
  private feeds: ThreatFeed[] = [];
  private readonly alerts: ThreatAlert[] = [];
  private readonly maxAlerts = 10000;

  constructor() {
    this.redis = getRedisClient();

    this.initializeFeeds();
    this.startFeedUpdates();
  }

  private initializeFeeds() {
    // Initialize default threat feeds
    this.feeds = [
      {
        name: 'Abuse.ch SSL Blacklist',
        url: 'https://sslbl.abuse.ch/downloads/SSLBLACKLIST.txt',
        type: 'domain',
        format: 'txt',
        enabled: true,
        lastUpdated: new Date(0),
        updateInterval: 60, // 1 hour
      },
      {
        name: 'Malware Domain List',
        url: 'https://www.malwaredomainlist.com/hostslist/hosts.txt',
        type: 'domain',
        format: 'txt',
        enabled: true,
        lastUpdated: new Date(0),
        updateInterval: 120, // 2 hours
      },
      {
        name: 'PhishTank',
        url: 'https://data.phishtank.com/data/online-valid.json',
        type: 'url',
        format: 'json',
        enabled: true,
        lastUpdated: new Date(0),
        updateInterval: 60, // 1 hour
      },
      {
        name: 'VirusTotal Public API',
        url: 'https://www.virustotal.com/vtapi/v2/',
        type: 'hash',
        format: 'json',
        enabled: process.env.VIRUSTOTAL_API_KEY ? true : false,
        lastUpdated: new Date(0),
        updateInterval: 30, // 30 minutes
      },
    ];

    logger.info('Threat intelligence feeds initialized', {
      totalFeeds: this.feeds.length,
      enabledFeeds: this.feeds.filter(f => f.enabled).length,
    });
  }

  private startFeedUpdates() {
    // Update feeds periodically
    setInterval(
      async () => {
        await this.updateAllFeeds();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    // Initial update
    this.updateAllFeeds().catch(error => {
      logger.error('Initial feed update failed:', error);
    });
  }

  /**
   * Check if IP address is malicious
   */
  public async checkIPAddress(ip: string): Promise<ThreatIndicator | null> {
    try {
      // Check cache first
      const cacheKey = `threat:ip:${ip}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        const indicator = JSON.parse(cached);
        if (indicator.isActive) {
          return indicator;
        }
      }

      // Check against threat feeds
      const indicators = await this.checkThreatFeeds('ip', ip);

      if (indicators.length > 0) {
        const indicator = indicators[0]; // Use highest confidence indicator

        // Cache result
        await this.redis.setEx(cacheKey, this.cacheTimeout, JSON.stringify(indicator));

        // Create alert
        await this.createAlert({
          id: this.generateAlertId(),
          type: 'malicious_ip',
          severity: indicator.severity,
          indicator: ip,
          description: `Malicious IP detected: ${indicator.description}`,
          source: indicator.source,
          timestamp: new Date(),
          ipAddress: ip,
          action: this.determineAction(indicator.severity),
        });

        return indicator;
      }

      return null;
    } catch (error) {
      logger.error('Error checking IP address:', { ip, error });
      return null;
    }
  }

  /**
   * Check if domain is malicious
   */
  public async checkDomain(domain: string): Promise<ThreatIndicator | null> {
    try {
      // Check cache first
      const cacheKey = `threat:domain:${domain}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        const indicator = JSON.parse(cached);
        if (indicator.isActive) {
          return indicator;
        }
      }

      // Check against threat feeds
      const indicators = await this.checkThreatFeeds('domain', domain);

      if (indicators.length > 0) {
        const indicator = indicators[0];

        // Cache result
        await this.redis.setEx(cacheKey, this.cacheTimeout, JSON.stringify(indicator));

        // Create alert
        await this.createAlert({
          id: this.generateAlertId(),
          type: 'malicious_domain',
          severity: indicator.severity,
          indicator: domain,
          description: `Malicious domain detected: ${indicator.description}`,
          source: indicator.source,
          timestamp: new Date(),
          action: this.determineAction(indicator.severity),
        });

        return indicator;
      }

      return null;
    } catch (error) {
      logger.error('Error checking domain:', { domain, error });
      return null;
    }
  }

  /**
   * Check if URL is malicious
   */
  public async checkURL(url: string): Promise<ThreatIndicator | null> {
    try {
      // Extract domain from URL
      const domain = new URL(url).hostname;

      // Check domain first
      const domainIndicator = await this.checkDomain(domain);
      if (domainIndicator) {
        return domainIndicator;
      }

      // Check URL-specific feeds
      const cacheKey = `threat:url:${Buffer.from(url).toString('base64')}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        const indicator = JSON.parse(cached);
        if (indicator.isActive) {
          return indicator;
        }
      }

      const indicators = await this.checkThreatFeeds('url', url);

      if (indicators.length > 0) {
        const indicator = indicators[0];

        // Cache result
        await this.redis.setEx(cacheKey, this.cacheTimeout, JSON.stringify(indicator));

        // Create alert
        await this.createAlert({
          id: this.generateAlertId(),
          type: 'malicious_url',
          severity: indicator.severity,
          indicator: url,
          description: `Malicious URL detected: ${indicator.description}`,
          source: indicator.source,
          timestamp: new Date(),
          action: this.determineAction(indicator.severity),
        });

        return indicator;
      }

      return null;
    } catch (error) {
      logger.error('Error checking URL:', { url, error });
      return null;
    }
  }

  /**
   * Check if file hash is malicious
   */
  public async checkHash(hash: string): Promise<ThreatIndicator | null> {
    try {
      // Check cache first
      const cacheKey = `threat:hash:${hash}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        const indicator = JSON.parse(cached);
        if (indicator.isActive) {
          return indicator;
        }
      }

      // Check against threat feeds
      const indicators = await this.checkThreatFeeds('hash', hash);

      if (indicators.length > 0) {
        const indicator = indicators[0];

        // Cache result
        await this.redis.setEx(cacheKey, this.cacheTimeout, JSON.stringify(indicator));

        // Create alert
        await this.createAlert({
          id: this.generateAlertId(),
          type: 'malicious_hash',
          severity: indicator.severity,
          indicator: hash,
          description: `Malicious file hash detected: ${indicator.description}`,
          source: indicator.source,
          timestamp: new Date(),
          action: this.determineAction(indicator.severity),
        });

        return indicator;
      }

      return null;
    } catch (error) {
      logger.error('Error checking hash:', { hash, error });
      return null;
    }
  }

  /**
   * Check threat feeds for indicators
   */
  private async checkThreatFeeds(type: string, value: string): Promise<ThreatIndicator[]> {
    const indicators: ThreatIndicator[] = [];

    for (const feed of this.feeds) {
      if (!feed.enabled || feed.type !== type) {
        continue;
      }

      try {
        const feedIndicators = await this.checkFeed(feed, value);
        indicators.push(...feedIndicators);
      } catch (error) {
        logger.error('Error checking feed:', { feed: feed.name, error });
      }
    }

    // Sort by confidence and severity
    return indicators.sort((a, b) => {
      if (a.severity !== b.severity) {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return b.confidence - a.confidence;
    });
  }

  /**
   * Check specific feed for indicator
   */
  private async checkFeed(feed: ThreatFeed, value: string): Promise<ThreatIndicator[]> {
    const indicators: ThreatIndicator[] = [];

    try {
      switch (feed.format) {
        case 'txt':
          indicators.push(...(await this.checkTextFeed(feed, value)));
          break;
        case 'json':
          indicators.push(...(await this.checkJSONFeed(feed, value)));
          break;
        case 'csv':
          indicators.push(...(await this.checkCSVFeed(feed, value)));
          break;
      }
    } catch (error) {
      logger.error('Error checking feed format:', { feed: feed.name, format: feed.format, error });
    }

    return indicators;
  }

  /**
   * Check text-based feed
   */
  private async checkTextFeed(feed: ThreatFeed, value: string): Promise<ThreatIndicator[]> {
    const cacheKey = `feed:${feed.name}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      const lines = cached.split('\n');
      const found = lines.some(line => {
        // Remove comments and empty lines
        const cleanLine = line.trim();
        if (cleanLine.startsWith('#') || cleanLine === '') {
          return false;
        }
        return cleanLine === value || cleanLine.includes(value);
      });

      if (found) {
        return [
          {
            type: feed.type as any,
            value,
            source: feed.name,
            confidence: 0.8,
            severity: 'medium' as const,
            description: `Found in ${feed.name}`,
            tags: ['threat-feed'],
            firstSeen: new Date(),
            lastSeen: new Date(),
            isActive: true,
          },
        ];
      }
      return [];
    } else {
      // Stream the feed to avoid loading entire file into memory
      const response = await axios.get(feed.url, { responseType: 'stream', timeout: 10000 });
      const stream = response.data as NodeJS.ReadableStream;
      const rl = require('readline').createInterface({ input: stream, crlfDelay: Infinity });
      let found = false;
      for await (const line of rl) {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith('#')) continue;
        if (cleanLine === value || cleanLine.includes(value)) {
          found = true;
          break;
        }
      }
      // Cache raw feed data for future fast access (optional, omitted for brevity)
      if (found) {
        return [
          {
            type: feed.type as any,
            value,
            source: feed.name,
            confidence: 0.8,
            severity: 'medium' as const,
            description: `Found in ${feed.name}`,
            tags: ['threat-feed'],
            firstSeen: new Date(),
            lastSeen: new Date(),
            isActive: true,
          },
        ];
      }
      return [];
    }
  }

  /**
   * Check JSON-based feed
   */
  private async checkJSONFeed(feed: ThreatFeed, value: string): Promise<ThreatIndicator[]> {
    const cacheKey = `feed:${feed.name}`;
    const cached = await this.redis.get(cacheKey);

    let feedData: any;
    if (cached) {
      feedData = JSON.parse(cached);
    } else {
      const response = await axios.get(feed.url, { timeout: 10000 });
      feedData = response.data;
      await this.redis.setEx(cacheKey, feed.updateInterval * 60, JSON.stringify(feedData));
    }

    // Handle different JSON formats
    if (feed.name.includes('PhishTank')) {
      return this.checkPhishTankFeed(feedData, value);
    } else if (feed.name.includes('VirusTotal')) {
      return await this.checkVirusTotalFeed(value);
    }

    return [];
  }

  /**
   * Check PhishTank feed
   */
  private checkPhishTankFeed(feedData: any, value: string): ThreatIndicator[] {
    if (!feedData.data) {
      return [];
    }

    const entries = feedData.data.filter(
      (entry: any) => entry.url === value || entry.url.includes(value),
    );

    return entries.map((entry: any) => ({
      type: 'url' as const,
      value,
      source: 'PhishTank',
      confidence: entry.phish_detail_url ? 0.9 : 0.7,
      severity: 'high' as const,
      description: entry.phish_detail_url || 'Phishing URL detected',
      tags: ['phishing', 'url'],
      firstSeen: new Date(entry.submission_time),
      lastSeen: new Date(),
      isActive: true,
    }));
  }

  /**
   * Check VirusTotal feed
   */
  private async checkVirusTotalFeed(hash: string): Promise<ThreatIndicator[]> {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return [];
    }

    try {
      const response = await axios.get(`https://www.virustotal.com/vtapi/v2/file/report`, {
        params: {
          apikey: apiKey,
          resource: hash,
        },
        timeout: 10000,
      });

      const data = response.data;

      if (data.positives > 0 && data.total > 0) {
        const ratio = data.positives / data.total;
        // Use shared cache utilities
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

        if (ratio >= 0.7) severity = 'critical';
        else if (ratio >= 0.5) severity = 'high';
        else if (ratio >= 0.3) severity = 'medium';

        return [
          {
            type: 'hash' as const,
            value: hash,
            source: 'VirusTotal',
            confidence: ratio,
            severity,
            description: `Malware detected by ${data.positives}/${data.total} engines`,
            tags: ['malware', 'hash'],
            firstSeen: new Date(data.scan_date || Date.now()),
            lastSeen: new Date(),
            isActive: true,
          },
        ];
      }
    } catch (error) {
      logger.error('VirusTotal API error:', error);
    }

    return [];
  }



  /**
   * Check CSV-based feed
   */
  private async checkCSVFeed(feed: ThreatFeed, value: string): Promise<ThreatIndicator[]> {
    // Implementation for CSV feeds
    return [];
  }

  /**
   * Update all threat feeds
   */
  private async updateAllFeeds() {
    logger.info('Updating threat intelligence feeds...');

    for (const feed of this.feeds) {
      if (!feed.enabled) {
        continue;
      }

      try {
        const cacheKey = `feed:${feed.name}`;
        await this.redis.del(cacheKey); // Force refresh

        logger.debug('Feed updated', { feed: feed.name });
      } catch (error) {
        logger.error('Error updating feed:', { feed: feed.name, error });
      }
    }

    logger.info('Threat intelligence feeds update completed');
  }

  /**
   * Create threat alert
   */
  private async createAlert(alert: ThreatAlert) {
    try {
      // Add to memory
      this.alerts.push(alert);

      // Keep only recent alerts
      if (this.alerts.length > this.maxAlerts) {
        this.alerts.splice(0, this.alerts.length - this.maxAlerts);
      }

      // Store in Redis
      await this.redis.setEx(
        `alert:${alert.id}`,
        24 * 60 * 60, // 24 hours
        JSON.stringify(alert),
      );

      // Add to alerts list
      await this.redis.lPush('alerts:recent', JSON.stringify(alert));
      await this.redis.lTrim('alerts:recent', 0, 999); // Keep last 1000

      logger.warn('Threat alert created', {
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        indicator: alert.indicator,
        action: alert.action,
      });
    } catch (error) {
      logger.error('Error creating threat alert:', error);
    }
  }

  /**
   * Determine action based on severity
   */
  private determineAction(severity: string): 'block' | 'warn' | 'monitor' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'block';
      case 'medium':
        return 'warn';
      default:
        return 'monitor';
    }
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get recent alerts
   */
  public async getRecentAlerts(limit: number = 100): Promise<ThreatAlert[]> {
    try {
      const alertData = await this.redis.lRange('alerts:recent', 0, limit - 1);
      return alertData.map(data => JSON.parse(data));
    } catch (error) {
      logger.error('Error getting recent alerts:', error);
      return [];
    }
  }

  /**
   * Get threat statistics
   */
  public async getStats(): Promise<{
    totalFeeds: number;
    activeFeeds: number;
    totalAlerts: number;
    alertsBySeverity: { [key: string]: number };
    alertsByType: { [key: string]: number };
    recentAlerts: number;
  }> {
    try {
      const totalFeeds = this.feeds.length;
      const activeFeeds = this.feeds.filter(f => f.enabled).length;
      const totalAlerts = this.alerts.length;

      const alertsBySeverity: { [key: string]: number } = {};
      const alertsByType: { [key: string]: number } = {};

      this.alerts.forEach(alert => {
        alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
        alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
      });

      const recentAlerts = await this.redis.lLen('alerts:recent');

      return {
        totalFeeds,
        activeFeeds,
        totalAlerts,
        alertsBySeverity,
        alertsByType,
        recentAlerts,
      };
    } catch (error) {
      logger.error('Error getting threat stats:', error);
      return {
        totalFeeds: 0,
        activeFeeds: 0,
        totalAlerts: 0,
        alertsBySeverity: {},
        alertsByType: {},
        recentAlerts: 0,
      };
    }
  }

  /**
   * Add custom threat indicator
   */
  public async addCustomIndicator(
    indicator: Omit<ThreatIndicator, 'firstSeen' | 'lastSeen' | 'isActive'>,
  ): Promise<boolean> {
    try {
      const fullIndicator: ThreatIndicator = {
        ...indicator,
        firstSeen: new Date(),
        lastSeen: new Date(),
        isActive: true,
      };

      const cacheKey = `threat:custom:${indicator.type}:${indicator.value}`;
      await this.redis.setEx(cacheKey, this.cacheTimeout, JSON.stringify(fullIndicator));

      logger.info('Custom threat indicator added', {
        type: indicator.type,
        value: indicator.value,
        source: indicator.source,
      });

      return true;
    } catch (error) {
      logger.error('Error adding custom indicator:', error);
      return false;
    }
  }

  /**
   * Enable/disable threat feed
   */
  public async toggleFeed(feedName: string, enabled: boolean): Promise<boolean> {
    try {
      const feed = this.feeds.find(f => f.name === feedName);
      if (!feed) {
        return false;
      }

      feed.enabled = enabled;
      logger.info(`Threat feed ${feedName} ${enabled ? 'enabled' : 'disabled'}`);

      return true;
    } catch (error) {
      logger.error('Error toggling feed:', { feedName, error });
      return false;
    }
  }

  /**
   * Get all threat feeds
   */
  public getFeeds(): ThreatFeed[] {
    return this.feeds.map(feed => ({ ...feed }));
  }
}
