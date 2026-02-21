import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { AstraeaController } from '../controllers/AstraeaController';
import { authGuard } from '../middleware/auth.middleware';

const router = Router();
const astraeaController = container.get<AstraeaController>(TYPES.AstraeaController);

/**
 * 🌌 ASTRAEA ROUTES
 * Real-time voice and spatial intelligence orchestration.
 */

router.post('/session', authGuard, (req, res, next) => {
  astraeaController.startSession(req, res, next);
});
router.post('/call', authGuard, (req, res, next) => {
  astraeaController.induceCall(req, res, next);
});

export default router;
