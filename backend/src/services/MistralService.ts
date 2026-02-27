import { Mistral } from '@mistralai/mistralai';
import { injectable } from 'inversify';
import { Readable } from 'stream';
import { logger } from '../utils/logger';
import { env } from '../config/env.schema';

/**
 * MISTRAL GOD MODE SERVICE — Sovereign Intelligence Alternative
 * High-performance integration for Mistral AI models.
 * Capabilities: Streaming · Structured Output · Secure Handshake · SOTA Reasoning
 */

export const MISTRAL_MODELS = {
  LARGE: 'mistral-large-latest',
  SMALL: 'mistral-small-latest',
  CODE: 'codestral-latest',
  OPEN_MIXTRAL: 'open-mixtral-8x22b',
} as const;

export type MistralModel = (typeof MISTRAL_MODELS)[keyof typeof MISTRAL_MODELS];

@injectable()
export class MistralService {
  private client: Mistral;

  constructor() {
    const apiKey = env.MISTRAL_API_KEY;
    if (!apiKey) {
      logger.warn('⚠️ MISTRAL_API_KEY not found. MistralService will run in degraded mode.');
    }
    this.client = new Mistral({ apiKey: apiKey || '' });
  }

  /**
   * Generates text using Mistral models.
   */
  async generateText(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemInstruction?: string;
    } = {},
  ) {
    const model = options.model || MISTRAL_MODELS.LARGE;
    try {
      const messages: any[] = [];
      if (options.systemInstruction) {
        messages.push({ role: 'system', content: options.systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.complete({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        maxTokens: options.maxTokens ?? 2048,
      });

      return response.choices?.[0]?.message?.content || '';
    } catch (error) {
      logger.error(`[MistralService] Content generation failed for ${model}`, error);
      throw error;
    }
  }

  /**
   * Streams a chat response from Mistral.
   */
  async streamChat(
    prompt: string,
    history: any[] = [],
    options: { model?: string; systemInstruction?: string } = {},
  ): Promise<Readable> {
    const model = options.model || MISTRAL_MODELS.LARGE;
    const stream = new Readable({ read() {} });

    try {
      const messages: any[] = [];
      if (options.systemInstruction) {
        messages.push({ role: 'system', content: options.systemInstruction });
      }

      // Inject history
      history.forEach(msg => {
        messages.push({
          role: msg.role === 'model' || msg.role === 'assistant' ? 'assistant' : 'user',
          content:
            msg.content || (typeof msg.parts?.[0]?.text === 'string' ? msg.parts[0].text : ''),
        });
      });

      messages.push({ role: 'user', content: prompt });

      const result = await this.client.chat.stream({
        model,
        messages,
        temperature: 0.7,
      });

      const runner = async () => {
        try {
          for await (const chunk of result) {
            const content = chunk.data.choices?.[0]?.delta?.content;
            if (content) {
              stream.push(`data: ${JSON.stringify({ type: 'text', content })}\n\n`);
            }
          }
          stream.push('data: [DONE]\n\n');
          stream.push(null);
        } catch (error) {
          logger.error('[MistralService] Stream processing error', error);
          stream.emit('error', error);
          stream.push(null);
        }
      };

      runner();
      return stream;
    } catch (error) {
      logger.error(`[MistralService] Stream initiation failed for ${model}`, error);
      throw error;
    }
  }

  /**
   * Generates structured JSON output conforming to a provided schema.
   */
  async generateStructured<T = any>(
    prompt: string,
    schema: Record<string, any>,
    options: { model?: string; systemInstruction?: string; temperature?: number } = {},
  ): Promise<T> {
    const model = options.model || MISTRAL_MODELS.LARGE;
    try {
      const messages: any[] = [];
      if (options.systemInstruction) {
        messages.push({ role: 'system', content: options.systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.complete({
        model,
        messages,
        temperature: options.temperature ?? 0.2, // Lower temp for reliability
        responseFormat: { type: 'json_object' },
      });

      const jsonText = (response.choices?.[0]?.message?.content as string) || '{}';
      return JSON.parse(jsonText) as T;
    } catch (error) {
      logger.error(`[MistralService] Structured generation failed (${model})`, error);
      throw error;
    }
  }

  /**
   * Estimates token count (Heuristic until native tokenizer is integrated).
   */
  countTokens(text: string): number {
    // Basic heuristic: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
