import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { inject, injectable } from 'inversify';
import { env } from '../../config/env.schema';
import { logger } from '../../utils/logger';

@injectable()
export class DocumentProcessorService {
  private client: DocumentProcessorServiceClient;

  constructor() {
    this.client = new DocumentProcessorServiceClient();
  }

  /**
   * Processes a document (Invoice or Contract) using GCP Document AI
   */
  async processDocument(fileBuffer: Buffer, mimeType: string, processorId: string): Promise<any> {
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID;
    const location = env.GOOGLE_CLOUD_LOCATION || 'europe-west1';

    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

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

      return this.extractEntities(document);
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
