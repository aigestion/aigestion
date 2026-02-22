import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MetaverseService } from '../services/metaverse.service';
import { ForgeGem } from '../services/gems/ForgeGem';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class ForgeController {
  constructor(
    @inject(TYPES.MetaverseService) private readonly metaverse: MetaverseService,
    @inject(TYPES.ForgeGem) private readonly forgeGem: ForgeGem
  ) {
    this.createRequest = this.createRequest.bind(this);
    this.executeTask = this.executeTask.bind(this);
  }

  /**
   * Directly creates a forge request file.
   */
  public async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, description } = req.body;
      const requestId = (req as any).requestId || 'unknown';

      logger.info({ id, name }, '[ForgeController] Manual Forge Request created');
      await this.metaverse.requestObjectForge(id, name, description);

      res.json(buildResponse({ status: 'queued', id }, 200, requestId));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Triggers the Python orchestrator for a specific task.
   */
  public async executeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const requestId = (req as any).requestId || 'unknown';

      const result = await this.metaverse.executeForgeTask(id);

      res.json(buildResponse({ 
        success: result.success,
        output: result.output.split('\n').slice(-5).join('\n') // Return last 5 lines
      }, result.success ? 200 : 500, requestId));
    } catch (error) {
      next(error);
    }
  }
}
