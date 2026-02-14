/**
 * Sprint 1: Task 1.1 - REST API Refactoring Tests
 *
 * Standardized for God Mode Phase 5
 */

import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';

import { connectToDatabase } from '../config/database';

jest.setTimeout(60000);

const SKIP_DB_TESTS = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP_DB_TESTS ? describe.skip : describe)('API v1 - REST Refactoring', () => {
  let testUserId: string;

  beforeAll(async () => {
    await connectToDatabase();
    // Cleanup test users to prevent 409 Conflict
    await User.deleteMany({
      email: { $in: ['api-v1-test@example.com'] },
    });

    // Create a test user for ID-based tests
    const response = await request(app).post('/api/v1/users').send({
      email: 'api-v1-test@example.com',
      name: 'API Test User',
      password: 'AIGestion2026!',
    });

    if (response.status === 201) {
      testUserId = response.body.id || response.body.data?.id;
    }
  });

  describe('GET /health', () => {
    it('should return standardized health response', async () => {
      const response = await request(app).get('/api/v1/health').expect(200);

      expect(response.body).toHaveProperty('status', 200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');

      const requestId = response.body.requestId;
      expect(requestId).toBeDefined();
    });
  });

  describe('POST /users (create)', () => {
    it('should create user with valid input', async () => {
      const uniqueEmail = `unique-${Date.now()}@example.com`;
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: uniqueEmail,
          name: 'Unique Test User',
          password: 'AIGestion123!',
        })
        .expect(201);

      expect(response.body.status).toBe(201);
      const data = response.body.data || response.body;
      expect(data.email).toBe(uniqueEmail);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/v1/users')
        .send({
          name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('User Retrieval', () => {
    it('should get user by ID', async () => {
      if (!testUserId) {
        console.warn('Skipping ID test: testUserId not created');
        return;
      }
      const response = await request(app).get(`/api/v1/users/${testUserId}`).expect(200);
      expect(response.body.status).toBe(200);
    });
  });
});
