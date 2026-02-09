import type { Request, Response, NextFunction } from 'express';
import { UsageRecord } from '../models/UsageRecord';
import { User } from '../models/User';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';
import { container } from '../config/inversify.config';
import { StripeService } from '../services/stripe.service';
import { PayPalService } from '../services/paypal.service';
import { env } from '../config/env.schema';

/**
 * Get a snapshot of the current billing status
 * Composes actual AI costs + estimated infra costs
 */
export const getBillingSnapshot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    // 1. Calculate Actual AI Costs from UsageRecord
    const aiCostData = await UsageRecord.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$costEstimate' } } },
    ]);

    const aiTotal = aiCostData[0]?.total || 0;

    // 2. Compose full snapshot
    // For GCP/GitHub, in a real env we might query APIs, but here we can derive from usage or constants
    const snapshot = {
      updatedAt: new Date().toISOString(),
      googleCloudUSD: parseFloat((aiTotal * 0.4).toFixed(2)), // Assume 40% of AI cost is infra overhead
      githubActionsUSD: 8.75, // Fixed baseline for CI/CD & deployment
      otherUSD: 5.0,
      ivaRate: 0.21,
      totalUSD: parseFloat(((aiTotal + 20) * 1.21).toFixed(2)),
      currency: 'EUR',
      totalEUR: parseFloat(((aiTotal + 20) * 1.21 * 0.92).toFixed(2)), // USD to EUR conversion
    };

    res.json(snapshot); // Frontend expects raw object based on fetchBillingData implementation
  } catch (err) {
    logger.error(err, 'Error in billing snapshot');
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Initiate a Stripe Checkout Session for subscription
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body;
    const userId = (req as any).user?.id;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stripeService = container.get(StripeService);

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripeService.createCustomer(user.email, user.name);
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripeService.createSubscriptionCheckoutSession(
      customerId,
      priceId,
      `${env.FRONTEND_URL}/billing?success=true`,
      `${env.FRONTEND_URL}/billing?canceled=true`,
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    logger.error(error, 'Checkout session creation failed');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

/**
 * Create a Stripe Portal Session for managing subscriptions
 */
export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account linked to this user' });
    }

    const stripeService = container.get(StripeService);

    const session = await stripeService.createPortalSession(
      user.stripeCustomerId,
      `${env.FRONTEND_URL}/billing`,
    );

    res.json({ url: session.url });
  } catch (error: any) {
    logger.error(error, 'Portal session creation failed');
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};

/**
 * Create a PayPal Order
 */
export const createPayPalOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency } = req.body;
        // In a real app, validate amount against a priceId or plan
        const payPalService = container.get(PayPalService);
        const order = await payPalService.createOrder(amount, currency || 'USD');
        res.json(order);
    } catch (error: any) {
        logger.error(error, 'PayPal create order failed');
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
};

/**
 * Capture a PayPal Order
 */
export const capturePayPalOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        const payPalService = container.get(PayPalService);
        const capture = await payPalService.captureOrder(orderId);

        // TODO: Update user subscription status here based on successful capture

        res.json(capture);
    } catch (error: any) {
        logger.error(error, 'PayPal capture order failed');
        res.status(500).json({ error: 'Failed to capture PayPal order' });
    }
};
