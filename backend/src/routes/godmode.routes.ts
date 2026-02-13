import { Router } from 'express';
import { container, TYPES } from '../config/inversify.config';
import { GodModeController } from '../controllers/godmode.controller';

const router = Router();

// Controller resolution moved inside route handlers to avoid circular dependency

/**
 * @openapi
 * /god-mode/projects:
 *   get:
 *     summary: List all AI projects
 *     tags: [God Mode]
 */
router.get('/projects', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).listProjects(req, res, next)
);
router.post('/projects', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).createProject(req, res, next)
);

/**
 * @openapi
 * /god-mode/search:
 *   post:
 *     summary: Execute Hybrid Search (Vector + Full Text)
 *     tags: [God Mode]
 */
router.post('/search', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).hybridSearch(req, res, next)
);

/**
 * @openapi
 * /god-mode/prompts:
 *   get:
 *     summary: List all available prompt templates
 *     tags: [God Mode]
 */
router.get('/prompts', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).listPrompts(req, res, next)
);

/**
 * @openapi
 * /god-mode/prompts/:name:
 *   get:
 *     summary: Get a specific prompt template by name
 *     tags: [God Mode]
 */
router.get('/prompts/:name', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).getPrompt(req, res, next)
);

/**
 * @openapi
 * /god-mode/audit:
 *   get:
 *     summary: View recent audit logs
 *     tags: [God Mode]
 */
router.get('/audit', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).getAuditLogs(req, res, next)
);

/**
 * @openapi
 * /god-mode/test-notification:
 *   post:
 *     summary: Test sovereign notification channels
 *     tags: [God Mode]
 */
router.post('/test-notification', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).testNotification(req, res, next)
);

export default router;
