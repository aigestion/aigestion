import request from 'supertest';
import express from 'express';

// Mock logger to avoid pino initialization issues
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  httpLogger: (_req: any, _res: any, next: any) => next(),
}));

describe('Dynamic Rate Limiter Middleware', () => {
  it('should initialize and respond when applied to routes', async () => {
    // Fresh import per test to avoid shared rate limiter state
    let dynamicRateLimiter: any;
    jest.isolateModules(() => {
      dynamicRateLimiter = require('../../middleware/rate-limit.middleware').dynamicRateLimiter;
    });

    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      (req as any).user = { id: 'test-user', role: 'god', subscriptionPlan: 'god' };
      next();
    });
    app.get('/test', dynamicRateLimiter, (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should set rate limit headers for standard users', async () => {
    let dynamicRateLimiter: any;
    jest.isolateModules(() => {
      dynamicRateLimiter = require('../../middleware/rate-limit.middleware').dynamicRateLimiter;
    });

    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      (req as any).user = { id: 'test-user', role: 'user', subscriptionPlan: 'free' };
      next();
    });
    app.get('/test', dynamicRateLimiter, (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    // express-rate-limit sets ratelimit-limit header (standard headers v7)
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });

  it('should process request without user (anonymous)', async () => {
    let dynamicRateLimiter: any;
    jest.isolateModules(() => {
      dynamicRateLimiter = require('../../middleware/rate-limit.middleware').dynamicRateLimiter;
    });

    const app = express();
    app.use(express.json());
    // No user middleware - anonymous request
    app.get('/test', dynamicRateLimiter, (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
  });
});
