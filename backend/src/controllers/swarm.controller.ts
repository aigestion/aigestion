import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { SwarmService } from '../services/swarm.service';
import { logger } from '../utils/logger';
import { buildResponse, buildError } from '../common/response-builder';

@injectable()
export class SwarmController {
  constructor(@inject(TYPES.SwarmService) private swarmService: SwarmService) {}

  public async createMission(req: Request, res: Response, next: any) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { objective } = req.body;
      const userId = (req as any).user?.id || 'system';

      if (!objective) {
        return res
          .status(400)
          .json(buildError('objective is required', 'BAD_REQUEST', 400, requestId));
      }

      const result = await this.swarmService.createMission(objective, userId);
      return res.json(buildResponse(result, 200, requestId));
    } catch (error) {
      next(error);
    }
  }

  public async executeTool(req: Request, res: Response, next: any) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { tool_name, args } = req.body;

      if (!tool_name) {
        return res
          .status(400)
          .json(buildError('tool_name is required', 'BAD_REQUEST', 400, requestId));
      }

      const result = await this.swarmService.executeTool(tool_name, args || {});
      return res.json(buildResponse(result, 200, requestId));
    } catch (error) {
      next(error);
    }
  }

  public async getGodState(req: Request, res: Response, next: any) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const godState = await this.swarmService.getGodState();
      return res.json(buildResponse(godState, 200, requestId));
    } catch (error) {
      next(error);
    }
  }

  public async getMission(req: Request, res: Response, next: any) {
    const requestId = (req as any).requestId || 'unknown';
    try {
      const { id } = req.params as any;
      const mission = await this.swarmService.getMission(id);
      return res.json(buildResponse(mission, 200, requestId));
    } catch (error) {
      next(error);
    }
  }
}
