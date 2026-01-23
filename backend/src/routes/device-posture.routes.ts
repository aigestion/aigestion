import { Router } from 'express';
import { container, TYPES } from '../config/inversify.config';
import { DevicePostureController } from '../controllers/DevicePostureController';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const controller = container.get<DevicePostureController>(TYPES.DevicePostureController);

/**
 * @openapi
 * /device-posture/me:
 *   get:
 *     summary: Get trusted devices for the current user
 *     tags: [Security]
 */
router.get('/me', protect, controller.getMyDevices);

/**
 * @openapi
 * /device-posture/register:
 *   post:
 *     summary: Register the current/new device as trusted
 *     tags: [Security]
 */
router.post('/register', protect, controller.registerDevice);

/**
 * @openapi
 * /device-posture/verify:
 *   get:
 *     summary: Manual posture check for the current request
 *     tags: [Security]
 */
router.get('/verify', protect, controller.verifyCurrentDevice);

/**
 * @openapi
 * /device-posture/{deviceId}:
 *   delete:
 *     summary: Revoke trust for a specific device
 *     tags: [Security]
 */
router.delete('/:deviceId', protect, controller.revokeDevice);

export default router;
