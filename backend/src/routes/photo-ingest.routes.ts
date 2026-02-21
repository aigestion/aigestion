import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { buildResponse, buildError } from '../common/response-builder';
import { VisualPerceptionService } from '../services/google/visual-perception.service';
import { RagService } from '../services/rag.service';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /photo-ingest
 * Pixel 8 photo pipeline: Tasker captures → n8n uploads → POST here.
 * Body: { imageUrl: string, source?: string, tags?: string[], prompt?: string }
 *
 * Flow:
 * 1. Gemini Vision analyzes the image
 * 2. Analysis + metadata archived to ChromaDB
 * 3. Returns the AI description for downstream use
 */
router.post('/', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const { imageUrl, source = 'pixel_8_camera', tags = [], prompt } = req.body;

    if (!imageUrl) {
      return res.status(400).json(buildError('imageUrl is required', 'MISSING_IMAGE', 400, requestId));
    }

    logger.info(`[PhotoIngest] Processing image from ${source}`);

    // Step 1: Analyze with Gemini Vision
    const perception = container.get<VisualPerceptionService>(TYPES.VisualPerceptionService);
    const analysisPrompt = prompt ||
      'Describe esta imagen en detalle. Incluye: objetos visibles, texto legible, personas (sin identificar), ubicación estimada, contexto temporal, y cualquier dato relevante. Responde en español conciso.';

    const description = await perception.analyzeVisualContext(imageUrl, analysisPrompt);
    logger.info(`[PhotoIngest] Vision analysis complete (${description.length} chars)`);

    // Step 2: Archive to ChromaDB via RAG
    const rag = container.get<RagService>(TYPES.RagService);
    const filename = `photo_${source}_${Date.now()}.md`;
    const content = [
      `# 📸 Photo Analysis`,
      `- **Source:** ${source}`,
      `- **Timestamp:** ${new Date().toISOString()}`,
      `- **Tags:** ${tags.join(', ') || 'none'}`,
      ``,
      `## AI Description`,
      description,
      ``,
      `## Metadata`,
      `- Image URL: ${imageUrl}`,
    ].join('\n');

    await rag.ingestDocument(filename, content, ['photo', source, ...tags]);
    logger.info(`[PhotoIngest] Archived to RAG: ${filename}`);

    res.json(buildResponse({
      ingested: true,
      description,
      filename,
      tags: ['photo', source, ...tags],
    }, 200, requestId));

  } catch (err: any) {
    logger.error(`[PhotoIngest] Error: ${err.message}`);
    res.status(500).json(buildError('Photo ingestion failed', 'INGEST_ERROR', 500, requestId));
  }
});

export default router;
