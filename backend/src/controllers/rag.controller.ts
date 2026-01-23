import { Request, Response } from 'express';
import { controller, httpPost, interfaces, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { RagService } from '../services/rag.service';
import { logger } from '../utils/logger';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

import { malwareScanner } from '../middleware/malware-scanner.middleware';

@controller('/rag')
export class RagController implements interfaces.Controller {
  constructor(@inject(TYPES.RagService) private ragService: RagService) { }

  @httpPost('/ingest', malwareScanner.uploadSingle('file'))
  async ingestDocument(@request() req: Request, @response() res: Response) {
    try {
      const request = req as any;
      if (!request.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = request.file;
      const content = file.buffer.toString('utf-8'); // Assuming text-based files for now
      const filename = file.originalname;

      logger.info(`[RagController] Received ingestion request for ${filename}`);

      await this.ragService.ingestDocument(filename, content);

      return res.json({ status: 'success', message: `${filename} ingested successfully` });
    } catch (error) {
      logger.error('[RagController] Ingestion failed:', error);
      return res.status(500).json({ error: 'Ingestion failed' });
    }
  }

  @httpPost('/query')
  async query(@request() req: Request, @response() res: Response) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const context = await this.ragService.queryKnowledgeBase(query);

      return res.json({ status: 'success', data: context });
    } catch (error) {
      logger.error('[RagController] Query failed:', error);
      return res.status(500).json({ error: 'Query failed' });
    }
  }
}
