import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { SwarmService } from '../services/swarm.service';
import { logger } from '../utils/logger';
import { buildResponse, buildError } from '../common/response-builder';

@injectable()
export class SwarmController {
  public router: Router;

  constructor(
    @inject(TYPES.SwarmService) private swarmService: SwarmService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/tool-call', this.executeTool.bind(this));
    this.router.get('/god-state', this.getGodState.bind(this));
    this.router.post('/missions', this.createMission.bind(this));
    this.router.get('/missions/:id', this.getMission.bind(this));
  }

  private async createMission(req: Request, res: Response) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { objective } = req.body;
      const userId = (req as any).user?.id || 'system';

      if (!objective) {
        return res.status(400).json(buildError('objective is required', 'BAD_REQUEST', 400, requestId));
      }

      const result = await this.swarmService.createMission(objective, userId);
      return res.json(buildResponse(result, 200, requestId));
    } catch (error) {
      logger.error('[SwarmController] Error creating mission:', error);
      return res.status(500).json(buildError(
        error instanceof Error ? error.message : 'Unknown error',
        'INTERNAL_ERROR',
        500,
        requestId
      ));
    }
  }

  private async executeTool(req: Request, res: Response) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { tool_name, args } = req.body;

      if (!tool_name) {
        return res.status(400).json(buildError('tool_name is required', 'BAD_REQUEST', 400, requestId));
      }

      const result = await this.swarmService.executeTool(tool_name, args || {});
      return res.json(buildResponse(result, 200, requestId));
    } catch (error) {
      logger.error('[SwarmController] Error executing tool:', error);
      return res.status(500).json(buildError(
        error instanceof Error ? error.message : 'Unknown error',
        'INTERNAL_ERROR',
        500,
        requestId
      ));
    }
  }

  private async getGodState(req: Request, res: Response) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const godState = await this.swarmService.getGodState();
      return res.json(buildResponse(godState, 200, requestId));
    } catch (error) {
      logger.error('[SwarmController] Error fetching God State:', error);
      return res.status(500).json(buildError('Failed to fetch God State', 'INTERNAL_ERROR', 500, requestId));
    }
  }

  private async getMission(req: Request, res: Response) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { id } = req.params as any;
      const mission = await this.swarmService.getMission(id);
      return res.json(buildResponse(mission, 200, requestId));
    } catch (error) {
      logger.error('[SwarmController] Error fetching mission:', error);
      return res.status(404).json(buildError(
        error instanceof Error ? error.message : 'Mission not found',
        'NOT_FOUND',
        404,
        requestId
      ));
    }
  }
}
