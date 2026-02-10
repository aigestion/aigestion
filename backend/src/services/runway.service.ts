import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

@injectable()
export class RunwayService {
  private static readonly API_URL = 'https://api.runwayml.com/v1';

  /**
   * Generates a video using Runway Gen-3 Alpha (Image-to-Video)
   * Note: This is a simulated implementation based on typical GenAI API patterns,
   * as specific backend SDKs might not be public or fully standardized yet.
   */
  /**
   * Generates a video using Runway Gen-3 Alpha Turbo (Image-to-Video)
   */
  async generateImageToVideo(
    prompt: string,
    imageUri: string, // URL or Data URI
    options: {
      duration?: number;
      aspect_ratio?: string;
      model?: string;
    } = {},
  ): Promise<any> {
    if (!env.RUNWAY_API_KEY) {
      throw new Error('RUNWAY_API_KEY is missing');
    }

    try {
      logger.info(`Starting Runway Gen-3 Alpha Turbo Video Generation: "${prompt}"`);

      const response = await axios.post(
        `${RunwayService.API_URL}/image_to_video`, // Standard endpoint, subject to change based on actual API version
        {
          promptText: prompt, // Specific field name might vary, checking docs simulation
          image: imageUri,
          model: 'gen3a_turbo', // Explicit model ID for Gen-3 Alpha Turbo
          duration: options.duration || 5, // 5 or 10
          ratio: options.aspect_ratio || '1280:768', // Cinema standard
        },
        {
          headers: {
            Authorization: `Bearer ${env.RUNWAY_API_KEY}`,
            'Content-Type': 'application/json',
            'X-Runway-Version': '2024-09-26',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      // Improved error logging
      const errorData = error.response?.data;
      const errorMsg = errorData?.error || error.message;

      logger.error('Runway API Error:', errorMsg);
      if (errorData) {
        logger.error('Full Error Details:', JSON.stringify(errorData, null, 2));
      }

      if (
        error.response?.status === 402 ||
        (error.response?.status === 400 && errorMsg.includes('credits'))
      ) {
        logger.warn(
          'This error likely indicates insufficient credits or a billing issue on your Runway account.',
        );
      } else if (error.response?.status === 400) {
        logger.warn(
          'This error might be due to credits, or possibly invalid parameters (e.g. image format). The image size confirms it should be valid for Data URI.',
        );
      }

      throw error;
    }
  }

  /**
   * Check status of a generation task
   */
  async checkStatus(taskId: string): Promise<any> {
    if (!env.RUNWAY_API_KEY) {
      throw new Error('RUNWAY_API_KEY is missing');
    }

    try {
      const response = await axios.get(`${RunwayService.API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${env.RUNWAY_API_KEY}`,
          'X-Runway-Version': '2024-09-26',
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error('Runway Status Check Error:', error.response?.data || error.message);
      throw error;
    }
  }
}
