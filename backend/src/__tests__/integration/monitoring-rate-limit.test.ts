import express from 'express';
import request from 'supertest';
import { RateLimitMiddleware } from '../../middleware/rate-limit.middleware';

jest.setTimeout(60000);

describe('Monitoring Rate Limit Isolation Test', () => {
  let app: express.Application;
  let redisMock: any;
  let loggerMock: any;

  beforeAll(() => {
    app = express();
    app.set('trust proxy', 1); // Important for rate limiting with X-Forwarded-For

    // In-memory mock for Redis
    const store = new Map<string, number>();
    redisMock = {
      isOpen: true,
      incr: jest.fn(async (key: string) => {
        const val = (store.get(key) || 0) + 1;
        store.set(key, val);
        return val;
      }),
      expire: jest.fn(async () => true),
    };

    loggerMock = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    };

    const rateLimiter = new RateLimitMiddleware(redisMock, loggerMock);
    const monitoringLimit = rateLimiter.attempt('MONITORING');

    app.get('/test-monitoring', monitoringLimit, (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  test('Should return 429 after 30 requests from the same IP', async () => {
    const endpoint = '/test-monitoring';
    const clientIp = '1.2.3.4';

    console.log(`Hammering ${endpoint} with IP ${clientIp}...`);

    for (let i = 1; i <= 30; i++) {
      const response = await request(app).get(endpoint).set('X-Forwarded-For', clientIp);

      if (response.status !== 200) {
        throw new Error(
          `Request ${i} failed unexpectedly with status ${response.status} at iteration ${i}`,
        );
      }
    }

    // 31st request
    const throttledResponse = await request(app).get(endpoint).set('X-Forwarded-For', clientIp);

    expect(throttledResponse.status).toBe(429);
    expect(throttledResponse.body.message).toMatch(/Por favor, inténtalo de nuevo más tarde/i); // Spanish message from middleware

    expect(redisMock.incr).toHaveBeenCalledTimes(31);
    console.log('✅ Rate limit isolation test passed: 429 received after 30 requests.');
  });
});
