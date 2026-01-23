import { Router } from 'express';
import { threatIntelligenceMiddleware } from '../middleware/threat-intelligence.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Threat Intelligence Routes
 */

// Get threat intelligence statistics
router.get('/stats', threatIntelligenceMiddleware.getStats as any);

// Get recent threat alerts
router.get('/alerts', threatIntelligenceMiddleware.getRecentAlerts as any);

// Add custom threat indicator
router.post('/indicators', threatIntelligenceMiddleware.addCustomIndicator as any);

// Get threat feeds
router.get('/feeds', threatIntelligenceMiddleware.getFeeds as any);

// Toggle threat feed
router.post('/feeds/toggle', threatIntelligenceMiddleware.toggleFeed as any);

// Check IP address
router.post('/check/ip', async (req: any, res: any) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({
        success: false,
        error: 'IP address is required',
      });
    }

    // Create mock request for threat checking
    const mockReq = {
      ip,
      connection: { remoteAddress: ip },
      socket: { remoteAddress: ip },
    } as any;

    // Apply IP threat check
    await new Promise<void>(resolve => {
      threatIntelligenceMiddleware.checkIPThreat(mockReq, res, () => resolve());
    });

    const threatCheck = (mockReq as any).threatCheck;

    res.json({
      success: true,
      data: {
        ip,
        threat: threatCheck?.ipThreat || null,
        riskScore: threatCheck?.riskScore || 0,
        action: threatCheck?.action || 'allow',
      },
    });
  } catch (error) {
    logger.error('Error checking IP threat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check IP threat',
    });
  }
});

// Check domain
router.post('/check/domain', async (req: any, res: any) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain is required',
      });
    }

    // Create mock request for threat checking
    const mockReq = {
      body: { domain },
      get: (header: string) => (header === 'Host' ? domain : null),
      hostname: domain,
    } as any;

    // Apply domain threat check
    await new Promise<void>(resolve => {
      threatIntelligenceMiddleware.checkDomainThreat(mockReq, res, () => resolve());
    });

    const threatCheck = (mockReq as any).threatCheck;

    res.json({
      success: true,
      data: {
        domain,
        threat: threatCheck?.domainThreat || null,
        riskScore: threatCheck?.riskScore || 0,
        action: threatCheck?.action || 'allow',
      },
    });
  } catch (error) {
    logger.error('Error checking domain threat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check domain threat',
    });
  }
});

// Check URL
router.post('/check/url', async (req: any, res: any) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }

    // Create mock request for threat checking
    const mockReq = {
      body: { url },
      get: (header: string) => (header === 'Referer' ? url : null),
    } as any;

    // Apply URL threat check
    await new Promise<void>(resolve => {
      threatIntelligenceMiddleware.checkURLThreat(mockReq, res, () => resolve());
    });

    const threatCheck = (mockReq as any).threatCheck;

    res.json({
      success: true,
      data: {
        url,
        threat: threatCheck?.urlThreat || null,
        riskScore: threatCheck?.riskScore || 0,
        action: threatCheck?.action || 'allow',
      },
    });
  } catch (error) {
    logger.error('Error checking URL threat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check URL threat',
    });
  }
});

// Check file hash
router.post('/check/hash', async (req: any, res: any) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({
        success: false,
        error: 'Hash is required',
      });
    }

    // Create mock request for threat checking
    const mockReq = {
      body: { hash },
    } as any;

    // Apply hash threat check
    await new Promise<void>(resolve => {
      threatIntelligenceMiddleware.checkHashThreat(mockReq, res, () => resolve());
    });

    const threatCheck = (mockReq as any).threatCheck;

    res.json({
      success: true,
      data: {
        hash,
        threat: threatCheck?.urlThreat || null, // Reuse urlThreat for hash
        riskScore: threatCheck?.riskScore || 0,
        action: threatCheck?.action || 'allow',
      },
    });
  } catch (error) {
    logger.error('Error checking hash threat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check hash threat',
    });
  }
});

// Comprehensive threat check
router.post('/check/comprehensive', async (req: any, res: any) => {
  try {
    const { ip, domain, url, hash } = req.body;

    if (!ip && !domain && !url && !hash) {
      return res.status(400).json({
        success: false,
        error: 'At least one of ip, domain, url, or hash is required',
      });
    }

    // Create mock request for threat checking
    const mockReq = {
      ip,
      body: { domain, url, hash },
      get: (header: string) => {
        switch (header) {
          case 'Host':
            return domain || null;
          case 'Referer':
            return url || null;
          default:
            return null;
        }
      },
      hostname: domain,
      connection: { remoteAddress: ip },
      socket: { remoteAddress: ip },
    } as any;

    // Apply comprehensive threat check
    await new Promise<void>(resolve => {
      threatIntelligenceMiddleware.comprehensiveThreatCheck(mockReq, res, () => resolve());
    });

    const threatCheck = (mockReq as any).threatCheck;

    res.json({
      success: true,
      data: {
        checked: { ip, domain, url, hash },
        threats: {
          ip: threatCheck?.ipThreat || null,
          domain: threatCheck?.domainThreat || null,
          url: threatCheck?.urlThreat || null,
          hash: threatCheck?.urlThreat || null, // Reuse urlThreat for hash
        },
        riskScore: threatCheck?.riskScore || 0,
        action: threatCheck?.action || 'allow',
      },
    });
  } catch (error) {
    logger.error('Error in comprehensive threat check:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform comprehensive threat check',
    });
  }
});

// Get threat intelligence health
router.get('/health', (req: any, res: any) => {
  try {
    const health = {
      status: 'healthy',
      service: 'threat-intelligence',
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Error getting threat intelligence health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get threat intelligence health',
    });
  }
});

export default router;
