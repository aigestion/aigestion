import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

/**
 * Whisper STT Service - Speech-to-Text using OpenAI Whisper
 * Alternativa gratuita para transcripción de voz
 */
export class WhisperSTTService {
  private readonly modelSize: 'tiny' | 'base' | 'small' | 'medium' | 'large';
  private readonly language = 'es';

  constructor(modelSize: 'tiny' | 'base' | 'small' | 'medium' | 'large' = 'base') {
    this.modelSize = modelSize;
  }

  /**
   * Transcribe audio file to text using Whisper
   * @param audioPath Path to audio file
   * @param language Language code (default: 'es' for Spanish)
   * @returns Transcribed text
   */
  async transcribe(audioPath: string, language?: string): Promise<string> {
    try {
      logger.info(`[WhisperSTT] Transcribing audio: ${audioPath}`);

      // Check if file exists
      await fs.access(audioPath);

      const lang = language || this.language;

      // Run Whisper command
      const command = `whisper "${audioPath}" --model ${this.modelSize} --language ${lang} --output_format txt --output_dir /tmp`;

      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      if (stderr && !stderr.includes('Detecting language')) {
        logger.warn('[WhisperSTT] Warning:', stderr);
      }

      // Read the generated text file
      const baseName = path.basename(audioPath, path.extname(audioPath));
      const txtPath = `/tmp/${baseName}.txt`;

      const transcription = await fs.readFile(txtPath, 'utf-8');

      // Clean up temp file
      await fs.unlink(txtPath).catch(() => {});

      logger.info(`[WhisperSTT] Transcription complete: "${transcription.substring(0, 50)}..."`);

      return transcription.trim();

    } catch (error: any) {
      logger.error('[WhisperSTT] Error transcribing audio:', error.message);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  /**
   * Transcribe audio using Python API (alternative method)
   */
  async transcribeWithPython(audioPath: string): Promise<string> {
    try {
      const pythonScript = `
import whisper
import sys

model = whisper.load_model("${this.modelSize}")
result = model.transcribe("${audioPath}", language="${this.language}")
print(result["text"])
      `.trim();

      const { stdout } = await execAsync(`python -c '${pythonScript}'`);
      return stdout.trim();

    } catch (error: any) {
      logger.error('[WhisperSTT] Python transcription error:', error.message);
      throw error;
    }
  }

  /**
   * Check if Whisper is installed
   */
  async isInstalled(): Promise<boolean> {
    try {
      await execAsync('whisper --help');
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
To install Whisper:
1. pip install openai-whisper
2. Test: whisper audio.mp3 --model base --language es

For more info: https://github.com/openai/whisper
    `.trim();
  }

  /**
   * Get available models info
   */
  getModelsInfo(): Record<string, { size: string; speed: string; accuracy: string }> {
    return {
      tiny: { size: '39 MB', speed: '~32x', accuracy: 'Low' },
      base: { size: '74 MB', speed: '~16x', accuracy: 'Medium' },
      small: { size: '244 MB', speed: '~6x', accuracy: 'Good' },
      medium: { size: '769 MB', speed: '~2x', accuracy: 'Very Good' },
      large: { size: '1550 MB', speed: '~1x', accuracy: 'Best' },
    };
  }
}

export const whisperSTTService = new WhisperSTTService('base');
