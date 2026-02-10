import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { DockerController } from '../controllers/docker.controller';

const router = Router();
const controller = container.get<DockerController>(TYPES.DockerController);

/**
 * @openapi
 * /docker/containers:
 *   get:
 *     summary: List all Docker containers
 *     tags: [Docker]
 *     responses:
 *       200:
 *         description: List of containers
 */
router.get('/containers', (req, res, next) => controller.getContainers(req, res, next));

/**
 * @openapi
 * /docker/containers/{id}/stats:
 *   get:
 *     summary: Get stats for a specific container
 *     tags: [Docker]
 */
router.get('/containers/:id/stats', (req, res, next) =>
  controller.getContainerStats(req, res, next),
);

/**
 * @openapi
 * /docker/containers/{id}/start:
 *   post:
 *     summary: Start a specific container
 *     tags: [Docker]
 */
router.post('/containers/:id/start', (req, res, next) => controller.startContainer(req, res, next));

/**
 * @openapi
 * /docker/containers/{id}/stop:
 *   post:
 *     summary: Stop a specific container
 *     tags: [Docker]
 */
router.post('/containers/:id/stop', (req, res, next) => controller.stopContainer(req, res, next));

export default router;
