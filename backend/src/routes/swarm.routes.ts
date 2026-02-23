import { Router } from 'express';
import { container } from '../config/inversify.config';
import { SwarmController } from '../controllers/swarm.controller';
import { TYPES } from '../types';

const swarmRouter = Router();
const controller = container.get<SwarmController>(TYPES.SwarmController);

swarmRouter.post('/tool-call', (req, res, next) => controller.executeTool(req, res, next));
swarmRouter.get('/god-state', (req, res, next) => controller.getGodState(req, res, next));
swarmRouter.post('/missions', (req, res, next) => controller.createMission(req, res, next));
swarmRouter.post('/recursive-reasoning', (req, res, next) =>
  controller.runRecursiveReasoning(req, res, next),
);
swarmRouter.get('/missions/:id', (req, res, next) => controller.getMission(req, res, next));
swarmRouter.post('/stress-test', (req, res, next) => controller.stressTest(req, res, next));
swarmRouter.get('/history', (req, res, next) => controller.getHistory(req, res, next));

export default swarmRouter;
