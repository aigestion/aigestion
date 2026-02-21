import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { injectable } from 'inversify';
import { env } from '../../config/env.schema';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';
import * as crypto from 'node:crypto';

const CACHE_TTL = 3600 * 24; // 24 hours (Documents are static)

@injectable()
export class DocumentProcessorService {
  private readonly client: DocumentProcessorServiceClient;

  constructor() {
    this.client = new DocumentProcessorServiceClient();
  }

  private hashBuffer(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Processes a document (Invoice or Contract) using GCP Document AI
   */
  async processDocument(fileBuffer: Buffer, mimeType: string, processorId: string): Promise<any> {
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID;
    const location = env.GOOGLE_CLOUD_LOCATION || 'europe-west1';

    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    const bufferHash = this.hashBuffer(fileBuffer);
    const cacheKey = `doc_ai:result:${processorId}:${bufferHash}`;

    const cached = await getCache<any>(cacheKey);
    if (cached) {
      logger.info(`[DocumentProcessor] Cache Hit for hash: ${bufferHash}`);
      return cached;
    }

    const request = {
      name,
      rawDocument: {
        content: fileBuffer,
        mimeType,
      },
    };

    try {
      const [result] = await this.client.processDocument(request);
      const { document } = result;

      if (!document) {
        throw new Error('Document AI returned empty document');
      }

      const resultData = this.extractEntities(document);
      await setCache(cacheKey, resultData, CACHE_TTL);

      return resultData;
    } catch (error) {
      logger.error('[DocumentProcessorService] Error processing document:', error);
      throw error;
    }
  }

  /**
   * Specifically handles invoice processing
   */
  async processInvoice(fileBuffer: Buffer): Promise<any> {
    const processorId = env.INVOICE_PROCESSOR_ID;
    if (!processorId) throw new Error('INVOICE_PROCESSOR_ID not configured');
    return this.processDocument(fileBuffer, 'application/pdf', processorId);
  }

  /**
   * Specifically handles contract processing
   */
  async processContract(fileBuffer: Buffer): Promise<any> {
    const processorId = env.CONTRACT_PROCESSOR_ID;
    if (!processorId) throw new Error('CONTRACT_PROCESSOR_ID not configured');
    return this.processDocument(fileBuffer, 'application/pdf', processorId);
  }

  /**
   * Extracts structured entities from the Document AI response
   */
  private extractEntities(document: any): any {
    const entities = document.entities || [];
    const extractedData: Record<string, any> = {};

    entities.forEach((entity: any) => {
      extractedData[entity.type] = entity.mentionText || entity.normalizedValue?.text;
    });

    return {
      extractedData,
      text: document.text,
    };
  }
}
