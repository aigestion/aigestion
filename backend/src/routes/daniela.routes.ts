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
router.post('/chat', protect, (req, res, next) => danielaController.chat(req, res, next));
router.get('/status', protect, (req, res, next) => danielaController.getStatus(req, res, next));
router.get('/system-status', protect, (req, res, next) =>
  danielaController.getSystemStatus(req, res, next),
);
router.get('/insights', protect, (req, res, next) => danielaController.getInsights(req, res, next));

export default router;
