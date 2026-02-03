import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

/**
 * Coqui TTS Service - Open Source Text-to-Speech
 * Alternativa gratuita a ElevenLabs
 */
export class CoquiTTSService {
  private readonly defaultModel = 'tts_models/es/css10/vits';
  private readonly outputDir = path.join(__dirname, '../../uploads/audio');

  constructor() {
    this.ensureOutputDir();
  }

  private async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      logger.error('Error creating output directory:', error);
    }
  }

  /**
   * Convert text to speech using Coqui TTS
   * @param text Text to convert to speech
   * @param outputPath Optional custom output path
   * @param voiceModel Optional voice model (default: Spanish)
   * @returns Path to generated audio file
   */
  async textToSpeech(
    text: string,
    outputPath?: string,
    voiceModel?: string
  ): Promise<string> {
    try {
      const model = voiceModel || this.defaultModel;
      const finalOutputPath = outputPath || path.join(
        this.outputDir,
        `tts_${Date.now()}.wav`
      );

      logger.info(`[CoquiTTS] Generating speech for: "${text.substring(0, 50)}..."`);

      // Escape text for shell
      const escapedText = text.replace(/"/g, '\\"');

      // Run Coqui TTS command
      const command = `tts --text "${escapedText}" --model_name "${model}" --out_path "${finalOutputPath}"`;

      const { stdout, stderr } = await execAsync(command);

      if (stderr && !stderr.includes('Loading')) {
        logger.warn('[CoquiTTS] Warning:', stderr);
      }

      logger.info(`[CoquiTTS] Audio generated successfully: ${finalOutputPath}`);
      return finalOutputPath;

    } catch (error: any) {
      logger.error('[CoquiTTS] Error generating speech:', error.message);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  /**
   * List available Coqui TTS models
   */
  async listModels(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('tts --list_models');
      const models = stdout
        .split('\n')
        .filter(line => line.includes('tts_models'))
        .map(line => line.trim());

      return models;
    } catch (error: any) {
      logger.error('[CoquiTTS] Error listing models:', error.message);
      return [];
    }
  }

  /**
   * Check if Coqui TTS is installed
   */
  async isInstalled(): Promise<boolean> {
    try {
      await execAsync('tts --help');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get installation instructions
   */
  getInstallInstructions(): string {
    return `
To install Coqui TTS:
1. pip install TTS
2. Test: tts --text "Hola" --model_name "tts_models/es/css10/vits" --out_path test.wav

For more info: https://github.com/coqui-ai/TTS
    `.trim();
  }
}

export const coquiTTSService = new CoquiTTSService();
