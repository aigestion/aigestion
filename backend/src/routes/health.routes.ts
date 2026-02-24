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
 *     summary: Basic health check (liveness)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is up (DB may still be connecting)
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
 * /api/v1/health/readyz:
 *   get:
 *     summary: Readiness check — 200 once DB is connected, 503 during boot
 *     tags: [System]
 */
healthRouter.get('/readyz', (req: Request, res: Response) => {
  // isReady is exported from server.ts — set true after MongoDB connects
  const { isReady } = require('../server');
  const requestId = (req as any).requestId || 'unknown';
  if (!isReady) {
    return res.status(503).json(
      buildResponse({ status: 'starting', uptime: process.uptime() }, 503, requestId)
    );
  }
  return res.json(
    buildResponse({ status: 'ready', uptime: process.uptime() }, 200, requestId)
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

export default healthRouter;
