import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { PixelSensorService } from '../services/iot/PixelSensorService';
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
  constructor(
    @inject(TYPES.NeuralHomeBridge) private homeBridge: NeuralHomeBridge,
    @inject(TYPES.PixelSensorService) private pixelSensor: PixelSensorService,
  ) {
    this.handleWebhook = this.handleWebhook.bind(this);
    this.getPixelSensors = this.getPixelSensors.bind(this);
    this.getPixelDailyStats = this.getPixelDailyStats.bind(this);
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

  /**
   * GET /v1/iot/pixel-sensors
   * Returns the latest sensor snapshot from the Pixel 8.
   */
  public getPixelSensors(req: Request, res: Response, next: NextFunction): void {
    try {
      const requestId =
        ((req as unknown as Record<string, unknown>).requestId as string) || 'unknown';
      const data = this.pixelSensor.getLatestSnapshot();
      res.json(buildResponse({ success: true, data }, 200, requestId));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/iot/pixel-sensors/daily-stats
   * Returns aggregated daily stats from the Pixel 8 sensor history.
   */
  public getPixelDailyStats(req: Request, res: Response, next: NextFunction): void {
    try {
      const requestId =
        ((req as unknown as Record<string, unknown>).requestId as string) || 'unknown';
      const raw = this.pixelSensor.getDailyStats();
      const data = {
        success: true,
        steps: raw.totalSteps,
        battery_avg: raw.averageBattery,
        active_minutes: raw.screenOnTime,
        sleep_score: null,
        dominant_activity: raw.dominantActivity,
        zones_visited: raw.zonesVisited,
        total_readings: raw.totalReadings,
      };
      res.json(buildResponse(data, 200, requestId));
    } catch (error) {
      next(error);
    }
  }
}
