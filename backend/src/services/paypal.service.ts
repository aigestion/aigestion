import { injectable } from 'inversify';
import axios from 'axios';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { CircuitBreakerFactory } from '../infrastructure/resilience/CircuitBreakerFactory';

interface CreateOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

interface CaptureOrderResponse {
  id: string;
  status: string;
  payer: any;
}

@injectable()
export class PayPalService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Circuit Breakers
  private createOrderBreaker: any;
  private captureOrderBreaker: any;

  constructor() {
    this.baseUrl =
      env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    this.clientId = env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = env.PAYPAL_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      logger.warn('PayPal credentials missing. PayPalService will not function.');
    }

    // Initialize Circuit Breakers
    this.createOrderBreaker = CircuitBreakerFactory.create(
      (amount: string, currency: string) => this.createOrderInternal(amount, currency),
      { name: 'PayPal.createOrder' },
    );

    this.captureOrderBreaker = CircuitBreakerFactory.create(
      (orderId: string) => this.captureOrderInternal(orderId),
      { name: 'PayPal.captureOrder' },
    );
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000; // Buffer 1 min
      return this.accessToken!;
    } catch (error) {
      logger.error(error, 'Failed to get PayPal access token');
      throw new Error('PayPal authentication failed');
    }
  }

  async createOrder(amount: string, currency: string = 'USD'): Promise<CreateOrderResponse> {
    return this.createOrderBreaker.fire(amount, currency);
  }

  private async createOrderInternal(
    amount: string,
    currency: string,
  ): Promise<CreateOrderResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount,
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      logger.error(error, 'PayPal create order failed');
      throw error;
    }
  }

  async captureOrder(orderId: string): Promise<CaptureOrderResponse> {
    return this.captureOrderBreaker.fire(orderId);
  }

  private async captureOrderInternal(orderId: string): Promise<CaptureOrderResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      logger.error(error, 'PayPal capture order failed');
      throw error;
    }
  }
}
