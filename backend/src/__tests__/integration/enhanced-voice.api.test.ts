import request from 'supertest';

// Mock Supabase globally to prevent side effects in tests
jest.mock('../../services/supabase.service', () => ({
  SupabaseService: {
    getInstance: jest.fn().mockReturnValue({
      client: {},
      initializeRealtimeSubscriptions: jest.fn(),
    }),
  },
}));
import { app } from '../../app';
import { container } from '../../config/inversify.config';
import { EnhancedVoiceService } from '../../services/enhanced-voice.service';
import { RateLimitService } from '../../services/rate-limit.service';
import { TYPES } from '../../types';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { User } from '../../models/User';

// Mock the services
jest.mock('../../services/enhanced-voice.service');
jest.mock('../../services/rate-limit.service');

const SKIP_INTEGRATION = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP_INTEGRATION ? describe.skip : describe)('Enhanced Voice API Integration Tests', () => {
  let mockEnhancedVoiceService: jest.Mocked<EnhancedVoiceService>;
  let mockRateLimitService: jest.Mocked<RateLimitService>;
  let authToken: string;

  beforeAll(async () => {
    // Ensure DB is connected
    const { connectToDatabase } = require('../../config/database');
    await connectToDatabase();

    // Cleanup and create real test user
    await User.deleteMany({ email: 'test@example.com' });
    const testUser = await User.create({
      name: 'Test Voice User',
      email: 'test@example.com',
      password: 'testPassword123!',
      role: 'user',
      isEmailVerified: true,
    });

    // Generate valid JWT token for testing
    authToken = `Bearer ${jwt.sign(
      {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        tokenVersion: testUser.tokenVersion,
      },
      process.env.JWT_SECRET || 'test-jwt-secret-at-least-32-chars-long-for-security-check',
      { expiresIn: '1h' },
    )}`;

    // Get mock services
    mockEnhancedVoiceService = {
      processConversation: jest.fn(),
      getConversationHistory: jest.fn(),
      clearConversation: jest.fn(),
    } as any;

    mockRateLimitService = {
      incrementAndCheck: jest.fn().mockResolvedValue(undefined),
      reset: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Replace services in container
    container.rebind(TYPES.EnhancedVoiceService).toConstantValue(mockEnhancedVoiceService);
    container.rebind(TYPES.RateLimitService).toConstantValue(mockRateLimitService);
  };);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/enhanced-voice/process', () => {
    const validPayload = {
      sessionId: 'test_session_123',
      userId: 'test_user_456',
      text: 'Hola Daniela, ¿cómo estás?',
    };

    it('should process text conversation successfully', async () => {
      const mockResponse = {
        transcription: 'Hola Daniela, ¿cómo estás?',
        response: '¡Hola! Estoy excelente, gracias por preguntar.',
        suggestedActions: [],
        context: {
          messages: [],
          emotionalHistory: [],
          clientProfile: {
            preferences: [],
            previousTopics: [],
            interactionStyle: 'professional',
          },
        },
      };

      mockEnhancedVoiceService.processConversation.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(validPayload)
        .expect(200);

      expect(response.body.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(response.body).toHaveProperty('requestId');
    });

    it('should process audio conversation successfully', async () => {
      const audioPayload = {
        ...validPayload,
        audio: 'base64_encoded_audio_data',
        text: undefined,
      };

      const mockResponse = {
        transcription: 'Audio transcrito',
        response: 'Entendido',
        audioResponse: Buffer.from('audio_data'),
        suggestedActions: [],
        context: {
          messages: [],
          emotionalHistory: [],
          clientProfile: {
            preferences: [],
            previousTopics: [],
            interactionStyle: 'professional',
          },
        },
      };

      mockEnhancedVoiceService.processConversation.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(audioPayload)
        .expect(200);

      expect(response.body.status).toBe(200);
      expect(response.body.data.audioResponse).toBe(Buffer.from('audio_data').toString('base64'));
    });

    it('should return 401 for missing authorization', async () => {
      await request(app).post('/api/v1/enhanced-voice/process').send(validPayload).expect(401);
    });

    it('should return 400 for invalid payload', async () => {
      await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send({ sessionId: '' })
        .expect(400);
    });
  });

  describe('GET /api/v1/enhanced-voice/history', () => {
    it('should retrieve history', async () => {
      mockEnhancedVoiceService.getConversationHistory.mockResolvedValue({ messages: [] });

      const response = await request(app)
        .get('/api/v1/enhanced-voice/history?sessionId=123')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.status).toBe(200);
    });
  });

  describe('POST /api/v1/enhanced-voice/clear', () => {
    it('should clear session', async () => {
      mockEnhancedVoiceService.clearConversation.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/v1/enhanced-voice/clear')
        .set('Authorization', authToken)
        .send({ sessionId: '123' })
        .expect(200);

      expect(response.body.status).toBe(200);
    });
  });
});
