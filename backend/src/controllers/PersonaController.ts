import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { PersonaMarketplaceService } from '../services/PersonaMarketplaceService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class PersonaController {
  constructor(
    @inject(TYPES.PersonaMarketplaceService) private marketplaceService: PersonaMarketplaceService,
  ) {}

  public async getMarketplace(req: Request, res: Response, next: NextFunction) {
    try {
      const personas = await this.marketplaceService.getPersonas();
      res.json(buildResponse(personas, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PersonaController] Failed to get marketplace', error);
      next(error);
    }
  }

  public async hire(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 'nexus_god'; // Fallback for dev
      const persona = await this.marketplaceService.hirePersona(userId, id);
      res.json(buildResponse(persona, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PersonaController] Failed to hire persona', error);
      next(error);
    }
  }

  public async rate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const persona = await this.marketplaceService.ratePersona(id, rating);
      res.json(buildResponse(persona, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PersonaController] Failed to rate persona', error);
      next(error);
    }
  }
}
