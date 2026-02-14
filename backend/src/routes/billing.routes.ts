import { Router } from 'express';

import { env } from '../config/env.schema';
import { container } from '../config/inversify.config'; // Assuming you have a container export
import { requireAuth } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { StripeService } from '../services/stripe.service';
import { logger } from '../utils/logger';
import { TYPES } from '../types';
import { BillingController } from '../controllers/billing.controller';

const router = Router();
const stripeService = container.get<StripeService>(TYPES.StripeService);
const billingController = container.get<BillingController>(TYPES.BillingController);

// Core Billing & Snapshot
router.get('/snapshot', requireAuth, (req, res, next) =>
  billingController.getBillingSnapshot(req, res, next),
);

// Marketplace & Hiring
router.post('/hire', requireAuth, (req, res, next) =>
  billingController.hirePersona(req, res, next),
);

// Subscription & Checkout
router.post('/checkout', requireAuth, (req, res, next) =>
  billingController.createCheckoutSession(req, res, next),
);

router.post('/portal', requireAuth, (req, res, next) =>
  billingController.createPortalSession(req, res, next),
);

// PayPal Integration
router.post('/paypal/create-order', requireAuth, (req, res, next) =>
  billingController.createPayPalOrder(req, res, next),
);
router.post('/paypal/capture-order', requireAuth, (req, res, next) =>
  billingController.capturePayPalOrder(req, res, next),
);

// Partner Transparency API
router.get('/metrics/partner', requireAuth, (req, res, next) =>
  billingController.getPartnerMetrics(req, res, next),
);

export default router;
