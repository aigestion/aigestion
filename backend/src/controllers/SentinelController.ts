import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { SovereignSentinelService } from '../services/SovereignSentinelService';
import { VoiceBiometricsService } from '../services/VoiceBiometricsService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class SentinelController {
  constructor(
    @inject(TYPES.SovereignSentinelService) private sentinel: SovereignSentinelService,
    @inject(TYPES.VoiceBiometricsService) private biometrics: VoiceBiometricsService,
  ) {}

  public async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const forecasts = await this.sentinel.getResourceForecasts();
      res.json(
        buildResponse({ forecasts, systemStatus: 'PROTECTED' }, 200, (req as any).requestId),
      );
    } catch (error) {
      logger.error('[SentinelController] Failed to get status', error);
      next(error);
    }
  }

  public async getForecast(res: Response) {
    try {
      const forecasts = await this.sentinel.getResourceForecasts();
      res.json(buildResponse({ forecasts }, 200, 'INTERNAL_REQUEST'));
    } catch (error) {
      logger.error('[SentinelController] Failed to get forecast', error);
      res
        .status(500)
        .json(buildResponse({ error: 'Forecast calculation failed' }, 500, 'INTERNAL_REQUEST'));
    }
  }

  public async requestChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      // Generate a one-time challenge token for the voice challenge
      const challengeToken = `SEC_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      res.json(
        buildResponse(
          { challengeToken, instructions: 'Please recite the challenge token clearly.' },
          200,
          (req as any).requestId,
        ),
      );
    } catch (error) {
      logger.error('[SentinelController] Challenge generation failed', error);
      next(error);
    }
  }

  public async verifyBiometric(req: Request, res: Response, next: NextFunction) {
    try {
      const { audioBase64, storedHash } = req.body;
      if (!audioBase64) throw new Error('Missing audio data');

      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const isValid = await this.biometrics.verifyVoiceprint(
        storedHash || 'MASTER_SOVEREIGN_HASH',
        audioBuffer,
      );

      if (isValid) {
        logger.info(
          '🛡️ [Sentinel] Biometric verification SUCCESS. Granting temporary God-Mode access.',
        );
        res.json(
          buildResponse(
            { status: 'AUTHORIZED', token: 'GOD_MODE_TEMP_SESSION' },
            200,
            (req as any).requestId,
          ),
        );
      } else {
        logger.warn('🚫 [Sentinel] Biometric verification FAILED. Alerting Security Guardian.');
        res
          .status(403)
          .json(
            buildResponse(
              { status: 'DENIED', error: 'Biometric mismatch detected.' },
              403,
              (req as any).requestId,
            ),
          );
      }
    } catch (error) {
      logger.error('[SentinelController] Verification failed', error);
      next(error);
    }
  }
}
