import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

interface UserBehaviorEvent {
  userId: string;
  eventType:
    | 'login'
    | 'logout'
    | 'file_upload'
    | 'api_call'
    | 'page_view'
    | 'error'
    | 'permission_denied'
    | 'data_access'
    | 'malware_detected';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  metadata: {
    [key: string]: any;
  };
}

interface UserBehaviorProfile {
  userId: string;
  baseline: {
    typicalIPs: string[];
    typicalUserAgents: string[];
    typicalHours: number[];
    typicalDays: number[];
    apiCallFrequency: number;
    errorRate: number;
    sessionDuration: number;
    dataAccessPatterns: string[];
  };
  currentSession: {
    startTime: Date;
    ipAddress: string;
    userAgent: string;
    apiCalls: number;
    errors: number;
    dataAccess: string[];
    unusualEvents: string[];
  };
  riskScore: number;
  lastUpdated: Date;
}

interface BehaviorAnomaly {
  id: string;
  userId: string;
  type:
    | 'new_ip'
    | 'new_user_agent'
    | 'unusual_time'
    | 'high_error_rate'
    | 'excessive_api_calls'
    | 'unusual_data_access'
    | 'session_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  metadata: {
    [key: string]: any;
  };
  resolved: boolean;
}

@injectable()
export class UserBehaviorService {
  private readonly redis: RedisClientType;
  private readonly profileCache = new Map<string, UserBehaviorProfile>();
  private readonly cacheTimeout = 30 * 60; // 30 minutes
  private readonly baselinePeriod = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly anomalies: BehaviorAnomaly[] = [];
  private readonly maxAnomalies = 10000;

  constructor() {
    this.redis = getRedisClient();
  }

  /**
   * Track user behavior event
   */
  public async trackEvent(event: UserBehaviorEvent): Promise<void> {
    try {
      // Store event in Redis
      const eventKey = `behavior:event:${event.userId}:${Date.now()}`;
      await this.redis.setEx(eventKey, 7 * 24 * 60 * 60, JSON.stringify(event)); // 7 days

      // Update user profile
      await this.updateUserProfile(event);

      // Check for anomalies
      await this.detectAnomalies(event);

      logger.debug('User behavior event tracked', {
        userId: event.userId,
        eventType: event.eventType,
        timestamp: event.timestamp,
      });
    } catch (error) {
      logger.error('Error tracking user behavior event:', error);
    }
  }

  /**
   * Update user behavior profile
   */
  private async updateUserProfile(event: UserBehaviorEvent): Promise<void> {
    try {
      let profile = await this.getUserProfile(event.userId);

      if (!profile) {
        profile = this.createInitialProfile(event.userId);
      }

      // Update current session
      this.updateCurrentSession(profile, event);

      // Update baseline with new data
      this.updateBaseline(profile, event);

      // Calculate risk score
      profile.riskScore = this.calculateRiskScore(profile);
      profile.lastUpdated = new Date();

      // Cache profile
      this.profileCache.set(event.userId, profile);
      await this.redis.setEx(
        `behavior:profile:${event.userId}`,
        this.cacheTimeout,
        JSON.stringify(profile)
      );

      logger.debug('User behavior profile updated', {
        userId: event.userId,
        riskScore: profile.riskScore,
      });
    } catch (error) {
      logger.error('Error updating user profile:', error);
    }
  }

  /**
   * Specifically track malware detection events
   */
  public async trackThreat(
    userId: string,
    filename: string,
    threats: string[],
    ipAddress: string
  ): Promise<void> {
    const event: UserBehaviorEvent = {
      userId,
      eventType: 'malware_detected',
      timestamp: new Date(),
      ipAddress,
      userAgent: 'system-scanner',
      sessionId: 'security-alert',
      metadata: {
        filename,
        threats,
        priority: 'critical',
      },
    };
    await this.trackEvent(event);
  }

  /**
   * Get user behavior profile
   */
  public async getUserProfile(userId: string): Promise<UserBehaviorProfile | null> {
    try {
      // Check cache first
      if (this.profileCache.has(userId)) {
        return this.profileCache.get(userId)!;
      }

      // Get from Redis
      const cached = await this.redis.get(`behavior:profile:${userId}`);
      if (cached) {
        const profile = JSON.parse(cached);
        this.profileCache.set(userId, profile);
        return profile;
      }

      return null;
    } catch (error) {
      logger.error('Error getting user profile:', { userId, error });
      return null;
    }
  }

  /**
   * Create initial user profile
   */
  private createInitialProfile(userId: string): UserBehaviorProfile {
    return {
      userId,
      baseline: {
        typicalIPs: [],
        typicalUserAgents: [],
        typicalHours: [],
        typicalDays: [],
        apiCallFrequency: 0,
        errorRate: 0,
        sessionDuration: 0,
        dataAccessPatterns: [],
      },
      currentSession: {
        startTime: new Date(),
        ipAddress: '',
        userAgent: '',
        apiCalls: 0,
        errors: 0,
        dataAccess: [],
        unusualEvents: [],
      },
      riskScore: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Update current session data
   */
  private updateCurrentSession(profile: UserBehaviorProfile, event: UserBehaviorEvent): void {
    const session = profile.currentSession;

    // Update session basics
    if (event.eventType === 'login') {
      session.startTime = event.timestamp;
      session.ipAddress = event.ipAddress;
      session.userAgent = event.userAgent;
      session.apiCalls = 0;
      session.errors = 0;
      session.dataAccess = [];
      session.unusualEvents = [];
    }

    // Update session counters
    switch (event.eventType) {
      case 'api_call':
        session.apiCalls++;
        break;
      case 'error':
      case 'permission_denied':
        session.errors++;
        break;
      case 'data_access':
        if (event.metadata.resource) {
          session.dataAccess.push(event.metadata.resource);
        }
        break;
    }

    // Add unusual events
    if (event.metadata.unusual) {
      session.unusualEvents.push(event.eventType);
    }
  }

  /**
   * Update baseline with new data
   */
  private updateBaseline(profile: UserBehaviorProfile, event: UserBehaviorEvent): void {
    const baseline = profile.baseline;

    // Update typical IPs
    if (!baseline.typicalIPs.includes(event.ipAddress)) {
      baseline.typicalIPs.push(event.ipAddress);
      // Keep only last 20 IPs
      if (baseline.typicalIPs.length > 20) {
        baseline.typicalIPs = baseline.typicalIPs.slice(-20);
      }
    }

    // Update typical user agents
    if (!baseline.typicalUserAgents.includes(event.userAgent)) {
      baseline.typicalUserAgents.push(event.userAgent);
      // Keep only last 10 user agents
      if (baseline.typicalUserAgents.length > 10) {
        baseline.typicalUserAgents = baseline.typicalUserAgents.slice(-10);
      }
    }

    // Update typical hours
    const hour = event.timestamp.getHours();
    if (!baseline.typicalHours.includes(hour)) {
      baseline.typicalHours.push(hour);
      baseline.typicalHours.sort((a, b) => a - b);
    }

    // Update typical days
    const day = event.timestamp.getDay();
    if (!baseline.typicalDays.includes(day)) {
      baseline.typicalDays.push(day);
      baseline.typicalDays.sort((a, b) => a - b);
    }

    // Update data access patterns
    if (event.eventType === 'data_access' && event.metadata.resource) {
      if (!baseline.dataAccessPatterns.includes(event.metadata.resource)) {
        baseline.dataAccessPatterns.push(event.metadata.resource);
        // Keep only last 50 patterns
        if (baseline.dataAccessPatterns.length > 50) {
          baseline.dataAccessPatterns = baseline.dataAccessPatterns.slice(-50);
        }
      }
    }
  }

  /**
   * Detect anomalies in user behavior
   */
  private async detectAnomalies(event: UserBehaviorEvent): Promise<void> {
    try {
      const profile = await this.getUserProfile(event.userId);
      if (!profile || profile.baseline.typicalIPs.length < 3) {
        // Not enough baseline data
        return;
      }

      const anomalies: BehaviorAnomaly[] = [];

      // Check for new IP
      if (!profile.baseline.typicalIPs.includes(event.ipAddress)) {
        anomalies.push({
          id: this.generateAnomalyId(),
          userId: event.userId,
          type: 'new_ip',
          severity: 'medium',
          description: `Login from new IP address: ${event.ipAddress}`,
          detectedAt: new Date(),
          metadata: {
            newIP: event.ipAddress,
            typicalIPs: profile.baseline.typicalIPs.slice(0, 5),
          },
          resolved: false,
        });
      }

      // Check for new user agent
      if (!profile.baseline.typicalUserAgents.includes(event.userAgent)) {
        anomalies.push({
          id: this.generateAnomalyId(),
          userId: event.userId,
          type: 'new_user_agent',
          severity: 'low',
          description: 'Login from new user agent',
          detectedAt: new Date(),
          metadata: {
            newUserAgent: event.userAgent,
            typicalUserAgents: profile.baseline.typicalUserAgents.slice(0, 3),
          },
          resolved: false,
        });
      }

      // Check for unusual time
      const hour = event.timestamp.getHours();
      if (!profile.baseline.typicalHours.includes(hour) && event.eventType === 'login') {
        anomalies.push({
          id: this.generateAnomalyId(),
          userId: event.userId,
          type: 'unusual_time',
          severity: 'low',
          description: `Login at unusual hour: ${hour}:00`,
          detectedAt: new Date(),
          metadata: {
            hour,
            typicalHours: profile.baseline.typicalHours,
          },
          resolved: false,
        });
      }

      // Check for high error rate
      if (profile.currentSession.errors > 5 && profile.currentSession.apiCalls > 0) {
        const errorRate = profile.currentSession.errors / profile.currentSession.apiCalls;
        if (errorRate > 0.2) {
          // More than 20% errors
          anomalies.push({
            id: this.generateAnomalyId(),
            userId: event.userId,
            type: 'high_error_rate',
            severity: 'high',
            description: `High error rate: ${Math.round(errorRate * 100)}%`,
            detectedAt: new Date(),
            metadata: {
              errorRate,
              errors: profile.currentSession.errors,
              apiCalls: profile.currentSession.apiCalls,
            },
            resolved: false,
          });
        }
      }

      // Check for excessive API calls
      if (profile.currentSession.apiCalls > 1000) {
        anomalies.push({
          id: this.generateAnomalyId(),
          userId: event.userId,
          type: 'excessive_api_calls',
          severity: 'medium',
          description: `Excessive API calls: ${profile.currentSession.apiCalls}`,
          detectedAt: new Date(),
          metadata: {
            apiCalls: profile.currentSession.apiCalls,
            sessionDuration: Date.now() - profile.currentSession.startTime.getTime(),
          },
          resolved: false,
        });
      }

      // Check for unusual data access
      if (event.eventType === 'data_access' && event.metadata.resource) {
        if (!profile.baseline.dataAccessPatterns.includes(event.metadata.resource)) {
          anomalies.push({
            id: this.generateAnomalyId(),
            userId: event.userId,
            type: 'unusual_data_access',
            severity: 'medium',
            description: `Access to unusual resource: ${event.metadata.resource}`,
            detectedAt: new Date(),
            metadata: {
              resource: event.metadata.resource,
              typicalPatterns: profile.baseline.dataAccessPatterns.slice(0, 5),
            },
            resolved: false,
          });
        }
      }

      // Store anomalies
      for (const anomaly of anomalies) {
        await this.storeAnomaly(anomaly);
      }
    } catch (error) {
      logger.error('Error detecting anomalies:', error);
    }
  }

  /**
   * Store anomaly
   */
  private async storeAnomaly(anomaly: BehaviorAnomaly): Promise<void> {
    try {
      // Add to memory
      this.anomalies.push(anomaly);

      // Keep only recent anomalies
      if (this.anomalies.length > this.maxAnomalies) {
        this.anomalies.splice(0, this.anomalies.length - this.maxAnomalies);
      }

      // Store in Redis
      await this.redis.setEx(
        `behavior:anomaly:${anomaly.id}`,
        7 * 24 * 60 * 60, // 7 days
        JSON.stringify(anomaly)
      );

      // Add to user anomalies list
      await this.redis.lPush(`behavior:anomalies:${anomaly.userId}`, JSON.stringify(anomaly));
      await this.redis.lTrim(`behavior:anomalies:${anomaly.userId}`, 0, 99); // Keep last 100

      // Log anomaly
      logger.warn('User behavior anomaly detected', {
        userId: anomaly.userId,
        type: anomaly.type,
        severity: anomaly.severity,
        description: anomaly.description,
      });
    } catch (error) {
      logger.error('Error storing anomaly:', error);
    }
  }

  /**
   * Calculate risk score
   */
  private calculateRiskScore(profile: UserBehaviorProfile): number {
    let score = 0;

    // Base score
    score += 10;

    // Current session factors
    const session = profile.currentSession;

    // Error rate impact
    if (session.apiCalls > 0) {
      const errorRate = session.errors / session.apiCalls;
      score += errorRate * 30;
    }

    // Unusual events impact
    score += session.unusualEvents.length * 5;

    // API call frequency impact
    if (session.apiCalls > 500) {
      score += Math.min(session.apiCalls / 100, 20);
    }

    // Recent anomalies impact
    // Malware detections add 50 points immediately
    if (session.unusualEvents.includes('malware_detected')) {
      score += 50;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Get user anomalies
   */
  public async getUserAnomalies(userId: string, limit: number = 50): Promise<BehaviorAnomaly[]> {
    try {
      const anomalyData = await this.redis.lRange(`behavior:anomalies:${userId}`, 0, limit - 1);
      return anomalyData.map(data => JSON.parse(data));
    } catch (error) {
      logger.error('Error getting user anomalies:', { userId, error });
      return [];
    }
  }

  /**
   * Get recent anomalies
   */
  public async getRecentAnomalies(limit: number = 100): Promise<BehaviorAnomaly[]> {
    try {
      return this.anomalies
        .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
        .slice(0, limit);
    } catch (error) {
      logger.error('Error getting recent anomalies:', error);
      return [];
    }
  }

  /**
   * Resolve anomaly
   */
  public async resolveAnomaly(anomalyId: string): Promise<boolean> {
    try {
      // Update in memory
      const anomaly = this.anomalies.find(a => a.id === anomalyId);
      if (anomaly) {
        anomaly.resolved = true;
      }

      // Update in Redis
      const cached = await this.redis.get(`behavior:anomaly:${anomalyId}`);
      if (cached) {
        const updatedAnomaly = JSON.parse(cached);
        updatedAnomaly.resolved = true;
        await this.redis.setEx(
          `behavior:anomaly:${anomalyId}`,
          7 * 24 * 60 * 60,
          JSON.stringify(updatedAnomaly)
        );
      }

      logger.info('Anomaly resolved', { anomalyId });
      return true;
    } catch (error) {
      logger.error('Error resolving anomaly:', { anomalyId, error });
      return false;
    }
  }

  /**
   * Get behavior statistics
   */
  public async getStats(): Promise<{
    totalProfiles: number;
    totalAnomalies: number;
    anomaliesByType: { [key: string]: number };
    anomaliesBySeverity: { [key: string]: number };
    averageRiskScore: number;
    highRiskUsers: number;
  }> {
    try {
      const totalProfiles = this.profileCache.size;
      const totalAnomalies = this.anomalies.length;

      const anomaliesByType: { [key: string]: number } = {};
      const anomaliesBySeverity: { [key: string]: number } = {};

      this.anomalies.forEach(anomaly => {
        anomaliesByType[anomaly.type] = (anomaliesByType[anomaly.type] || 0) + 1;
        anomaliesBySeverity[anomaly.severity] = (anomaliesBySeverity[anomaly.severity] || 0) + 1;
      });

      const riskScores = Array.from(this.profileCache.values()).map(p => p.riskScore);
      const averageRiskScore =
        riskScores.length > 0
          ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length
          : 0;

      const highRiskUsers = riskScores.filter(score => score > 70).length;

      return {
        totalProfiles,
        totalAnomalies,
        anomaliesByType,
        anomaliesBySeverity,
        averageRiskScore: Math.round(averageRiskScore),
        highRiskUsers,
      };
    } catch (error) {
      logger.error('Error getting behavior stats:', error);
      return {
        totalProfiles: 0,
        totalAnomalies: 0,
        anomaliesByType: {},
        anomaliesBySeverity: {},
        averageRiskScore: 0,
        highRiskUsers: 0,
      };
    }
  }

  /**
   * Generate anomaly ID
   */
  private generateAnomalyId(): string {
    return `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup old data
   */
  public async cleanup(): Promise<void> {
    try {
      // Clean old profiles from cache
      const now = Date.now();
      for (const [userId, profile] of this.profileCache.entries()) {
        if (now - profile.lastUpdated.getTime() > this.cacheTimeout * 1000) {
          this.profileCache.delete(userId);
        }
      }

      // Clean old anomalies from memory
      const cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      this.anomalies.filter(anomaly => anomaly.detectedAt > cutoff);

      logger.info('User behavior cleanup completed');
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }
}
