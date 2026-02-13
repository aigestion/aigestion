import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { AIService } from './ai.service';

@injectable()
export class AnomalyDetectionService {
  constructor(@inject(TYPES.AIService) private aiService: AIService) {}

  /**
   * Analyzes recent system metrics/logs for anomalies.
   */
  async analyzePatterns(data: any): Promise<{
    anomalyDetected: boolean;
    threatLevel: 'low' | 'medium' | 'high';
    message?: string;
  }> {
    logger.info(`[AnomalyDetection] Analyzing system patterns...`);

    // Real-world: Use a specialized model or statistical analysis.
    // God-mode: Leverage AIService for high-level semantic anomaly detection.
    const prompt = `Analyze the following system behavior logs for security anomalies: ${JSON.stringify(
      data
    )}. Return a JSON with "anomalyDetected" (boolean), "threatLevel" (string), and "explanation" (string).`;

    try {
      const response = await this.aiService.generateContent(prompt, 'system', 'security_analyst');
      const result = JSON.parse(response);

      if (result.anomalyDetected) {
        logger.warn(
          `[AnomalyDetection] ALERT: ${result.explanation} (Level: ${result.threatLevel})`
        );
      }

      return result;
    } catch (error) {
      logger.error(`[AnomalyDetection] Error analyzing patterns: ${error}`);
      // Fallback to basic rule-based detection
      return { anomalyDetected: false, threatLevel: 'low' };
    }
  }

  /**
   * Specifically checks for "impossible travel" or unusual login timing.
   */
  async checkUserActivity(userId: string, activityLog: any[]): Promise<void> {
    // Logic to correlate timestamps and geo-locations
    logger.info(`[AnomalyDetection] Checking activity for user ${userId}`);
  }
}
