import { Router } from 'express';
import { ragService } from '../services/rag.service';
import { logger } from '../utils/logger';
import multer from 'multer';

const router = Router();
const upload = multer();

/**
 * @openapi
 * /rag/query:
 *   post:
 *     summary: Query the hybrid knowledge base (Cloud + Local + Code)
 *     tags: [RAG]
 */
router.post('/query', async (req: any, res: any) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body' });
  }

  try {
    const result = await ragService.queryKnowledgeBase(query);
    res.json({ success: true, data: result });
  } catch (error: any) {
    logger.error(`[RagRoute] Query failed: ${error.message}`);
    res.status(500).json({ error: 'Search operation failed' });
  }
});

/**
 * @openapi
 * /rag/ingest:
 *   post:
 *     summary: Ingest a document into hybrid memory
 *     tags: [RAG]
 */
router.post('/ingest', upload.single('file'), async (req: any, res: any) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const content = file.buffer.toString('utf-8');
    const tags = req.body.tags ? String(req.body.tags).split(',') : [];

    await ragService.ingestDocument(file.originalname, content, tags);

    res.json({ success: true, message: 'Document ingested successfully' });
  } catch (error: any) {
    logger.error(`[RagRoute] Ingestion failed: ${error.message}`);
    res.status(500).json({ error: 'Ingestion operation failed' });
  }
});

// Legacy support: GET /rag?query=...
router.get('/', async (req: any, res: any) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  try {
    const result = await ragService.queryKnowledgeBase(query);
    res.json({ results: [{ content: result }] }); // Match previous format roughly
  } catch (error: any) {
    res.status(502).json({ error: 'Failed to retrieve context' });
  }
});

export default router;
