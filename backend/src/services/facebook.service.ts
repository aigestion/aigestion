import axios from 'axios';
import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

@injectable()
export class FacebookService {
  private readonly baseUrl = 'https://graph.facebook.com/v19.0';

  /**
   * Post a message to a Facebook Page feed
   */
  async postToPage(pageId: string, message: string, accessToken?: string): Promise<any> {
    const token = accessToken || env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!token) {
      throw new Error('Facebook Page Access Token not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/${pageId}/feed`,
        {
          message: message,
        },
        {
          params: { access_token: token },
        },
      );

      logger.info(`Posted to Facebook Page ${pageId}: ${response.data.id}`);
      return response.data;
    } catch (error: any) {
      logger.error(
        { error: error.response?.data || error.message },
        'Error posting to Facebook Page',
      );
      throw error;
    }
  }

  /**
   * Get Page insights (e.g., page_impressions, page_engagement)
   */
  async getPageInsights(
    pageId: string,
    metrics: string = 'page_impressions,page_engaged_users',
  ): Promise<any> {
    const token = env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!token) {
      return null;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}/insights`, {
        params: {
          metric: metrics,
          access_token: token,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error(
        { error: error.response?.data || error.message },
        'Error fetching Facebook Page insights',
      );
      return null;
    }
  }

  /**
   * Get comments for a specific post
   */
  async getPostComments(postId: string): Promise<any> {
    const token = env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!token) {
      return null;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/${postId}/comments`, {
        params: {
          access_token: token,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error(
        { error: error.response?.data || error.message },
        'Error fetching Facebook post comments',
      );
      return null;
    }
  }
}
