import 'reflect-metadata';
import path from 'path';
import { DanielaCallAgent } from '../../services/daniela-call-agent.service';
import { AIService } from '../../services/ai.service';
import { ElevenLabsService } from '../../services/elevenlabs.service';
import { ContactRegistryService } from '../../services/contact-registry.service';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock Supabase globally to prevent side effects in tests
jest.mock('../../services/supabase.service', () => ({
  SupabaseService: {
    getInstance: jest.fn().mockReturnValue({
      client: {},
      initializeRealtimeSubscriptions: jest.fn(),
    }),
  },
}));

describe('DanielaCallAgent', () => {
  let callAgent: DanielaCallAgent;
  let mockAIService: jest.Mocked<AIService>;
  let mockElevenLabsService: jest.Mocked<ElevenLabsService>;
  let mockContactRegistry: jest.Mocked<ContactRegistryService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAIService = {
      generateContent: jest.fn(),
    } as any;

    mockElevenLabsService = {
      textToSpeech: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockContactRegistry = {
      findByName: jest.fn(),
    } as any;

    callAgent = new DanielaCallAgent(mockAIService, mockElevenLabsService, mockContactRegistry);
  });

  describe('initiateVoiceCall', () => {
    const mockContact = {
      id: '1',
      name: 'Papá',
      phone: '+34600000000',
      relationship: 'padre',
      aliases: ['papá', 'padre'],
    };

    it('should successfully initiate a voice call', async () => {
      mockContactRegistry.findByName.mockReturnValue(mockContact);
      mockAIService.generateContent.mockResolvedValue('Hola papá, ¿cómo estás?');

      const result = await callAgent.initiateVoiceCall(
        'Papá',
        'Dile que estoy ocupado',
        'Alejandro',
      );

      expect(result.status).toBe('audio_ready');
      expect(result.contact.name).toBe('Papá');
      expect(result.danielaScript).toBe('Hola papá, ¿cómo estás?');
      expect(result.audioUrl).toContain('.mp3');
      expect(mockElevenLabsService.textToSpeech).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringContaining('Voice call audio ready'),
      );
    });

    it('should throw an error if contact is not found', async () => {
      mockContactRegistry.findByName.mockReturnValue(null);

      await expect(callAgent.initiateVoiceCall('Unknown', 'Hello', 'Alejandro')).rejects.toThrow(
        'Contact "Unknown" not found',
      );
    });

    it('should handle AI service failure gracefully', async () => {
      mockContactRegistry.findByName.mockReturnValue(mockContact);
      mockAIService.generateContent.mockRejectedValue(new Error('AI fail'));

      const result = await callAgent.initiateVoiceCall('Papá', 'Hello', 'Alejandro');

      // Should use fallback script
      expect(result.danielaScript).toContain('asistente de Alejandro');
      expect(result.status).toBe('audio_ready');
    });
  });

  describe('extractCallInstructions', () => {
    it('should extract contact and instructions correctly from complex patterns', () => {
      const messages = [
        {
          input: 'Llama a papá y dile que estoy ocupado',
          expected: { contactName: 'papá', instructions: 'estoy ocupado' },
        },
        {
          input: 'Marca al jefe y pregúntale si ya llegó',
          expected: { contactName: 'jefe', instructions: 'ya llegó' },
        },
        {
          input: 'Contacta con Alejandro para decirle que la reunión se canceló',
          expected: { contactName: 'Alejandro', instructions: 'la reunión se canceló' },
        },
      ];

      messages.forEach(({ input, expected }) => {
        expect(DanielaCallAgent.extractCallInstructions(input)).toEqual(expected);
      });
    });

    it('should handle simple call requests without instructions', () => {
      const input = 'Llama a mamá';
      const expected = { contactName: 'mamá', instructions: '' };
      expect(DanielaCallAgent.extractCallInstructions(input)).toEqual(expected);
    });

    it('should return null contact if no pattern matches', () => {
      const input = 'Hola Daniela';
      const expected = { contactName: null, instructions: '' };
      expect(DanielaCallAgent.extractCallInstructions(input)).toEqual(expected);
    });
  });
});
