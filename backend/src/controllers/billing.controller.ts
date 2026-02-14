import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { UsageRecord } from '../models/UsageRecord';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { StripeService } from '../services/stripe.service';
import { PayPalService } from '../services/paypal.service';
import { env } from '../config/env.schema';
import { TYPES } from '../types';
import { Persona } from '../models/Persona';

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

  public async hirePersona(req: Request, res: Response, next: NextFunction) {
    try {
      const { personaId } = req.body;
      const userId = (req as any).user?.id;

      if (!personaId) {
        return res.status(400).json({ error: 'Persona ID is required' });
      }

      const persona = await Persona.findById(personaId);
      if (!persona) {
        return res.status(404).json({ error: 'Persona not found' });
      }

      if (!persona.price || persona.price === 0) {
        return res.json({ success: true, message: 'Free persona hired' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (env.STRIPE_SECRET_KEY?.includes('PLACEHOLDER')) {
        return res.json({
          sessionId: `cs_persona_${Date.now()}`,
          url: `${env.FRONTEND_URL}/marketplace?hired=${personaId}`,
        });
      }

      res.json({ message: 'Stripe integration for one-time payments pending', url: '#' });
    } catch (error) {
      next(error);
    }
  }

  public async getPartnerMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const globalStats = await UsageRecord.aggregate([
        {
          $group: {
            _id: null,
            totalTokens: { $sum: '$totalTokens' },
            totalCost: { $sum: '$costEstimate' },
            totalPlatformCommission: { $sum: '$platformCommission' },
            totalCreatorCommission: { $sum: '$creatorCommission' },
            activeUsers: { $addToSet: '$userId' },
          },
        },
        {
          $project: {
            _id: 0,
            totalTokens: 1,
            totalCost: 1,
            totalPlatformCommission: 1,
            totalCreatorCommission: 1,
            userCount: { $size: '$activeUsers' },
          },
        },
      ]);

      const metrics = globalStats[0] || {
        totalTokens: 0,
        totalCost: 0,
        totalPlatformCommission: 0,
        totalCreatorCommission: 0,
        userCount: 0,
      };

      res.json({
        ...metrics,
        status: 'Sovereign Growth',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
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

      if (env.STRIPE_SECRET_KEY?.includes('PLACEHOLDER')) {
        logger.info(`[Billing] Simulating checkout for ${user.email} (Dev Mode)`);
        if (!customerId) {
          customerId = `cus_simulated_${Date.now()}`;
          user.stripeCustomerId = customerId;
        }
        user.subscriptionStatus = 'active';
        user.role = 'professional';
        user.subscriptionPlan = 'dev_simulated_plan';
        await user.save();

        return res.json({
          sessionId: `cs_simulated_${Date.now()}`,
          url: `${env.FRONTEND_URL}/billing?success=true&session_id=cs_simulated_dev`,
        });
      }

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
