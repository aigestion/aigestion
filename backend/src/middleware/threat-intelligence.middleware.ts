import { NextFunction, Request, Response } from 'express';
import { ThreatIntelligenceService } from '../services/threat-intelligence.service';
import { logger } from '../utils/logger';

interface ThreatRequest extends Request {
  threatCheck?: {
    ipThreat?: any;
    domainThreat?: any;
    urlThreat?: any;
    riskScore: number;
    action: 'allow' | 'warn' | 'block';
  };
}

/**
 * Middleware for threat intelligence integration
 */
export class ThreatIntelligenceMiddleware {
  private threatService: ThreatIntelligenceService;

  constructor() {
    this.threatService = new ThreatIntelligenceService();
  }

  /**
   * Check IP address against threat intelligence
   */
  public checkIPThreat = async (req: ThreatRequest, res: Response, next: NextFunction) => {
    try {
      const clientIP = this.getClientIP(req);

      if (!clientIP || this.isPrivateIP(clientIP)) {
        return next();
      }

      const threat = await this.threatService.checkIPAddress(clientIP);

      if (threat) {
        req.threatCheck = req.threatCheck || { riskScore: 0, action: 'allow' };
        req.threatCheck.ipThreat = threat;
        req.threatCheck.riskScore += this.getScoreFromSeverity(threat.severity);

        // Determine action based on severity
        if (threat.severity === 'critical' || threat.severity === 'high') {
          req.threatCheck.action = 'block';
        } else if (threat.severity === 'medium') {
          req.threatCheck.action = req.threatCheck.action === 'block' ? 'block' : 'warn';
        }

        logger.warn('Threat detected - IP', {
          ip: clientIP,
          threat: threat.description,
          severity: threat.severity,
          action: req.threatCheck.action,
        });

        // Add security headers
        res.setHeader('X-Threat-IP-Detected', 'true');
        res.setHeader('X-Threat-IP-Severity', threat.severity);
        res.setHeader('X-Threat-IP-Source', threat.source);
      }

      next();
    } catch (error) {
      logger.error('Error checking IP threat:', error);
      next(); // Continue on error to avoid breaking functionality
    }
  };

  /**
   * Check domain against threat intelligence
   */
  public checkDomainThreat = async (req: ThreatRequest, res: Response, next: NextFunction) => {
    try {
      const domain = this.extractDomainFromRequest(req);

      if (!domain) {
        return next();
      }

      const threat = await this.threatService.checkDomain(domain);

      if (threat) {
        req.threatCheck = req.threatCheck || { riskScore: 0, action: 'allow' };
        req.threatCheck.domainThreat = threat;
        req.threatCheck.riskScore += this.getScoreFromSeverity(threat.severity);

        // Determine action based on severity
        if (threat.severity === 'critical' || threat.severity === 'high') {
          req.threatCheck.action = 'block';
        } else if (threat.severity === 'medium') {
          req.threatCheck.action = req.threatCheck.action === 'block' ? 'block' : 'warn';
        }

        logger.warn('Threat detected - Domain', {
          domain,
          threat: threat.description,
          severity: threat.severity,
          action: req.threatCheck.action,
        });

        // Add security headers
        res.setHeader('X-Threat-Domain-Detected', 'true');
        res.setHeader('X-Threat-Domain-Severity', threat.severity);
        res.setHeader('X-Threat-Domain-Source', threat.source);
      }

      next();
    } catch (error) {
      logger.error('Error checking domain threat:', error);
      next();
    }
  };

  /**
   * Check URL against threat intelligence
   */
  public checkURLThreat = async (req: ThreatRequest, res: Response, next: NextFunction) => {
    try {
      const url = this.extractURLFromRequest(req);

      if (!url) {
        return next();
      }

      const threat = await this.threatService.checkURL(url);

      if (threat) {
        req.threatCheck = req.threatCheck || { riskScore: 0, action: 'allow' };
        req.threatCheck.urlThreat = threat;
        req.threatCheck.riskScore += this.getScoreFromSeverity(threat.severity);

        // Determine action based on severity
        if (threat.severity === 'critical' || threat.severity === 'high') {
          req.threatCheck.action = 'block';
        } else if (threat.severity === 'medium') {
          req.threatCheck.action = req.threatCheck.action === 'block' ? 'block' : 'warn';
        }

        logger.warn('Threat detected - URL', {
          url,
          threat: threat.description,
          severity: threat.severity,
          action: req.threatCheck.action,
        });

        // Add security headers
        res.setHeader('X-Threat-URL-Detected', 'true');
        res.setHeader('X-Threat-URL-Severity', threat.severity);
        res.setHeader('X-Threat-URL-Source', threat.source);
      }

      next();
    } catch (error) {
      logger.error('Error checking URL threat:', error);
      next();
    }
  };

  /**
   * Check file hash against threat intelligence
   */
  public checkHashThreat = async (req: ThreatRequest, res: Response, next: NextFunction) => {
    try {
      const hash = this.extractHashFromRequest(req);

      if (!hash) {
        return next();
      }

      const threat = await this.threatService.checkHash(hash);

      if (threat) {
        req.threatCheck = req.threatCheck || { riskScore: 0, action: 'allow' };
        req.threatCheck.riskScore += this.getScoreFromSeverity(threat.severity);

        // Always block malicious files
        req.threatCheck.action = 'block';

        logger.warn('Threat detected - File Hash', {
          hash,
          threat: threat.description,
          severity: threat.severity,
          action: req.threatCheck.action,
        });

        // Add security headers
        res.setHeader('X-Threat-Hash-Detected', 'true');
        res.setHeader('X-Threat-Hash-Severity', threat.severity);
        res.setHeader('X-Threat-Hash-Source', threat.source);
      }

      next();
    } catch (error) {
      logger.error('Error checking hash threat:', error);
      next();
    }
  };

  /**
   * Comprehensive threat check (IP, Domain, URL)
   */
  public comprehensiveThreatCheck = async (
    req: ThreatRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      req.threatCheck = { riskScore: 0, action: 'allow' };

      // Run all threat checks in parallel
      await Promise.all([
        this.checkIPThreat(req, res, () => {}),
        this.checkDomainThreat(req, res, () => {}),
        this.checkURLThreat(req, res, () => {}),
      ]);

      // Add overall threat score header
      res.setHeader('X-Threat-Score', req.threatCheck.riskScore.toString());
      res.setHeader('X-Threat-Action', req.threatCheck.action);

      // Block request if action is block
      if (req.threatCheck.action === 'block') {
        logger.warn('Request blocked due to threat intelligence', {
          ip: this.getClientIP(req),
          path: req.path,
          riskScore: req.threatCheck.riskScore,
          threats: {
            ip: req.threatCheck.ipThreat?.description,
            domain: req.threatCheck.domainThreat?.description,
            url: req.threatCheck.urlThreat?.description,
          },
        });

        return res.status(403).json({
          success: false,
          error: 'Request blocked due to security concerns',
          code: 'THREAT_BLOCKED',
          data: {
            riskScore: req.threatCheck.riskScore,
            threats: {
              ip: req.threatCheck.ipThreat
                ? {
                    severity: req.threatCheck.ipThreat.severity,
                    description: req.threatCheck.ipThreat.description,
                    source: req.threatCheck.ipThreat.source,
                  }
                : null,
              domain: req.threatCheck.domainThreat
                ? {
                    severity: req.threatCheck.domainThreat.severity,
                    description: req.threatCheck.domainThreat.description,
                    source: req.threatCheck.domainThreat.source,
                  }
                : null,
              url: req.threatCheck.urlThreat
                ? {
                    severity: req.threatCheck.urlThreat.severity,
                    description: req.threatCheck.urlThreat.description,
                    source: req.threatCheck.urlThreat.source,
                  }
                : null,
            },
          },
        });
      }

      // Add warning headers if action is warn
      if (req.threatCheck.action === 'warn') {
        res.setHeader('X-Threat-Warning', 'true');
        logger.warn('Request allowed with threat warning', {
          ip: this.getClientIP(req),
          path: req.path,
          riskScore: req.threatCheck.riskScore,
        });
      }

      next();
    } catch (error) {
      logger.error('Error in comprehensive threat check:', error);
      next();
    }
  };

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Check if IP is private
   */
  private isPrivateIP(ip: string): boolean {
    // Private IP ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];

    return privateRanges.some(range => range.test(ip));
  }

  /**
   * Extract domain from request
   */
  private extractDomainFromRequest(req: Request): string | null {
    // Try to get domain from various sources
    const host = req.get('Host') || req.get('X-Forwarded-Host') || req.hostname;

    if (host) {
      // Remove port if present
      return host.split(':')[0];
    }

    // Try to extract from URL parameter
    if (req.query && typeof req.query.url === 'string') {
      try {
        return new URL(req.query.url).hostname;
      } catch {
        // Invalid URL
      }
    }

    // Try to extract from body
    if (req.body && typeof req.body === 'object') {
      const url = req.body.url || req.body.domain || req.body.website;
      if (typeof url === 'string') {
        try {
          return new URL(url).hostname;
        } catch {
          // Invalid URL, might be just a domain
          if (url.includes('.')) {
            return url.split('/')[0]; // Remove path if any
          }
        }
      }
    }

    return null;
  }

  /**
   * Extract URL from request
   */
  private extractURLFromRequest(req: Request): string | null {
    // Try to get URL from various sources
    if (req.query && typeof req.query.url === 'string') {
      return req.query.url;
    }

    if (req.body && typeof req.body === 'object') {
      const url = req.body.url || req.body.link || req.body.redirect;
      if (typeof url === 'string') {
        return url;
      }
    }

    // Try Referer header
    const referer = req.get('Referer');
    if (referer) {
      return referer;
    }

    return null;
  }

  /**
   * Extract hash from request
   */
  private extractHashFromRequest(req: Request): string | null {
    // Try to get hash from various sources
    if (req.query && typeof req.query.hash === 'string') {
      return req.query.hash;
    }

    if (req.body && typeof req.body === 'object') {
      const hash = req.body.hash || req.body.fileHash || req.body.checksum;
      if (typeof hash === 'string') {
        return hash;
      }
    }

    // Try from file upload
    if ((req as any).file && (req as any).file.filename) {
      // In a real implementation, you would calculate the file hash
      // For now, return null
      return null;
    }

    return null;
  }

  /**
   * Get score from severity
   */
  private getScoreFromSeverity(severity: string): number {
    switch (severity) {
      case 'critical':
        return 10;
      case 'high':
        return 7;
      case 'medium':
        return 4;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Get threat intelligence statistics
   */
  public getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.threatService.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Error getting threat stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get threat intelligence statistics',
      });
    }
  };

  /**
   * Get recent threat alerts
   */
  public getRecentAlerts = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const alerts = await this.threatService.getRecentAlerts(limit);

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      logger.error('Error getting recent alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recent threat alerts',
      });
    }
  };

  /**
   * Add custom threat indicator
   */
  public addCustomIndicator = async (req: Request, res: Response) => {
    try {
      const indicator = req.body;

      if (!indicator.type || !indicator.value || !indicator.source) {
        return res.status(400).json({
          success: false,
          error: 'type, value, and source are required',
        });
      }

      const success = await this.threatService.addCustomIndicator(indicator);

      res.json({
        success: true,
        data: { added: success },
      });
    } catch (error) {
      logger.error('Error adding custom indicator:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add custom threat indicator',
      });
    }
  };

  /**
   * Get threat feeds
   */
  public getFeeds = (req: Request, res: Response) => {
    try {
      const feeds = this.threatService.getFeeds();

      res.json({
        success: true,
        data: feeds,
      });
    } catch (error) {
      logger.error('Error getting threat feeds:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get threat feeds',
      });
    }
  };

  /**
   * Toggle threat feed
   */
  public toggleFeed = async (req: Request, res: Response) => {
    try {
      const { feedName, enabled } = req.body;

      if (!feedName || typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'feedName and enabled are required',
        });
      }

      const success = await this.threatService.toggleFeed(feedName, enabled);

      res.json({
        success: true,
        data: { toggled: success },
      });
    } catch (error) {
      logger.error('Error toggling feed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle threat feed',
      });
    }
  };
}

// Export singleton instance
export const threatIntelligenceMiddleware = new ThreatIntelligenceMiddleware();

// Export convenience methods
export const checkIPThreat = threatIntelligenceMiddleware.checkIPThreat;
export const checkDomainThreat = threatIntelligenceMiddleware.checkDomainThreat;
export const checkURLThreat = threatIntelligenceMiddleware.checkURLThreat;
export const checkHashThreat = threatIntelligenceMiddleware.checkHashThreat;
export const comprehensiveThreatCheck = threatIntelligenceMiddleware.comprehensiveThreatCheck;
