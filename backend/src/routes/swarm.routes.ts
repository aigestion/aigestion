import { Router } from 'express';
import { container } from '../config/inversify.config';
import { SwarmController } from '../controllers/swarm.controller';
import { TYPES } from '../types';

const swarmRouter = Router();
const controller = container.get<SwarmController>(TYPES.SwarmController);

swarmRouter.use('/', controller.router);

export default swarmRouter;
