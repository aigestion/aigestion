import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { config } from '../config/config';

/**
 * Content Security Policy Middleware
 * Provides different CSP configurations based on environment
 */
export const cspMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],

    // Script sources - more restrictive in production
    scriptSrc:
      config.nodeEnv === 'production'
        ? ["'self'"]
        : [
          "'self'",
          "'unsafe-eval'", // Required for React/Vite development
          "'unsafe-inline'", // Temporary for development
        ],

    // Style sources
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for TailwindCSS and inline styles
      'fonts.googleapis.com',
    ],

    // Image sources
    imgSrc: [
      "'self'",
      'data:',
      'https:',
      'blob:', // For file uploads and avatars
    ],

    // Connect sources - API endpoints and external services
    connectSrc: [
      "'self'",
      'ws:',
      'wss:',
      // AI/ML API endpoints
      'api.openai.com',
      'api.anthropic.com',
      'googleapis.com',
      'vertexai.googleapis.com',
      'pinecone.io',
      // Monitoring and analytics
      'sentry.io',
      'browser.sentry-cdn.com',
      // Development servers
      ...(config.nodeEnv === 'development' ? ['localhost:*', '127.0.0.1:*'] : []),
    ],

    // Font sources
    fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],

    // Security restrictions
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    childSrc: ["'none'"],
    workerSrc: ["'self'", 'blob:'],
    manifestSrc: ["'self'"],

    // Force HTTPS in production
    upgradeInsecureRequests: config.nodeEnv === 'production' ? [] : [],
  },

  // Report violations to monitoring endpoint
  reportOnly: config.nodeEnv === 'development',
});

/**
 * CSP Report Handler
 * Logs CSP violations for monitoring and debugging
 */
export const cspReportHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/csp-report' && req.method === 'POST') {
    const report = req.body;

    // Log CSP violation
    console.warn('CSP Violation:', {
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      report,
    });

    // In production, send to monitoring service
    if (config.nodeEnv === 'production') {
      try {
        const { container, TYPES } = require('../config/inversify.config');
        const errorReporting = container.get(TYPES.ErrorReportingService);
        errorReporting.reportViolation('CSP_POLICY', report);
      } catch (err) {
        console.error('Failed to report CSP violation', err);
      }
    }

    res.status(204).end();
    return;
  }

  next();
};

/**
 * Dynamic CSP for different routes
 * Adjusts CSP based on the route requirements
 */
export const dynamicCspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // More restrictive CSP for auth routes
  if (req.path.startsWith('/auth') || req.path.startsWith('/api/v1/auth')) {
    const authCsp = {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        childSrc: ["'none'"],
      },
    };

    return helmet.contentSecurityPolicy(authCsp)(req, res, next);
  }

  // Standard CSP for other routes
  return cspMiddleware(req, res, next);
};
