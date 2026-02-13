import { Router } from 'express';
import { container } from '../config/inversify.config';
import { DanielaController } from '../controllers/daniela.controller';
import { TYPES } from '../types';
import { protect } from '../middleware/auth.middleware';

const router = Router();
// Controller resolution moved inside route handlers

/**
 * @route POST /api/v1/daniela/chat
 * @desc Interaction with Daniela AI
 * @access Private
 */
router.post('/chat', protect, (req, res, next) =>
  container.get<DanielaController>(TYPES.DanielaController).chat(req, res, next)
);
router.get('/status', protect, (req, res, next) =>
  container.get<DanielaController>(TYPES.DanielaController).getStatus(req, res, next)
);
router.get('/system-status', protect, (req, res, next) =>
  container.get<DanielaController>(TYPES.DanielaController).getSystemStatus(req, res, next)
);
router.get('/insights', protect, (req, res, next) =>
  container.get<DanielaController>(TYPES.DanielaController).getInsights(req, res, next)
);

export default router;
