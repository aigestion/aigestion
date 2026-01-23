import { Router } from 'express';
import { requireApiKey } from '../middleware/security.middleware';
import { wafManagement } from '../middleware/waf.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * WAF Management Routes
 * These endpoints allow monitoring and managing the Web Application Firewall
 */

// Get WAF statistics
router.get('/stats', requireApiKey, (req: any, res: any) => {
  try {
    const stats = wafManagement.getStats();

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
});

// Get all WAF rules
router.get('/rules', requireApiKey, (req: any, res: any) => {
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
});

// Enable a specific WAF rule
router.post('/rules/:ruleName/enable', requireApiKey, (req: any, res: any) => {
  try {
    const { ruleName } = req.params;

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
});

// Disable a specific WAF rule
router.post('/rules/:ruleName/disable', requireApiKey, (req: any, res: any) => {
  try {
    const { ruleName } = req.params;

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
});

// Reset WAF statistics
router.post('/stats/reset', requireApiKey, (req: any, res: any) => {
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
});

// Test WAF with a payload
router.post('/test', requireApiKey, (req: any, res: any) => {
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
    } as any;

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
});

// Get WAF health check
router.get('/health', (req: any, res: any) => {
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
});

export default router;
