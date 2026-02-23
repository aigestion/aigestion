// src/controllers/gemini.controller.ts
// GOD MODE — Sovereign Gemini Command Center
import type { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service, SOVEREIGN_MODELS } from '../services/gemini-2.service';
import { GeminiLiveService } from '../services/google/gemini-live.service';
import { logger } from '../utils/logger';

@injectable()
export class GeminiController {
  constructor(
    @inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service,
    @inject(TYPES.GeminiLiveService) private readonly live: GeminiLiveService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // SOVEREIGN GENERATION
  // ─────────────────────────────────────────────────────────────

  /**
   * POST /sovereign — Generate with model selection, structured JSON, or thinking mode
   */
  public async sovereign(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, mode = 'standard', model, systemInstruction, schema, thinkingBudget } = req.body;
      logger.info(`[GeminiController] 🧠 Sovereign generation | Mode: ${mode}`);

      let result: any;

      switch (mode) {
        case 'structured':
          if (!schema) {
            return res.status(400).json({ error: 'Schema required for structured mode' });
          }
          result = await this.gemini.generateStructured(prompt, schema, {
            model,
            systemInstruction,
          });
          break;

        case 'thinking':
          result = await this.gemini.generateWithThinking(prompt, {
            model,
            systemInstruction,
            thinkingBudget,
          });
          break;

        case 'standard':
        default:
          const text = await this.gemini.generateText(prompt, {
            model,
            systemInstruction,
          });
          result = { response: text };
          break;
      }

      res.json({
        mode,
        model: model || this.gemini.getDefaultModel(),
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MULTIMODAL
  // ─────────────────────────────────────────────────────────────

  /**
   * POST /multimodal — Analyze images, audio, or combined inputs
   */
  public async multimodal(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, imageUrl, audioUrl } = req.body;
      logger.info('[GeminiController] 👁️ Multimodal analysis');

      if (imageUrl && text) {
        const result = await this.gemini.analyzeImage(imageUrl, text);
        return res.json({ result, type: 'image_analysis' });
      }

      const result = await this.gemini.multimodalAnalysis({ text, imageUrl, audioUrl });
      res.json({ result, type: 'multimodal' });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // TOKEN COUNTING
  // ─────────────────────────────────────────────────────────────

  /**
   * POST /count-tokens — Estimate token usage for cost planning
   */
  public async countTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, model } = req.body;
      const result = await this.gemini.countTokens(text, model);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MODELS REGISTRY
  // ─────────────────────────────────────────────────────────────

  /**
   * GET /models — List available sovereign models
   */
  public async listModels(_req: Request, res: Response, next: NextFunction) {
    try {
      const models = this.gemini.listSovereignModels();
      res.json({
        default: this.gemini.getDefaultModel(),
        models,
        registry: SOVEREIGN_MODELS,
      });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LIVE VOICE SESSIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * POST /live/session — Create a live voice session
   */
  public async createLiveSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const { voice, model, language, modality } = req.body;
      const session = await this.live.createSession(userId, { voice, model, language, modality });
      res.json(session);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /live/session/:id — Terminate a session
   */
  public async terminateLiveSession(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.live.terminateSession(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /live/sessions — List active sessions
   */
  public async listLiveSessions(_req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = this.live.listActiveSessions();
      res.json({ sessions, count: sessions.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /live/speak — Proactive speech injection
   */
  public async proactiveSpeech(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, text } = req.body;
      const result = await this.live.triggerProactiveSpeech(sessionId, text);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /live/voices — Available voices
   */
  public async listVoices(_req: Request, res: Response, next: NextFunction) {
    try {
      const voices = this.live.getAvailableVoices();
      res.json({ voices });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /live/health — Live service health
   */
  public async liveHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = this.live.getServiceHealth();
      res.json(health);
    } catch (error) {
      next(error);
    }
  }
}
