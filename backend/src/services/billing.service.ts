import Stripe from 'stripe';
import { cache } from '../utils/cacheManager';
import { logger } from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27' as any,
});

export class BillingService {
  /**
   * Report usage for metered billing
   */
  async reportUsage(customerId: string, subscriptionItemId: string, quantity: number = 1) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);

      // 1. Log to Redis for real-time analytics
      const analyticsKey = `billing:usage:${customerId}:${new Date().toISOString().split('T')[0]}`;
      await cache.set(analyticsKey, { lastUpdate: timestamp, quantity }, { ttl: 86400 });

      // 2. Report to Stripe
      await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
        timestamp,
        action: 'increment',
      });

      logger.info({ customerId, quantity }, 'Billing usage reported successfully');
      return true;
    } catch (error) {
      logger.error({ error, customerId }, 'Error reporting billing usage');
      return false;
    }
  }

  /**
   * Get subscription status with caching
   */
  async getSubscriptionStatus(customerId: string) {
    const cacheKey = `billing:status:${customerId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'active',
      });

      const status = {
        active: subscriptions.data.length > 0,
        plan: subscriptions.data[0]?.items.data[0]?.price.nickname || 'free',
        timestamp: Date.now(),
      };

      await cache.set(cacheKey, status, { ttl: 3600 }); // Cache for 1 hour
      return status;
    } catch (error) {
      logger.error({ error, customerId }, 'Error fetching subscription status');
      return { active: false, plan: 'none', error: true };
    }
  }
}

export const billingService = new BillingService();
