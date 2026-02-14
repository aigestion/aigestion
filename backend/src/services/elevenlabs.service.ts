import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * SOVEREIGN ELEVENLABS SERVICE (God Mode)
 * Specialized in high-fidelity neural voice synthesis with extreme resilience.
 */
@injectable()
export class ElevenLabsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = env.ELEVENLABS_API_KEY || '';
  }

  /**
   * Resilient execution wrapper with exponential backoff for ElevenLabs API
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const status = error.response?.status;
        
        // Critical: Do not retry on 401 (Auth), 402 (Quota), or 4xx (Validation)
        if (status === 401 || status === 402 || (status >= 400 && status < 500)) {
          logger.error(`[ElevenLabsService] ${context} Terminal Error: ${status}`, error.response?.data);
          throw error;
        }

        if (attempt === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`[ElevenLabsService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[ElevenLabsService] ${context} failed after maximum retries`);
  }

  /**
   * Generates audio from text and saves it to a file with God Mode resilience.
   */
  async textToSpeech(text: string, voiceId: string, outputPath: string, settings?: VoiceSettings): Promise<string> {
    return this.withRetry(async () => {
      logger.info(`[ElevenLabsService] Synthesizing Sovereign Voice: "${text.substring(0, 50)}..."`);

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings || {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      const buffer = Buffer.from(response.data);
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(outputPath, buffer);

      logger.info({ size: buffer.length, path: outputPath }, '[ElevenLabsService] Synthesis successful');
      return outputPath;
    }, 'textToSpeech');
  }

  /**
   * Returns a readable stream for audio (latence-optimized for real-time)
   */
  async textToSpeechStream(text: string, voiceId: string, settings?: VoiceSettings): Promise<Readable> {
    return this.withRetry(async () => {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}/stream`,
        {
          text,
          model_id: 'eleven_turbo_v2', // Turbo model for lower latency in streaming
          voice_settings: settings || {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        }
      );
      return response.data;
    }, 'textToSpeechStream');
  }

  /**
   * Universal Voice Registry Access
   */
  async getVoices(): Promise<any[]> {
    return this.withRetry(async () => {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: { 'xi-api-key': this.apiKey },
      });
      return response.data.voices;
    }, 'getVoices');
  }
}

export const elevenLabsService = new ElevenLabsService();
