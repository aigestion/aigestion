import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

/**
 * GOOGLE SPEECH SERVICE — God Level Vocals & Audition
 * High-fidelity STT (transcription) and TTS (synthesis).
 */
@injectable()
export class GoogleSpeechService {
  private sttClient: SpeechClient | null = null;
  private ttsClient: TextToSpeechClient | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initializeClients();
  }

  private async initializeClients() {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        this.sttClient = new SpeechClient();
        this.ttsClient = new TextToSpeechClient();
        logger.info('[GoogleSpeech] ✅ Initialized STT and TTS clients');
      } else {
        logger.warn('[GoogleSpeech] No credentials found — service inactive');
      }
    } catch (error: any) {
      logger.error(`[GoogleSpeech] Init failure: ${error.message}`);
    }
  }

  private async getSttClient(): Promise<SpeechClient> {
    if (this.initPromise) await this.initPromise;
    if (!this.sttClient) throw new Error('STT client not initialized');
    return this.sttClient;
  }

  private async getTtsClient(): Promise<TextToSpeechClient> {
    if (this.initPromise) await this.initPromise;
    if (!this.ttsClient) throw new Error('TTS client not initialized');
    return this.ttsClient;
  }

  // ─────────────────────────────────────────────────────────────
  // TEXT TO SPEECH (TTS)
  // ─────────────────────────────────────────────────────────────

  /**
   * Synthesizes text into audio (MP3).
   */
  async textToSpeech(
    text: string,
    options: {
      languageCode?: string;
      ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
      voiceName?: string;
    } = {},
  ): Promise<Buffer> {
    const client = await this.getTtsClient();
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: options.languageCode || 'es-ES',
        ssmlGender: options.ssmlGender || 'FEMALE',
        name: options.voiceName,
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    return response.audioContent as Buffer;
  }

  // ─────────────────────────────────────────────────────────────
  // SPEECH TO TEXT (STT)
  // ─────────────────────────────────────────────────────────────

  /**
   * Transcribes short audio (synchronous).
   */
  async speechToText(
    audioContent: Buffer | string,
    options: {
      languageCode?: string;
      encoding?: 'LINEAR16' | 'FLAC' | 'OGG_OPUS' | 'MULAW';
      sampleRateHertz?: number;
    } = {},
  ): Promise<string> {
    const client = await this.getSttClient();
    const response = await client.recognize({
      config: {
        encoding: options.encoding || 'LINEAR16',
        sampleRateHertz: options.sampleRateHertz || 16000,
        languageCode: options.languageCode || 'es-ES',
      },
      audio: {
        content: Buffer.isBuffer(audioContent) ? audioContent.toString('base64') : audioContent,
      },
    });

    const results = response[0]?.results;
    return results?.map((result: any) => result.alternatives?.[0]?.transcript).join('\n') || '';
  }

  /**
   * Starts a long-running transcription for large files.
   */
  async longRunningRecognize(gcsUri: string, languageCode = 'es-ES') {
    const client = await this.getSttClient();
    const [operation] = await client.longRunningRecognize({
      config: { languageCode },
      audio: { uri: gcsUri },
    });

    logger.info(`[GoogleSpeech] 🚀 Started long-running transcription: ${operation.name}`);
    return operation.name;
  }
}
