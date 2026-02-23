import { Router } from 'express';
import { container, TYPES } from '../config/inversify.config';
import { IoTController } from '../controllers/iot.controller';

const router = Router();

// Lazy-resolve controller for the route
const getController = () => container.get<IoTController>(TYPES.IoTController);

/**
 * @route   POST /api/v1/iot/webhook
 * @desc    Ingest physical events from Home Assistant/n8n
 * @access  Private (API Key Required)
 */
router.post('/webhook', (req, res, next) => getController().handleWebhook(req, res, next));

/**
 * @route   GET /api/v1/iot/pixel-sensors
 * @desc    Get latest Pixel 8 sensor snapshot
 */
router.get('/pixel-sensors', (req, res, next) => getController().getPixelSensors(req, res, next));

/**
 * @route   GET /api/v1/iot/pixel-sensors/daily-stats
 * @desc    Get aggregated daily stats from Pixel sensor history
 */
router.get('/pixel-sensors/daily-stats', (req, res, next) =>
  getController().getPixelDailyStats(req, res, next),
);

export default router;
