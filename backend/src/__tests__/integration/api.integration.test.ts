/**
 * API Integration Tests
 *
 * These tests require a fully running server with real MongoDB and Redis connections.
 * They are skipped in unit test mode (NODE_ENV=test) and should only be run
 * as part of a dedicated integration test pipeline with `npm run test:integration`.
 *
 * To run: RUN_INTEGRATION_TESTS=true npx jest --runInBand api.integration.test.ts
 */

const SKIP_INTEGRATION = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP_INTEGRATION ? describe.skip : describe)('API Integration Tests', () => {
  let server: any;
  let dbService: any;
  let redisService: any;

  beforeAll(async () => {
    // Dynamic imports to avoid compilation errors when skipped
    const { app } = await import('../../app');
    const { connectToDatabase } = await import('../../config/database');
    process.env.MONGODB_URI =
      'mongodb://admin:AWReTznw7k3Sf4lWFEenRw@localhost:27017/aigestion-platform?authSource=admin';
    await connectToDatabase();

    dbService = {};
    redisService = {};
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) server.close();
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/v1/auth/login - Valid credentials', async () => {
      const request = require('supertest');

      // Create user first
      await request(server).post('/api/v1/users').send({
        email: 'test@example.com',
        name: 'Integration Test User',
        password: 'AIGestion2026!',
      });

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'AIGestion2026!' });

      expect(response.status).toBe(200);
    });
  });

  describe('Health Check', () => {
    test('GET /health should return status', async () => {
      const request = require('supertest');
      const response = await request(server).get('/health');
      expect(response.status).toBeDefined();
    });
  });
});
