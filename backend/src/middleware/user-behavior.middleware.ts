import { NextFunction, Request, Response } from 'express';
import { Socket } from 'net';
import { UserBehaviorService } from '../services/user-behavior.service';
import { logger } from '../utils/logger';

interface BehaviorUser {
  id: string;
  email: string;
  role: string;
}

interface BehaviorRequest extends Request {
  user?: BehaviorUser;
  sessionId?: string;
  file?: { size: number; mimetype: string; originalname: string } | any;
  res?: Response;
}

interface EventMetadata {
  path: string;
  method: string;
  query: any;
  timestamp: string;
  [key: string]: any;
}

/**
 * Middleware for user behavior analysis
 */
export class UserBehaviorMiddleware {
  private behaviorService: UserBehaviorService;

  constructor() {
    this.behaviorService = new UserBehaviorService();

    // Start cleanup interval
    setInterval(
      () => {
        this.behaviorService.cleanup();
      },
      60 * 60 * 1000,
    ); // Every hour
  }

  /**
   * Track user behavior events
   */
  public trackBehavior = (
    eventType:
      | 'login'
      | 'logout'
      | 'file_upload'
      | 'api_call'
      | 'page_view'
      | 'error'
      | 'permission_denied'
      | 'data_access',
  ) => {
    return async (req: BehaviorRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.user.id) {
          return next();
        }

        const event = {
          userId: req.user.id,
          eventType,
          timestamp: new Date(),
          ipAddress: this.getClientIP(req),
          userAgent: req.get('User-Agent') || 'unknown',
          sessionId: req.sessionId || this.generateSessionId(req),
          metadata: this.extractMetadata(req, eventType),
        };

        await this.behaviorService.trackEvent(event);

        // Add behavior headers
        const profile = await this.behaviorService.getUserProfile(req.user.id);
        if (profile) {
          res.setHeader('X-Behavior-Risk-Score', profile.riskScore.toString());
          res.setHeader('X-Behavior-Session-Id', event.sessionId);
        }

        next();
      } catch (error) {
        logger.error('Error tracking user behavior:', error);
        next(); // Continue on error to avoid breaking functionality
      }
    };
  };

  /**
   * Check user risk score and take action if needed
   */
  public checkRiskScore = async (req: BehaviorRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return next();
      }

      const profile = await this.behaviorService.getUserProfile(req.user.id);
      if (!profile) {
        return next();
      }

      // Add risk score header
      res.setHeader('X-Behavior-Risk-Score', profile.riskScore.toString());

      // Take action based on risk score
      if (profile.riskScore >= 80) {
        logger.warn('High risk user detected', {
          userId: req.user.id,
          riskScore: profile.riskScore,
          ipAddress: this.getClientIP(req),
        });

        // Require additional authentication
        res.setHeader('X-Behavior-Action', 'additional-auth-required');

        return res.status(403).json({
          success: false,
          error: 'Additional authentication required',
          code: 'HIGH_RISK_USER',
          data: {
            riskScore: profile.riskScore,
            reason: 'Unusual behavior detected',
          },
        });
      } else if (profile.riskScore >= 60) {
        logger.warn('Medium risk user detected', {
          userId: req.user.id,
          riskScore: profile.riskScore,
        });

        // Add warning headers
        res.setHeader('X-Behavior-Action', 'monitor');
        res.setHeader('X-Behavior-Warning', 'true');
      }

      next();
    } catch (error) {
      logger.error('Error checking risk score:', error);
      next();
    }
  };

  /**
   * Monitor for suspicious patterns
   */
  public monitorSuspiciousPatterns = async (
    req: BehaviorRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user || !req.user.id) {
        return next();
      }

      const profile = await this.behaviorService.getUserProfile(req.user.id);
      if (!profile) {
        return next();
      }

      // Check for rapid successive requests
      const session = profile.currentSession;
      const sessionDuration = Date.now() - session.startTime.getTime();
      const requestsPerMinute = session.apiCalls / (sessionDuration / 60000);

      if (requestsPerMinute > 100) {
        logger.warn('High frequency requests detected', {
          userId: req.user.id,
          requestsPerMinute,
          sessionDuration,
        });

        res.setHeader('X-Behavior-Pattern', 'high-frequency');

        // Rate limit more aggressively
        if (requestsPerMinute > 500) {
          return res.status(429).json({
            success: false,
            error: 'Rate limit exceeded due to unusual activity',
            code: 'BEHAVIOR_RATE_LIMIT',
          });
        }
      }

      // Check for error patterns
      if (session.errors > 10 && session.apiCalls > 0) {
        const errorRate = session.errors / session.apiCalls;
        if (errorRate > 0.5) {
          logger.warn('High error rate detected', {
            userId: req.user.id,
            errorRate,
            errors: session.errors,
            apiCalls: session.apiCalls,
          });

          res.setHeader('X-Behavior-Pattern', 'high-error-rate');
        }
      }

      next();
    } catch (error) {
      logger.error('Error monitoring suspicious patterns:', error);
      next();
    }
  };

  /**
   * Generate session ID
   */
  private generateSessionId(req: Request): string {
    const ip = this.getClientIP(req);
    const userAgent = req.get('User-Agent') || 'unknown';
    const timestamp = Date.now();

    return Buffer.from(`${ip}:${userAgent}:${timestamp}`).toString('base64').substring(0, 32);
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: BehaviorRequest): string {
    const socket = (req.connection as any)?.socket as Socket | undefined;
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      socket?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Extract metadata from request
   */
  private extractMetadata(req: BehaviorRequest, eventType: string): EventMetadata {
    const metadata: EventMetadata = {
      path: req.path,
      method: req.method,
      query: req.query,
      timestamp: new Date().toISOString(),
    };

    // Add specific metadata based on event type
    switch (eventType) {
      case 'login':
        metadata.loginMethod = req.body?.method || 'password';
        metadata.success = req.body?.success || true;
        break;

      case 'file_upload':
        if (req.file) {
          metadata.fileSize = req.file.size;
          metadata.fileType = req.file.mimetype;
          metadata.fileName = req.file.originalname;
        }
        break;

      case 'api_call':
        metadata.endpoint = req.path;
        metadata.responseTime = req.get('X-Response-Time');
        metadata.statusCode = req.res?.statusCode;
        break;

      case 'error':
        metadata.error = req.body?.error || 'Unknown error';
        metadata.errorCode = req.body?.errorCode;
        metadata.stack = req.body?.stack;
        break;

      case 'permission_denied':
        metadata.resource = req.body?.resource || 'Unknown resource';
        metadata.action = req.body?.action || 'Unknown action';
        metadata.requiredPermission = req.body?.requiredPermission;
        break;

      case 'data_access':
        metadata.resource = req.body?.resource || (req.params as any)?.resource || (req.query as any)?.resource;
        metadata.action = req.body?.action || req.method?.toLowerCase();
        metadata.dataType = req.body?.dataType || 'unknown';
        break;

      case 'page_view':
        metadata.referrer = req.get('Referer');
        metadata.page = req.path;
        metadata.duration = req.body?.duration;
        break;
    }

    // Add user information
    if (req.user) {
      metadata.userId = req.user.id;
      metadata.userEmail = req.user.email;
      metadata.userRole = req.user.role;
    }

    return metadata;
  }

  /**
   * Get behavior statistics
   */
  public getStats = async (_req: Request, res: Response) => {
    try {
      const stats = await this.behaviorService.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error getting behavior stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get behavior statistics',
      });
    }
  };

  /**
   * Get user behavior profile
   */
  public getUserProfile = async (req: BehaviorRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdStr = Array.isArray(userId) ? userId[0] : userId;

      if (!userIdStr) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        });
      }

      const profile = await this.behaviorService.getUserProfile(userIdStr);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'User behavior profile not found',
        });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      logger.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user behavior profile',
      });
    }
  };

  /**
   * Get user anomalies
   */
  public getUserAnomalies = async (req: BehaviorRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const limitParam = req.query.limit;
      const limitStr = Array.isArray(limitParam) ? limitParam[0] : limitParam;
      const limit = limitStr ? parseInt(limitStr) : 50;
      const userIdStr = Array.isArray(userId) ? userId[0] : userId;

      if (!userIdStr) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        });
      }

      const anomalies = await this.behaviorService.getUserAnomalies(userIdStr, limit);

      res.json({
        success: true,
        data: anomalies,
      });
    } catch (error) {
      logger.error('Error getting user anomalies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user anomalies',
      });
    }
  };

  /**
   * Get recent anomalies
   */
  public getRecentAnomalies = async (req: Request, res: Response) => {
    try {
      const limitParam = req.query.limit;
      const limitStr = Array.isArray(limitParam) ? limitParam[0] : limitParam;
      const limit = limitStr ? parseInt(limitStr) : 100;
      const anomalies = await this.behaviorService.getRecentAnomalies(limit);

      res.json({
        success: true,
        data: anomalies,
      });
    } catch (error) {
      logger.error('Error getting recent anomalies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recent anomalies',
      });
    }
  };

  /**
   * Resolve anomaly
   */
  public resolveAnomaly = async (req: Request, res: Response) => {
    try {
      const { anomalyId } = req.params;
      const anomalyIdStr = Array.isArray(anomalyId) ? anomalyId[0] : anomalyId;

      if (!anomalyIdStr) {
        return res.status(400).json({
          success: false,
          error: 'anomalyId is required',
        });
      }

      const success = await this.behaviorService.resolveAnomaly(anomalyIdStr);

      res.json({
        success: true,
        data: { resolved: success },
      });
    } catch (error) {
      logger.error('Error resolving anomaly:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve anomaly',
      });
    }
  };
}

// Export singleton instance
export const userBehaviorMiddleware = new UserBehaviorMiddleware();

// Export convenience methods
export const trackBehavior = userBehaviorMiddleware.trackBehavior;
export const checkRiskScore = userBehaviorMiddleware.checkRiskScore;
export const monitorSuspiciousPatterns = userBehaviorMiddleware.monitorSuspiciousPatterns;
