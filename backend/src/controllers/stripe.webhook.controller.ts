import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import Stripe from 'stripe';

import { User } from '../models/User';
import { StripeService } from '../services/stripe.service';
import { EmailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { TYPES } from '../types';

@controller('/api/v1/stripe/webhook')
export class StripeWebhookController {
  constructor(
    @inject(TYPES.StripeService) private stripeService: StripeService,
    @inject(TYPES.EmailService) private emailService: EmailService,
  ) {}

  @httpPost('/')
  async handleWebhook(@request() req: Request, @response() res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return (res as any).status(400).send('Webhook Error: Missing stripe-signature');
    }

    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        logger.error(
          'Webhook Error: Missing rawBody. parsing middleware configuration might be incorrect.',
        );
        return (res as any).status(400).send('Webhook Error: Missing rawBody');
      }

      // Use raw body for signature verification
      event = this.stripeService.constructEvent(rawBody, sig as string);
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      return (res as any).status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleCheckoutSessionCompleted(session);
          break;
        case 'customer.subscription.updated':
          const subscriptionUpdated = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionUpdated(subscriptionUpdated);
          break;
        case 'customer.subscription.deleted':
          const subscriptionDeleted = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionDeleted(subscriptionDeleted);
          break;
        default:
          logger.info(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      logger.error(error, 'Error processing webhook event');
      (res as any).status(500).json({ error: 'Webhook processing failed' });
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (!session.customer || !session.subscription) {
      return;
    }

    const user = await User.findOne({ email: session.customer_details?.email });
    if (user) {
      user.stripeCustomerId = session.customer as string;
      const status = session.subscription ? (session.subscription as any).status : 'active';
      user.subscriptionStatus = status;
      user.subscriptionId = (session.subscription as any).id;

      // Map Price ID to Role
      // Note: In real production, use session.line_items or retrieve subscription details
      // For now, we infer based on recent intent or default to 'professional' upgrade
      if (user.role === 'user') {
        user.role = 'professional'; // Default upgrade
      }

      await user.save();
      logger.info(`User ${user.email} subscription activated via checkout. New Role: ${user.role}`);

      // Send Welcome Email
      try {
        await this.emailService.sendEmail({
          to: user.email,
          subject: 'Bienvenido a NEXUS: Acceso Confirmado 🚀',
          html: `
            <h1>Bienvenido al Nivel ${user.role.toUpperCase()}</h1>
            <p>Tu suscripción ha sido activada correctamente.</p>
            <p>Accede a tu panel de control ahora: https://aigestion.net/dashboard</p>
            <br>
            <p><em>Sovereign Intelligence System</em></p>
          `,
        });
        logger.info(`Welcome email sent to ${user.email}`);
      } catch (emailError) {
        logger.error(emailError, `Failed to send welcome email to ${user.email}`);
      }
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
    if (user) {
      user.subscriptionStatus = subscription.status as any;
      user.subscriptionId = subscription.id;
      // Update plan info if changed
      await user.save();
      logger.info(`User ${user.email} subscription updated to ${subscription.status}`);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
    if (user) {
      user.subscriptionStatus = 'canceled';
      user.subscriptionId = undefined;
      await user.save();
      logger.info(`User ${user.email} subscription canceled`);
    }
  }
}
