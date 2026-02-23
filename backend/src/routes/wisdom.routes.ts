import { Router } from 'express';
import { WisdomController } from '../controllers/wisdom.controller';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { requireAuth } from '../middleware/auth.middleware';

/**
 * WISDOM ROUTES
 * Orchestration routes for strategic insights and Colab research flows.
 */
const wisdomRouter = Router();
const controller = container.get<WisdomController>(TYPES.WisdomController);

// All wisdom routes require sovereign authentication
wisdomRouter.use(requireAuth);

/**
 * @route GET /api/v1/wisdom/card
 * Generates a strategic insight card
 */
wisdomRouter.get('/card', (req, res, next) => controller.getWisdomCard(req, res, next));

/**
 * @route POST /api/v1/wisdom/research
 * Triggers a deep research mission (Notebook generation + Dispatch)
 */
wisdomRouter.post('/research', (req, res, next) => controller.triggerDeepResearch(req, res, next));

/**
 * @route POST /api/v1/wisdom/process/:fileId
 * Extracts wisdom from a finished Colab execution
 */
wisdomRouter.post('/process/:fileId', (req, res, next) => controller.processWisdom(req, res, next));

export default wisdomRouter;
