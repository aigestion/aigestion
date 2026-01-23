import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { buildResponse } from '../common/response-builder';
import { VoiceService } from '../services/voice.service';

const voiceRouter = Router();

/**
 * @openapi
 * /voice/daniela/webhook:
 *   post:
 *     summary: Webhook for Vapi (Daniela) to communicate with AIGestion
 *     tags: [Voice]
 */
voiceRouter.post('/daniela/webhook', async (req: any, res: any) => {
    const requestId = req.requestId;
    const payload = req.body;

    try {
        const voiceService = container.get<VoiceService>(TYPES.VoiceService);
        const result = await voiceService.processVapiMessage(payload);

        return res.status(200).json(result);
    } catch (error) {
        console.error('ERROR: Vapi Webhook Processing Failed:', error);
        return res.status(500).json(buildResponse({ error: 'Webhook processing failed' }, 500, requestId));
    }
});

export default voiceRouter;
