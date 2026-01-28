import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

/**
 * Interface for Qwen TTS parameters
 */
export interface QwenTTSOptions {
  model?: string;
  voice?: string;
  format?: 'mp3' | 'wav' | 'pcm';
  sample_rate?: number;
  volume?: number;
  rate?: number;
  pitch?: number;
}

@injectable()
export class QwenTTSService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://dashscope-intl.aliyuncs.com/api/v1'; // International endpoint

  constructor() {
    this.apiKey = env.DASHSCOPE_API_KEY || '';
  }

  /**
   * Generates audio from text using Qwen3-TTS and saves it to a file
   * @param text The text to synthesize
   * @param outputPath Full path where the audio file will be saved
   * @param options Optional synthesis parameters
   */
  async textToSpeech(
    text: string,
    outputPath: string,
    options: QwenTTSOptions = {}
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error('DASHSCOPE_API_KEY is not configured.');
      }

      logger.info(`[QwenTTSService] Synthesizing voice (Qwen3-TTS) for: "${text.substring(0, 30)}..."`);

      const model = options.model || 'qwen3-tts-1.7b';
      const voice = options.voice || env.QWEN_TTS_VOICE_ID || 'longxiaomiao';
      const format = options.format || 'mp3';

      const response = await axios.post(
        `${this.baseUrl}/services/aigc/text-to-speech/synthesis`,
        {
          model,
          input: {
            text,
          },
          parameters: {
            voice,
            format,
            sample_rate: options.sample_rate || 16000,
            volume: options.volume || 50,
            rate: options.rate || 1.0,
            pitch: options.pitch || 1.0,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable',
          },
          responseType: 'arraybuffer',
        }
      );

      const buffer = Buffer.from(response.data);

      // Ensure directory exists
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(outputPath, buffer);

      logger.info(`[QwenTTSService] Audio saved to: ${outputPath}`);
      return outputPath;
    } catch (error: any) {
      const errorMessage = error.response?.data 
        ? Buffer.from(error.response.data).toString() 
        : error.message;
        
      logger.error('[QwenTTSService] Synthesis failed:', errorMessage);
      throw new Error(`Qwen3 TTS failed: ${error.message}`);
    }
  }

  /**
   * List available voices (Note: DashScope might not have a direct endpoint for this via public API, 
   * usually it's documented in their console. This is a placeholder for future extension.)
   */
  async getVoices(): Promise<string[]> {
    // Standard voices: longxiaomiao, longxiaolan, longxiaoying, etc.
    return ['longxiaomiao', 'longxiaolan', 'longxiaoying', 'longxiaoxia', 'longxiaomeng'];
  }
}
