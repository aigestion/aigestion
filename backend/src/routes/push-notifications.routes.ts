// src/routes/push-notifications.routes.ts
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { NexusPushService } from '../services/nexus-push.service';
import { buildResponse } from '../common/response-builder';
import { logger } from '../utils/logger';

// Minimal auth guard (inline, no overhead)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json(buildResponse({ error: 'Unauthorized' }, 401, 'unknown'));
  next();
};

const requireGod = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user?.role;
  if (role !== 'god' && role !== 'admin')
    return res.status(403).json(buildResponse({ error: 'God Mode required' }, 403, 'unknown'));
  next();
};

const router = Router();

/**
 * POST /push/register
 * Save FCM token for authenticated user.
 * Called by the mobile dashboard on first load.
 */
router.post('/register', requireAuth, (req: Request, res: Response) => {
  try {
    const { fcmToken } = req.body;
    const userId = (req as any).user?.id || 'sovereign';

    if (!fcmToken) {
      return res.status(400).json(buildResponse({ error: 'fcmToken required' }, 400, 'unknown'));
    }

    const pushService = container.get<NexusPushService>(TYPES.NexusPushService);
    pushService.registerToken(userId, fcmToken);

    logger.info({ userId }, '[PushRoutes] 📱 FCM token registered');
    return res.json(
      buildResponse({ status: 'registered', message: '🔔 Device registered for NEXUS push notifications' }, 200, 'unknown'),
    );
  } catch (err) {
    logger.error(err, '[PushRoutes] Register error');
    return res.status(500).json(buildResponse({ error: 'Registration failed' }, 500, 'unknown'));
  }
});

/**
 * POST /push/test
 * Send a test notification to a specific token (God Mode only).
 */
router.post('/test', requireAuth, requireGod, async (req: Request, res: Response) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json(buildResponse({ error: 'fcmToken required' }, 400, 'unknown'));
    }

    const pushService = container.get<NexusPushService>(TYPES.NexusPushService);
    const success = await pushService.sendTestNotification(fcmToken);

    return res.json(
      buildResponse(
        { status: success ? 'sent' : 'failed', message: success ? '✅ Test push enviado' : '❌ Push falló — verifica el token' },
        200,
        'unknown',
      ),
    );
  } catch (err) {
    logger.error(err, '[PushRoutes] Test push error');
    return res.status(500).json(buildResponse({ error: 'Test push failed' }, 500, 'unknown'));
  }
});

/**
 * POST /push/notify
 * Send custom notification to a user (God Mode only).
 */
router.post('/notify', requireAuth, requireGod, async (req: Request, res: Response) => {
  try {
    const { userId, title, body, data, channel } = req.body;
    if (!userId || !title || !body) {
      return res.status(400).json(buildResponse({ error: 'userId, title, body required' }, 400, 'unknown'));
    }

    const pushService = container.get<NexusPushService>(TYPES.NexusPushService);
    const success = await pushService.sendToUser(userId, { title, body, data, channel });

    return res.json(
      buildResponse({ status: success ? 'sent' : 'no_tokens', delivered: success }, 200, 'unknown'),
    );
  } catch (err) {
    logger.error(err, '[PushRoutes] Notify error');
    return res.status(500).json(buildResponse({ error: 'Notify failed' }, 500, 'unknown'));
  }
});

export default router;
