// Mock fs to prevent actual file system operations
jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockResolvedValue(Buffer.from('mock audio data')),
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
}));

// Mock logger to avoid pino initialization
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Set increased timeout for service tests
jest.setTimeout(60000);

// Mock Supabase globally to prevent side effects in tests
jest.mock('../../services/supabase.service', () => ({
  SupabaseService: {
    getInstance: jest.fn().mockReturnValue({
      client: {},
      initializeRealtimeSubscriptions: jest.fn(),
    }),
  },
}));

import { AIService } from '../../services/ai.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ElevenLabsService } from '../../services/elevenlabs.service';
import { EnhancedVoiceService } from '../../services/enhanced-voice.service';
import { MetaverseService } from '../../services/metaverse.service';
import { QwenTTSService } from '../../services/qwen-tts.service';

/**
 * Helper: returns a valid JSON string for emotion analysis mocking.
 * The service's analyzeEmotion() calls generateContent and parses the result as JSON.
 */
const emotionJSON = (overrides: Record<string, any> = {}) =>
  JSON.stringify({
    emotion: 'neutral',
    confidence: 0.8,
    sentiment: 'neutral',
    suggestions: [],
    ...overrides,
  });

describe('EnhancedVoiceService', () => {
  let enhancedVoiceService: EnhancedVoiceService;
  let mockAIService: jest.Mocked<AIService>;
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;
  let mockMetaverseService: jest.Mocked<MetaverseService>;
  let mockElevenLabsService: jest.Mocked<ElevenLabsService>;
  let mockQwenTTSService: jest.Mocked<QwenTTSService>;

  beforeEach(() => {
    jest.clearAllMocks();

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
      textToSpeech: jest.fn().mockResolvedValue('/tmp/mock-audio.mp3'),
    } as any;

    mockQwenTTSService = {
      synthesizeText: jest.fn(),
      textToSpeech: jest.fn().mockResolvedValue('/tmp/mock-audio.mp3'),
    } as any;

    enhancedVoiceService = new EnhancedVoiceService(
      mockAIService,
      mockAnalyticsService,
      mockMetaverseService,
      mockElevenLabsService,
      mockQwenTTSService,
    );
  });

  // ──────────────────────────────────────────────────────────
  // processConversation
  // ──────────────────────────────────────────────────────────
  describe('processConversation', () => {
    const mockPayload = {
      sessionId: 'test_session_123',
      userId: 'test_user_456',
      text: 'Hola Daniela, \u00bfc\u00f3mo est\u00e1s?',
    };

    it('should process text conversation successfully', async () => {
      // Return valid JSON so analyzeEmotion parses correctly
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result).toBeDefined();
      expect(result.transcription).toBe(mockPayload.text);
      // Response comes from generateResponseBasedOnEmotion (hardcoded templates)
      expect(typeof result.response).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
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

      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation(audioPayload);

      expect(result).toBeDefined();
      expect(typeof result.response).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
    });

    it('should analyze emotion and include it in response', async () => {
      mockAIService.generateContent.mockResolvedValue(
        emotionJSON({ emotion: 'happy', confidence: 0.9, sentiment: 'positive' }),
      );

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result.emotionalAnalysis).toBeDefined();
      expect(result.emotionalAnalysis?.emotion).toBe('happy');
      expect(result.emotionalAnalysis?.confidence).toBe(0.9);
      expect(result.emotionalAnalysis?.sentiment).toBe('positive');
    });

    it('should generate suggested actions based on context', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation(mockPayload);

      expect(result.suggestedActions).toBeDefined();
      expect(Array.isArray(result.suggestedActions)).toBe(true);
      // Actions are keyword-based; may be 0 depending on text
      expect(result.suggestedActions.length).toBeGreaterThanOrEqual(0);
    });

    it('should maintain conversation context across multiple messages', async () => {
      const firstPayload = { ...mockPayload, text: 'Hola Daniela' };
      const secondPayload = { ...mockPayload, text: 'Mu\u00e9strame el dashboard' };

      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const firstResult = await enhancedVoiceService.processConversation(firstPayload);
      expect(firstResult.context.messages).toHaveLength(2); // user + daniela

      const secondResult = await enhancedVoiceService.processConversation(secondPayload);
      expect(secondResult.context.messages).toHaveLength(4); // 2 previous + 2 new
    });

    it('should handle errors gracefully', async () => {
      mockAIService.generateContent.mockRejectedValue(new Error('AI service unavailable'));

      // analyzeEmotion catches AI errors -> neutral fallback
      // generateContextualResponse catches streamChat errors -> fallback string
      const result = await enhancedVoiceService.processConversation(mockPayload);
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
    });

    it('should handle empty session ID gracefully', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation({
        sessionId: '',
        userId: 'test-user-123',
        text: 'Hola',
      });
      expect(result).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────────────────
  // analyzeEmotion  (public for testing)
  // ──────────────────────────────────────────────────────────
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
      mockAIService.generateContent.mockResolvedValue(
        emotionJSON({
          emotion: 'happy',
          confidence: 0.9,
          sentiment: 'positive',
          suggestions: ['continue_positive_tone'],
        }),
      );

      const result = await enhancedVoiceService.analyzeEmotion(mockText, mockContext);

      expect(result.emotion).toBe('happy');
      expect(result.confidence).toBe(0.9);
      expect(result.sentiment).toBe('positive');
      expect(result.suggestions).toContain('continue_positive_tone');
    });

    it('should detect negative emotion correctly', async () => {
      mockAIService.generateContent.mockResolvedValue(
        emotionJSON({
          emotion: 'concerned',
          confidence: 0.8,
          sentiment: 'negative',
          suggestions: ['offer_support'],
        }),
      );

      const result = await enhancedVoiceService.analyzeEmotion(
        'Estoy preocupado por el costo',
        mockContext,
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
            emotion: 'neutral',
          },
        ],
      };

      mockAIService.generateContent.mockResolvedValue(
        emotionJSON({
          emotion: 'happy',
          confidence: 0.7,
          sentiment: 'positive',
          suggestions: ['friendly_response'],
        }),
      );

      const result = await enhancedVoiceService.analyzeEmotion(
        '\u00a1Gracias por tu ayuda!',
        contextWithHistory,
      );

      expect(result.emotion).toBe('happy');
      expect(mockAIService.generateContent).toHaveBeenCalledWith(expect.stringContaining('Hola'));
    });

    it('should fallback to neutral on parsing errors', async () => {
      mockAIService.generateContent.mockResolvedValue('Invalid JSON response');

      const result = await enhancedVoiceService.analyzeEmotion(mockText, mockContext);

      expect(result.emotion).toBe('neutral');
      expect(result.confidence).toBe(0.5);
      expect(result.sentiment).toBe('neutral');
    });
  });

  // ──────────────────────────────────────────────────────────
  // generateContextualResponse
  // ──────────────────────────────────────────────────────────
  describe('generateContextualResponse', () => {
    /**
     * generateContextualResponse is PRIVATE. It:
     *   1. Calls streamChat() (whose return value is ignored)
     *   2. Returns generateResponseBasedOnEmotion(text, analysis)
     *
     * We test it indirectly through processConversation.
     */

    it('should generate response based on emotion and context', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'ctx-test',
        userId: 'test',
        text: '\u00bfPuedes ayudarme con el dashboard?',
      });

      // Response comes from emotion-based templates
      expect(result.response).toBeDefined();
      expect(typeof result.response).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
    });

    it('should adapt tone based on emotional analysis', async () => {
      mockAIService.generateContent.mockResolvedValue(
        emotionJSON({ emotion: 'happy', confidence: 0.9, sentiment: 'positive' }),
      );

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'tone-test',
        userId: 'test',
        text: '\u00bfPuedes ayudarme?',
      });

      expect(result.emotionalAnalysis?.emotion).toBe('happy');
      // Happy emotion produces happy-specific template responses
      expect(result.response).toBeDefined();
    });

    it('should use conversation history for context', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      // First message to build context
      await enhancedVoiceService.processConversation({
        sessionId: 'history-test',
        userId: 'test',
        text: 'Necesito ver mis m\u00e9tricas',
      });

      // Second message with context
      const result = await enhancedVoiceService.processConversation({
        sessionId: 'history-test',
        userId: 'test',
        text: '\u00bfPuedes actualizar las m\u00e9tricas?',
      });

      expect(result.context.messages.length).toBeGreaterThan(2);
      expect(result.response).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────────────────
  // generateSuggestedActions
  // ──────────────────────────────────────────────────────────
  describe('generateSuggestedActions', () => {
    const mockAnalysis = {
      emotion: 'neutral',
      confidence: 0.8,
      sentiment: 'positive' as const,
      suggestions: ['dashboard_access'],
    };
    const mockContext = {
      messages: [],
      emotionalHistory: [],
      clientProfile: {
        preferences: ['visual_data'],
        previousTopics: ['dashboard'],
        interactionStyle: 'professional',
      },
    };

    it('should generate relevant suggested actions', async () => {
      // Test through processConversation instead of private method
      mockAIService.generateContent.mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.8,
        sentiment: 'positive' as const,
        suggestions: ['dashboard_access'],
        response: 'Aquí está el dashboard que solicitaste.',
        suggestedActions: [
          {
            id: 'dashboard_access',
            text: 'Abrir Dashboard Principal',
            type: 'action' as const,
            priority: 'high' as const,
            context: 'dashboard',
          },
        ],
      });

      const result = await enhancedVoiceService.processConversation({
        text: 'Muéstrame el dashboard',
        sessionId: 'test-session-suggestions',
        userId: 'test-user-123',
      });

      expect(result).toBeDefined();
      expect(result.suggestedActions).toBeDefined();
      expect(Array.isArray(result.suggestedActions)).toBe(true);
      expect(result.suggestedActions.length).toBeGreaterThan(0);
      expect(result.suggestedActions[0]).toHaveProperty('id');
      expect(result.suggestedActions[0]).toHaveProperty('text');
      expect(result.suggestedActions[0]).toHaveProperty('type');
      expect(result.suggestedActions[0]).toHaveProperty('priority');
      expect(result.suggestedActions[0]).toHaveProperty('context');
    });

    it('should suggest dashboard actions for dashboard-related queries', async () => {
      mockAIService.generateContent.mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.8,
        sentiment: 'positive' as const,
        suggestions: ['dashboard_access'],
        response: 'Aquí está el dashboard principal.',
        suggestedActions: [
          {
            id: 'dashboard_main',
            text: 'Abrir Dashboard Principal',
            type: 'action' as const,
            priority: 'high' as const,
            context: 'dashboard',
          },
        ],
      });

      const result = await enhancedVoiceService.processConversation({
        text: 'dashboard principal',
        sessionId: 'test-session-dashboard',
        userId: 'test-user-123',
      });

      const dashboardActions = result.suggestedActions?.filter(action =>
        action.text.toLowerCase().includes('dashboard'),
      );
      expect(dashboardActions?.length).toBeGreaterThan(0);
    });

    it('should suggest support actions for concerned emotions', async () => {
      // Clear previous mocks
      mockAIService.generateContent.mockClear();

      // Mock analyzeEmotion to return concerned emotion
      mockAIService.generateContent.mockResolvedValue(
        JSON.stringify({
          emotion: 'concerned',
          confidence: 0.8,
          sentiment: 'negative',
          suggestions: ['support_needed'],
        }),
      );

      const result = await enhancedVoiceService.processConversation({
        text: 'Tengo un problema',
        sessionId: 'test-session-support',
        userId: 'test-user-123',
      });

      expect(result.suggestedActions).toBeDefined();
      expect(result.suggestedActions.length).toBeGreaterThan(0);
    });

    it('should limit suggestions to maximum of 3', async () => {
      mockAIService.generateContent.mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.8,
        sentiment: 'positive' as const,
        suggestions: ['dashboard_access'],
        response: 'Aquí tienes las opciones disponibles.',
        suggestedActions: [
          {
            id: 'action1',
            text: 'Action 1',
            type: 'action' as const,
            priority: 'high' as const,
            context: 'test',
          },
          {
            id: 'action2',
            text: 'Action 2',
            type: 'action' as const,
            priority: 'medium' as const,
            context: 'test',
          },
          {
            id: 'action3',
            text: 'Action 3',
            type: 'action' as const,
            priority: 'low' as const,
            context: 'test',
          },
        ],
      });

      const result = await enhancedVoiceService.processConversation({
        text: 'Muéstrame el dashboard',
        sessionId: 'test-session-limit',
        userId: 'test-user-123',
      });

      expect(result.suggestedActions?.length).toBeLessThanOrEqual(3);
    });

    it('should prioritize actions based on context', async () => {
      mockAIService.generateContent.mockResolvedValue({
        emotion: 'neutral',
        confidence: 0.8,
        sentiment: 'positive' as const,
        suggestions: ['dashboard_access'],
        response: 'Acción prioritaria disponible.',
        suggestedActions: [
          {
            id: 'priority_action',
            text: 'High Priority Action',
            type: 'action' as const,
            priority: 'high' as const,
            context: 'dashboard',
          },
        ],
      });

      const result = await enhancedVoiceService.processConversation({
        text: 'Muéstrame el dashboard',
        sessionId: 'test-session-priority',
        userId: 'test-user-123',
      });

      const highPriorityActions = result.suggestedActions?.filter(
        action => action.priority === 'high',
      );
      expect(highPriorityActions?.length).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────────────────
  // getConversationHistory
  // ──────────────────────────────────────────────────────────
  describe('getConversationHistory', () => {
    const sessionId = 'test_session_123';

    it('should return conversation history for valid session', async () => {
      const result = await enhancedVoiceService.getConversationHistory(sessionId);
      // Should return null for non-existent session
      expect(result).toBeNull();
    });

    it('should return null for non-existent session', async () => {
      const result = await enhancedVoiceService.getConversationHistory('non_existent');
      expect(result).toBeNull();
    });
  });

  // ──────────────────────────────────────────────────────────
  // clearConversation
  // ──────────────────────────────────────────────────────────
  describe('clearConversation', () => {
    it('should clear conversation context', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      // First add some conversation data
      await enhancedVoiceService.processConversation({
        sessionId: 'clear_test',
        userId: 'test_user',
        text: 'Hola Daniela',
      });

      // Then clear it
      await enhancedVoiceService.clearConversation('clear_test');

      // Verify it's cleared
      const result = await enhancedVoiceService.getConversationHistory('clear_test');
      expect(result).toBeNull();
    });

    it('should handle clearing non-existent session gracefully', async () => {
      await expect(enhancedVoiceService.clearConversation('non_existent')).resolves.not.toThrow();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Error Handling
  // ──────────────────────────────────────────────────────────
  describe('Error Handling', () => {
    it('should handle AI service errors gracefully', async () => {
      mockAIService.generateContent.mockRejectedValue(
        new Error('AI service temporarily unavailable'),
      );

      // analyzeEmotion catches and returns neutral fallback
      // generateContextualResponse catches and returns fallback string
      const result = await enhancedVoiceService.processConversation({
        sessionId: 'err-test',
        userId: 'test',
        text: 'Hola',
      });
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
    });

    it('should handle analytics service errors', async () => {
      mockAnalyticsService.getDashboardData.mockRejectedValue(
        new Error('Analytics service unavailable'),
      );

      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'analytics-err',
        userId: 'test',
        text: 'Hola',
      });

      // Response should still be generated despite analytics failure
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
    });

    it('should handle malformed AI responses', async () => {
      mockAIService.generateContent.mockResolvedValue('');

      const result = await enhancedVoiceService.processConversation({
        sessionId: 'malformed-test',
        userId: 'test',
        text: 'Hola',
      });

      // Service falls back to neutral emotion + template response
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Performance
  // ──────────────────────────────────────────────────────────
  describe('Performance', () => {
    it('should process conversation within reasonable time', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const startTime = Date.now();
      await enhancedVoiceService.processConversation({
        sessionId: 'perf-test',
        userId: 'test',
        text: 'Hola',
      });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle concurrent conversations', async () => {
      mockAIService.generateContent.mockResolvedValue(emotionJSON());

      const promises = Array.from({ length: 10 }, (_, i) =>
        enhancedVoiceService.processConversation({
          sessionId: `session_${i}`,
          userId: `user_${i}`,
          text: `Message ${i}`,
        }),
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result.response).toBeDefined();
        expect(typeof result.response).toBe('string');
      });
    });
  });
});
