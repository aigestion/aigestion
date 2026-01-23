import { Job } from 'bullmq';
import { logger } from '../../utils/logger';
import { container } from '../../config/inversify.config';
import { TYPES } from '../../types';
import { DocumentProcessorService } from '../../services/google/document-processor.service';
import { PineconeService } from '../../services/pinecone.service';
import fs from 'fs/promises';

export class DocumentProcessor {
  /**
   * Processes a single document in the background.
   */
  public static async process(job: Job): Promise<void> {
    const { filePath, originalname, type, requestId } = job.data;
    logger.info(`[DocumentProcessor] Starting job [${job.id}] for file: ${originalname}`);

    try {
      const docProcessor = container.get<DocumentProcessorService>(TYPES.DocumentProcessorService);
      const pineconeService = container.get<PineconeService>(TYPES.PineconeService);

      // 1. Read the file from disk (Multer diskStorage)
      const buffer = await fs.readFile(filePath);

      // 2. Extract Data via Document AI
      let extracted: any;
      if (type === 'contract') {
        extracted = await docProcessor.processContract(buffer);
      } else {
        extracted = await docProcessor.processInvoice(buffer);
      }

      // 3. Index in Pinecone
      const docId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const embeddingText = `
        Type: ${String(type).toUpperCase()}
        Entities: ${JSON.stringify(extracted.extractedData)}
        Content: ${String(extracted.text || '').substring(0, 1000)}...
      `;

      await pineconeService.upsertDocument(docId, embeddingText, {
        type,
        filename: originalname,
        ...extracted.extractedData,
        requestId
      });

      // 4. Cleanup temporary file
      await fs.unlink(filePath).catch(err => logger.error(`Failed to delete temp file ${filePath}`, err));

      logger.info(`[DocumentProcessor] Job [${job.id}] completed successfully: ${docId}`);

      // Update job progress with result
      await job.updateProgress({ status: 'completed', docId, filename: originalname });
    } catch (error) {
      logger.error(`[DocumentProcessor] Job [${job.id}] failed:`, error);

      // Attempt cleanup even on failure
      await fs.unlink(filePath).catch(() => {});

      throw error;
    }
  }
}
