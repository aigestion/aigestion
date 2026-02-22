import { Router } from 'express';
import { container, TYPES } from '../config/inversify.config';
import { IoTController } from '../controllers/iot.controller';

const router = Router();

// Lazy-resolve controller for the route
const getController = () => container.get<IoTController>(TYPES.IoTController);

// ========================================
// GENERAL IoT WEBHOOKS
// ========================================

/**
 * @route   POST /api/v1/iot/webhook
 * @desc    Ingest physical events from Home Assistant/n8n
 * @access  Private (API Key Required)
 */
router.post('/webhook', (req, res, next) => getController().handleWebhook(req, res, next));

/**
 * @route   POST /api/v1/iot/pixel-test
 * @desc    Trigger a test God Mode alert on the Pixel 8
 * @access  Private
 */
router.post('/pixel-test', (req, res, next) => getController().triggerPixelTest(req, res, next));

// ========================================
// PIXEL SENSOR DATA
// ========================================

/**
 * @route   POST /api/v1/iot/pixel-sensors
 * @desc    Receive bulk sensor data from Pixel 8 (HA Companion / Tasker)
 * @access  Private
 */
router.post('/pixel-sensors', (req, res, next) => getController().ingestPixelSensors(req, res, next));

/**
 * @route   GET /api/v1/iot/pixel-sensors
 * @desc    Get latest sensor snapshot (for HA REST sensor pull)
 * @access  Private
 */
router.get('/pixel-sensors', (req, res, next) => getController().getPixelSensors(req, res, next));

/**
 * @route   GET /api/v1/iot/pixel-sensors/history
 * @desc    Get sensor history for the last N minutes (?minutes=60)
 * @access  Private
 */
router.get('/pixel-sensors/history', (req, res, next) => getController().getPixelSensorHistory(req, res, next));

/**
 * @route   GET /api/v1/iot/pixel-sensors/daily-stats
 * @desc    Get aggregated daily statistics from sensor data
 * @access  Private
 */
router.get('/pixel-sensors/daily-stats', (req, res, next) => getController().getPixelDailyStats(req, res, next));

/**
 * @route   POST /api/v1/iot/pixel-sensors/event
 * @desc    Receive a single sensor change event from HA webhook automation
 * @access  Private
 */
router.post('/pixel-sensors/event', (req, res, next) => getController().handleSensorEvent(req, res, next));

// ========================================
// N8N BRIDGE
// ========================================

/**
 * @route   GET /api/v1/iot/n8n/health
 * @desc    Check N8N connectivity status
 * @access  Private
 */
router.get('/n8n/health', (req, res, next) => getController().getN8nHealth(req, res, next));

export default router;
