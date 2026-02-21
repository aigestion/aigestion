import axios from 'axios';
import { VapiService } from '../../services/VapiService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock env
jest.mock('../../config/env.schema', () => ({
  env: {
    VAPI_API_KEY: 'test-api-key',
    VAPI_API_URL: 'https://api.vapi.ai',
    VAPI_PHONE_NUMBER_ID: 'test-phone-id',
  },
}));

describe('VapiService', () => {
  let vapiService: VapiService;
  const mockApiKey = 'test-api-key';
  const mockApiUrl = 'https://api.vapi.ai';
  const mockPhoneId = 'test-phone-id';

  beforeEach(() => {
    jest.clearAllMocks();
    vapiService = new VapiService();
    // Manually set private fields if necessary or rely on env if configured in jest.setup
    (vapiService as any).apiKey = mockApiKey;
    (vapiService as any).baseUrl = mockApiUrl;
    (vapiService as any).phoneNumberId = mockPhoneId;
  });

  describe('createAssistant', () => {
    it('should create an assistant successfully', async () => {
      const mockResponse = { data: { id: 'assistant-123' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await vapiService.createAssistant('Astraea', 'System prompt');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${mockApiUrl}/assistant`,
        expect.objectContaining({ name: 'Astraea' }),
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
      await expect(vapiService.createAssistant('Astraea', 'System prompt')).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('createCall', () => {
    it('should induce a call successfully', async () => {
      const mockResponse = { data: { id: 'call-123' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await vapiService.createCall('+123456789', 'assistant-123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${mockApiUrl}/call/phone`,
        expect.objectContaining({
          assistantId: 'assistant-123',
          customer: { number: '+123456789' },
          phoneNumberId: mockPhoneId,
        }),
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('checkHealth', () => {
    it('should return true if API is healthy', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });
      const result = await vapiService.checkHealth();
      expect(result).toBe(true);
    });

    it('should return false if API is unhealthy', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Down'));
      const result = await vapiService.checkHealth();
      expect(result).toBe(false);
    });
  });
});
