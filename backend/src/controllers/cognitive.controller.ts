import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { GoogleVisionService } from '../services/google/google-vision.service';
import { GoogleSpeechService } from '../services/google/google-speech.service';
import { logger } from '../utils/logger';

@injectable()
export class CognitiveController {
  constructor(
    @inject(TYPES.GoogleVisionService) private readonly vision: GoogleVisionService,
    @inject(TYPES.GoogleSpeechService) private readonly speech: GoogleSpeechService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // VISION AI
  // ─────────────────────────────────────────────────────────────

  async analyzeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { image, isUrl } = req.body; // image can be base64 string or path
      if (!image) return res.status(400).json({ error: 'Missing image input' });

      const analysis = await this.vision.analyzeImage(image);
      res.json(analysis);
    } catch (error: any) {
      logger.error(`[Cognitive] Vision failure: ${error.message}`);
      next(error);
    }
  }

  async detectOCR(req: Request, res: Response, next: NextFunction) {
    try {
      const { image } = req.body;
      const text = await this.vision.detectText(image);
      res.json({ text });
    } catch (error: any) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SPEECH
  // ─────────────────────────────────────────────────────────────

  async textToSpeech(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, languageCode, voiceName, gender } = req.body;
      if (!text) return res.status(400).json({ error: 'Missing text for synthesis' });

      const audioBuffer = await this.speech.textToSpeech(text, {
        languageCode,
        voiceName,
        ssmlGender: gender,
      });

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
      });
      res.send(audioBuffer);
    } catch (error: any) {
      logger.error(`[Cognitive] TTS failure: ${error.message}`);
      next(error);
    }
  }

  async speechToText(req: Request, res: Response, next: NextFunction) {
    try {
      const { audio, languageCode, encoding, sampleRate } = req.body;
      if (!audio) return res.status(400).json({ error: 'Missing audio content' });

      const transcript = await this.speech.speechToText(audio, {
        languageCode,
        encoding,
        sampleRateHertz: sampleRate,
      });

      res.json({ transcript });
    } catch (error: any) {
      logger.error(`[Cognitive] STT failure: ${error.message}`);
      next(error);
    }
  }
}
