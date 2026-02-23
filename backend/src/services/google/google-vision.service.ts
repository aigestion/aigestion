import { ImageAnnotatorClient } from '@google-cloud/vision';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

/**
 * GOOGLE VISION SERVICE — God Level Visual Perception
 * Image analysis, OCR, landmark detection, and safety filters.
 */
@injectable()
export class GoogleVisionService {
  private client: ImageAnnotatorClient | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Prioritize service account JSON if available
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        this.client = new ImageAnnotatorClient();
        logger.info('[GoogleVision] ✅ Initialized vision client');
      } else {
        logger.warn('[GoogleVision] No credentials found — service inactive');
      }
    } catch (error: any) {
      logger.error(`[GoogleVision] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<ImageAnnotatorClient> {
    if (this.initPromise) await this.initPromise;
    if (!this.client) throw new Error('Vision client not initialized');
    return this.client;
  }

  /**
   * Performs label detection on an image (local path or base64).
   */
  async detectLabels(imageInput: string | Buffer) {
    const client = await this.getClient();
    const [result] = await client.labelDetection(imageInput);
    return result.labelAnnotations || [];
  }

  /**
   * Performs OCR (Text Detection) on an image.
   */
  async detectText(imageInput: string | Buffer) {
    const client = await this.getClient();
    const [result] = await client.textDetection(imageInput);
    return result.textAnnotations || [];
  }

  /**
   * Detects landmarks in an image.
   */
  async detectLandmarks(imageInput: string | Buffer) {
    const client = await this.getClient();
    const [result] = await client.landmarkDetection(imageInput);
    return result.landmarkAnnotations || [];
  }

  /**
   * Performs safe search detection (explicit content filter).
   */
  async detectSafeSearch(imageInput: string | Buffer) {
    const client = await this.getClient();
    const [result] = await client.safeSearchDetection(imageInput);
    return result.safeSearchAnnotation || null;
  }

  /**
   * Comprehensive image analysis in a single call.
   */
  async analyzeImage(imageInput: string | Buffer) {
    const client = await this.getClient();
    const [result] = await client.annotateImage({
      image: { content: Buffer.isBuffer(imageInput) ? imageInput : imageInput },
      features: [
        { type: 'LABEL_DETECTION' },
        { type: 'TEXT_DETECTION' },
        { type: 'LANDMARK_DETECTION' },
        { type: 'SAFE_SEARCH_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
      ],
    });

    return {
      labels: result.labelAnnotations || [],
      text: result.fullTextAnnotation?.text || '',
      landmarks: result.landmarkAnnotations || [],
      safeSearch: result.safeSearchAnnotation || null,
      properties: result.imagePropertiesAnnotation || null,
    };
  }
}
