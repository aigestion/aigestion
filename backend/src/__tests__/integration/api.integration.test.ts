import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server';
import { DatabaseService } from '../src/services/database.service';
import { RedisService } from '../src/services/redis.service';

describe('API Integration Tests', () => {
  let server: any;
  let dbService: DatabaseService;
  let redisService: RedisService;

  beforeAll(async () => {
    // Initialize services
    dbService = new DatabaseService();
    redisService = new RedisService();

    await dbService.connect();
    await redisService.connect();

    // Start server
    server = app.listen(0); // Use random port
  });

  afterAll(async () => {
    // Cleanup
    await dbService.disconnect();
    await redisService.disconnect();
    server.close();
  });

  beforeEach(async () => {
    // Clean test data
    await dbService.clearTestData();
    await redisService.flushDb();
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/v1/auth/login - Valid credentials', async () => {
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    test('POST /api/v1/auth/login - Invalid credentials', async () => {
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    test('POST /api/v1/auth/refresh - Valid refresh token', async () => {
      // First login to get refresh token
      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      const response = await request(server)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });

  describe('User Endpoints', () => {
    let authToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create test user and get auth token
      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.data.accessToken;
      userId = loginResponse.body.data.user.id;
    });

    test('GET /api/v1/users/me - Authenticated user', async () => {
      const response = await request(server)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', userId);
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
    });

    test('PUT /api/v1/users/me - Update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        preferences: {
          theme: 'dark',
          notifications: false
        }
      };

      const response = await request(server)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.preferences.theme).toBe('dark');
    });

    test('GET /api/v1/users/me - Unauthorized', async () => {
      const response = await request(server)
        .get('/api/v1/users/me');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Conversation Endpoints', () => {
    let authToken: string;
    let conversationId: string;

    beforeEach(async () => {
      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.data.accessToken;
    });

    test('POST /api/v1/conversations - Create conversation', async () => {
      const conversationData = {
        title: 'Test Conversation',
        type: 'chat',
        participants: ['user_456']
      };

      const response = await request(server)
        .post('/api/v1/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(conversationData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Conversation');
      expect(response.body.data.type).toBe('chat');

      conversationId = response.body.data.id;
    });

    test('GET /api/v1/conversations - List conversations', async () => {
      const response = await request(server)
        .get('/api/v1/conversations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('conversations');
      expect(Array.isArray(response.body.data.conversations)).toBe(true);
    });

    test('POST /api/v1/conversations/:id/messages - Send message', async () => {
      // First create a conversation
      const createResponse = await request(server)
        .post('/api/v1/conversations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Message Test',
          type: 'chat'
        });

      const convId = createResponse.body.data.id;

      const messageData = {
        content: 'Hello, world!',
        type: 'text'
      };

      const response = await request(server)
        .post(`/api/v1/conversations/${convId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.content).toBe('Hello, world!');
    });
  });

  describe('AI Endpoints', () => {
    let authToken: string;

    beforeEach(async () => {
      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.data.accessToken;
    });

    test('POST /api/v1/ai/chat - Chat with AI', async () => {
      const chatData = {
        message: 'What is the weather like today?',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 100
      };

      const response = await request(server)
        .post('/api/v1/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('model', 'gpt-4');
      expect(response.body.data).toHaveProperty('usage');
      expect(typeof response.body.data.message).toBe('string');
      expect(response.body.data.message.length).toBeGreaterThan(0);
    });

    test('POST /api/v1/ai/chat - Invalid model', async () => {
      const chatData = {
        message: 'Hello',
        model: 'invalid-model'
      };

      const response = await request(server)
        .post('/api/v1/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_MODEL');
    });

    test('POST /api/v1/ai/voice/process - Process audio', async () => {
      const audioBuffer = Buffer.from('fake audio data');

      const response = await request(server)
        .post('/api/v1/ai/voice/process')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('audio', audioBuffer, 'test.wav')
        .field('language', 'en')
        .field('model', 'whisper-1');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transcript');
      expect(response.body.data).toHaveProperty('confidence');
      expect(typeof response.body.data.transcript).toBe('string');
    });
  });

  describe('Error Handling', () => {
    test('404 - Not Found', async () => {
      const response = await request(server)
        .get('/api/v1/nonexistent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    test('422 - Validation Error', async () => {
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: '' // Empty password
        });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toHaveProperty('fields');
    });

    test('429 - Rate Limit', async () => {
      // Make multiple rapid requests to trigger rate limit
      const promises = Array(20).fill(null).map(() =>
        request(server).get('/api/v1/users/me')
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponse = responses.find(res => res.status === 429);

      expect(rateLimitedResponse).toBeDefined();
      expect(rateLimitedResponse.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('WebSocket Integration', () => {
    let authToken: string;
    let ws: any;

    beforeEach(async () => {
      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      authToken = loginResponse.body.data.accessToken;
    });

    afterEach(() => {
      if (ws) {
        ws.close();
      }
    });

    test('WebSocket connection and message exchange', (done) => {
      const WebSocket = require('ws');

      ws = new WebSocket(`ws://localhost:${server.address().port}/socket.io?token=${authToken}`);

      ws.on('open', () => {
        // Send test message
        ws.send(JSON.stringify({
          type: 'join_conversation',
          data: { conversationId: 'test-conv' }
        }));
      });

      ws.on('message', (data) => {
        const message = JSON.parse(data);
        expect(message.type).toBeDefined();
        done();
      });

      ws.on('error', (error) => {
        done(error);
      });
    });
  });

  describe('Database Integration', () => {
    test('Database connection and operations', async () => {
      // Test database operations through service layer
      const testUser = {
        email: 'db-test@example.com',
        name: 'DB Test User',
        password: 'testpass123'
      };

      // Create user
      const createdUser = await dbService.user.create(testUser);
      expect(createdUser).toHaveProperty('id');
      expect(createdUser.email).toBe(testUser.email);

      // Read user
      const foundUser = await dbService.user.findById(createdUser.id);
      expect(foundUser).toBeTruthy();
      expect(foundUser.email).toBe(testUser.email);

      // Update user
      const updatedUser = await dbService.user.update(createdUser.id, {
        name: 'Updated DB User'
      });
      expect(updatedUser.name).toBe('Updated DB User');

      // Delete user
      await dbService.user.delete(createdUser.id);
      const deletedUser = await dbService.user.findById(createdUser.id);
      expect(deletedUser).toBeNull();
    });

    test('Redis caching operations', async () => {
      const testKey = 'test:integration:key';
      const testValue = { message: 'Hello from Redis!' };

      // Set value
      await redisService.set(testKey, testValue, 3600);

      // Get value
      const cachedValue = await redisService.get(testKey);
      expect(cachedValue).toEqual(testValue);

      // Delete value
      await redisService.del(testKey);
      const deletedValue = await redisService.get(testKey);
      expect(deletedValue).toBeNull();
    });
  });
});
