import { Request, Response, Router } from 'express';
import { buildError, buildResponse } from '../common/response-builder';
import { container } from '../config/inversify.config';
import { NewsService } from '../services/news.service';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

const newsRouter = Router();

const getNewsService = () => container.get<NewsService>(TYPES.NewsService);

/**
 * @openapi
 * /api/v1/news:
 *   get:
 *     summary: Get all daily news
 */
newsRouter.get('/', async (req: Request, res: Response) => {
  const requestId = (req as any).requestId;
  try {
    const news = await getNewsService().getAllNews();
    res.json(buildResponse(news, 200, requestId));
  } catch (error) {
    logger.error('[NewsController] Error getting news:', error);
    res.status(500).json(buildError('Failed to fetch news', 'NEWS_FETCH_ERROR', 500, requestId));
  }
});

/**
 * @openapi
 * /api/v1/news/ingest:
 *   post:
 *     summary: Ingest news from URLs
 */
newsRouter.post('/ingest', async (req: Request, res: Response) => {
  const requestId = (req as any).requestId;
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res
      .status(400)
      .json(buildError('Invalid URLs provided', 'INVALID_INPUT', 400, requestId));
  }

  try {
    const newItems = await getNewsService().ingestNews(urls);
    res.json(buildResponse(newItems, 201, requestId));
  } catch (error) {
    logger.error('[NewsController] Error ingesting news:', error);
    res.status(500).json(buildError('Failed to ingest news', 'INGEST_ERROR', 500, requestId));
  }
});

/**
 * @openapi
 * /api/v1/news/:id:
 *   patch:
 *     summary: Update a news item
 */
newsRouter.patch('/:id', async (req: Request, res: Response) => {
  const requestId = (req as any).requestId;
  const { id } = req.params as any;
  const updates = req.body;

  try {
    const updated = await getNewsService().updateNewsItem(id, updates);
    if (!updated) {
      return res.status(404).json(buildError('News item not found', 'NOT_FOUND', 404, requestId));
    }
    res.json(buildResponse(updated, 200, requestId));
  } catch (error) {
    logger.error('[NewsController] Error updating news:', error);
    res.status(500).json(buildError('Failed to update news', 'UPDATE_ERROR', 500, requestId));
  }
});

/**
 * @openapi
 * /api/v1/news/:id:
 *   delete:
 *     summary: Delete a news item
 */
newsRouter.delete('/:id', async (req: Request, res: Response) => {
  const requestId = (req as any).requestId;
  const { id } = req.params as any;

  try {
    const deleted = await getNewsService().deleteNews(id);
    if (!deleted) {
      return res.status(404).json(buildError('News item not found', 'NOT_FOUND', 404, requestId));
    }
    res.json(buildResponse({ success: true }, 200, requestId));
  } catch (error) {
    logger.error('[NewsController] Error deleting news:', error);
    res.status(500).json(buildError('Failed to delete news', 'DELETE_ERROR', 500, requestId));
  }
});

export default newsRouter;
