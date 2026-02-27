import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { AIProvider } from '../../interfaces/ai-provider.interface';
import { GeminiProvider } from './GeminiProvider';
import { MistralProvider } from './MistralProvider';

@injectable()
export class AIProviderFactory {
  constructor(
    @inject(TYPES.GeminiProvider) private gemini: GeminiProvider,
    @inject(TYPES.MistralProvider) private mistral: MistralProvider,
  ) {}

  public getProvider(providerName: string): AIProvider {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        return this.gemini;
      case 'mistral':
        return this.mistral;
      default:
        // Default to Gemini as sovereign fallback
        return this.gemini;
    }
  }
}
