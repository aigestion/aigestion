import { Router } from 'express';
import { container } from '../config/inversify.config';
import { DanielaController } from '../controllers/daniela.controller';
import { TYPES } from '../types';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const danielaController = container.get<DanielaController>(TYPES.DanielaController);

/**
 * @route POST /api/v1/daniela/chat
 * @desc Interaction with Daniela AI
 * @access Private
 */
router.post('/chat', protect, danielaController.chat);

/**
 * @route GET /api/v1/daniela/status
 * @desc Get Daniela's operational status
 * @access Private
 */
router.get('/status', protect, danielaController.getStatus);

/**
 * @route GET /api/v1/daniela/system-status
 * @desc Get system status for dashboards
 * @access Private
 */
router.get('/system-status', protect, danielaController.getSystemStatus);

/**
 * @route GET /api/v1/daniela/insights
 * @desc Get strategic insights for dashboards
 * @access Private
 */
router.get('/insights', protect, danielaController.getInsights);

export default router;
