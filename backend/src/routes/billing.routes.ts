import { Router } from 'express';

import { env } from '../config/env.schema';
import { container } from '../config/inversify.config'; // Assuming you have a container export
import { requireAuth } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { StripeService } from '../services/stripe.service';
import { logger } from '../utils/logger';

const router = Router();
const stripeService = container.get(StripeService);

router.post('/checkout', requireAuth, async (req: any, res: any) => {
  try {
    const { priceId } = req.body;
    const user = await User.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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
  } catch (error) {
    logger.error(error, 'Checkout error');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/portal', requireAuth, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripeService.createPortalSession(
      user.stripeCustomerId,
      `${env.FRONTEND_URL}/billing`,
    );

    res.json({ url: session.url });
  } catch (error) {
    logger.error(error, 'Portal error');
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

router.post('/paypal/create-order', requireAuth, async (req: any, res: any) => {
  // Dynamically import controller to avoid circular deps if any, or just call directly
  const { createPayPalOrder } = await import('../controllers/billing.controller');
  await createPayPalOrder(req, res);
});

router.post('/paypal/capture-order', requireAuth, async (req: any, res: any) => {
  const { capturePayPalOrder } = await import('../controllers/billing.controller');
  await capturePayPalOrder(req, res);
});

export default router;
