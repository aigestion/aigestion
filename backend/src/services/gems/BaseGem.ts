import { injectable, inject } from 'inversify';
import { Gemini2Service } from '../gemini-2.service';
import { logger } from '../../utils/logger';

export interface GemOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

@injectable()
export abstract class BaseGem {
  constructor(
    @inject(Gemini2Service) protected gemini: Gemini2Service,
    protected name: string,
    protected systemInstruction: string
  ) {}

  async ask(prompt: string, options: GemOptions = {}): Promise<string> {
    logger.info(`[${this.name}] Processing request...`);
    try {
      const response = await this.gemini.generateText(prompt, {
        systemInstruction: this.systemInstruction,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        model: options.model
      });
      logger.info(`[${this.name}] Response received.`);
      return response;
    } catch (error) {
      logger.error(`[${this.name}] Error processing request`, error);
      throw error;
    }
  }
}
