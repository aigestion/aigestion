import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { PerceptionController } from '../controllers/perception.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Lazy resolution for DI timing
let _ctrl: PerceptionController;
function getCtrl(): PerceptionController {
  if (!_ctrl) _ctrl = container.resolve(PerceptionController);
  return _ctrl;
}

router.get('/weather', requireAuth, (req, res, next) => getCtrl().getWeather(req, res, next));
router.get('/maps/geocode', requireAuth, (req, res, next) => getCtrl().geocode(req, res, next));
router.get('/maps/nearby', requireAuth, (req, res, next) => getCtrl().getNearby(req, res, next));
router.post('/navigate', requireAuth, (req, res, next) => getCtrl().navigate(req, res, next));

export default router;
