import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AstraeaService } from '../services/AstraeaService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
  requestId?: string;
}


@injectable()
export class AstraeaController {
  constructor(
    @inject(TYPES.AstraeaService) private readonly astraeaService: AstraeaService,
  ) {}

  public async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { location } = req.body as { location?: { lat: number; lng: number } };
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id || 'nexus_god';

      const session = await this.astraeaService.startSovereignSession(userId, location);
      res.json(buildResponse(session, 200, authReq.requestId || ''));
    } catch (error) {
      logger.error('[AstraeaController] Failed to start session', error);
      next(error);
    }
  }

  public async induceCall(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber } = req.body as { phoneNumber: string };
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id || 'nexus_god';

      const result = await this.astraeaService.induceCall(userId, phoneNumber);
      res.json(buildResponse(result, 200, authReq.requestId || ''));
    } catch (error) {
      logger.error('[AstraeaController] Failed to induce call', error);
      next(error);
    }
  }
}
