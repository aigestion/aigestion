import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
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

router.post('/compliance-export', (req, res, next) =>
  container.get<GodModeController>(TYPES.GodModeController).requestComplianceExport(req, res, next),
);

/**
 * BI Intelligence Routes
 */
router.get('/bi/projections', (req, res, next) =>
  container.get<any>(TYPES.PredictiveBIController).getProjections(req, res, next),
);

router.get('/bi/churn-risk/:userId?', (req, res, next) =>
  container.get<any>(TYPES.PredictiveBIController).getChurnRisk(req, res, next),
);

/**
 * Swarm Governance Routes
 */
router.get('/governance/proposals', (req, res, next) =>
  container.get<any>(TYPES.GovernanceController).getProposals(req, res, next),
);

router.post('/governance/proposals/:id/veto', (req, res, next) =>
  container.get<any>(TYPES.GovernanceController).vetoProposal(req, res, next),
);

/**
 * Neural Health & Resilience Routes
 */
router.get('/health/neural-score', (req, res, next) =>
  container.get<any>(TYPES.NeuralHealthController).getNeuralScore(req, res, next),
);

router.post('/health/trigger-phoenix', (req, res, next) =>
  container.get<any>(TYPES.NeuralHealthController).triggerPhoenix(req, res, next),
);

/**
 * MCP Hub & Discovery Routes
 */
router.get('/mcp/directory', (req, res, next) =>
  container.get<any>(TYPES.MCPController).getDirectory(req, res, next),
);

router.post('/mcp/activate/:id', (req, res, next) =>
  container.get<any>(TYPES.MCPController).activateServer(req, res, next),
);

router.post('/mcp/revoke/:id', (req, res, next) =>
  container.get<any>(TYPES.MCPController).revokeServer(req, res, next),
);

router.post('/mcp/register', (req, res, next) =>
  container.get<any>(TYPES.MCPController).registerLocal(req, res, next),
);

/**
 * SIMA Persona Marketplace Routes
 */
router.get('/marketplace/personas', (req, res, next) =>
  container.get<any>(TYPES.PersonaController).getMarketplace(req, res, next),
);

router.post('/marketplace/hire/:id', (req, res, next) =>
  container.get<any>(TYPES.PersonaController).hire(req, res, next),
);

router.post('/marketplace/rate/:id', (req, res, next) =>
  container.get<any>(TYPES.PersonaController).rate(req, res, next),
);

/**
 * SOVEREIGN SENTINEL SECURITY ROUTES
 */
router.get('/sentinel/status', (req, res, next) =>
  container.get<any>(TYPES.SentinelController).getStatus(req, res, next),
);

router.post('/sentinel/challenge', (req, res, next) =>
  container.get<any>(TYPES.SentinelController).requestChallenge(req, res, next),
);

router.post('/sentinel/verify', (req, res, next) =>
  container.get<any>(TYPES.SentinelController).verifyBiometric(req, res, next),
);

/**
 * SOVEREIGN FINANCE ROUTES
 */
router.get('/finance/yields', (req, res, next) =>
  container.get<any>(TYPES.FinanceController).getYields(req, res, next),
);

router.post('/finance/harvest', (req, res, next) =>
  container.get<any>(TYPES.FinanceController).harvest(req, res, next),
);

export default router;
