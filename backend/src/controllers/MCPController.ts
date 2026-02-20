import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MCPDiscoveryService } from '../services/MCPDiscoveryService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

@injectable()
export class MCPController {
  constructor(@inject(TYPES.MCPDiscoveryService) private mcpService: MCPDiscoveryService) {}

  public async getDirectory(req: Request, res: Response, next: NextFunction) {
    try {
      const servers = await this.mcpService.getDirectory();
      res.json(buildResponse(servers, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to get directory', error);
      next(error);
    }
  }

  public async activateServer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await this.mcpService.activateServer(id);
      res.json(buildResponse({ success }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to activate server', error);
      next(error);
    }
  }

  public async revokeServer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await this.mcpService.revokeServer(id);
      res.json(buildResponse({ success }, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to revoke server', error);
      next(error);
    }
  }

  public async registerLocal(req: Request, res: Response, next: NextFunction) {
    try {
      const server = await this.mcpService.registerServer(req.body);
      res.json(buildResponse(server, 201, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to register local server', error);
      next(error);
    }
  }

  public async checkHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const health = await this.mcpService.checkHealth(id);
      res.json(buildResponse(health, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to check health', error);
      next(error);
    }
  }

  public async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const server = await this.mcpService.syncCapabilities(id);
      res.json(buildResponse(server, 200, (req as any).requestId));
    } catch (error) {
      logger.error('[MCPController] Failed to sync capabilities', error);
      next(error);
    }
  }
}
