// src/controllers/phone-action.controller.ts
import type { NextFunction, Request, Response } from 'express';
import { container } from '../config/inversify.config';
import { buildResponse } from '../common/response-builder';
import { TYPES } from '../types';
import { ContactRegistryService } from '../services/contact-registry.service';
import { DanielaCallAgent } from '../services/daniela-call-agent.service';
import { TwilioService } from '../services/twilio.service';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE] Phone Action Controller
 * Handles phone call and SMS actions initiated by Daniela.
 *
 * Flow: Daniela intent → this controller → HA Companion push notification → Pixel dials
 */

/**
 * POST /ai/phone-action
 * Accepts: { action: 'call' | 'sms', contact: string, message?: string }
 *
 * For 'call': Sends push notification to Pixel 8 via HA Companion with tel: deep-link
 * For 'sms': Sends SMS via Twilio or push notification with sms: deep-link
 */
export const executePhoneAction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { action, contact, message } = req.body;
    const userRole = (req as any).user?.role;

    // 🔒 God Mode Only — phone actions are sovereign-level
    if (userRole !== 'god' && userRole !== 'admin') {
      return res
        .status(403)
        .json(
          buildResponse(
            { error: 'Phone actions require God Mode clearance' },
            403,
            (req as any).requestId || 'unknown',
          ),
        );
    }

    if (!action || !contact) {
      return res
        .status(400)
        .json(
          buildResponse(
            { error: 'Missing required fields: action, contact' },
            400,
            (req as any).requestId || 'unknown',
          ),
        );
    }

    const contactRegistry = container.get<ContactRegistryService>(TYPES.ContactRegistryService);
    const resolvedContact = contactRegistry.findByName(contact);

    if (!resolvedContact) {
      return res.json(
        buildResponse(
          {
            status: 'contact_not_found',
            message: `No encontré a "${contact}" en tu registro soberano de contactos. ¿Quieres que lo añada?`,
            availableContacts: contactRegistry.listContacts().map(c => c.name),
          },
          200,
          (req as any).requestId || 'unknown',
        ),
      );
    }

    logger.info(
      { action, contactName: resolvedContact.name, phone: resolvedContact.phone },
      '[PhoneAction] 🌌 Executing sovereign phone action',
    );

    if (action === 'call') {
      // 🌌 Hybrid: Pixel makes the call, Daniela speaks via TTS audio
      try {
        const homeBridge = container.get<NeuralHomeBridge>(TYPES.NeuralHomeBridge);

        if (message) {
          // Full Voice Agent: Generate TTS audio, push to Pixel via HA with audio URL
          const callAgent = container.get<DanielaCallAgent>(TYPES.DanielaCallAgent);
          const callCtx = await callAgent.initiateVoiceCall(
            contact,
            message,
            (req as any).user?.name || 'Alejandro',
          );

          await (homeBridge as any).triggerWebhook?.('daniela_call_bridge', {
            contact_name: resolvedContact.name,
            phone_number: resolvedContact.phone,
            action: 'voice_call',
            call_id: callCtx.callId,
            audio_url: callCtx.audioUrl,
            instructions: message,
            relationship: resolvedContact.relationship,
            priority: resolvedContact.priority,
          });

          return res.json(
            buildResponse(
              {
                status: 'voice_call_initiated',
                message: `📞 Daniela Voice Agent activado. Tu Pixel marcará a ${resolvedContact.name} y Daniela hablará por ti.`,
                contact: resolvedContact,
                callId: callCtx.callId,
                audioUrl: callCtx.audioUrl,
                script: callCtx.danielaScript,
                method: 'ha_companion_voice_agent',
              },
              200,
              (req as any).requestId || 'unknown',
            ),
          );
        }

        // Simple call: just open the dialer, user speaks
        await (homeBridge as any).triggerWebhook?.('daniela_call_bridge', {
          contact_name: resolvedContact.name,
          phone_number: resolvedContact.phone,
          action: 'simple_call',
          relationship: resolvedContact.relationship,
        });

        return res.json(
          buildResponse(
            {
              status: 'call_initiated',
              message: `📞 Abriendo marcador en tu Pixel 8. Contacto: ${resolvedContact.name} (${resolvedContact.phone})`,
              contact: resolvedContact,
              method: 'ha_companion_push',
            },
            200,
            (req as any).requestId || 'unknown',
          ),
        );
      } catch (haError) {
        logger.warn(
          { haError },
          '[PhoneAction] HA Companion unavailable, falling back to tel: URI',
        );
        return res.json(
          buildResponse(
            {
              status: 'call_fallback',
              message: `📞 HA no disponible. Usa este enlace para llamar:`,
              fallback_tel_uri: `tel:${resolvedContact.phone}`,
              contact: resolvedContact,
            },
            200,
            (req as any).requestId || 'unknown',
          ),
        );
      }
    }

    if (action === 'sms') {
      // For SMS: Use Twilio or HA push with sms: deep-link
      const smsBody = message || `Mensaje de ${resolvedContact.name} vía Daniela Sovereign Bridge`;

      try {
        const twilioService = container.get<TwilioService>(TYPES.TwilioService);
        const smsResult = await twilioService.sendSMS(resolvedContact.phone, smsBody);

        return res.json(
          buildResponse(
            {
              status: 'sms_sent',
              message: `📨 SMS enviado a ${resolvedContact.name}: "${smsBody}"`,
              messageSid: smsResult.sid,
              contact: resolvedContact,
            },
            200,
            (req as any).requestId || 'unknown',
          ),
        );
      } catch (smsError) {
        logger.error({ smsError }, '[PhoneAction] SMS failed');
        return res.json(
          buildResponse(
            {
              status: 'sms_failed',
              message: `❌ No pude enviar el SMS. Usa: sms:${resolvedContact.phone}`,
              fallback_sms_uri: `sms:${resolvedContact.phone}?body=${encodeURIComponent(smsBody)}`,
            },
            200,
            (req as any).requestId || 'unknown',
          ),
        );
      }
    }

    return res
      .status(400)
      .json(
        buildResponse(
          { error: `Unknown action: ${action}. Use 'call' or 'sms'.` },
          400,
          (req as any).requestId || 'unknown',
        ),
      );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /ai/contacts
 * Lists all sovereign contacts (God Mode only).
 */
export const listContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRole = (req as any).user?.role;
    if (userRole !== 'god' && userRole !== 'admin') {
      return res
        .status(403)
        .json(
          buildResponse(
            { error: 'Sovereign contacts require God Mode' },
            403,
            (req as any).requestId || 'unknown',
          ),
        );
    }

    const contactRegistry = container.get<ContactRegistryService>(TYPES.ContactRegistryService);
    const contacts = contactRegistry.listContacts();

    return res.json(
      buildResponse({ contacts, total: contacts.length }, 200, (req as any).requestId || 'unknown'),
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /ai/contacts
 * Adds a new sovereign contact (God Mode only).
 */
export const addContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRole = (req as any).user?.role;
    if (userRole !== 'god' && userRole !== 'admin') {
      return res
        .status(403)
        .json(
          buildResponse(
            { error: 'Adding contacts requires God Mode' },
            403,
            (req as any).requestId || 'unknown',
          ),
        );
    }

    const { name, aliases, phone, relationship, priority } = req.body;
    if (!name || !phone) {
      return res
        .status(400)
        .json(
          buildResponse(
            { error: 'Missing required fields: name, phone' },
            400,
            (req as any).requestId || 'unknown',
          ),
        );
    }

    const contactRegistry = container.get<ContactRegistryService>(TYPES.ContactRegistryService);
    contactRegistry.addContact({
      name,
      aliases: aliases || [name.toLowerCase()],
      phone,
      relationship: relationship || 'other',
      priority: priority || 'normal',
    });

    return res.json(
      buildResponse(
        { status: 'contact_added', message: `✅ Contacto "${name}" añadido al registro soberano.` },
        200,
        (req as any).requestId || 'unknown',
      ),
    );
  } catch (err) {
    next(err);
  }
};
