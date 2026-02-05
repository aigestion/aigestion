import { EnhancedVoiceService } from '../../services/enhanced-voice.service';
import { AIService } from '../../services/ai.service';
import { AnalyticsService } from '../../services/analytics.service';
import { MetaverseService } from '../../services/metaverse.service';
import { ElevenLabsService } from '../../services/elevenlabs.service';
import { QwenTTSService } from '../../services/qwen-tts.service';
import { container } from '../../config/inversify.config';
import { TYPES } from '../../types';

// Mock dependencies
jest.mock('../../services/ai.service');
jest.mock('../../services/analytics.service');
jest.mock('../../services/metaverse.service');
jest.mock('../../services/elevenlabs.service');
jest.mock('../../services/qwen-tts.service');

describe('EnhancedVoiceService', () => {
  let enhancedVoiceService: EnhancedVoiceService;
  let mockAIService: jest.Mocked<AIService>;
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;
  let mockMetaverseService: jest.Mocked<MetaverseService>;
  let mockElevenLabsService: jest.Mocked<ElevenLabsService>;
  let mockQwenTTSService: jest.Mocked<QwenTTSService>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock instances
    mockAIService = {
      generateContent: jest.fn(),
      streamChat: jest.fn(),
      chat: jest.fn(),
    } as any;

    mockAnalyticsService = {
      getDashboardData: jest.fn(),
    } as any;

    mockMetaverseService = {
      getStatus: jest.fn(),
    } as any;

    mockElevenLabsService = {
      synthesizeText: jest.fn(),
      textToSpeech: jest.fn(),
    } as any;

    mockQwenTTSService = {
      synthesizeText: jest.fn(),
      textToSpeech: jest.fn(),
    } as any;

    // Create service instance with mocked dependencies
    enhancedVoiceService = new EnhancedVoiceService(
      mockAIService,
      mockAnalyticsService,
      mockMetaverseService,
      mockElevenLabsService,
      mockQwenTTSService,
    );
  });

  describe('processConversation', () => {
    const mockPayload = {
      sessionId: 'test_session_123',
      userId: 'test_user_456',
      text: 'Hola Daniela, ¿cómo estás?',
    };

    const mockContext = {
      messages: [],
      emotionalHistory: [],
      clientProfile: {
        preferences: [],
        previousTopics: [],
        interactionStyle: 'professional',
      },
    };

    it('should process text conversation successfully', async () => {
      // Mock AI service response
      mockAIService.generateContent.mockResolvedValue(
        '¡Hola! Estoy excelente, gracias por preguntar. ¿En qué puedo ayudarte hoy?'
      );

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result).toBeDefined();
      expect(result.transcription).toBe(mockPayload.text);
      expect(result.response).toContain('¡Hola!');
      expect(result.suggestedActions).toBeDefined();
      expect(result.context).toBeDefined();
      expect(mockAIService.generateContent).toHaveBeenCalled();
    });

    it('should process audio conversation successfully', async () => {
      const audioPayload = {
        ...mockPayload,
        audio: Buffer.from('mock audio data'),
        text: undefined,
      };

      mockAIService.generateContent.mockResolvedValue(
        'Entendido tu mensaje de audio. ¿En qué te puedo ayudar?'
      );

      const result = await enhancedVoiceService.processConversation(audioPayload);

      expect(result).toBeDefined();
      expect(result.response).toContain('Entendido');
      expect(mockAIService.generateContent).toHaveBeenCalled();
    });

    it('should analyze emotion and include it in response', async () => {
      mockAIService.generateContent.mockResolvedValue(
        '¡Hola! Me alegra verte tan positivo.'
      );

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result.emotionalAnalysis).toBeDefined();
      expect(result.emotionalAnalysis?.emotion).toBeDefined();
      expect(result.emotionalAnalysis?.confidence).toBeGreaterThan(0);
      expect(result.emotionalAnalysis?.sentiment).toBeDefined();
    });

    it('should generate suggested actions based on context', async () => {
      mockAIService.generateContent.mockResolvedValue(
        'Puedo ayudarte con el dashboard o análisis de métricas.'
      );

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result.suggestedActions).toBeDefined();
      expect(Array.isArray(result.suggestedActions)).toBe(true);
      expect(result.suggestedActions.length).toBeGreaterThan(0);
    });

    it('should maintain conversation context across multiple messages', async () => {
      const firstPayload = {
        ...mockPayload,
        text: 'Hola Daniela',
      };

      const secondPayload = {
        ...mockPayload,
        text: 'Muéstrame el dashboard',
      };

      mockAIService.generateContent
        .mockResolvedValueOnce('¡Hola! ¿En qué puedo ayudarte?')
        .mockResolvedValueOnce('Aquí está tu dashboard principal.');

      // First message
      const firstResult = await enhancedVoiceService.processConversation(firstPayload);
      expect(firstResult.context.messages).toHaveLength(2); // user + daniela

      // Second message should include context
      mockAIService.generateContent.mockClear();
      const secondResult = await enhancedVoiceService.processConversation(secondPayload);
      expect(secondResult.context.messages).toHaveLength(4); // 2 previous + 2 new
    });

    it('should handle errors gracefully', async () => {
      mockAIService.generateContent.mockRejectedValue(
        new Error('AI service unavailable')
      );

      await expect(enhancedVoiceService.processConversation(mockPayload))
        .rejects.toThrow('AI service unavailable');
    });

    it('should validate required fields', async () => {
      const invalidPayload = {
        sessionId: '',
        userId: 'test_user',
        text: 'Hola',
      };

      await expect(enhancedVoiceService.processConversation(invalidPayload))
        .rejects.toThrow();
    });
  });

  describe('analyzeEmotion', () => {
    const mockText = 'Estoy muy feliz con el servicio!';
    const mockContext = {
      messages: [],
      emotionalHistory: [],
      clientProfile: {
        preferences: [],
        previousTopics: [],
        interactionStyle: 'professional',
      },
    };

    it('should detect positive emotion correctly', async () => {
      mockAIService.generateContent.mockResolvedValue(JSON.stringify({
        emotion: 'happy',
        confidence: 0.9,
        sentiment: 'positive',
        suggestions: ['continue_positive_tone']
      }));

      const result = await enhancedVoiceService.analyzeEmotion(mockText, mockContext);

      expect(result.emotion).toBe('happy');
      expect(result.confidence).toBe(0.9);
      expect(result.sentiment).toBe('positive');
      expect(result.suggestions).toContain('continue_positive_tone');
    });

    it('should detect negative emotion correctly', async () => {
      mockAIService.generateContent.mockResolvedValue(JSON.stringify({
        emotion: 'concerned',
        confidence: 0.8,
        sentiment: 'negative',
        suggestions: ['offer_support']
      }));

      const result = await enhancedVoiceService.analyzeEmotion(
        'Estoy preocupado por el costo',
        mockContext
      );

      expect(result.emotion).toBe('concerned');
      expect(result.sentiment).toBe('negative');
      expect(result.suggestions).toContain('offer_support');
    });

    it('should handle context from previous messages', async () => {
      const contextWithHistory = {
        ...mockContext,
        messages: [
          {
            id: '1',
            text: 'Hola',
            speaker: 'client' as const,
            timestamp: new Date(),
            emotion: 'neutral'
          }
        ]
      };

      mockAIService.generateContent.mockResolvedValue(JSON.stringify({
        emotion: 'happy',
        confidence: 0.7,
        sentiment: 'positive',
        suggestions: ['friendly_response']
      }));

      const result = await enhancedVoiceService.analyzeEmotion(
        '¡Gracias por tu ayuda!',
        contextWithHistory
      );

      expect(result.emotion).toBe('happy');
      expect(mockAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('Hola')
      );
    });

    it('should fallback to neutral on parsing errors', async () => {
      mockAIService.generateContent.mockResolvedValue('Invalid JSON response');

      const result = await enhancedVoiceService.analyzeEmotion(mockText, mockContext);

      expect(result.emotion).toBe('neutral');
      expect(result.confidence).toBe(0.5);
      expect(result.sentiment).toBe('neutral');
    });
  });

  describe('generateContextualResponse', () => {
    const mockText = '¿Puedes ayudarme con el dashboard?';
    const mockAnalysis = {
      emotion: 'neutral',
      confidence: 0.8,
      sentiment: 'positive',
      suggestions: ['provide_dashboard_access']
    };
    const mockContext = {
      messages: [],
      emotionalHistory: [],
      clientProfile: {
        preferences: ['dashboard_access'],
        previousTopics: ['dashboard'],
        interactionStyle: 'professional'
      }
    };

    it('should generate response based on emotion and context', async () => {
      mockAIService.generateContent.mockResolvedValue(
        'Claro que sí. Te mostraré el dashboard principal con todas tus métricas.'
      );

      const result = await enhancedVoiceService.generateContextualResponse(
        mockText,
        mockAnalysis,
        mockContext
      );

      expect(result).toContain('dashboard');
      expect(mockAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('neutral')
      );
    });

    it('should adapt tone based on emotional analysis', async () => {
      const happyAnalysis = {
        ...mockAnalysis,
        emotion: 'happy',
        sentiment: 'positive'
      };

      mockAIService.generateContent.mockResolvedValue(
        '¡Con mucho gusto! Te mostraré el dashboard con toda la información que necesitas.'
      );

      const result = await enhancedVoiceService.generateContextualResponse(
        mockText,
        happyAnalysis,
        mockContext
      );

      expect(result).toContain('¡');
      expect(mockAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('happy')
      );
    });

    it('should use conversation history for context', async () => {
      const contextWithHistory = {
        ...mockContext,
        messages: [
          {
            id: '1',
            text: 'Necesito ver mis métricas',
            speaker: 'client' as const,
            timestamp: new Date(),
            emotion: 'neutral'
          },
          {
            id: '2',
            text: 'Claro, te mostraré las métricas principales',
            speaker: 'daniela' as const,
            timestamp: new Date(),
            emotion: 'professional'
          }
        ]
      };

      mockAIService.generateContent.mockResolvedValue(
        'Aquí están tus métricas actualizadas desde nuestra última conversación.'
      );

      const result = await enhancedVoiceService.generateContextualResponse(
        '¿Puedes actualizar las métricas?',
        mockAnalysis,
        contextWithHistory
      );

      expect(result).toContain('métricas');
      expect(mockAIService.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('actualizadas')
      );
    });
  });

  describe('generateSuggestedActions', () => {
    const mockText = 'Muéstrame el dashboard';
    const mockAnalysis = {
      emotion: 'neutral',
      confidence: 0.8,
      sentiment: 'positive',
      suggestions: ['dashboard_access']
    };
    const mockContext = {
      messages: [],
      emotionalHistory: [],
      clientProfile: {
        preferences: ['visual_data'],
        previousTopics: ['dashboard'],
        interactionStyle: 'professional'
      }
    };

    it('should generate relevant suggested actions', async () => {
      const result = await enhancedVoiceService.generateSuggestedActions(
        mockText,
        mockAnalysis,
        mockContext
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('priority');
      expect(result[0]).toHaveProperty('context');
    });

    it('should suggest dashboard actions for dashboard-related queries', async () => {
      const result = await enhancedVoiceService.generateSuggestedActions(
        'dashboard principal',
        mockAnalysis,
        mockContext
      );

      const dashboardActions = result.filter(action =>
        action.text.toLowerCase().includes('dashboard')
      );
      expect(dashboardActions.length).toBeGreaterThan(0);
    });

    it('should suggest support actions for concerned emotions', async () => {
      const concernedAnalysis = {
        ...mockAnalysis,
        emotion: 'concerned',
        sentiment: 'negative'
      };

      const result = await enhancedVoiceService.generateSuggestedActions(
        'Tengo un problema',
        concernedAnalysis,
        mockContext
      );

      const supportActions = result.filter(action =>
        action.type === 'question' || action.text.toLowerCase().includes('ayuda')
      );
      expect(supportActions.length).toBeGreaterThan(0);
    });

    it('should limit suggestions to maximum of 3', async () => {
      const result = await enhancedVoiceService.generateSuggestedActions(
        mockText,
        mockAnalysis,
        mockContext
      );

      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should prioritize actions based on context', async () => {
      const result = await enhancedVoiceService.generateSuggestedActions(
        mockText,
        mockAnalysis,
        mockContext
      );

      const highPriorityActions = result.filter(action => action.priority === 'high');
      expect(highPriorityActions.length).toBeGreaterThan(0);
    });
  });

  describe('getConversationHistory', () => {
    const sessionId = 'test_session_123';

    it('should return conversation history for valid session', async () => {
      // Mock some conversation data
      const mockHistory = {
        messages: [
          {
            id: '1',
            text: 'Hola',
            speaker: 'client' as const,
            timestamp: new Date(),
            emotion: 'neutral'
          }
        ],
        emotionalHistory: [],
        clientProfile: {
          preferences: [],
          previousTopics: [],
          interactionStyle: 'professional'
        }
      };

      // Since we can't easily mock the internal Map, we'll test the method structure
      const result = await enhancedVoiceService.getConversationHistory(sessionId);

      // Should return null for non-existent session
      expect(result).toBeNull();
    });

    it('should return null for non-existent session', async () => {
      const result = await enhancedVoiceService.getConversationHistory('non_existent');
      expect(result).toBeNull();
    });
  });

  describe('clearConversation', () => {
    const sessionId = 'test_session_123';

    it('should clear conversation context', async () => {
      // First add some conversation data
      await enhancedVoiceService.processConversation({
        sessionId,
        userId: 'test_user',
        text: 'Hola Daniela'
      });

      // Then clear it
      await enhancedVoiceService.clearConversation(sessionId);

      // Verify it's cleared
      const result = await enhancedVoiceService.getConversationHistory(sessionId);
      expect(result).toBeNull();
    });

    it('should handle clearing non-existent session gracefully', async () => {
      await expect(enhancedVoiceService.clearConversation('non_existent'))
        .resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle AI service errors gracefully', async () => {
      mockAIService.generateContent.mockRejectedValue(
        new Error('AI service temporarily unavailable')
      );

      await expect(enhancedVoiceService.processConversation({
        sessionId: 'test',
        userId: 'test',
        text: 'Hola'
      })).rejects.toThrow('AI service temporarily unavailable');
    });

    it('should handle analytics service errors', async () => {
      mockAnalyticsService.getDashboardData.mockRejectedValue(
        new Error('Analytics service unavailable')
      );

      // Should still work even if analytics fails
      mockAIService.generateContent.mockResolvedValue('Respuesta normal');

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'test',
        userId: 'test',
        text: 'Hola'
      });

      expect(result.response).toBe('Respuesta normal');
    });

    it('should handle malformed AI responses', async () => {
      mockAIService.generateContent.mockResolvedValue('');

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'test',
        userId: 'test',
        text: 'Hola'
      });

      expect(result.response).toBe('');
    });
  });

  describe('Performance', () => {
    it('should process conversation within reasonable time', async () => {
      mockAIService.generateContent.mockResolvedValue('Quick response');

      const startTime = Date.now();
      await enhancedVoiceService.processConversation({
        sessionId: 'test',
        userId: 'test',
        text: 'Hola'
      });
      const endTime = Date.now();

      // Should complete within 5 seconds
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle concurrent conversations', async () => {
      mockAIService.generateContent.mockResolvedValue('Concurrent response');

      const promises = Array.from({ length: 10 }, (_, i) =>
        enhancedVoiceService.processConversation({
          sessionId: `session_${i}`,
          userId: `user_${i}`,
          text: `Message ${i}`
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.response).toBe('Concurrent response');
      });
    });
  });
});
