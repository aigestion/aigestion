import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { VertexAIService, vertexAIService } from './google/vertex-ai.service';
import { ElevenLabsService } from './elevenlabs.service';
import { logger } from '../utils/logger';
import path from 'path';

export interface ContentRequest {
  topic: string;
  tone?: string;
  targetPlatform?: 'youtube' | 'instagram' | 'tiktok';
}

@injectable()
export class ContentFactoryService {
  constructor(
    @inject(TYPES.ElevenLabsService) private elevenLabs: ElevenLabsService,
  ) {}

  /**
   * Generates a complete content piece: Script + Voice
   */
  async createShortFormContent(request: ContentRequest): Promise<any> {
    const { topic, tone = 'enthusiastic and professional', targetPlatform = 'youtube' } = request;

    try {
      logger.info(`[ContentFactory] Creating content for topic: ${topic}`);

      // 1. Generate Script using Vertex AI
      const prompt = `
        Create a viral ${targetPlatform} short script about "${topic}".
        Tone: ${tone}.
        Duration: ~50 seconds.
        Include visual cues in brackets [like this] and the spoken dialogue.
        Output only the spoken dialogue for the voice synthesis part if asked separately,
        but for now, give me the full script.
      `;

      const fullScript = await vertexAIService.generateText(prompt);

      // 2. Extract only the dialogue for ElevenLabs (Rough cleaning)
      // In a real scenario, we'd use a regex or another AI call to get only the Clean Dialogue.
      const cleanDialogue = fullScript.replace(/\[.*?\]/g, '').trim();

      // 3. Generate Voice synthesis
      const voiceId = 'pNInz6w7cyVja9MBYttH'; // Default "Daniela" style or similar
      const timestamp = Date.now();
      const outputDir = path.resolve(__dirname, '../../../data/outputs/audio');
      const audioPath = path.join(outputDir, `${targetPlatform}_${timestamp}.mp3`);

      await this.elevenLabs.textToSpeech(cleanDialogue, voiceId, audioPath);

      return {
        success: true,
        topic,
        script: fullScript,
        audioPath,
        assets: {
          voiceId,
        },
      };

    } catch (error: any) {
      logger.error('[ContentFactory] Content creation failed:', error.message);
      throw error;
    }
  }
}
