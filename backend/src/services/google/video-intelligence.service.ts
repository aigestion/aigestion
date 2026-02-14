import { injectable } from 'inversify';
const { VideoIntelligenceServiceClient } = require('@google-cloud/video-intelligence');
import { logger } from '../../utils/logger';

/**
 * SOVEREIGN VIDEO INTELLIGENCE SERVICE
 * Visual Sentinel for advanced content auditing and security.
 */
@injectable()
export class VideoIntelligenceService {
  private client: any;

  constructor() {
    this.client = new VideoIntelligenceServiceClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  /**
   * Performs deep visual analysis on a GCS URI (e.g., archived surveillance or YouTube backups).
   */
  async analyzeVideo(gcsUri: string) {
    logger.info(`[VideoIntelligence] Dispatching sentinel to URI: ${gcsUri}`);
    
    const request = {
      inputUri: gcsUri,
      features: ['LABEL_DETECTION', 'SHOT_CHANGE_DETECTION', 'OBJECT_TRACKING'],
    };

    try {
      const [operation] = await this.client.annotateVideo(request);
      logger.info(`[VideoIntelligence] Analysis started: ${operation.name}`);
      
      // We don't wait for completion in the request cycle (long-running)
      // Return the operation name as a tracking token
      return operation.name;
    } catch (error) {
      logger.error('[VideoIntelligence] Visual analysis fault', error);
      throw error;
    }
  }

  /**
   * Checks the status of a visual analysis operation.
   */
  async getAnalysisResults(operationName: string) {
      try {
          const [operation] = await this.client.checkAnnotateVideoProgress(operationName);
          if (operation.done) {
              return operation.result;
          }
          return { status: 'in_progress', metadata: operation.metadata };
      } catch (error) {
          logger.error('[VideoIntelligence] Result retrieval failure', error);
          throw error;
      }
  }
}
