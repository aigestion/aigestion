import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { buildResponse, buildError } from '../common/response-builder';
import { ContentFactoryService } from '../services/content-factory.service';

const contentRouter = Router();

/**
 * @openapi
 * /content/generate:
 *   post:
 *     summary: Generate script and voice for short-form content
 *     tags: [Content]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               tone:
 *                 type: string
 *               platform:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content generated successfully
 */
contentRouter.post('/generate', async (req: any, res: any) => {
  const requestId = req.requestId;
  const { topic, tone, platform } = req.body;

  if (!topic) {
    return res.status(400).json(buildError('Topic is required', 'INVALID_REQUEST', 400, requestId));
  }

  try {
    const factory = container.get<ContentFactoryService>(TYPES.ContentFactoryService);
    const result = await factory.createShortFormContent({
      topic,
      tone,
      targetPlatform: platform,
    });

    return res.json(buildResponse(result, 200, requestId));
  } catch (error: any) {
    console.error('Content Generation Failed:', error);
    return res
      .status(500)
      .json(buildError('Failed to generate content', 'GENERATION_ERROR', 500, requestId));
  }
});

export default contentRouter;
