import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { container } from '../config/inversify.config';
import { buildResponse } from '../common/response-builder';
import { validate, schemas } from '../middleware/validation.middleware';
import { EnhancedVoiceService } from '../services/enhanced-voice.service';
import { TYPES } from '../types';
import { RateLimitService } from '../services/rate-limit.service';

export const processConversation = [
  validate({
    body: {
      sessionId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      text: { type: 'string', optional: true },
      audio: { type: 'string', optional: true }, // Base64 encoded audio
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId, userId, text, audio } = req.body;
      const enhancedVoiceService = container.get<EnhancedVoiceService>(TYPES.EnhancedVoiceService);
      const rateLimitService = container.get<RateLimitService>(TYPES.RateLimitService);

      // Check rate limits (bypass for admin/god)
      const userRole = (req as any).user?.role;
      if (userRole !== 'god' && userRole !== 'admin') {
        await rateLimitService.incrementAndCheck(`enhanced_voice:${userId}`, 30, 60); // 30 requests per minute
      }

      // Process audio if provided
      let audioBuffer: Buffer | undefined;
      if (audio) {
        audioBuffer = Buffer.from(audio, 'base64');
      }

      const result = await enhancedVoiceService.processConversation({
        audio: audioBuffer,
        text,
        sessionId,
        userId,
      });

      // Convert audio response to base64 for frontend
      const response = {
        ...result,
        audioResponse: result.audioResponse ? result.audioResponse.toString('base64') : undefined,
      };

      res.json(buildResponse(response, 200, (req as any).requestId || 'unknown'));
    } catch (err) {
      next(err);
    }
  },
];

export const getConversationHistory = [
  validate({
    query: {
      sessionId: { type: 'string', required: true },
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.query;
      const enhancedVoiceService = container.get<EnhancedVoiceService>(TYPES.EnhancedVoiceService);
      const userId = (req as any).user?.id || 'anonymous';

      const history = await enhancedVoiceService.getConversationHistory(sessionId as string);

      res.json(buildResponse(history, 200, (req as any).requestId || 'unknown'));
    } catch (err) {
      next(err);
    }
  },
];

export const clearConversation = [
  validate({
    body: {
      sessionId: { type: 'string', required: true },
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.body;
      const enhancedVoiceService = container.get<EnhancedVoiceService>(TYPES.EnhancedVoiceService);
      const userId = (req as any).user?.id || 'anonymous';

      await enhancedVoiceService.clearConversation(sessionId);

      res.json(
        buildResponse(
          { message: 'Conversation cleared successfully' },
          200,
          (req as any).requestId || 'unknown',
        ),
      );
    } catch (err) {
      next(err);
    }
  },
];
