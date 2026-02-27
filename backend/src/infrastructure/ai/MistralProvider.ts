import { Readable } from 'node:stream';
import { AIProvider, AIStreamParams } from '../../interfaces/ai-provider.interface';
import { MistralService } from '../../services/MistralService';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class MistralProvider implements AIProvider {
  constructor(@inject(TYPES.MistralService) private mistralService: MistralService) {}

  async generateContent(prompt: string, options: { modelId: string }): Promise<string> {
    const result = await this.mistralService.generateText(prompt, { model: options.modelId });
    return typeof result === 'string' ? result : JSON.stringify(result);
  }

  async streamChat(params: AIStreamParams, options: { modelId: string }): Promise<Readable> {
    return this.mistralService.streamChat(params.prompt, params.history || [], {
      model: options.modelId,
      systemInstruction: params.systemInstruction,
    });
  }

  async getEmbeddings(text: string): Promise<number[]> {
    // Mistral embeddings could be implemented if supported/needed
    return [];
  }
}
