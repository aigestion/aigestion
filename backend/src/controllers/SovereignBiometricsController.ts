import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../types';
import { VoiceBiometricsService } from '../services/VoiceBiometricsService';
import { logger } from '../utils/logger';
import { setCache, getCache } from '../cache/redis';

@controller('/auth/sovereign/biometrics')
export class SovereignBiometricsController {
  constructor(@inject(TYPES.VoiceBiometricsService) private voiceService: VoiceBiometricsService) {}

  /**
   * Enrolls a user's voiceprint.
   * Expects a base64 encoded audio buffer in the body.
   */
  @httpPost('/enroll-voice')
  public async enrollVoice(@request() req: Request, @response() res: Response) {
    try {
      const { audio, userId } = req.body;
      if (!audio) return res.status(400).json({ error: 'Missing audio data' });

      const audioBuffer = Buffer.from(audio, 'base64');
      const voiceHash = await this.voiceService.generateVoiceHash(audioBuffer);

      // Store the voiceprint in a persistent way (mocked with Redis for now, should be in User DB)
      // In a real implementation, we'd associate this with the Sovereign Identity.
      await setCache(`sovereign:voiceprint:${userId || 'default'}`, voiceHash);

      logger.info({ userId }, '[SovereignBiometrics] Voice enrolled successfully');

      return res.json({
        success: true,
        message: 'Voiceprint enrolled and locked in vault.',
        voiceHash: voiceHash.substring(0, 10) + '...',
      });
    } catch (error) {
      logger.error('[SovereignBiometrics] Enrollment failed:', error);
      return res.status(500).json({ error: 'Biometric enrollment failed' });
    }
  }

  /**
   * Verifies a voice challenge.
   */
  @httpPost('/verify-voice')
  public async verifyVoice(@request() req: Request, @response() res: Response) {
    try {
      const { audio, userId } = req.body;
      if (!audio) return res.status(400).json({ error: 'Missing audio data' });

      const storedHash = await getCache<string>(`sovereign:voiceprint:${userId || 'default'}`);
      if (!storedHash) {
        return res.status(404).json({ error: 'No voiceprint found for this user' });
      }

      const audioBuffer = Buffer.from(audio, 'base64');
      const isValid = await this.voiceService.verifyVoiceprint(storedHash, audioBuffer);

      if (!isValid) {
        return res.status(401).json({ error: 'Biometric mismatch' });
      }

      return res.json({
        success: true,
        message: 'Voice identity verified.',
      });
    } catch (error) {
      logger.error('[SovereignBiometrics] Verification failed:', error);
      return res.status(500).json({ error: 'Biometric verification failed' });
    }
  }
}
