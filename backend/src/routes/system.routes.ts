import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { SystemController } from '../controllers/system.controller';

const router = Router();
const controller = container.get<SystemController>(TYPES.SystemController);

router.get('/metrics', (req, res, next) => controller.getSystemMetrics(req, res, next));
router.get('/cpu', (req, res, next) => controller.getCPUUsage(req, res, next));
router.get('/memory', (req, res, next) => controller.getMemoryUsage(req, res, next));
router.get('/disk', (req, res, next) => controller.getDiskUsage(req, res, next));
router.get('/network', (req, res, next) => controller.getNetworkStats(req, res, next));

export default router;
