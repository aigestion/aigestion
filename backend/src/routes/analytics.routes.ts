import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { AnalyticsController } from '../controllers/analytics.controller';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { rateLimiter } from '../middleware/rate-limiter.instance';

const router = Router();
const controller = container.get<AnalyticsController>(TYPES.AnalyticsController);

// Monitoring rate limit: 30 req/min per IP
const monitoringLimit = rateLimiter.attempt('MONITORING');

router.get('/overview', monitoringLimit, cacheMiddleware(600), (req, res, next) =>
  controller.getAnalyticsOverview(req, res, next)
);
router.get('/user-activity', cacheMiddleware(300), (req, res, next) =>
  controller.getUserActivity(req, res, next)
);
router.get('/system-usage', cacheMiddleware(120), (req, res, next) =>
  controller.getSystemUsage(req, res, next)
);
router.get('/error-rates', cacheMiddleware(60), (req, res, next) =>
  controller.getErrorRates(req, res, next)
);
router.get('/dashboard-data', cacheMiddleware(300), (req, res, next) =>
  controller.getDashboardData(req, res, next)
);
router.get('/god-mode', cacheMiddleware(30), (req, res, next) =>
  controller.getGodModeAnalytics(req, res, next),
);
router.get('/export', (req, res, next) => controller.exportReport(req, res, next));

export default router;
