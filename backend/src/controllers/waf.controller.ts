import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { wafManagement } from '../middleware/waf.middleware';
import { WAFService } from '../services/waf.service';
import { logger } from '../utils/logger';

@injectable()
export class WAFController {
  constructor(private wafService: WAFService) { }

  public getStats = async (req: Request, res: Response) => {
    try {
      const stats = this.wafService.getMetrics();

      res.json({
        success: true,
        data: {
          ...stats,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error('Error getting WAF stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public getRules = async (req: Request, res: Response) => {
    try {
      const rules = wafManagement.getRules();

      res.json({
        success: true,
        data: rules.map(rule => ({
          name: rule.name,
          enabled: rule.enabled,
          action: rule.action,
          description: rule.description,
          severity: rule.severity,
          pattern: rule.pattern.source,
        })),
      });
    } catch (error) {
      logger.error('Error getting WAF rules:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public enableRule = async (req: Request, res: Response) => {
    try {
      const { ruleName } = req.params as any;

      wafManagement.enableRule(ruleName);

      logger.info(`WAF rule ${ruleName} enabled by admin`, {
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: `Rule ${ruleName} enabled successfully`,
      });
    } catch (error) {
      logger.error('Error enabling WAF rule:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public disableRule = async (req: Request, res: Response) => {
    try {
      const { ruleName } = req.params as any;

      wafManagement.disableRule(ruleName);

      logger.warn(`WAF rule ${ruleName} disabled by admin`, {
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: `Rule ${ruleName} disabled successfully`,
      });
    } catch (error) {
      logger.error('Error disabling WAF rule:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public resetStats = async (req: Request, res: Response) => {
    try {
      wafManagement.resetStats();

      logger.info('WAF statistics reset by admin', {
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'WAF statistics reset successfully',
      });
    } catch (error) {
      logger.error('Error resetting WAF stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public testWAF = async (req: Request, res: Response) => {
    try {
      const { payload, context } = req.body;

      if (!payload || !context) {
        return res.status(400).json({
          success: false,
          error: 'Payload and context are required',
        });
      }

      // Create a mock request to test
      const mockReq = {
        url: context === 'URL' ? payload : '/test',
        query: context === 'QUERY' ? { test: payload } : {},
        body: context === 'BODY' ? payload : {},
        headers: context === 'HEADER' ? { 'X-Test': payload } : {},
        ip: req.ip,
        get: (header: string) => req.get(header),
      } as Request;

      const wafInstance = wafManagement.getInstance();
      const analysis = wafInstance.analyzeRequest(mockReq);

      res.json({
        success: true,
        data: {
          blocked: analysis.blocked,
          warnings: analysis.warnings,
          matchedRules: analysis.matchedRules,
          payload: payload.substring(0, 100), // Limit for security
          context,
        },
      });
    } catch (error) {
      logger.error('Error testing WAF:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public getHealth = async (req: Request, res: Response) => {
    try {
      const stats = wafManagement.getStats();
      const rules = wafManagement.getRules();

      const health = {
        status: 'healthy',
        uptime: process.uptime(),
        rules: {
          total: rules.length,
          enabled: rules.filter(r => r.enabled).length,
          disabled: rules.filter(r => !r.enabled).length,
        },
        stats: {
          totalRequests: stats.totalRequests,
          blockedRequests: stats.blockedRequests,
          warnings: stats.warnings,
          blockRate:
            stats.totalRequests > 0
              ? ((stats.blockedRequests / stats.totalRequests) * 100).toFixed(2) + '%'
              : '0%',
        },
        timestamp: new Date().toISOString(),
      };

      res.json({
        success: true,
        data: health,
      });
    } catch (error) {
      logger.error('Error getting WAF health:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public getEvents = async (req: Request, res: Response) => {
    try {
      const filters = {
        type: req.query.type as 'block' | 'warning' | 'info',
        severity: req.query.severity as 'low' | 'medium' | 'high' | 'critical',
        rule: req.query.rule as string,
        ip: req.query.ip as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      } as any;

      const result = this.wafService.getEvents(filters);

      res.json({
        success: true,
        data: result.events,
        pagination: {
          total: result.total,
          limit: filters.limit,
          offset: filters.offset,
        },
      });
    } catch (error) {
      logger.error('Error getting WAF events:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public getIPReputation = async (req: Request, res: Response) => {
    try {
      const { ip } = req.params as any;

      if (!ip) {
        return res.status(400).json({
          success: false,
          error: 'IP address is required',
        });
      }

      const reputation = this.wafService.getIPReputation(ip);

      res.json({
        success: true,
        data: reputation,
      });
    } catch (error) {
      logger.error('Error getting IP reputation:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public blockIP = async (req: Request, res: Response) => {
    try {
      const { ip } = req.params as any;
      const { reason, duration } = req.body;

      if (!ip) {
        return res.status(400).json({
          success: false,
          error: 'IP address is required',
        });
      }

      const blockDuration = duration || 24 * 60 * 60 * 1000; // Default 24 hours
      const blockReason = reason || 'Manual block via API';

      this.wafService.blockIP(ip, blockReason, blockDuration);

      res.json({
        success: true,
        message: `IP ${ip} blocked successfully`,
      });
    } catch (error) {
      logger.error('Error blocking IP:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public unblockIP = async (req: Request, res: Response) => {
    try {
      const { ip } = req.params as any;
      const { reason } = req.body;

      if (!ip) {
        return res.status(400).json({
          success: false,
          error: 'IP address is required',
        });
      }

      const unblockReason = reason || 'Manual unblock via API';

      this.wafService.unblockIP(ip, unblockReason);

      res.json({
        success: true,
        message: `IP ${ip} unblocked successfully`,
      });
    } catch (error) {
      logger.error('Error unblocking IP:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public exportEvents = async (req: Request, res: Response) => {
    try {
      const { format } = req.query as { format: 'json' | 'csv' };

      const exportData = this.wafService.exportEvents(format || 'json');

      const filename = `waf-events-${new Date().toISOString().split('T')[0]}.${format || 'json'}`;

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');

      res.send(exportData);
    } catch (error) {
      logger.error('Error exporting WAF events:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  public getDashboard = async (req: Request, res: Response) => {
    try {
      const dashboardData = this.wafService.getDashboardData();

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      logger.error('Error getting WAF dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}
