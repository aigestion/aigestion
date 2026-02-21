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

export default router;
