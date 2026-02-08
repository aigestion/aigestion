import request from 'supertest';
import { app } from '../../app';
import { container } from '../../config/inversify.config';
import { EnhancedVoiceService } from '../../services/enhanced-voice.service';
import { TYPES } from '../../types';

// Mock the EnhancedVoiceService
jest.mock('../../services/enhanced-voice.service');

const SKIP_INTEGRATION = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP_INTEGRATION ? describe.skip : describe)('Enhanced Voice API Integration Tests', () => {
  let mockEnhancedVoiceService: jest.Mocked<EnhancedVoiceService>;
  let authToken: string;

  beforeAll(async () => {
    // Mock JWT token for testing
    authToken = 'Bearer mock_jwt_token';

    // Mock the service
    mockEnhancedVoiceService = {
      processConversation: jest.fn(),
      getConversationHistory: jest.fn(),
      clearConversation: jest.fn(),
    } as any;

    // Replace the service in container
    container.rebind(TYPES.EnhancedVoiceService).toConstantValue(mockEnhancedVoiceService);
  });

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
        emotionalAnalysis: {
          emotion: 'neutral',
          confidence: 0.85,
          sentiment: 'positive',
          suggestions: ['friendly_response'],
        },
        response: '¡Hola! Estoy excelente, gracias por preguntar.',
        suggestedActions: [
          {
            id: 'action_1',
            text: 'Mostrar dashboard',
            type: 'action',
            priority: 'high',
            context: 'navigation',
          },
        ],
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

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResponse);
      expect(response.body.meta).toHaveProperty('requestId');
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(response.body.meta).toHaveProperty('version');
    });

    it('should process audio conversation successfully', async () => {
      const audioPayload = {
        ...validPayload,
        audio: 'base64_encoded_audio_data',
        text: undefined,
      };

      const mockResponse = {
        transcription: 'Audio transcrito correctamente',
        response: 'Entendido tu mensaje de audio.',
        audioResponse: 'base64_encoded_audio_response',
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

      expect(response.body.success).toBe(true);
      expect(response.body.data.transcription).toBe('Audio transcrito correctamente');
      expect(response.body.data.audioResponse).toBe('base64_encoded_audio_response');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidPayload = {
        sessionId: '',
        userId: 'test_user',
        text: 'Hola',
      };

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(invalidPayload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .send(validPayload)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D005');
    });

    it('should return 500 for service errors', async () => {
      mockEnhancedVoiceService.processConversation.mockRejectedValue(
        new Error('Service temporarily unavailable'),
      );

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(validPayload)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D002');
    });

    it('should handle rate limiting', async () => {
      // Mock rate limit exceeded
      mockEnhancedVoiceService.processConversation.mockRejectedValue(
        new Error('Rate limit exceeded'),
      );

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(validPayload)
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D004');
    });

    it('should validate audio format', async () => {
      const invalidAudioPayload = {
        ...validPayload,
        audio: 'invalid_audio_data',
        text: undefined,
      };

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(invalidAudioPayload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D010');
    });
  });

  describe('GET /api/v1/enhanced-voice/history', () => {
    const sessionId = 'test_session_123';

    it('should return conversation history successfully', async () => {
      const mockHistory = {
        messages: [
          {
            id: '1',
            text: 'Hola',
            speaker: 'client',
            timestamp: new Date(),
            emotion: 'neutral',
          },
          {
            id: '2',
            text: '¡Hola! ¿En qué puedo ayudarte?',
            speaker: 'daniela',
            timestamp: new Date(),
            emotion: 'professional',
          },
        ],
        emotionalHistory: [
          {
            emotion: 'neutral',
            confidence: 0.9,
            sentiment: 'positive',
            suggestions: [],
          },
        ],
        clientProfile: {
          preferences: ['spanish'],
          previousTopics: ['greeting'],
          interactionStyle: 'professional',
        },
      };

      mockEnhancedVoiceService.getConversationHistory.mockResolvedValue(mockHistory);

      const response = await request(app)
        .get(`/api/v1/enhanced-voice/history?sessionId=${sessionId}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockHistory);
      expect(response.body.meta).toHaveProperty('requestId');
    });

    it('should return 400 for missing sessionId', async () => {
      const response = await request(app)
        .get('/api/v1/enhanced-voice/history')
        .set('Authorization', authToken)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D001');
    });

    it('should return 404 for non-existent session', async () => {
      mockEnhancedVoiceService.getConversationHistory.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/enhanced-voice/history?sessionId=non_existent')
        .set('Authorization', authToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D001');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .get(`/api/v1/enhanced-voice/history?sessionId=${sessionId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D005');
    });
  });

  describe('POST /api/v1/enhanced-voice/clear', () => {
    const sessionId = 'test_session_123';

    it('should clear conversation successfully', async () => {
      mockEnhancedVoiceService.clearConversation.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/v1/enhanced-voice/clear')
        .set('Authorization', authToken)
        .send({ sessionId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Conversation cleared successfully');
      expect(mockEnhancedVoiceService.clearConversation).toHaveBeenCalledWith(sessionId);
    });

    it('should return 400 for missing sessionId', async () => {
      const response = await request(app)
        .post('/api/v1/enhanced-voice/clear')
        .set('Authorization', authToken)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D001');
    });

    it('should return 401 for missing authorization', async () => {
      const response = await request(app)
        .post('/api/v1/enhanced-voice/clear')
        .send({ sessionId })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D005');
    });

    it('should handle errors gracefully', async () => {
      mockEnhancedVoiceService.clearConversation.mockRejectedValue(
        new Error('Failed to clear conversation'),
      );

      const response = await request(app)
        .post('/api/v1/enhanced-voice/clear')
        .set('Authorization', authToken)
        .send({ sessionId })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('D002');
    });
  });

  describe('GET /api/v1/enhanced-voice/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/v1/enhanced-voice/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data).toHaveProperty('metrics');
    });

    it('should include service health details', async () => {
      const response = await request(app).get('/api/v1/enhanced-voice/health').expect(200);

      const { services } = response.body.data;
      expect(services).toHaveProperty('ai_provider');
      expect(services).toHaveProperty('voice_synthesis');
      expect(services).toHaveProperty('speech_recognition');
      expect(services).toHaveProperty('database');
      expect(services).toHaveProperty('cache');
    });

    it('should include performance metrics', async () => {
      const response = await request(app).get('/api/v1/enhanced-voice/health').expect(200);

      const { metrics } = response.body.data;
      expect(metrics).toHaveProperty('active_sessions');
      expect(metrics).toHaveProperty('requests_per_minute');
      expect(metrics).toHaveProperty('average_response_time');
      expect(metrics).toHaveProperty('error_rate');
    });
  });

  describe('Rate Limiting', () => {
    const validPayload = {
      sessionId: 'test_session',
      userId: 'test_user',
      text: 'Hola Daniela',
    };

    it('should enforce rate limits on process endpoint', async () => {
      // Mock rate limit error after 30 requests
      mockEnhancedVoiceService.processConversation
        .mockResolvedValue({ response: 'OK' })
        .mockRejectedValueOnce(new Error('Rate limit exceeded'));

      // Make 30 successful requests
      for (let i = 0; i < 30; i++) {
        await request(app)
          .post('/api/v1/enhanced-voice/process')
          .set('Authorization', authToken)
          .send({ ...validPayload, sessionId: `session_${i}` })
          .expect(200);
      }

      // Next request should be rate limited
      await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send({ ...validPayload, sessionId: 'session_rate_limited' })
        .expect(429);
    });

    it('should have different rate limits for different endpoints', async () => {
      // Test that history endpoint has higher limits
      for (let i = 0; i < 60; i++) {
        await request(app)
          .get(`/api/v1/enhanced-voice/history?sessionId=session_${i}`)
          .set('Authorization', authToken)
          .expect(200);
      }

      // Should still work (higher limit for history)
      await request(app)
        .get('/api/v1/enhanced-voice/history?sessionId=session_61')
        .set('Authorization', authToken)
        .expect(200);
    });
  });

  describe('CORS Headers', () => {
    it('should include proper CORS headers', async () => {
      const response = await request(app).options('/api/v1/enhanced-voice/process').expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });
  });

  describe('Response Format', () => {
    it('should maintain consistent response format', async () => {
      mockEnhancedVoiceService.processConversation.mockResolvedValue({
        response: 'Test response',
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
      });

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send({
          sessionId: 'test',
          userId: 'test',
          text: 'Hola',
        })
        .expect(200);

      // Check response structure
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');

      // Check meta structure
      expect(response.body.meta).toHaveProperty('requestId');
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(response.body.meta).toHaveProperty('version');

      // Check data structure
      expect(response.body.data).toHaveProperty('response');
      expect(response.body.data).toHaveProperty('suggestedActions');
      expect(response.body.data).toHaveProperty('context');
    });

    it('should maintain consistent error response format', async () => {
      mockEnhancedVoiceService.processConversation.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send({
          sessionId: 'test',
          userId: 'test',
          text: 'Hola',
        })
        .expect(500);

      // Check error response structure
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('meta');

      // Check error structure
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');

      // Check meta structure
      expect(response.body.meta).toHaveProperty('requestId');
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(response.body.meta).toHaveProperty('version');
    });
  });

  describe('Security', () => {
    it('should sanitize input properly', async () => {
      const maliciousPayload = {
        sessionId: '<script>alert("xss")</script>',
        userId: 'test_user',
        text: '<script>alert("xss")</script>',
      };

      mockEnhancedVoiceService.processConversation.mockResolvedValue({
        response: 'Sanitized response',
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
      });

      const response = await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send(maliciousPayload)
        .expect(200);

      // Should not contain script tags in response
      expect(response.body.data.response).not.toContain('<script>');
    });

    it('should validate JWT token format', async () => {
      const invalidTokens = ['invalid', 'Bearer invalid', 'Bearer', ''];

      for (const token of invalidTokens) {
        await request(app)
          .post('/api/v1/enhanced-voice/process')
          .set('Authorization', token)
          .send({
            sessionId: 'test',
            userId: 'test',
            text: 'Hola',
          })
          .expect(401);
      }
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time limits', async () => {
      mockEnhancedVoiceService.processConversation.mockResolvedValue({
        response: 'Quick response',
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
      });

      const startTime = Date.now();
      await request(app)
        .post('/api/v1/enhanced-voice/process')
        .set('Authorization', authToken)
        .send({
          sessionId: 'test',
          userId: 'test',
          text: 'Hola',
        })
        .expect(200);
      const endTime = Date.now();

      // Should respond within 2 seconds
      expect(endTime - startTime).toBeLessThan(2000);
    });

    it('should handle concurrent requests', async () => {
      mockEnhancedVoiceService.processConversation.mockResolvedValue({
        response: 'Concurrent response',
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
      });

      const promises = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .post('/api/v1/enhanced-voice/process')
          .set('Authorization', authToken)
          .send({
            sessionId: `concurrent_${i}`,
            userId: `user_${i}`,
            text: `Message ${i}`,
          }),
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
});
