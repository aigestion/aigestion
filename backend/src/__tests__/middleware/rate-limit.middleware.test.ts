import express from 'express';
import request from 'supertest';
import { config } from '../../config/config';
import { dynamicRateLimiter } from '../../middleware/rate-limit.middleware';

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

jest.mock('../../utils/redis', () => ({
  getClient: () => ({
    isOpen: true,
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(true),
  }),
}));

describe('Dynamic Rate Limiter Middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock user middleware
    app.use((req, res, next) => {
      const role = req.headers['x-test-role'] as string;
      const plan = req.headers['x-test-plan'] as string;

      if (role || plan) {
        (req as any).user = {
          id: 'test-user',
          role: role || 'user',
          subscriptionPlan: plan || 'free',
        };
      }
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and respond when applied to routes', async () => {
    app.get('/test', dynamicRateLimiter, (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test').set('x-test-role', 'god');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should set rate limit headers for standard users (free)', async () => {
    app.get('/test', dynamicRateLimiter, (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test').set('x-test-plan', 'free');
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBeDefined();
    expect(res.headers['ratelimit-limit']).toBe(config.rateLimit.plans.free.max.toString());
  });

  it('should apply PRO limit', async () => {
    app.get('/test', dynamicRateLimiter, (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test').set('x-test-plan', 'pro');
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe(config.rateLimit.plans.pro.max.toString());
  });

  it('should skip rate limiting for GOD role', async () => {
    app.get('/test', dynamicRateLimiter, (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test').set('x-test-role', 'god');
    expect(res.status).toBe(200);
    // God role skips the limiter, so header should be undefined (no rate limit headers sent)
    expect(res.headers['ratelimit-limit']).toBeUndefined();
  });

  it('should process request without user (anonymous) and apply default limit', async () => {
    app.get('/test', dynamicRateLimiter, (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe(config.rateLimit.plans.default.max.toString());
  });
});
