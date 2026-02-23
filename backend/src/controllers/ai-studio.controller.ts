// src/controllers/ai-studio.controller.ts
// GOD MODE — Sovereign AI Studio Command Center Controller
import type { NextFunction, Request, Response } from 'express';

import { container } from '../config/inversify.config';
import { buildResponse } from '../common/response-builder';
import { AiStudioService } from '../services/google/ai-studio.service';
import { TYPES } from '../types';
import { RateLimitService } from '../services/rate-limit.service';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getService() {
  return container.get<AiStudioService>(TYPES.AiStudioService);
}

function getRateLimiter() {
  return container.get<RateLimitService>(TYPES.RateLimitService);
}

function getUserMeta(req: Request) {
  const userId = (req as any).user?.id || 'anonymous';
  const userRole = (req as any).user?.role;
  return { userId, userRole };
}

async function enforceRateLimit(req: Request, bucket: string, limit: number, windowSec: number) {
  const { userId, userRole } = getUserMeta(req);
  if (userRole !== 'god' && userRole !== 'admin') {
    await getRateLimiter().incrementAndCheck(`${bucket}:${userId}`, limit, windowSec);
  }
}

// ─────────────────────────────────────────────────────────────
// STANDARD GENERATION
// ─────────────────────────────────────────────────────────────

export const studioPrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_prompt', 15, 60);
    const { prompt, model, systemInstruction, temperature } = req.body;
    const service = getService();
    const result = await service.executeCustomGem(
      {
        id: 'studio_prompt',
        name: 'Studio Prompt',
        systemInstruction: systemInstruction || 'You are a sovereign AI assistant.',
        model: model || 'gemini-2.0-flash',
        temperature,
      },
      prompt,
    );
    res.json(buildResponse({ text: result }, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GOOGLE SEARCH GROUNDING
// ─────────────────────────────────────────────────────────────

export const groundedGenerate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_grounded', 10, 60);
    const { prompt, model, systemInstruction } = req.body;
    const service = getService();
    const result = await service.generateGrounded(prompt, model, systemInstruction);
    res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// CODE EXECUTION
// ─────────────────────────────────────────────────────────────

export const codeExecGenerate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_code', 10, 60);
    const { prompt, model } = req.body;
    const service = getService();
    const result = await service.executeWithCode(prompt, model);
    res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// BATCH PROCESSING
// ─────────────────────────────────────────────────────────────

export const batchGenerate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_batch', 5, 60);
    const { prompts, model, systemInstruction } = req.body;
    if (!Array.isArray(prompts) || prompts.length === 0) {
      res.status(400).json(buildResponse({ error: 'prompts array required' }, 400, (req as any).requestId || 'unknown'));
      return;
    }
    if (prompts.length > 10) {
      res.status(400).json(buildResponse({ error: 'Maximum 10 prompts per batch' }, 400, (req as any).requestId || 'unknown'));
      return;
    }
    const service = getService();
    const result = await service.batchGenerate(prompts, { model, systemInstruction });
    res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// CONTEXT CACHING
// ─────────────────────────────────────────────────────────────

export const createCache = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_cache', 5, 60);
    const { name, content, model, systemInstruction } = req.body;
    const service = getService();
    const result = await service.createCachedContext(name, content, model, systemInstruction);
    res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

export const generateFromCache = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_cache_gen', 15, 60);
    const { id } = req.params;
    const { prompt } = req.body;
    const service = getService();
    const result = await service.generateWithCache(id, prompt);
    res.json(buildResponse({ text: result }, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// TUNED MODELS
// ─────────────────────────────────────────────────────────────

export const listTunedModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = getService();
    const models = await service.listTunedModels();
    res.json(buildResponse({ models }, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PROMPT LIBRARY
// ─────────────────────────────────────────────────────────────

export const listPrompts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = getService();
    const prompts = await service.listPrompts();
    res.json(buildResponse({ prompts }, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

export const savePrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, template, systemInstruction, model, temperature } = req.body;
    if (!name || !template) {
      res.status(400).json(buildResponse({ error: 'name and template required' }, 400, (req as any).requestId || 'unknown'));
      return;
    }
    const service = getService();
    const result = await service.savePrompt({
      name,
      category: category || 'general',
      template,
      systemInstruction,
      model,
      temperature,
    });
    res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

export const executePrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await enforceRateLimit(req, 'ai_studio_prompt_exec', 15, 60);
    const { id } = req.params;
    const { variables } = req.body;
    const service = getService();
    const result = await service.executePrompt(id, variables);
    res.json(buildResponse({ text: result }, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// HEALTH DIAGNOSTICS
// ─────────────────────────────────────────────────────────────

export const getStudioHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = getService();
    const health = await service.getStudioHealth();
    res.json(buildResponse(health, 200, (req as any).requestId || 'unknown'));
  } catch (err) {
    next(err);
  }
};
