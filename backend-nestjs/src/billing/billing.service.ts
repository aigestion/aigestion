import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

  /**
   * Report usage for metered billing
   */
  async reportUsage(customerId: string, subscriptionItemId: string, quantity: number = 1) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      
      this.logger.log(`Reporting usage for ${customerId}: +${quantity} units`);

      // 1. Log to Redis (Mocked for now via Logger) for real-time analytics
      // In production: await this.cacheManager.set(...)

      // 2. Report to Stripe
      await this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
        timestamp,
        action: 'increment',
      });

      return true;
    } catch (error) {
      this.logger.error(`Error reporting billing usage: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Check if user has sufficient credits (Simulated logic)
   */
  async checkCredits(customerId: string): Promise<boolean> {
      // In a real implementation, this would check Redis or Stripe balances
      // For Sovereign MVP, we assume active subscription = has credits
      const status = await this.getSubscriptionStatus(customerId);
      return status.active;
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(customerId: string) {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'active',
      });

      const status = {
        active: subscriptions.data.length > 0,
        plan: subscriptions.data[0]?.items.data[0]?.price.nickname || 'free',
        timestamp: Date.now(),
      };

      return status;
    } catch (error) {
      this.logger.error(`Error fetching subscription status: ${error.message}`, error.stack);
      return { active: false, plan: 'none', error: true };
    }
  }
}
