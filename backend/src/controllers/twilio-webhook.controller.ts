// src/controllers/twilio-webhook.controller.ts
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { TwilioService } from '../services/twilio.service';
import { logger } from '../utils/logger';

@injectable()
export class TwilioWebhookController {
  constructor(
    @inject(TYPES.TwilioService) private twilioService: TwilioService
  ) {}

  /**
   * 📞 Handles the primary incoming call
   */
  public handleIncomingCall = async (req: Request, res: Response) => {
    logger.info('[TwilioWebhook] 🌌 Sovereign Call incoming from: ' + req.body.From);

    const greeting = 'Hola Alejandro, soy Daniela. He interceptado tu llamada en el Nodo Soberano. ¿En qué puedo asistirte hoy? Tus sistemas están operando a Nivel Dios.';
    const twiml = this.twilioService.generateSovereignTwiML(greeting);

    res.type('text/xml');
    res.send(twiml);
  };

  /**
   * 🛑 Handles call status changes
   */
  public handleStatusCallback = async (req: Request, res: Response) => {
    const { CallSid, CallStatus, CallDuration } = req.body;
    logger.info(`[TwilioWebhook] 📊 Call ${CallSid} status changed to: ${CallStatus}${CallDuration ? ` (${CallDuration}s)` : ''}`);
    res.sendStatus(200);
  };

  /**
   * 🚑 Handles emergency failover
   */
  public handleFailover = async (req: Request, res: Response) => {
    logger.warn('[TwilioWebhook] 🚑 Emergency Failover triggered for: ' + req.body.CallSid);

    const fallbackMessage = 'El sistema está experimentando una carga inusual, pero he activado los protocolos de respaldo. Daniela sigue aquí.';
    const twiml = this.twilioService.generateSovereignTwiML(fallbackMessage);

    res.type('text/xml');
    res.send(twiml);
  };

  /**
   * 🎙️ Handles recordings
   */
  public handleRecording = async (req: Request, res: Response) => {
    const { RecordingUrl, CallSid } = req.body;
    logger.info(`[TwilioWebhook] 🎙️ Recording received for ${CallSid}: ${RecordingUrl}`);
    res.sendStatus(200);
  };
}
