import { Request, Response, Router } from 'express';
import { buildResponse } from '../common/response-builder';
import { config } from '../config/config';
import { container, TYPES } from '../config/inversify.config';
import { HealthService } from '../services/health.service';

const healthRouter = Router();

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
healthRouter.get('/', (req: Request, res: Response) => {
  const requestId = (req as any).requestId || 'unknown';
  return res.json(
    buildResponse(
      {
        status: 'healthy',
        uptime: process.uptime(),
        version: config.apiDocs.version || '1.0.0',
      },
      200,
      requestId,
    ),
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
healthRouter.get('/detailed', async (req: Request, res: Response) => {
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
