import { Router } from 'express';
import { container } from '../config/inversify.config';
import { AstraeaController } from '../controllers/AstraeaController';
import { withAuth, requireAuth } from '../middleware/auth.middleware';
import { TYPES } from '../types';

const router = Router();
const astraeaController = container.get<AstraeaController>(TYPES.AstraeaController);

/**
 * 🌌 ASTRAEA ROUTES
 * Real-time voice and spatial intelligence orchestration.
 */

router.post('/session', requireAuth, withAuth('user', 'admin'), (req, res, next) => {
  astraeaController.startSession(req, res, next);
});
router.post('/call', requireAuth, withAuth('user', 'admin'), (req, res, next) => {
  astraeaController.induceCall(req, res, next);
});

export default router;
