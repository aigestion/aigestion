import { Router } from 'express';
import { container, TYPES } from '../config/inversify.config';
import { ForgeController } from '../controllers/ForgeController';

const router = Router();

// Lazy-resolve controller
const getController = () => container.get<ForgeController>(TYPES.ForgeController);

/**
 * @route   POST /api/v1/forge/request
 * @desc    Create a manual 3D forge request
 */
router.post('/request', (req, res, next) => getController().createRequest(req, res, next));

/**
 * @route   POST /api/v1/forge/execute/:id
 * @desc    Trigger the generation for a specific request ID
 */
router.post('/execute/:id', (req, res, next) => getController().executeTask(req, res, next));

export default router;
