import { Request, Response, Router } from 'express';
import { buildResponse } from '../common/response-builder';
import { config } from '../config/config';
import { container, TYPES } from '../config/inversify.config';
import { HealthService } from '../services/health.service';
import { rateLimiter } from '../middleware/rate-limiter.instance';

const healthRouter = Router();

// Monitoring rate limit: 30 req/min per IP
const monitoringLimit = rateLimiter.attempt('MONITORING');

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Basic health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System is up
 */
healthRouter.get('/', monitoringLimit, (req: Request, res: Response) => {
  const requestId = (req as any).requestId || 'unknown';
  return res.json(
    buildResponse(
      {
        status: 'healthy',
        uptime: process.uptime(),
        version: config.apiDocs.version || '1.0.0',
      },
      200,
      requestId
    )
  );
});

/**
 * @openapi
 * /api/v1/health/detailed:
 *   get:
 *     summary: Get detailed system health diagnostics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System health report
 */
healthRouter.get('/detailed', monitoringLimit, async (req: Request, res: Response) => {
  const requestId = (req as any).requestId ?? 'unknown';
  try {
    const healthService = container.get<HealthService>(TYPES.DetailedHealthService);
    const report = await healthService.getDetailedHealth();
    return res.json(buildResponse(report, 200, requestId as string));
  } catch (error: any) {
    console.error('Detailed Health Check Failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate detailed health report',
      error: error.message ?? 'Unknown',
    });
  }
});

/**
 * @openapi
 * /api/v1/health/healer:
 *   get:
 *     summary: Get Nexus Healer status and recent autonomous repairs
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Healer status report
 */
healthRouter.get('/healer', monitoringLimit, async (req: Request, res: Response) => {
  const requestId = (req as any).requestId ?? 'unknown';
  try {
    const sovereignHealingService = container.get<any>(TYPES.SovereignHealingService);
    const status = await sovereignHealingService.getHealerStatus();
    return res.json(buildResponse(status, 200, requestId as string));
  } catch (error: any) {
    console.error('Healer Status Check Failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve healer status',
      error: error.message ?? 'Unknown',
    });
  }
});

export default healthRouter;
