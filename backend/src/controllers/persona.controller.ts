import type { NextFunction, Request, Response } from 'express'; // using express types directly often simpler, or express-serve-static-core
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import type { CreatePersonaUseCase } from '../application/usecases/persona/CreatePersonaUseCase';
import type { GetMarketplacePersonasUseCase } from '../application/usecases/persona/GetMarketplacePersonasUseCase';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { buildResponse } from '../common/response-builder';

export const createPersona = [
  validate({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().min(1, 'Description is required'),
      systemPrompt: z.string().min(1, 'System Prompt is required'),
      voiceSettings: z.object({
        provider: z.string().min(1, 'Voice provider is required'),
        voiceId: z.string().min(1, 'Voice ID is required'),
        settings: z.any().optional(),
      }),
      price: z.number().min(0).optional(),
      isPublic: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    })
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createPersonaUseCase = container.get<CreatePersonaUseCase>(TYPES.CreatePersonaUseCase);
      const persona = await createPersonaUseCase.execute({
        ...req.body,
        ownerId: (req as any).user.id,
      });

      res.status(201).json(buildResponse({ persona }, 201, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  }
];

export const getMarketplacePersonas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getMarketplacePersonasUseCase = container.get<GetMarketplacePersonasUseCase>(TYPES.GetMarketplacePersonasUseCase);
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await getMarketplacePersonasUseCase.execute(limit, offset);

    res.status(200).json(buildResponse(result, 200, (req as any).requestId));
  } catch (error) {
    next(error);
  }
};
