import { Router } from 'express';
import { nexusCommandController } from '../controllers/NexusCommandController';

const router = Router();

/**
 * @route   POST /api/nexus/command
 * @desc    Execute a God Mode command
 * @access  Private (God Mode Authority Required)
 */
router.post('/command', nexusCommandController.executeCommand.bind(nexusCommandController));

/**
 * @route   GET /api/nexus/status
 * @desc    Get real-time neural health status
 * @access  Private
 */
router.get('/status', nexusCommandController.getNeuralStatus.bind(nexusCommandController));

export default router;
