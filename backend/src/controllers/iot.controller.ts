import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

import { TYPES } from '../types';

/**
 * 🏠 IoT Controller
 * Receives events from the physical environment (Home Assistant, n8n)
 * and bridges them to the Nexus Intelligence.
 */
@injectable()
export class IoTController {
  constructor(@inject(TYPES.NeuralHomeBridge) private homeBridge: NeuralHomeBridge) {
    this.handleWebhook = this.handleWebhook.bind(this);
  }

  /**
   * Receives localized IoT events and ingests them into RAG context.
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { event, source, data } = req.body;
      const requestId = (req as any).requestId || 'unknown';

      logger.info({ event, source }, '[IoTController] Incoming event received');

      const result = await this.homeBridge.ingestIoTEvent(event, source, data);

      res.json(
        buildResponse(
          {
            status: 'ingested',
            neuralImpact: 'high',
            event: event,
            timestamp: new Date().toISOString(),
          },
          200,
          requestId,
        ),
      );
    } catch (error) {
      logger.error('Error in IoTController.handleWebhook:', error);
      next(error);
    }
  }
}
