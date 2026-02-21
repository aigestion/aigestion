import { Request, Response, NextFunction } from 'express';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { VisionService } from '../services/vision.service';
import { VisualPerceptionService } from '../services/google/visual-perception.service';

@controller('/vision')
export class VisionController {
  constructor(
    @inject(TYPES.VisionService) private visionService: VisionService,
    @inject(TYPES.VisualPerceptionService) private visualPerception: VisualPerceptionService,
  ) {}

  @httpPost('/analyze-architecture')
  async analyzeArchitecture(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl, focus } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }
      const result = await this.visionService.analyzeArchitecture(imageUrl, focus);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/audit-security')
  async auditSecurity(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl, text } = req.body;
      const result = await this.visionService.auditSecurity({ imageUrl, text });
      res.json({ result });
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/dashboard-audit')
  async dashboardAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }
      const result = await this.visualPerception.auditDashboardView(imageUrl);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
