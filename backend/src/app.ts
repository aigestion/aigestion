import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xssClean from 'xss-clean';

// Middleware to ensure every JSON response follows the standard API for
import { config } from './config/config';
import { setupSwagger } from './docs/swagger';
import { createGraphQLRouter } from './graphql/router';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestIdMiddleware } from './middleware/requestId.middleware';
import routes from './routes';
import mcpRouter from './routes/mcp.routes';
import { logger } from './utils/logger';

import { buildResponse } from './common/response-builder';
import getRedisClient from './utils/redis';

const app = express();
app.set('trust proxy', 1);

// Request Traceability
app.use(requestIdMiddleware);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
      },
    },
  })
);
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      const allowedOrigins = config.cors.origin;
      const isAllowed =
        !origin ||
        allowedOrigins === '*' ||
        (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate limiting middleware (Granular Redis-backed)
import { rateLimiter } from './middleware/rate-limiter.instance';

// Apply 'GENERAL' rate limiter to all API routes
// Use looser general limit globally (1000 req/min)
// Specific routes (Auth/AI) will have tighter limits applied in their routers
if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  app.use('/api/v1', rateLimiter.attempt('GENERAL'));
}

// Security middlewares
app.use(hpp() as any);
app.use(xssClean() as any);

// app.use(responseTime());

// Performance Middleware
app.use(
  compression({
    level: 7, // Slightly higher compression
    threshold: 512, // Compress smaller payloads for mobile speed
  }) as any
);

// Logging Middleware
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
    skip: (req: Request) => req.url === '/api/v1/health',
  })
);

// Request Parsing
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res: Response, buf: Buffer) => {
      if (req.originalUrl.includes('/stripe/webhook')) {
        req.rawBody = buf;
      }
    },
  })
);
app.use(cookieParser());

// Mount Routes
setupSwagger(app);

// Health checks are now handled in api-v1.routes.ts
app.use('/api/v1', routes);
app.use('/mcp', mcpRouter);
app.use('/graphql', createGraphQLRouter());

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  const client = getRedisClient();
  if (client && client.isOpen) {
    logger.info('Shutting down Redis...');
    try {
      await client.quit();
    } catch (err) {
      logger.error('Error during Redis shutdown', err);
    }
  }
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { app };
