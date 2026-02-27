import { Router } from 'express';
import multer from 'multer';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { RagService } from '../services/rag.service';
import { logger } from '../utils/logger';

const router = Router();
const upload = multer();

/**
 * @openapi
 * /rag/query:
 *   post:
 *     summary: Query the hybrid knowledge base (Cloud + Local + Code)
 *     tags: [RAG]
 */
router.post('/query', (req: any, res: any, next: any) => {
  (async () => {
    const { query } = (req as any).body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }

    try {
      const ragService = container.get<RagService>(TYPES.RagService);
      const result = await ragService.queryKnowledgeBase(query);
      res.json({ success: true, data: result });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[RagRoute] Query failed: ${message}`);
      res.status(500).json({ error: 'Search operation failed' });
    }
  })().catch(next);
});

/**
 * @openapi
 * /rag/ingest:
 *   post:
 *     summary: Ingest a document into hybrid memory
 *     tags: [RAG]
 */
// TODO: Fix Express type conflicts - temporarily disabled
// router.post('/ingest', upload.single('file'), (req, res, next) => {
//   (async () => {
//     const file = (req as any).file;
//     if (!file) {
//       return res.status(400).json({ error: 'No file provided' });
//     }

//     try {
//       const content = file.buffer.toString('utf-8');
//       const tags = (req as any).body.tags ? String((req as any).body.tags).split(',') : [];

//       const ragService = container.get<RagService>(TYPES.RagService);
//       await ragService.ingestDocument(file.originalname, content, tags);

//       res.json({ success: true, message: 'Document ingested successfully' });
//     } catch (error: any) {
//       logger.error(`[RagRoute] Ingestion failed: ${error.message}`);
//       res.status(500).json({ error: 'Ingestion operation failed' });
//     }
//   })().catch(next);
// });

// Legacy support: GET /rag?query=...
router.get('/', (req: any, res: any, next: any) => {
  (async () => {
    const query = (req as any).query.query as string;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    try {
      const ragService = container.get<RagService>(TYPES.RagService);
      const result = await ragService.queryKnowledgeBase(query);
      res.json({ results: [{ content: result }] }); // Match previous format roughly
    } catch (error: any) {
      res.status(502).json({ error: 'Failed to retrieve context' });
    }
  })().catch(next);
});

export default router;
