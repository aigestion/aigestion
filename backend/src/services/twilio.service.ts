import { injectable } from 'inversify';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import axios from 'axios';

/**
 * SOVEREIGN TWILIO SERVICE (God Mode)
 * Engineered for resilient global communications via SMS and Programmable Voice.
 * Note: Uses Axios to avoid heavy external SDK dependencies in Sovereign builds.
 */
@injectable()
export class TwilioService {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly fromNumber: string;
  private readonly baseUrl: string;

  constructor() {
    this.accountSid = env.TWILIO_ACCOUNT_SID || '';
    this.authToken = env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
  }

  /**
   * Resilient execution wrapper with exponential backoff
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 3;
    const baseDelay = 500;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const status = error.response?.status;
        
        // Critical: Do not retry on 401 (Auth) or 400 (Invalid Number/Bad Request)
        if (status === 401 || status === 400 || (status >= 400 && status < 500)) {
          logger.error(`[TwilioService] ${context} Terminal Error: ${status}`, error.response?.data);
          throw error;
        }

        if (attempt === maxRetries - 1) throw error;

        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`[TwilioService] ${context} transient error (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[TwilioService] ${context} failed after maximum retries`);
  }

  /**
   * Sends a resilient SMS interaction
   */
  async sendSMS(to: string, body: string): Promise<any> {
    if (!this.accountSid || !this.authToken) {
      logger.warn('[TwilioService] Twilio credentials missing. SMS simulation mode active.', { to, body });
      return { sid: 'SM_MOCK_1234', status: 'simulated' };
    }

    return this.withRetry(async () => {
      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', this.fromNumber);
      params.append('Body', body);

      const response = await axios.post(
        `${this.baseUrl}/Messages.json`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          },
        }
      );

      logger.info({ sid: response.data.sid, to }, '[TwilioService] SMS dispatched successfully');
      return response.data;
    }, 'sendSMS');
  }

  /**
   * Initiates a Programmable Voice interaction (Call)
   */
  async makeCall(to: string, twimlUrl: string): Promise<any> {
    return this.withRetry(async () => {
      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', this.fromNumber);
      params.append('Url', twimlUrl);

      const response = await axios.post(
        `${this.baseUrl}/Calls.json`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          },
        }
      );

      logger.info({ sid: response.data.sid, to }, '[TwilioService] Voice call initiated');
      return response.data;
    }, 'makeCall');
  }

  /**
   * Health Check: Validates Twilio Account status
   */
  async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const twilioService = new TwilioService();
