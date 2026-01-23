import request from 'supertest';
import { app } from '../app';

// Mock Redis to avoid connection issues during tests
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    disconnect: jest.fn().mockResolvedValue(undefined),
    sendCommand: jest.fn().mockResolvedValue('OK'),
  })),
}));

// Mock services to avoid actual DB/AI calls
jest.mock('../services/auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      login: jest.fn().mockResolvedValue({
        user: {
          id: 'user_123',
          email: 'test@example.com',
          name: 'Test User',
          toObject: () => ({ id: 'user_123', email: 'test@example.com', name: 'Test User' }),
        },
        token: 'mock_jwt_token',
        refreshToken: 'mock_refresh_token',
      }),
    })),
  };
});

jest.mock('../services/ai.service', () => {
  return {
    AIService: jest.fn().mockImplementation(() => ({
      chat: jest.fn().mockResolvedValue('This is a mock AI response'),
    })),
  };
});

// Mock container to return mocked services
jest.mock('../config/inversify.config', () => {
  const mockAuthService = new (require('../services/auth.service').AuthService)();
  const mockAIService = new (require('../services/ai.service').AIService)();

  return {
    container: {
      get: jest.fn((key) => {
        const keyStr = key.toString();
        if (keyStr.includes('AuthService')) return mockAuthService;
        if (keyStr.includes('AIService')) return mockAIService;
        // Check for SwarmController
        if (keyStr.includes('SwarmController')) {
          const express = require('express');
          return {
            router: express.Router(),
            executeTool: jest.fn(),
            getGodState: jest.fn(),
            createMission: jest.fn(),
            getMission: jest.fn()
          };
        }
        return {
          getOverview: jest.fn().mockResolvedValue({}),
          getDashboardData: jest.fn().mockResolvedValue({ revenue: [], users: [], conversions: [] }),
          getUserActivity: jest.fn().mockResolvedValue({ range: '24h', data: [] })
        };
      }),
    },
  };
});

describe('Task 1.3: Auth & AI GraphQL', () => {
  describe('Mutation: login', () => {
    it('should return token and user on successful login', async () => {
      const mutation = `
        mutation {
          login(email: "test@example.com", password: "password123") {
            token
            user {
              id
              email
              name
            }
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login).toBeDefined();
      expect(response.body.data.login.token).toBe('mock_jwt_token');
      expect(response.body.data.login.user.email).toBe('test@example.com');
    });
  });

  describe('Query: chat', () => {
    it('should return AI response', async () => {
      const query = `
        query {
          chat(message: "Hello Nexus")
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query });

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.chat).toBe('This is a mock AI response');
    });
  });
});
