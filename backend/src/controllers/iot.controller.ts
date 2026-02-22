import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { PixelBridgeService } from '../services/iot/PixelBridgeService';
import { PixelSensorService } from '../services/iot/PixelSensorService';
import { N8nBridgeService } from '../services/iot/N8nBridgeService';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

import { TYPES } from '../types';
import { SocketService } from '../services/socket.service';

/**
 * 🏠 IoT Controller
 * Receives events from the physical environment (Home Assistant, n8n, Pixel Sensors)
 * and bridges them to the Nexus Intelligence.
 */
@injectable()
export class IoTController {
  constructor(
    @inject(TYPES.NeuralHomeBridge) private homeBridge: NeuralHomeBridge,
    @inject(TYPES.PixelBridgeService) private pixelBridge: PixelBridgeService,
    @inject(TYPES.PixelSensorService) private pixelSensor: PixelSensorService,
    @inject(TYPES.N8nBridgeService) private n8nBridge: N8nBridgeService,
    @inject(TYPES.SocketService) private socketService: SocketService,
  ) {
    this.handleWebhook = this.handleWebhook.bind(this);
    this.triggerPixelTest = this.triggerPixelTest.bind(this);
    this.ingestPixelSensors = this.ingestPixelSensors.bind(this);
    this.getPixelSensors = this.getPixelSensors.bind(this);
    this.getPixelSensorHistory = this.getPixelSensorHistory.bind(this);
    this.handleSensorEvent = this.handleSensorEvent.bind(this);
    this.getPixelDailyStats = this.getPixelDailyStats.bind(this);
    this.getN8nHealth = this.getN8nHealth.bind(this);
  }

  /**
   * Receives localized IoT events and ingests them into RAG context.
   */
  public async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { event, source, data } = req.body;
      const requestId = (req as any).requestId || 'unknown';

      logger.info({ event, source }, '[IoTController] Incoming event received');

      // Bridge to Metaverse Presence if applicable
      if (event === 'meta_presence_enter' || event === 'meta_presence_exit') {
        this.socketService.emit('meta_presence', {
          event,
          source,
          data,
          timestamp: new Date().toISOString(),
        });
      }

      const result = await this.homeBridge.ingestIoTEvent(event, source, data);

      // Forward to N8N if configured
      this.n8nBridge.sendSensorEvent(event, { source, data }).catch(err => {
        logger.warn({ error: err.message }, '[IoTController] N8N forward failed (non-blocking)');
      });

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
   * Triggers a test "God Mode" alert on the Pixel 8.
   */
  public async triggerPixelTest(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const success = await this.pixelBridge.triggerGodModeAlert(
        'TEST: Sistema Nexus en Nivel God Activado.',
      );

      res.json(
        buildResponse(
          {
            status: success ? 'sent' : 'failed',
            target: 'Pixel 8 Sovereign',
            timestamp: new Date().toISOString(),
          },
          success ? 200 : 500,
          requestId,
        ),
      );
    } catch (error) {
      logger.error('Error in IoTController.triggerPixelTest:', error);
      next(error);
    }
  }

  /**
   * POST /pixel-sensors
   * Receives bulk sensor data from the Pixel 8 (via HA Companion or Tasker).
   */
  public async ingestPixelSensors(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const snapshot = req.body;

      if (!snapshot || !snapshot.deviceId) {
        res
          .status(400)
          .json(buildResponse({ error: 'Missing deviceId in sensor payload' }, 400, requestId));
        return;
      }

      const result = await this.pixelSensor.ingestSnapshot(snapshot);

      // Forward significant transitions to N8N
      for (const transition of result.transitions) {
        if (transition.significance === 'high') {
          if (transition.type === 'zone_change') {
            const direction = transition.to === 'unknown' ? 'leave' : 'enter';
            this.n8nBridge
              .sendZoneTransition(
                direction === 'enter' ? transition.to : transition.from,
                direction,
                { from: transition.from, to: transition.to },
              )
              .catch(() => {});
          }
          if (transition.type === 'battery_critical') {
            this.n8nBridge
              .sendBatteryAlert(
                parseInt(transition.to, 10),
                snapshot.batteryState || 'unknown',
                snapshot.batteryTemperature,
              )
              .catch(() => {});
          }
          if (transition.type === 'incoming_call') {
            this.n8nBridge
              .sendIncomingCall({
                phoneState: transition.to,
                context: result.contextLevel,
              })
              .catch(() => {});
          }
        }
      }

      // Deep Sync: Always mirror physical context to N8N
      this.n8nBridge
        .sendDeepContextSync({
          level: result.contextLevel,
          snapshot: snapshot,
          transitions: result.transitions,
        })
        .catch(err => {
          logger.warn({ error: err.message }, '[IoTController] Deep context sync failed');
        });

      res.json(
        buildResponse(
          {
            status: 'ingested',
            contextLevel: result.contextLevel,
            transitions: result.transitions,
            timestamp: new Date().toISOString(),
          },
          200,
          requestId,
        ),
      );
    } catch (error) {
      logger.error('Error in IoTController.ingestPixelSensors:', error);
      next(error);
    }
  }

  /**
   * GET /pixel-sensors
   * Returns the latest sensor snapshot (used by HA REST sensor pull).
   */
  public async getPixelSensors(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const data = this.pixelSensor.getLatestSnapshot();

      res.json(buildResponse(data, 200, requestId));
    } catch (error) {
      logger.error('Error in IoTController.getPixelSensors:', error);
      next(error);
    }
  }

  /**
   * GET /pixel-sensors/history
   * Returns sensor history for the last N minutes.
   */
  public async getPixelSensorHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const minutes = parseInt(req.query.minutes as string, 10) || 60;
      const history = this.pixelSensor.getHistory(minutes);

      res.json(
        buildResponse(
          {
            count: history.length,
            minutes,
            snapshots: history,
          },
          200,
          requestId,
        ),
      );
    } catch (error) {
      logger.error('Error in IoTController.getPixelSensorHistory:', error);
      next(error);
    }
  }

  /**
   * POST /pixel-sensors/event
   * Receives a single sensor change event from HA webhook automation.
   */
  public async handleSensorEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const { event_type, entity_id, new_state, old_state } = req.body;

      logger.info({ event_type, entity_id }, '[IoTController] Sensor event received');

      // Ingest into neural context
      await this.homeBridge.ingestIoTEvent(
        event_type || 'sensor_change',
        entity_id || 'ha_sensor',
        { new_state, old_state, entity_id },
      );

      // Forward to N8N
      this.n8nBridge
        .sendSensorEvent(event_type || 'sensor_change', {
          entity_id,
          new_state,
          old_state,
        })
        .catch(() => {});

      res.json(
        buildResponse(
          {
            status: 'processed',
            entity: entity_id,
            timestamp: new Date().toISOString(),
          },
          200,
          requestId,
        ),
      );
    } catch (error) {
      logger.error('Error in IoTController.handleSensorEvent:', error);
      next(error);
    }
  }

  /**
   * GET /pixel-sensors/daily-stats
   * Returns aggregated daily statistics from sensor data.
   */
  public async getPixelDailyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const stats = this.pixelSensor.getDailyStats();

      res.json(buildResponse(stats, 200, requestId));
    } catch (error) {
      logger.error('Error in IoTController.getPixelDailyStats:', error);
      next(error);
    }
  }

  /**
   * GET /n8n/health
   * Returns N8N connectivity status.
   */
  public async getN8nHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = (req as any).requestId || 'unknown';
      const health = await this.n8nBridge.healthCheck();

      res.json(buildResponse(health, health.connected ? 200 : 503, requestId));
    } catch (error) {
      logger.error('Error in IoTController.getN8nHealth:', error);
      next(error);
    }
  }
}
