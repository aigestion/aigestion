// src/routes/ai-studio.routes.ts
// GOD MODE — Sovereign AI Studio API Routes
import { Router } from 'express';

import {
  studioPrompt,
  groundedGenerate,
  codeExecGenerate,
  batchGenerate,
  createCache,
  generateFromCache,
  listTunedModels,
  listPrompts,
  savePrompt,
  executePrompt,
  getStudioHealth,
} from '../controllers/ai-studio.controller';

const router = Router();

// ═══════════════════════════════════════════════════════════
// GENERATION ENDPOINTS
// ═══════════════════════════════════════════════════════════

/**
 * @openapi
 * /api/v1/ai-studio/prompt:
 *   post:
 *     summary: Standard AI Studio generation
 *     tags: [AI Studio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt: { type: string }
 *               model: { type: string }
 *               systemInstruction: { type: string }
 *               temperature: { type: number }
 *     responses:
 *       200:
 *         description: Generated text response
 */
router.post('/prompt', studioPrompt);

/**
 * @openapi
 * /api/v1/ai-studio/grounded:
 *   post:
 *     summary: Google Search grounded generation
 *     tags: [AI Studio]
 */
router.post('/grounded', groundedGenerate);

/**
 * @openapi
 * /api/v1/ai-studio/code-exec:
 *   post:
 *     summary: Code execution enabled generation
 *     tags: [AI Studio]
 */
router.post('/code-exec', codeExecGenerate);

/**
 * @openapi
 * /api/v1/ai-studio/batch:
 *   post:
 *     summary: Batch multi-prompt processing (max 10)
 *     tags: [AI Studio]
 */
router.post('/batch', batchGenerate);

// ═══════════════════════════════════════════════════════════
// CONTEXT CACHING
// ═══════════════════════════════════════════════════════════

/**
 * @openapi
 * /api/v1/ai-studio/cache:
 *   post:
 *     summary: Create a cached context for token reuse
 *     tags: [AI Studio]
 */
router.post('/cache', createCache);

/**
 * @openapi
 * /api/v1/ai-studio/cache/{id}/generate:
 *   post:
 *     summary: Generate using a cached context
 *     tags: [AI Studio]
 */
router.post('/cache/:id/generate', generateFromCache);

// ═══════════════════════════════════════════════════════════
// TUNED MODELS
// ═══════════════════════════════════════════════════════════

/**
 * @openapi
 * /api/v1/ai-studio/tuned-models:
 *   get:
 *     summary: List available tuned models
 *     tags: [AI Studio]
 */
router.get('/tuned-models', listTunedModels);

// ═══════════════════════════════════════════════════════════
// PROMPT LIBRARY
// ═══════════════════════════════════════════════════════════

/**
 * @openapi
 * /api/v1/ai-studio/prompts:
 *   get:
 *     summary: List saved prompt templates
 *     tags: [AI Studio]
 */
router.get('/prompts', listPrompts);

/**
 * @openapi
 * /api/v1/ai-studio/prompts:
 *   post:
 *     summary: Save a new prompt template
 *     tags: [AI Studio]
 */
router.post('/prompts', savePrompt);

/**
 * @openapi
 * /api/v1/ai-studio/prompts/{id}/execute:
 *   post:
 *     summary: Execute a saved prompt with variable substitution
 *     tags: [AI Studio]
 */
router.post('/prompts/:id/execute', executePrompt);

// ═══════════════════════════════════════════════════════════
// DIAGNOSTICS
// ═══════════════════════════════════════════════════════════

/**
 * @openapi
 * /api/v1/ai-studio/health:
 *   get:
 *     summary: AI Studio health diagnostics
 *     tags: [AI Studio]
 */
router.get('/health', getStudioHealth);

export default router;
