import { Router } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { buildResponse, buildError } from '../common/response-builder';
import { DeviceStateStore } from '../services/device-state.store';
import { NeuralHomeBridge } from '../services/google/neural-home.service';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /device-telemetry
 * Receives device state from HA / Tasker / n8n.
 * Body: { device, battery_level, location?, coords?, wifi_connected?, wifi_ssid?,
 *         bluetooth_connected?, car_mode?, type?, health?: {...}, timestamp? }
 */
router.post('/', async (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const body = req.body;
    const store = container.get<DeviceStateStore>(TYPES.DeviceStateStore);

    if (body.type === 'health') {
      // Health telemetry (Google Health Connect via n8n)
      store.updateHealthState({
        steps: body.steps,
        heart_rate: body.heart_rate,
        sleep_hours: body.sleep_hours,
        calories: body.calories,
        last_workout: body.last_workout,
        timestamp: body.timestamp || new Date().toISOString(),
      });

      // Ingest into RAG for long-term memory
      try {
        const homeBridge = container.get<NeuralHomeBridge>(TYPES.NeuralHomeBridge);
        await homeBridge.ingestIoTEvent('health_update', 'pixel_8', {
          steps: body.steps,
          heart_rate: body.heart_rate,
          sleep_hours: body.sleep_hours,
        });
      } catch (e) {
        logger.warn('[DeviceTelemetry] RAG ingest failed (non-critical)');
      }

      return res.json(buildResponse({ stored: true, type: 'health' }, 200, requestId));
    }

    // Standard device telemetry
    store.updateDeviceState({
      device: body.device || 'pixel_8',
      battery_level: body.battery_level ?? 100,
      battery_state: body.battery_state,
      location: body.location,
      coords: body.coords,
      wifi_connected: body.wifi_connected,
      wifi_ssid: body.wifi_ssid,
      bluetooth_connected: body.bluetooth_connected,
      car_mode: body.car_mode,
      sector: body.sector,
      timestamp: body.timestamp || new Date().toISOString(),
    });

    // Ingest location changes into RAG for Daniela's long-term memory
    if (body.location) {
      try {
        const homeBridge = container.get<NeuralHomeBridge>(TYPES.NeuralHomeBridge);
        await homeBridge.ingestIoTEvent('location_update', 'pixel_8', {
          location: body.location,
          sector: body.sector,
          battery: body.battery_level,
          coords: body.coords,
        });
      } catch (e) {
        logger.warn('[DeviceTelemetry] RAG ingest failed (non-critical)');
      }
    }

    res.json(buildResponse({ stored: true, type: 'device' }, 200, requestId));
  } catch (err: any) {
    logger.error(`[DeviceTelemetry] Error: ${err.message}`);
    res.status(500).json(buildError('Telemetry processing failed', 'TELEMETRY_ERROR', 500, requestId));
  }
});

/** GET /device-telemetry — returns current state */
router.get('/', (req: any, res: any) => {
  const requestId = req.requestId;
  try {
    const store = container.get<DeviceStateStore>(TYPES.DeviceStateStore);
    res.json(buildResponse({
      device: store.getDeviceState(),
      health: store.getHealthState(),
      context: store.buildContextBlock(),
    }, 200, requestId));
  } catch (err: any) {
    res.status(500).json(buildError('Failed to get state', 'STATE_ERROR', 500, requestId));
  }
});

export default router;
