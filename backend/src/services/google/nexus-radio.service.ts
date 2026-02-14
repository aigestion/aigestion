import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Gemini2Service } from '../gemini-2.service';
import { ElevenLabsService } from '../elevenlabs.service';
import { logger } from '../../utils/logger';

/**
 * NEXUS RADIO SERVICE (V2)
 * Advanced conversational briefing and multi-voice synthesis.
 */
@injectable()
export class NexusRadioService {
  constructor(
    @inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service,
    @inject(TYPES.ElevenLabsService) private readonly eleven: ElevenLabsService,
  ) {}

  /**
   * Generates a conversational radio script for the day's briefing.
   */
  async generateRadioScript(context: string): Promise<string> {
    logger.info('[NexusRadio] Drafting Sovereign Script (V2)...');

    const prompt = `
      Act as two high-level AI News anchors, "Nexus" (authoritative, deep) and "Aurora" (analytical, sharp).
      Generate a conversational script summarizing:
      ${context}
      
      Style: "High-tech noir", fast-paced, insightful. Avoid filler.
      Format: [NEXUS]: text, [AURORA]: text.
    `;

    return await this.gemini.generateText(prompt, { model: 'gemini-1.5-pro' });
  }

  /**
   * Synthesizes the radio script into a multi-voice audio stream.
   */
  async broadcastBriefing(script: string) {
    logger.info('[NexusRadio] Multi-voice synthesis initiated...');
    // Logic for multi-voice interleaving would go here
    // For now, we synthesize the authoritative core
    const summary = script.replaceAll(/\[NEXUS\]:|\[AURORA\]:/g, '');
    return await this.eleven.textToSpeech(summary);
  }
}
