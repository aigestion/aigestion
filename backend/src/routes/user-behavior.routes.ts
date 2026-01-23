import { Router } from 'express';
import { userBehaviorMiddleware } from '../middleware/user-behavior.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * User Behavior Analysis Routes
 */

// Get behavior statistics
router.get('/stats', (req: any, res: any) => userBehaviorMiddleware.getStats(req, res));

// Get user behavior profile
router.get('/profile/:userId', (req: any, res: any) =>
  userBehaviorMiddleware.getUserProfile(req as any, res),
);

// Get user anomalies
router.get('/anomalies/:userId', (req: any, res: any) =>
  userBehaviorMiddleware.getUserAnomalies(req as any, res),
);

// Get recent anomalies
router.get('/anomalies', (req: any, res: any) =>
  userBehaviorMiddleware.getRecentAnomalies(req, res),
);

// Resolve anomaly
router.post('/anomalies/:anomalyId/resolve', (req: any, res: any) =>
  userBehaviorMiddleware.resolveAnomaly(req, res),
);

// Track custom behavior event
router.post('/track', async (req: any, res: any) => {
  try {
    const { userId, eventType, metadata } = req.body;

    if (!userId || !eventType) {
      return res.status(400).json({
        success: false,
        error: 'userId and eventType are required',
      });
    }

    // Create mock request for behavior tracking
    const mockReq = {
      user: { id: userId, email: 'unknown@example.com' },
      ip: req.ip || 'unknown',
      get: (header: string) => req.get(header),
      path: req.path,
      method: req.method,
      query: req.query,
      body: metadata || {},
    } as any;

    // Create mock response
    const mockRes = {
      setHeader: () => { },
    } as any;

    // Apply behavior tracking
    await new Promise<void>(resolve => {
      userBehaviorMiddleware.trackBehavior(eventType as any)(mockReq as any, mockRes as any, () =>
        resolve(),
      );
    });

    res.json({
      success: true,
      message: 'Behavior event tracked successfully',
    });
  } catch (error) {
    logger.error('Error tracking behavior event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track behavior event',
    });
  }
});

// Get behavior health
router.get('/health', (req: any, res: any) => {
  try {
    const health = {
      status: 'healthy',
      service: 'user-behavior-analysis',
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Error getting behavior health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get behavior health',
    });
  }
});

export default router;
