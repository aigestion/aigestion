import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Enhanced Rate Limiting Configuration
 * Different limits for different user tiers and endpoints
 */
export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message: message || `Rate limit exceeded. Maximum ${max} requests per ${windowMs}ms.`,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Tier-based rate limiting
 */
export const rateLimiters = {
  // Free tier - 100 requests per 15 minutes
  free: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100,
    'Free tier limit exceeded. Upgrade to Pro for higher limits.',
  ),

  // Pro tier - 1000 requests per 15 minutes
  pro: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    1000,
    'Pro tier rate limit exceeded.',
  ),

  // Enterprise tier - 10000 requests per 15 minutes
  enterprise: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    10000,
    'Enterprise tier rate limit exceeded.',
  ),

  // Authentication endpoints - stricter limits
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many authentication attempts. Please try again later.',
  ),

  // AI endpoints - moderate limits
  ai: createRateLimiter(
    1 * 60 * 1000, // 1 minute
    10,
    'AI service rate limit exceeded. Please wait before making another request.',
  ),

  // File upload endpoints - very strict limits
  upload: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10,
    'Upload rate limit exceeded. Please wait before uploading more files.',
  ),
};

/**
 * Dynamic rate limiting based on user tier
 */
export const dynamicRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Get user tier from request (would be set by auth middleware)
  const userTier = (req as any).user?.tier || 'free';

  // Apply appropriate rate limiter
  const limiter = rateLimiters[userTier] || rateLimiters.free;
  return limiter(req, res, next);
};

/**
 * Enhanced Security Headers
 */
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'ws:',
        'wss:',
        'api.openai.com',
        'api.anthropic.com',
        'googleapis.com',
        'vertexai.googleapis.com',
        'pinecone.io',
      ],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'", 'blob:'],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },

  // Other security headers
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
});

/**
 * IP-based security middleware
 */
export const ipSecurity = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = (req.ip || req.connection.remoteAddress || 'unknown') as string;

  // Block known malicious IPs (would be populated from threat intelligence)
  const blockedIPs = new Set<string>();

  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied from this IP address.',
    });
  }

  // Check for suspicious patterns
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [/bot/i, /crawler/i, /scanner/i, /sqlmap/i, /nikto/i];
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));

  if (isSuspicious) {
    console.warn('Suspicious request detected:', {
      ip: clientIP,
      userAgent,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    // Apply stricter rate limiting for suspicious requests
    return rateLimiters.auth(req, res, next);
  }

  next();
};

/**
 * Request size limiting middleware
 */
export const requestSizeLimit = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');

    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);

      if (sizeInBytes > maxSizeInBytes) {
        return res.status(413).json({
          error: 'Payload Too Large',
          message: `Request size exceeds maximum allowed size of ${maxSize}.`,
        });
      }
    }

    next();
  };
};

/**
 * Helper function to parse size strings (e.g., '10mb' -> bytes)
 */
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = size.toLowerCase().match(/^(\d+)(b|kb|mb|gb)$/);
  if (!match) {
    throw new Error(`Invalid size format: ${size}`);
  }

  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

/**
 * Security monitoring middleware
 */
export const securityMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    if (duration > 5000) {
      console.warn('Slow request detected:', {
        method: req.method,
        path: req.path,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    if (res.statusCode >= 400) {
      console.warn('Error response:', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }
  });

  next();
};

/**
 * API key validation middleware
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('X-API-Key');

  const publicPaths = ['/health', '/metrics', '/docs', '/api/v1/auth/login'];
  const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
  if (isPublicPath) {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required.',
    });
  }

  if (!apiKey.startsWith('nexus_') || apiKey.length !== 40) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key format.',
    });
  }

  next();
};

export const requireApiKey = validateApiKey;
