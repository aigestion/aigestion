import { Router } from 'express';
import { buildError, buildResponse } from '../common/response-builder';
import { container } from '../config/inversify.config';
import { CredentialManagerService } from '../services/credential-manager.service';
import { HistoryService } from '../services/history.service';
import { TYPES } from '../types';

// Middleware
import { apiKeyAuth } from '../middleware/api-key.middleware';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware';
import { dynamicRateLimiter } from '../middleware/rate-limit.middleware';
import { redisCache } from '../middleware/redis-cache.middleware';
import { requireAuth } from '../middleware/auth.middleware';

const apiV1Router = Router();

// Middleware
apiV1Router.use(idempotencyMiddleware);
apiV1Router.use(apiKeyAuth);

console.log('DEBUG: API V1 router loading with lazy-loaded sub-routers');

// Lazy-Loaded Routers to avoid top-level container.get / circular dependency issues
const lazy = (path: string) => (req: any, res: any, next: any) => {
  const router = require(path).default;
  if (typeof router === 'function') {
    return router(req, res, next);
  }
  // Handle cases where it might be a named export or already a router instance
  const r = router.router || router;
  return r(req, res, next);
};

// Mount Routes (Lazy)
apiV1Router.use('/auth', lazy('./auth.routes'));
apiV1Router.use('/docker', lazy('./docker.routes'));
apiV1Router.use('/personas', lazy('./persona.routes'));
apiV1Router.use('/swarm', lazy('./swarm.routes'));
apiV1Router.use('/webauthn', lazy('./webauthn.routes'));
apiV1Router.use('/sovereign', lazy('./sovereign-handshake.routes'));
apiV1Router.use('/users', lazy('./users.routes'));
apiV1Router.use('/health', lazy('./health.routes'));
apiV1Router.use('/stripe', lazy('./stripe.routes'));
apiV1Router.use('/youtube', lazy('./youtube.routes'));
apiV1Router.use('/contact', lazy('./contact.routes'));
apiV1Router.use('/exit-templates', lazy('./exit-templates.routes'));

// System Endpoints
apiV1Router.post('/system/credentials/verify', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const credManager = container.get<CredentialManagerService>(TYPES.CredentialManagerService);
    const report = await credManager.verifyAll();
    res.json(buildResponse(report, 200, requestId));
  } catch (err) {
    res.status(500).json(buildError('Verification failed', 'VERIFICATION_ERROR', 500, requestId));
  }
});

apiV1Router.get('/system/history/:metric', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const { metric } = req.params;
    const historyService = container.get<HistoryService>(TYPES.HistoryService);
    const history = await historyService.getHistory(metric);
    res.json(buildResponse(history, 200, requestId));
  } catch (err) {
    res.status(500).json(buildError('Internal server error', 'INTERNAL_ERROR', 500, requestId));
  }
});

// Controllers (Lazy-ish resolution inside handlers)
apiV1Router.get('/usage/current', redisCache(60), (req, res, next) => {
  const { UsageController } = require('../controllers/usage.controller');
  const controller = container.get<any>(TYPES.UsageController);
  return controller.getCurrentUsage(req, res, next);
});

apiV1Router.get('/billing/snapshot', requireAuth, redisCache(300), (req, res, next) => {
  const controller = container.get<any>(TYPES.BillingController);
  return controller.getBillingSnapshot(req, res, next);
});

apiV1Router.post('/billing/checkout', requireAuth, (req, res, next) => {
  const controller = container.get<any>(TYPES.BillingController);
  return controller.createCheckoutSession(req, res, next);
});

apiV1Router.post('/billing/portal', requireAuth, (req, res, next) => {
  const controller = container.get<any>(TYPES.BillingController);
  return controller.createPortalSession(req, res, next);
});

// Monitoring and AI (Lazy)
apiV1Router.use('/analytics', redisCache(30), lazy('./analytics.routes'));
apiV1Router.use('/enhanced-voice', lazy('./enhanced-voice.routes'));
apiV1Router.use('/daniela', lazy('./daniela.routes'));
apiV1Router.use('/ai', dynamicRateLimiter, lazy('./ai.routes'));
apiV1Router.use('/rag', lazy('./rag.routes'));

// System Management (Lazy)
apiV1Router.use('/system', lazy('./system.routes'));
apiV1Router.use('/social', lazy('./social.routes'));
apiV1Router.use('/logs', lazy('./logs.routes'));
apiV1Router.use('/security-dashboard', lazy('./security-dashboard.routes'));
apiV1Router.use('/waf', lazy('./waf.routes'));
apiV1Router.use('/malware-scanner', lazy('./malware-scanner.routes'));
apiV1Router.use('/threat-intelligence', lazy('./threat-intelligence.routes'));
apiV1Router.use('/behavior', lazy('./user-behavior.routes'));
apiV1Router.use('/device-posture', lazy('./device-posture.routes'));
apiV1Router.use('/nexus', lazy('./nexus.routes'));
apiV1Router.use('/god-mode', lazy('./godmode.routes'));

export default apiV1Router;
