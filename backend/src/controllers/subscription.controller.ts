import { Request, Response } from 'express';
import { Subscription } from '../models/subscription.model';
import { Plan } from '../models/plan.model';
import { buildResponse } from '../common/response-builder';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

/**
 * Get user subscription
 */
export const getUserSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { id: adminId, role } = req.user!;

    // Users can only access their own subscription, admins can access any
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    let subscription = await Subscription.findOne({ userId }).populate('planDetails').exec();

    // If no subscription exists, create a free one
    if (!subscription) {
      const freePlan = await Plan.findOne({ id: 'free' }).exec();

      if (!freePlan) {
        return res.status(500).json(buildResponse(null, 500, (req as any).requestId));
      }

      subscription = new Subscription({
        userId,
        planId: 'free',
        status: 'active',
        startDate: new Date(),
        autoRenew: false,
      });

      await subscription.save();
      // Reload to get virtuals
      subscription = await Subscription.findOne({ userId }).populate('planDetails').exec();
    }

    const plan = (subscription as any).planDetails;

    res.json(
      buildResponse(
        {
          id: subscription!._id,
          userId: subscription!.userId,
          planId: subscription!.planId,
          status: subscription!.status,
          startDate: subscription!.startDate,
          endDate: subscription!.endDate,
          trialEnd: subscription!.trialEnd,
          autoRenew: subscription!.autoRenew,
          lastPaymentDate: subscription!.lastPaymentDate,
          nextBillingDate: subscription!.nextBillingDate,
          planDetails: plan,
        },
        200,
        (req as any).requestId,
      ),
    );
  } catch (error) {
    console.error('[Subscription] Error getting subscription:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Validate subscription access
 */
export const validateSubscriptionAccess = async (req: Request, res: Response) => {
  try {
    const { userId, accessType } = req.body;
    const { id: adminId, role } = req.user!;

    // Users can only validate their own subscription
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    const subscription = await Subscription.findOne({ userId }).populate('planDetails').exec();

    if (!subscription) {
      return res.json(
        buildResponse(
          {
            isValid: false,
            plan: null,
            subscription: null,
            restrictions: {
              canAccessDashboard: false,
              canAccessMobile: false,
              canAccessAPI: false,
              maxProjectsReached: false,
              maxUsersReached: false,
              daysUntilExpiry: 0,
              isTrial: false,
              isExpired: true,
            },
            messages: ['No active subscription found'],
          },
          200,
          (req as any).requestId,
        ),
      );
    }

    const plan = (subscription as any).planDetails;
    if (!plan) {
      return res.status(500).json(buildResponse(null, 500, (req as any).requestId));
    }
    const now = new Date();
    const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const trialEnd = subscription.trialEnd ? new Date(subscription.trialEnd) : null;

    const isExpired = endDate && endDate < now;
    const isTrial = trialEnd && trialEnd > now && !endDate;
    const daysUntilExpiry = endDate
      ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : Infinity;

    const canAccessDashboard = !isExpired && (plan.hasDashboardAccess || isTrial);
    const canAccessMobile = !isExpired && (plan.hasMobileAccess || isTrial);
    const canAccessAPI = !isExpired && (plan.hasAPIAccess || isTrial);

    const validation = {
      isValid: !isExpired && subscription.status === 'active',
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        features: plan.features,
        maxProjects: plan.maxProjects,
        maxUsers: plan.maxUsers,
        hasDashboardAccess: plan.hasDashboardAccess,
        hasMobileAccess: plan.hasMobileAccess,
        hasAPIAccess: plan.hasAPIAccess,
        hasPrioritySupport: plan.hasPrioritySupport,
      },
      subscription: {
        userId: subscription.userId,
        planId: plan.id,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialEnd: subscription.trialEnd,
        autoRenew: subscription.autoRenew,
        lastPaymentDate: subscription.lastPaymentDate,
        nextBillingDate: subscription.nextBillingDate,
      },
      restrictions: {
        canAccessDashboard,
        canAccessMobile,
        canAccessAPI,
        maxProjectsReached: false, // TODO: Implement project counting
        maxUsersReached: false, // TODO: Implement user counting
        daysUntilExpiry,
        isTrial,
        isExpired,
      },
      messages: generateValidationMessages(accessType, plan, !!isExpired, !!isTrial, daysUntilExpiry || 0),
    };

    res.json(buildResponse(validation, 200, (req as any).requestId));
  } catch (error) {
    console.error('[Subscription] Error validating access:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Validate mobile subscription (for APK)
 */
export const validateMobileSubscription = async (req: Request, res: Response) => {
  try {
    const { userId, platform, appVersion } = req.body;
    const { id: adminId, role } = req.user!;

    // Users can only validate their own subscription
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    const subscription = await Subscription.findOne({ userId }).populate('planDetails').exec();

    if (!subscription) {
      return res.json(
        buildResponse(
          {
            userId,
            subscriptionStatus: 'inactive',
            planType: 'free',
            lastValidated: new Date().toISOString(),
          },
          200,
          (req as any).requestId,
        ),
      );
    }

    const plan = (subscription as any).planDetails;
    const now = new Date();
    const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
    const trialEnd = subscription.trialEnd ? new Date(subscription.trialEnd) : null;

    const isExpired = endDate && endDate < now;
    const isTrial = trialEnd && trialEnd > now && !endDate;

    let subscriptionStatus: 'active' | 'inactive' | 'expired' | 'trial' = 'inactive';
    if (isExpired) {
      subscriptionStatus = 'expired';
    } else if (isTrial) {
      subscriptionStatus = 'trial';
    } else if (subscription.status === 'active') {
      subscriptionStatus = 'active';
    }

    const mobileData = {
      userId,
      subscriptionStatus,
      planType: plan.id,
      expiryDate: subscription.endDate,
      trialEnd: subscription.trialEnd,
      lastValidated: new Date().toISOString(),
    };

    res.json(buildResponse(mobileData, 200, (req as any).requestId));
  } catch (error) {
    console.error('[Subscription] Error validating mobile subscription:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Create payment session
 */
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { userId, planId } = req.body;
    const { id: adminId, role } = req.user!;

    // Users can only create sessions for themselves
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    // Get plan details
    const plan = await Plan.findOne({ id: planId }).exec();
    if (!plan) {
      return res.status(404).json(buildResponse(null, 404, (req as any).requestId));
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
              images: [],
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId,
      },
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
    });

    res.json(
      buildResponse(
        {
          sessionId: session.id,
          url: session.url,
        },
        200,
        (req as any).requestId,
      ),
    );
  } catch (error) {
    console.error('[Subscription] Error creating payment session:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Update subscription
 */
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const { id: adminId, role } = req.user!;

    // Users can only update their own subscription
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    const subscription = await Subscription.findOne({ userId }).exec();
    if (!subscription) {
      return res.status(404).json(buildResponse(null, 404, (req as any).requestId));
    }

    Object.assign(subscription, updates);
    await subscription.save();

    res.json(buildResponse(subscription, 200, (req as any).requestId));
  } catch (error) {
    console.error('[Subscription] Error updating subscription:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { id: adminId, role } = req.user!;

    // Users can only cancel their own subscription
    if (role !== 'admin' && userId !== adminId) {
      return res.status(403).json(buildResponse(null, 403, (req as any).requestId));
    }

    const subscription = await Subscription.findOne({ userId }).exec();
    if (!subscription) {
      return res.status(404).json(buildResponse(null, 404, (req as any).requestId));
    }

    // Cancel at period end in Stripe
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json(
      buildResponse(
        { message: 'Subscription cancelled successfully' },
        200,
        (req as any).requestId,
      ),
    );
  } catch (error) {
    console.error('[Subscription] Error cancelling subscription:', error);
    res.status(500).json(buildResponse(null, 500, (req as any).requestId));
  }
};

/**
 * Generate validation messages
 */
function generateValidationMessages(
  accessType: string,
  plan: any,
  isExpired: boolean,
  isTrial: boolean,
  daysUntilExpiry: number,
): string[] {
  const messages: string[] = [];

  if (isExpired) {
    messages.push('Tu suscripción ha expirado. Renueva tu plan para continuar.');
    return messages;
  }

  if (isTrial) {
    messages.push(`Estás en período de prueba. Disfruta de todas las funciones premium.`);
    return messages;
  }

  if (plan.id === 'free') {
    if (accessType === 'dashboard') {
      messages.push('El dashboard completo requiere una suscripción de pago.');
    } else if (accessType === 'mobile') {
      messages.push('La aplicación móvil requiere una suscripción Básica o superior.');
    } else if (accessType === 'api') {
      messages.push('El acceso a API requiere una suscripción Profesional o Empresarial.');
    }
  }

  if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
    messages.push(
      `Tu suscripción expira en ${daysUntilExpiry} días. Renueva para evitar interrupciones.`,
    );
  }

  return messages;
}

/**
 * Stripe webhook handler
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleSuccessfulRenewal(invoice);
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancellation(subscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const { userId, planId } = session.metadata!;

    const subscription = await Subscription.findOne({ userId }).exec();
    const plan = await Plan.findOne({ id: planId }).exec();

    if (subscription && plan) {
      subscription.planId = plan.id;
      subscription.status = 'active';
      subscription.stripeSubscriptionId = session.subscription as string;
      subscription.startDate = new Date();
      subscription.lastPaymentDate = new Date();
      subscription.autoRenew = true;

      await subscription.save();
      console.log(`[Subscription] Payment successful for user ${userId}, plan ${planId}`);
    }
  } catch (error) {
    console.error('[Subscription] Error handling successful payment:', error);
  }
}

async function handleSuccessfulRenewal(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;

    const subscription = await Subscription.findOne({
      stripeSubscriptionId: subscriptionId,
    }).exec();

    if (subscription) {
      subscription.lastPaymentDate = new Date();
      subscription.status = 'active';

      await subscription.save();
      console.log(`[Subscription] Renewal successful for subscription ${subscriptionId}`);
    }
  } catch (error) {
    console.error('[Subscription] Error handling renewal:', error);
  }
}

async function handleSubscriptionCancellation(stripeSubscription: Stripe.Subscription) {
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: stripeSubscription.id,
    }).exec();

    if (subscription) {
      subscription.status = 'cancelled';
      subscription.endDate = new Date(stripeSubscription.cancel_at! * 1000);

      await subscription.save();
      console.log(
        `[Subscription] Cancellation processed for subscription ${stripeSubscription.id}`,
      );
    }
  } catch (error) {
    console.error('[Subscription] Error handling cancellation:', error);
  }
}
