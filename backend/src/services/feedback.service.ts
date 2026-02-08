import { cache } from '../utils/cacheManager';
import { logger } from '../utils/logger';

export interface UIFeedback {
  messageId: string;
  isPositive: boolean;
  userId?: string;
  timestamp: number;
}

export class FeedbackService {
  /**
   * Submit feedback for an AI response
   */
  async submitFeedback(data: UIFeedback) {
    try {
      const feedbackKey = `feedback:ai:${data.messageId}`;

      // 1. Log to Redis for aggregation
      // We store it with a score (1 for positive, -1 for negative)
      const score = data.isPositive ? 1 : -1;

      // In a real scenario, we'd use SADD or HSET
      await cache.set(
        feedbackKey,
        {
          ...data,
          processed: false,
        },
        { ttl: 604800 },
      ); // Store for 7 days

      logger.info(
        { messageId: data.messageId, isPositive: data.isPositive },
        'AI Feedback collected successfully',
      );

      // 2. Proactive Alerting if negative
      if (!data.isPositive) {
        logger.warn(
          { messageId: data.messageId },
          'NEGATIVE AI Feedback received - Flagged for review',
        );
      }

      return true;
    } catch (error) {
      logger.error({ error, messageId: data.messageId }, 'Error collecting AI feedback');
      return false;
    }
  }

  /**
   * Get feedback summary for a message
   */
  async getFeedback(messageId: string) {
    const feedbackKey = `feedback:ai:${messageId}`;
    return await cache.get(feedbackKey);
  }
}

export const feedbackService = new FeedbackService();
