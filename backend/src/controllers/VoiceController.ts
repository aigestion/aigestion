import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { z } from 'zod';
import { buildResponse } from '../common/response-builder';
import { validate } from '../middleware/validation.middleware';
import { ElevenLabsService } from '../services/elevenlabs.service';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

@injectable()
export class VoiceController {
  constructor(
    @inject(TYPES.ElevenLabsService) private elevenLabsService: ElevenLabsService
  ) {}

  /**
   * 🌌 [GOD MODE] Text-to-Speech Proxy
   * Converts text to premium audio using ElevenLabs and streams it back.
   */
  public tts = [
    validate({
      body: z.object({
        text: z.string().min(1).max(5000),
        voiceId: z.string().optional(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { text, voiceId } = req.body;
        const finalVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || 'eleven_monica';
        
        logger.info(`[VoiceController] 🌌 Synthesizing voice for text: "${text.substring(0, 50)}..."`);

        // Use streaming for low latency if possible, or simple file delivery
        const tempFileName = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
        const tempPath = path.join(process.cwd(), 'uploads', 'voice', tempFileName);

        await this.elevenLabsService.textToSpeech(text, finalVoiceId, tempPath);

        // Stream the file back to the client
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${tempFileName}"`);
        
        const readStream = fs.createReadStream(tempPath);
        readStream.pipe(res);

        readStream.on('end', () => {
          // Cleanup after streaming
          fs.unlink(tempPath, (err) => {
            if (err) logger.error(`[VoiceController] Failed to delete temp file: ${tempPath}`, err);
          });
        });

      } catch (err) {
        logger.error('[VoiceController] TTS failed', err);
        next(err);
      }
    },
  ];

  /**
   * 📋 Get available voices
   */
  public getVoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const voices = await this.elevenLabsService.getVoices();
      res.json(buildResponse(voices, 200, (req as any).requestId || 'unknown'));
    } catch (err) {
      next(err);
    }
  };
}
