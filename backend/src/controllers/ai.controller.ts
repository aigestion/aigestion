// src/controllers/ai.controller.ts
import type { NextFunction, Request, Response } from 'express-serve-static-core';

import { container } from '../config/inversify.config';
import { buildResponse } from '../common/response-builder';
import { validate, schemas } from '../middleware/validation.middleware';
import { AIService } from '../services/ai.service';
import { TYPES } from '../types';
import { RateLimitService } from '../services/rate-limit.service';

export const runPrompt = [
  validate({ body: schemas.ai.prompt }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt } = req.body;
      const userId = (req as any).user?.id || 'anonymous';
      // Get the service from the container to ensure dependencies (Analytics, Search, etc.) are injected
      const aiService = container.get<AIService>(TYPES.AIService);
      const rateLimitService = container.get<RateLimitService>(TYPES.RateLimitService);

      // God Mode: Bypass rate limits for admin/god
      const userRole = (req as any).user?.role;
      if (userRole !== 'god' && userRole !== 'admin') {
        // Rate Limit: 10 requests per minute for prompts
        await rateLimitService.incrementAndCheck(`ai_prompt:${userId}`, 10, 60);
      }

      const result = await aiService.generateContent(prompt, userId, userRole);
      res.json(buildResponse(result, 200, (req as any).requestId || 'unknown'));
    } catch (err) {
      next(err);
    }
  },
];

export const streamChat = [
  validate({ body: schemas.ai.chat }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt, history } = req.body;
      const userId = (req as any).user?.id || 'anonymous';
      const aiService = container.get<AIService>(TYPES.AIService);
      const rateLimitService = container.get<RateLimitService>(TYPES.RateLimitService);

      // God Mode: Bypass rate limits for admin/god
      const userRole = (req as any).user?.role;
      if (userRole !== 'god' && userRole !== 'admin') {
        // Rate Limit: 20 requests per minute for chat sessions
        await rateLimitService.incrementAndCheck(`ai_chat:${userId}`, 20, 60);
      }

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const stream = await aiService.streamChat({ prompt, history, userId, userRole });

        for await (const chunk of stream) {
          res.write(chunk);
        }

        res.write('data: [DONE]\n\n');
        res.end();
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        res.write(`data: ${JSON.stringify({ type: 'error', content: 'Streaming failed' })}\n\n`);
        res.end();
      }
    } catch (err) {
      next(err);
    }
  },
];
