import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { SystemController } from '../controllers/system.controller';
import { rateLimiter } from '../middleware/rate-limiter.instance';

const router = Router();
const controller = container.get<SystemController>(TYPES.SystemController);

// Monitoring rate limit: 30 req/min per IP — protects high-frequency polling endpoints
const monitoringLimit = rateLimiter.attempt('MONITORING');

router.get('/metrics', monitoringLimit, (req, res, next) => controller.getSystemMetrics(req, res, next));
router.get('/cpu',     monitoringLimit, (req, res, next) => controller.getCPUUsage(req, res, next));
router.get('/memory',  monitoringLimit, (req, res, next) => controller.getMemoryUsage(req, res, next));
router.get('/disk',    monitoringLimit, (req, res, next) => controller.getDiskUsage(req, res, next));
router.get('/network', monitoringLimit, (req, res, next) => controller.getNetworkStats(req, res, next));

export default router;

