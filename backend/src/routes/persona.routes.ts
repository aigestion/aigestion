import { Router } from 'express';
import { TYPES } from '../types';
import { container } from '../config/inversify.config';
import { PersonaController } from '../controllers/PersonaController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

const getController = () => container.get<PersonaController>(TYPES.PersonaController);

// CRUD routes
router.post('/', protect, (req, res, next) => getController().create(req, res, next));
router.get('/marketplace', (req, res, next) => getController().getMarketplace(req, res, next));
router.post('/hire/:id', protect, (req, res, next) => getController().hire(req, res, next));
router.post('/rate/:id', protect, (req, res, next) => getController().rate(req, res, next));

export default router;
