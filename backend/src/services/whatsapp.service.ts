import axios from 'axios';
import { Service } from 'typedi';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

@Service()
export class WhatsAppService {
  private readonly baseUrl = env.WHATSAPP_API_URL || 'https://graph.facebook.com/v19.0';

  /**
   * Send a WhatsApp message using the Business API
   */
  async sendMessage(to: string, message: string): Promise<any> {
    const phoneId = env.WHATSAPP_BUSINESS_PHONE_ID;
    const token = env.WHATSAPP_TOKEN || env.FACEBOOK_PAGE_ACCESS_TOKEN || env.META_ACCESS_TOKEN;

    if (!phoneId || !token) {
      throw new Error('WhatsApp Business Phone ID or Token not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`WhatsApp message sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error: any) {
      logger.error(
        { error: error.response?.data || error.message },
        'Error sending WhatsApp message'
      );
      throw error;
    }
  }

  /**
   * Send a template message (required for initiating conversations)
   */
  async sendTemplate(to: string, templateName: string, languageCode: string = 'es'): Promise<any> {
    const phoneId = env.WHATSAPP_BUSINESS_PHONE_ID;
    const token = env.WHATSAPP_TOKEN || env.FACEBOOK_PAGE_ACCESS_TOKEN || env.META_ACCESS_TOKEN;

    if (!phoneId || !token) {
      throw new Error('WhatsApp Business Phone ID or Token not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info(`WhatsApp template sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error: any) {
      logger.error(
        { error: error.response?.data || error.message },
        'Error sending WhatsApp template'
      );
      throw error;
    }
  }
}
