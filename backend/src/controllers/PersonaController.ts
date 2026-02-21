import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { PersonaMarketplaceService } from '../services/PersonaMarketplaceService';
import { CreatePersonaUseCase } from '../application/usecases/persona/CreatePersonaUseCase';
import { GetMarketplacePersonasUseCase } from '../application/usecases/persona/GetMarketplacePersonasUseCase';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class PersonaController {
  constructor(
    @inject(TYPES.PersonaMarketplaceService)
    private readonly marketplaceService: PersonaMarketplaceService,
    @inject(TYPES.CreatePersonaUseCase) private readonly createPersonaUseCase: CreatePersonaUseCase,
    @inject(TYPES.GetMarketplacePersonasUseCase)
    private readonly getMarketplacePersonasUseCase: GetMarketplacePersonasUseCase,
  ) {}

  public async getMarketplace(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number.parseInt(req.query.limit as string) || 20;
      const offset = Number.parseInt(req.query.offset as string) || 0;
      const result = await this.getMarketplacePersonasUseCase.execute(limit, offset);
      res.json(buildResponse(result, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[PersonaController] Failed to get marketplace', error);
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'nexus_god'; // Consistent with hire fallback
      const persona = await this.createPersonaUseCase.execute({
        ...req.body,
        ownerId: userId,
      });

      res.status(201).json(buildResponse({ persona }, 201, (req as any).requestId));
    } catch (error) {
      logger.error('[PersonaController] Failed to create persona', error);
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
