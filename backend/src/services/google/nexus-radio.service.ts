import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Gemini2Service } from '../gemini-2.service';
import { VoiceService } from '../voice.service';
import { SovereignKnowledgeService } from './sovereign-knowledge.service';
import { logger } from '../../utils/logger';

/**
 * NEXUS RADIO 2.0
 * Generates conversational audio briefings based on sovereign sources.
 */
@injectable()
export class NexusRadioService {
  constructor(
    @inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service,
    @inject(TYPES.VoiceService) private readonly voice: VoiceService,
    @inject(TYPES.SovereignKnowledgeService) private readonly knowledge: SovereignKnowledgeService,
  ) {}

  /**
   * Generates a conversational briefing from a specific Source Set.
   */
  async generateSovereignBriefing(sourceSetId: string): Promise<Buffer> {
    logger.info(`[NexusRadio] Generating source-grounded briefing for set: ${sourceSetId}`);

    // 1. Get grounded context
    const rawContext = await this.knowledge.generateBriefing(sourceSetId);

    // 2. Generate conversational script with "High-tech noir" style
    const scriptPrompt = `
      Actúa como el locutor del Nexus Radio.
      Genera un resumen informativo basado en estas fuentes:
      "${rawContext}"
      
      ESTILO: Alta tecnología, noir, directo, inteligente.
      FORMATO: Podcast corto.
      IDIOMA: Español.
    `;

    return await this.gemini.generateText(scriptPrompt, { model: 'gemini-2.0-flash' });
  }

  /**
   * Synthesizes the radio script into a multi-voice audio stream.
   */
  async broadcastBriefing(script: string) {
    logger.info('[NexusRadio] Multi-voice synthesis initiated...');
    // Logic for multi-voice interleaving would go here
    // For now, we synthesize the authoritative core
    const summary = script.replaceAll(/\[NEXUS\]:|\[AURORA\]:/g, '');
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Fallback voice
    const outputPath = `temp/briefing_${Date.now()}.mp3`;
    return await this.eleven.textToSpeech(summary, voiceId, outputPath);
  }
}
