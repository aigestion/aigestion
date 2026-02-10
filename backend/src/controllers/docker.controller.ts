import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DockerService } from '../infrastructure/docker/DockerService';
import { buildResponse } from '../common/response-builder';

@injectable()
export class DockerController {
  constructor(@inject(TYPES.DockerService) private dockerService: DockerService) {}

  public async getContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const containers = await this.dockerService.getContainers();
      res.json(buildResponse({ data: containers }, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  }

  public async getContainerStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const stats = await this.dockerService.getContainerStats(id);
      res.json(buildResponse({ data: stats }, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  }

  public async startContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.dockerService.startContainer(id);
      res.json(buildResponse({ message: `Container ${id} started` }, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  }

  public async stopContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.dockerService.stopContainer(id);
      res.json(buildResponse({ message: `Container ${id} stopped` }, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  }
}
