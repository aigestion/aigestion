import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/subscriptions/{userId}:
 *   get:
 *     summary: Get user subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:userId', requireAuth, subscriptionController.getUserSubscription);

/**
 * @openapi
 * /api/v1/subscriptions/validate:
 *   post:
 *     summary: Validate subscription access
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/validate', requireAuth, subscriptionController.validateSubscriptionAccess);

/**
 * @openapi
 * /api/v1/subscriptions/validate-mobile:
 *   post:
 *     summary: Validate mobile subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/validate-mobile', requireAuth, subscriptionController.validateMobileSubscription);

/**
 * @openapi
 * /api/v1/subscriptions/checkout:
 *   post:
 *     summary: Create payment session
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/checkout', requireAuth, subscriptionController.createPaymentSession);

/**
 * @openapi
 * /api/v1/subscriptions/{userId}:
 *   put:
 *     summary: Update subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:userId', requireAuth, subscriptionController.updateSubscription);

/**
 * @openapi
 * /api/v1/subscriptions/{userId}/cancel:
 *   post:
 *     summary: Cancel subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:userId/cancel', requireAuth, subscriptionController.cancelSubscription);

/**
 * Stripe Webhook (No Auth)
 */
router.post('/webhook/stripe', subscriptionController.handleStripeWebhook);

export default router;
