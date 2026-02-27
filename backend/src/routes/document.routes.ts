import { Router } from 'express';
import fs from 'fs/promises';
import { buildError, buildResponse } from '../common/response-builder';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { JobQueue } from '../infrastructure/jobs/JobQueue';
import { JobName } from '../infrastructure/jobs/job-definitions';
import { malwareScanner } from '../middleware/malware-scanner.middleware';
import { DocumentProcessorService } from '../services/google/document-processor.service';
import { PineconeService } from '../services/pinecone.service';

const documentRouter = Router();
// Removed raw multer: const upload = multer();

/**
 * @openapi
 * /documents/process:
 *   post:
 *     summary: Process a document (Invoice/Contract), extract data, and index it.
 *     tags: [Documents]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [invoice, contract]
 *     responses:
 *       200:
 *         description: Document processed and indexed successfully
 */
documentRouter.post('/process', malwareScanner.uploadSingle('file'), async (req: any, res: any) => {
  const requestId = req.requestId;

  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .json(buildError('No file provided', 'INVALID_REQUEST', 400, requestId as string));
  }

  const type = (req.body && req.body.type) || 'invoice';

  try {
    // 1. Extract Data via Document AI
    const docProcessor = container.get<DocumentProcessorService>(TYPES.DocumentProcessorService);
    let extractedResult: any;

    // Read file from disk since MalwareScanner uses diskStorage
    const fileBuffer = await fs.readFile(file.path);

    if (type === 'contract') {
      extractedResult = await docProcessor.processContract(fileBuffer);
    } else {
      extractedResult = await docProcessor.processInvoice(fileBuffer);
    }

    // Cleanup: Remove the file after processing
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.warn('Failed to cleanup processed file:', file.path);
    }

    // 2. Index in Pinecone for semantic search
    const pineconeService = container.get<PineconeService>(TYPES.PineconeService);
    const docId = `${type}_${Date.now()}`; // Simple ID generation

    // Create a rich text representation for embedding (Entities + Raw Text)
    const embeddingText = `
      Type: ${String(type).toUpperCase()}
      Entities: ${JSON.stringify(extractedResult.extractedData)}
      Content: ${String(extractedResult.text || '').substring(0, 1000)}...
    `;

    await pineconeService.upsertDocument(docId, embeddingText, {
      type,
      filename: file.originalname,
      ...extractedResult.extractedData,
    });

    return res.json(
      buildResponse(
        {
          docId,
          extractedData: extractedResult.extractedData,
          status: 'indexed',
        },
        200,
        requestId
      )
    );
  } catch (error) {
    console.error('Document Processing Failed:', error);
    return res
      .status(500)
      .json(buildError('Failed to process document', 'PROCESSING_ERROR', 500, requestId as string));
  }
});

/**
 * @openapi
 * /documents/process-bulk:
 *   post:
 *     summary: Process multiple documents in bulk.
 *     tags: [Documents]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               type:
 *                 type: string
 *                 default: invoice
 *     responses:
 *       200:
 *         description: All documents processed
 */
documentRouter.post(
  '/process-bulk',
  malwareScanner.uploadMultiple('files', 10),
  async (req: any, res: any) => {
    const requestId = req.requestId;
    const files = req.files as any[]; // Type workaround for Multer files

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json(buildError('No files provided', 'INVALID_REQUEST', 400, requestId as string));
    }

    const type = (req.body && req.body.type) || 'invoice';
    const jobQueue = container.get<JobQueue>(TYPES.JobQueue);

    try {
      const jobIds = await Promise.all(
        files.map(async file => {
          // Add background job
          const jobId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          await jobQueue.addJob(
            JobName.DATA_PROCESSING,
            {
              filePath: file.path, // Multer disk path
              originalname: file.originalname,
              type,
              requestId,
            },
            { jobId }
          );

          return jobId;
        })
      );

      return res.json(
        buildResponse(
          {
            status: 'queued',
            total: files.length,
            jobIds,
          },
          200,
          requestId
        )
      );
    } catch (error) {
      console.error('Failed to queue bulk processing jobs:', error);
      return res
        .status(500)
        .json(
          buildError('Failed to queue processing jobs', 'QUEUE_ERROR', 500, requestId as string)
        );
    }
  }
);

/**
 * @openapi
 * /documents/search:
 *   get:
 *     summary: Semantic search for documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Natural language query
 *     responses:
 *       200:
 *         description: Search results
 */
documentRouter.get('/search', async (req: any, res: any) => {
  const requestId = req.requestId;
  const query = req.query.q as string;

  if (!query) {
    return res
      .status(400)
      .json(buildError('Query required', 'INVALID_REQUEST', 400, requestId as string));
  }

  try {
    const pineconeService = container.get<PineconeService>(TYPES.PineconeService);
    const results = await pineconeService.search(query);

    return res.json(buildResponse(results, 200, requestId as string));
  } catch (error) {
    console.error('Document Search Failed:', error);
    return res
      .status(500)
      .json(buildError('Search failed', 'SEARCH_ERROR', 500, requestId as string));
  }
});

export default documentRouter;
