import { Router } from 'express';

import { buildError, buildResponse } from '../common/response-builder';
// import { buildError, buildResponse, requestIdMiddleware } from '../common/response-builder';

// import { getEmailTracking } from '../controllers/email-tracking.controller';
// import briefingRoutes from './briefing.routes';
import { container } from '../config/inversify.config';
import exitEmailRouter from '../controllers/exit-email.controller';
import { CredentialManagerService } from '../services/credential-manager.service';
import { HistoryService } from '../services/history.service';
import { TYPES } from '../types';
import aiRouter from './ai.routes';
import ragRoutes from './rag.routes';
// import gmailRoutes from './gmail.routes';
// import bigqueryRoutes from './bigquery.routes';
// import cloudMonitoringRoutes from './cloudMonitoring.routes';
// import jwt from 'jsonwebtoken';
// import { env } from '../config/env.schema';
// import { dashboardAuth } from '../middleware/dashboardAuth';
import {
  createCheckoutSession,
  createPortalSession,
  getBillingSnapshot,
} from '../controllers/billing.controller';
import { getCurrentUsage } from '../controllers/usage.controller';
import { requireAuth } from '../middleware/auth.middleware';
import analyticsRouter from './analytics.routes';
import authRouter from './auth.routes';
import danielaRouter from './daniela.routes';
import dockerRouter from './docker.routes';
import enhancedVoiceRouter from './enhanced-voice.routes';
import personaRouter from './persona.routes';
import stripeRouter from './stripe.routes';
import swarmRouter from './swarm.routes';
import usersRouter from './users.routes';
import youtubeRouter from './youtube.routes';
import godmodeRoutes from './godmode.routes';

// ... (existing imports)

import { idempotencyMiddleware } from '../middleware/idempotency.middleware';
import { dynamicRateLimiter } from '../middleware/rate-limit.middleware';
import { redisCache } from '../middleware/redis-cache.middleware';
import devicePostureRouter from './device-posture.routes';
import logsRouter from './logs.routes';
import malwareScannerRouter from './malware-scanner.routes';
import nexusRouter from './nexus.routes';
import securityDashboardRouter from './security-dashboard.routes';
import socialRouter from './social.routes';
import systemRouter from './system.routes';
import threatIntelRouter from './threat-intelligence.routes';
import behaviorRouter from './user-behavior.routes';
import wafRouter from './waf.routes';

/**
 * API v1 Router
 * Base estandarizada para todas las rutas versionadas
 */
const apiV1Router = Router();

// Aplicar middleware de idempotencia globalmente para proteger todos los POST/PUT/PATCH
apiV1Router.use(idempotencyMiddleware);

console.log('DEBUG: API V1 router loaded');

// Mount Auth Routes
// Mount Auth Routes
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/docker', dockerRouter);
apiV1Router.use('/personas', personaRouter);
apiV1Router.use('/swarm', swarmRouter);

/**
 * @openapi
 * /api/v1/system/credentials/verify:
 *   post:
 *     summary: Verify all configured credentials and API keys
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Verification report
 *       500:
 *         description: Internal server error
 */
apiV1Router.post('/system/credentials/verify', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const credManager = container.get<CredentialManagerService>(TYPES.CredentialManagerService);
    const report = await credManager.verifyAll();
    res.json(buildResponse(report, 200, requestId));
  } catch (err) {
    const requestId = req.requestId;
    res.status(500).json(buildError('Verification failed', 'VERIFICATION_ERROR', 500, requestId));
  }
});

/**
 * @openapi
 * /api/v1/system/history/{metric}:
 *   get:
 *     summary: Retrieve history for a specific metric
 *     tags: [System]
 *     parameters:
 *       - in: path
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the metric (e.g., cpu, memory)
 *     responses:
 *       200:
 *         description: List of metric snapshots
 *       500:
 *         description: Internal server error
 */
apiV1Router.get('/system/history/:metric', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const { metric } = req.params;
    const historyService = container.get<HistoryService>(TYPES.HistoryService);
    const history = await historyService.getHistory(metric);
    res.json(buildResponse(history, 200, requestId));
  } catch (err) {
    const requestId = req.requestId;
    res.status(500).json(buildError('Internal server error', 'INTERNAL_ERROR', 500, requestId));
  }
});

// Standard API Routes

// Users (Prueba poniéndolo arriba)
apiV1Router.use('/users', usersRouter);

import healthRouter from './health.routes';
// ... (existing imports)

// Health checks
apiV1Router.use('/health', healthRouter);

// Other services
/**
 * @openapi
 * /api/v1/stripe:
 *   get:
 *     summary: Stripe related endpoints (placeholder)
 *     tags: [Stripe]
 *     responses:
 *       200:
 *         description: Successful response
 */
apiV1Router.use('/stripe', stripeRouter);
/**
 * @openapi
 * /api/v1/youtube:
 *   get:
 *     summary: YouTube related endpoints (placeholder)
 *     tags: [YouTube]
 *     responses:
 *       200:
 *         description: Successful response
 */
apiV1Router.use('/youtube', youtubeRouter);
// apiV1Router.use('/gmail', gmailRoutes);
// apiV1Router.use('/bigquery', bigqueryRoutes);
// apiV1Router.use('/cloud-monitoring', cloudMonitoringRoutes);
// apiV1Router.use('/youtube', youtubeRoutes);
// apiV1Router.use('/briefing', briefingRoutes);

// Dashboard Auth routes (refresh token, etc.)
// apiV1Router.post('/auth/refresh', dashboardAuth, (req, res) => {
//   const { user } = req as any;
//   const newToken = jwt.sign({ user: user.user, role: user.role }, env.JWT_SECRET, {
//     expiresIn: '7d',
//   });
//   res.json({ token: newToken });
// });

// Nueva ruta para el tracking de emails
// apiV1Router.get('/email/tracking', getEmailTracking);

apiV1Router.get('/usage/current', redisCache(60), getCurrentUsage);
apiV1Router.get('/billing/snapshot', requireAuth, redisCache(300), getBillingSnapshot);
apiV1Router.post('/billing/checkout', requireAuth, createCheckoutSession);
apiV1Router.post('/billing/portal', requireAuth, createPortalSession);
apiV1Router.use('/analytics', redisCache(30), analyticsRouter);

// Enhanced Voice Service (Daniela)
/**
 * @openapi
 * /api/v1/enhanced-voice:
 *   get:
 *     summary: Enhanced Voice Service endpoints for Daniela
 *     tags: [EnhancedVoice]
 *     responses:
 *       200:
 *         description: Enhanced Voice Service endpoints
 */
apiV1Router.use('/enhanced-voice', enhancedVoiceRouter);
apiV1Router.use('/daniela', danielaRouter);

// AI and RAG Routes

/**
 * @openapi
 * /api/v1/ai:
 *   get:
 *     summary: AI related endpoints (placeholder)
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: Successful response
 */
apiV1Router.use('/ai', dynamicRateLimiter, aiRouter);
apiV1Router.use('/rag', ragRoutes);
/**
 * @openapi
 * /api/v1/exit-templates:
 *   get:
 *     summary: Exit email templates endpoints (placeholder)
 *     tags: [ExitEmail]
 *     responses:
 *       200:
 *         description: Successful response
 */
apiV1Router.use('/exit-templates', exitEmailRouter);

// System Routes (Metrics, CPU, etc.)
apiV1Router.use('/system', systemRouter);

// Social Routes (Facebook, Instagram, etc.)
apiV1Router.use('/social', socialRouter);

// Logs Routes
apiV1Router.use('/logs', logsRouter);
apiV1Router.use('/security-dashboard', securityDashboardRouter);
apiV1Router.use('/waf', wafRouter);
apiV1Router.use('/malware-scanner', malwareScannerRouter);
apiV1Router.use('/threat-intelligence', threatIntelRouter);
apiV1Router.use('/behavior', behaviorRouter);
apiV1Router.use('/device-posture', devicePostureRouter);
apiV1Router.use('/nexus', nexusRouter);
apiV1Router.use('/god-mode', godmodeRoutes);

export default apiV1Router;
