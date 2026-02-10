import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * Service-to-Service Authentication Middleware.
 * Validates X-API-Key against known microservice keys.
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(); // Pass to next middleware (likely JWT protect)
  }

  // Check against our known service keys
  const validKeys = [
    env.ML_SERVICE_API_KEY,
    env.IA_ENGINE_API_KEY,
  ];

  if (validKeys.includes(apiKey as string)) {
    // If it's a valid service key, we grant a "system" user context
    (req as any).user = {
      id: 'system-agent',
      email: 'service@aigestion.net',
      role: 'admin', // Microservices are granted high-level access
    };
    logger.debug(`[Auth] Validated microservice callback via X-API-Key`);
    return next();
  }

  // If a key was provided but it's invalid
  return res.status(403).json({
    success: false,
    message: 'Invalid Service API Key',
  });
};
