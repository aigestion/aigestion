import { Request, Response } from 'express';
import { controller, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { LandingPersonalizationService } from '../services/LandingPersonalizationService';
import { logger } from '../utils/logger';

@controller('/api/v1/landing')
export class LandingController {
  constructor(
    @inject(TYPES.LandingPersonalizationService)
    private readonly personalizationService: LandingPersonalizationService,
  ) {}

  @httpGet('/personalization')
  public async getPersonalization(
    @queryParam('source') source: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const personalization = await this.personalizationService.getPersonalization(source);
      res.status(200).json(personalization);
    } catch (error) {
      logger.error('Error fetching landing personalization:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
