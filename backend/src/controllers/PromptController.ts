import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { PromptService } from '../services/prompt.service';
import { TYPES } from '../types';
import { buildResponse, buildError } from '../common/response-builder';

@injectable()
export class PromptController {
  constructor(@inject(TYPES.PromptService) private promptService: PromptService) {}

  /**
   * POST /api/prompt
   * Body: { model?: string, prompt: string, params?: Record<string, any> }
   */
  public run = async (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { model, prompt, params } = req.body;
      if (!prompt) {
        return res.status(400).json(buildError('Prompt is required', 'BAD_REQUEST', 400, requestId));
      }
      // Optionally allow overriding model via body
      const result = await this.promptService.runPrompt(prompt, params);
      res.json(buildResponse({ result }, 200, requestId));
    } catch (err) {
      next(err);
    }
  };
}
