import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { UsageRecord } from '../models/UsageRecord';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { StripeService } from '../services/stripe.service';
import { PayPalService } from '../services/paypal.service';
import { env } from '../config/env.schema';
import { TYPES } from '../types';

@injectable()
export class BillingController {
  constructor(
    @inject(TYPES.StripeService) private stripeService: StripeService,
    @inject(TYPES.PaypalService) private payPalService: PayPalService,
  ) {}

  public async getBillingSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const aiCostData = await UsageRecord.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, total: { $sum: '$costEstimate' } } },
      ]);

      const aiTotal = aiCostData[0]?.total || 0;
      const snapshot = {
        updatedAt: new Date().toISOString(),
        googleCloudUSD: Number.parseFloat((aiTotal * 0.4).toFixed(2)),
        githubActionsUSD: 8.75,
        otherUSD: 5.0,
        ivaRate: 0.21,
        totalUSD: Number.parseFloat(((aiTotal + 20) * 1.21).toFixed(2)),
        currency: 'EUR',
        totalEUR: Number.parseFloat(((aiTotal + 20) * 1.21 * 0.92).toFixed(2)),
      };

      res.json(snapshot);
    } catch (err) {
      next(err);
    }
  }

  public async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
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

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await this.stripeService.createCustomer(user.email, user.name);
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      const session = await this.stripeService.createSubscriptionCheckoutSession(
        customerId,
        priceId,
        `${env.FRONTEND_URL}/billing?success=true`,
        `${env.FRONTEND_URL}/billing?canceled=true`,
      );

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      next(error);
    }
  }

  public async createPortalSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const user = await User.findById(userId);

      if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: 'No billing account linked to this user' });
      }

      const session = await this.stripeService.createPortalSession(
        user.stripeCustomerId,
        `${env.FRONTEND_URL}/billing`,
      );

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  }

  public async createPayPalOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, currency } = req.body;
      const order = await this.payPalService.createOrder(amount, currency || 'USD');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  public async capturePayPalOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const capture = await this.payPalService.captureOrder(orderId);
      res.json(capture);
    } catch (error) {
      next(error);
    }
  }
}
