import { injectable } from 'inversify';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';

const CACHE_TTL = 3600 * 24; // 24 hours

/**
 * SOVEREIGN VIDEO INTELLIGENCE SERVICE
 * Visual Sentinel for advanced content auditing and security.
 */
@injectable()
export class VideoIntelligenceService {
  private client: any;

  constructor() {
    this.client = new VideoIntelligenceServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
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

      // Cache the operation name for the URI to avoid duplicate analysis
      await setCache(`video_intel:op:${gcsUri}`, operation.name, 3600);

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
    const cacheKey = `video_intel:result:${operationName}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const [operation] = await this.client.checkAnnotateVideoProgress(operationName);
      if (operation.done) {
        await setCache(cacheKey, operation.result, CACHE_TTL);
        return operation.result;
      }
      return { status: 'in_progress', metadata: operation.metadata };
    } catch (error) {
      logger.error('[VideoIntelligence] Result retrieval failure', error);
      throw error;
    }
  }
}
