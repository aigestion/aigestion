// src/routes/twilio.routes.ts
import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TwilioWebhookController } from '../controllers/twilio-webhook.controller';
import { TYPES } from '../types';

const router = Router();

/**
 * 📞 [GOD LEVEL] Twilio Webhook Routes
 * Handled by Sovereign Node Daniela
 */

router.post('/call-handler', (req, res) =>
  container
    .get<TwilioWebhookController>(TYPES.TwilioWebhookController)
    .handleIncomingCall(req, res),
);

router.post('/status-callback', (req, res) =>
  container
    .get<TwilioWebhookController>(TYPES.TwilioWebhookController)
    .handleStatusCallback(req, res),
);

router.post('/failover-handler', (req, res) =>
  container.get<TwilioWebhookController>(TYPES.TwilioWebhookController).handleFailover(req, res),
);

router.post('/handle-recording', (req, res) =>
  container.get<TwilioWebhookController>(TYPES.TwilioWebhookController).handleRecording(req, res),
);

export default router;
