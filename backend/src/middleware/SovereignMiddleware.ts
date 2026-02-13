import { Request, Response, NextFunction } from 'express';
import { getCache } from '../cache/redis';
import { logger } from '../utils/logger';

/**
 * 🏛️ Sovereign Middleware
 * Protects critical endpoints by requiring a valid PQC-derived session token.
 */
export async function sovereignMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-sovereign-token'] as string;

  if (!token) {
    logger.warn(`[SovereignMiddleware] Missing token from ${req.ip}`);
    return res.status(403).json({
      error: 'SOVEREIGN_ACCESS_DENIED',
      message: 'This endpoint requires hardware-validated Sovereign Identity.',
    });
  }

  try {
    const symmetricKey = await getCache(`sovereign:session:${token}`);

    if (!symmetricKey) {
      logger.warn(`[SovereignMiddleware] Expired or invalid token: ${token}`);
      return res.status(401).json({
        error: 'SOVEREIGN_SESSION_EXPIRED',
        message:
          'Your Sovereign session has expired. Please re-authenticate with your hardware key.',
      });
    }

    // Inject the symmetric key into the request for downstream services (like VaultService)
    (req as any).sovereignKey = symmetricKey;
    (req as any).sovereignToken = token;

    next();
  } catch (error) {
    logger.error('[SovereignMiddleware] Validation error:', error);
    return res.status(500).json({ error: 'INTERNAL_SECURITY_ERROR' });
  }
}
