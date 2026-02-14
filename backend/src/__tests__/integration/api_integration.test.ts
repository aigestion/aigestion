/**
 * API Integration Tests (V3 Clean)
 */
import request from 'supertest';

jest.setTimeout(60000);

const RUN_INT = process.env.RUN_INTEGRATION_TESTS === 'true';

(RUN_INT ? describe : describe.skip)('API Integration Tests', () => {
  let server: any;

  beforeAll(async () => {
    const { app } = await import('../../app');
    const { connectToDatabase } = await import('../../config/database');

    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/aigestion-platform';
    }

    await connectToDatabase();
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) server.close();
  });

  test('GET /health - Status check', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);
  });

  test('POST /api/v1/auth/login - Auth flow', async () => {
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      name: 'Integration Test User',
      password: 'AIGestion2026!'
    };

    // Create user
    await request(server).post('/api/v1/users').send(testUser);

    // Login
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.token).toBeDefined();
  });
});
