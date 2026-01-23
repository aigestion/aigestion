import { Router } from 'express';
import { SecurityDashboardService } from '../services/security-dashboard.service';
import { logger } from '../utils/logger';

const router = Router();
const dashboardService = new SecurityDashboardService();

/**
 * Security Dashboard Routes
 */

// Get complete dashboard data
router.get('/dashboard', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data',
    });
  }
});

// Get real-time metrics
router.get('/metrics/realtime', async (req: any, res: any) => {
  try {
    const metrics = await dashboardService.getRealTimeMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    logger.error('Error getting real-time metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get real-time metrics',
    });
  }
});

// Get security incidents
router.get('/incidents', async (req: any, res: any) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const incidents = await dashboardService.getSecurityIncidents(limit);

    res.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    logger.error('Error getting security incidents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get security incidents',
    });
  }
});

// Get security score
router.get('/score', async (req: any, res: any) => {
  try {
    const score = await dashboardService.getSecurityScore();

    res.json({
      success: true,
      data: score,
    });
  } catch (error) {
    logger.error('Error getting security score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get security score',
    });
  }
});

// Export dashboard data
router.get('/export', async (req: any, res: any) => {
  try {
    const format = (req.query.format as string) || 'json';
    const data = await dashboardService.exportDashboardData(format as 'json' | 'csv');

    const filename = `security-dashboard-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(data);
  } catch (error) {
    logger.error('Error exporting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export dashboard data',
    });
  }
});

// Get WAF statistics
router.get('/waf/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.waf,
    });
  } catch (error) {
    logger.error('Error getting WAF stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get WAF stats',
    });
  }
});

// Get malware scanner statistics
router.get('/malware/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.malware,
    });
  } catch (error) {
    logger.error('Error getting malware stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get malware stats',
    });
  }
});

// Get 2FA statistics
router.get('/2fa/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.twoFactor,
    });
  } catch (error) {
    logger.error('Error getting 2FA stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get 2FA stats',
    });
  }
});

// Get threat intelligence statistics
router.get('/threat-intel/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.threatIntel,
    });
  } catch (error) {
    logger.error('Error getting threat intel stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get threat intel stats',
    });
  }
});

// Get behavior analysis statistics
router.get('/behavior/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.behavior,
    });
  } catch (error) {
    logger.error('Error getting behavior stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get behavior stats',
    });
  }
});

// Get log statistics
router.get('/logs/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.logs,
    });
  } catch (error) {
    logger.error('Error getting log stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get log stats',
    });
  }
});

// Get monitoring statistics
router.get('/monitoring/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.monitoring,
    });
  } catch (error) {
    logger.error('Error getting monitoring stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get monitoring stats',
    });
  }
});

// Get backup statistics
router.get('/backup/stats', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    res.json({
      success: true,
      data: data.backup,
    });
  } catch (error) {
    logger.error('Error getting backup stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get backup stats',
    });
  }
});

// Get dashboard health
router.get('/health', async (req: any, res: any) => {
  try {
    const data = await dashboardService.getDashboardData();

    const health = {
      status: data.overview.systemHealth === 'healthy' ? 200 : 503,
      service: 'security-dashboard',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0',
    };

    res.status(health.status).json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Error getting dashboard health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard health',
    });
  }
});

export default router;
