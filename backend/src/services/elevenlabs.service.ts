import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

@injectable()
export class ElevenLabsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = env.ELEVENLABS_API_KEY || '';
  }

  /**
   * Generates audio from text and saves it to a file
   * @param text The text to synthesize
   * @param voiceId The ElevenLabs Voice ID
   * @param outputPath Full path where the .mp3 will be saved
   */
  async textToSpeech(text: string, voiceId: string, outputPath: string): Promise<string> {
    try {
      logger.info(`[ElevenLabsService] Synthesizing voice for: "${text.substring(0, 30)}..."`);

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      const buffer = Buffer.from(response.data);

      // Ensure directory exists
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(outputPath, buffer);

      logger.info(`[ElevenLabsService] Audio saved to: ${outputPath}`);
      return outputPath;
    } catch (error: any) {
      logger.error(
        '[ElevenLabsService] Synthesis failed:',
        error.response?.data?.toString() || error.message,
      );
      throw new Error('Failed to generate high-fidelity voice.');
    }
  }

  /**
   * Retrieves available voices
   */
  async getVoices(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: { 'xi-api-key': this.apiKey },
      });
      return response.data.voices;
    } catch (error) {
      logger.error('[ElevenLabsService] Failed to fetch voices:', error);
      return [];
    }
  }
}
