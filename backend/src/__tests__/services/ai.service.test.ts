import 'reflect-metadata';
import { Container } from 'inversify';
import { Readable } from 'stream';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { AnalyticsService } from '@/services/analytics.service';
import type { RagService } from '@/services/rag.service';
import type { UsageService } from '@/services/usage.service';
import type { ArbitrationService } from '@/services/arbitration.service';

describe('AIService', () => {
  let container: Container;
  let aiService: any;
  let mockGenerateContent: any;
  let mockSendMessageStream: any;

  const mockAnalyticsService = { getDashboardData: jest.fn() };
  const mockRagService = { getProjectContext: jest.fn() };
  const mockUsageService = { trackUsage: jest.fn() };
  const mockSemanticCache = { getSemantic: jest.fn(), setSemantic: jest.fn() };
  const mockArbitrationService = {
    arbitrate: jest.fn(),
    getOptimalConfig: jest
      .fn()
      .mockReturnValue({ provider: 'gemini', modelId: 'gemini-1.5-flash' }),
  };

  beforeEach(async () => {
    jest.resetModules();

    mockGenerateContent = jest.fn();
    mockSendMessageStream = jest.fn();

    // Re-register amqplib mock after resetModules()
    jest.mock('amqplib', () => ({
      connect: jest.fn().mockResolvedValue({
        createChannel: jest.fn().mockResolvedValue({
          prefetch: jest.fn().mockResolvedValue(undefined),
          assertQueue: jest.fn().mockResolvedValue({}),
          on: jest.fn().mockReturnThis(),
          close: jest.fn().mockResolvedValue(undefined),
        }),
        close: jest.fn().mockResolvedValue(undefined),
        on: jest.fn().mockReturnThis(),
      }),
    }));

    // Must be set BEFORE requiring the service — captures closure over mockSendMessageStream
    const getMockSMS = () => mockSendMessageStream;

    // Mock @google-cloud/vertexai to prevent real GCP auth and forward to shared mock
    jest.mock('@google-cloud/vertexai', () => ({
      VertexAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({ response: { text: () => 'mock' } }),
          generateContentStream: jest.fn().mockResolvedValue({
            stream: (async function* () {
              yield { text: () => 'mock vertex', functionCalls: () => [] };
            })(),
            response: Promise.resolve({ text: () => 'mock vertex' }),
          }),
          startChat: jest.fn().mockReturnValue({
            sendMessageStream: (...args: any[]) => getMockSMS()(...args),
          }),
        }),
      })),
      HarmCategory: {},
      HarmBlockThreshold: {},
    }));

    // Mock @google/generative-ai (Gemini path)
    jest.mock('@google/generative-ai', () => ({
      GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockImplementation(() => ({
          generateContent: mockGenerateContent,
          startChat: jest.fn().mockImplementation(() => ({
            sendMessageStream: mockSendMessageStream,
          })),
        })),
      })),
    }));

    const { AIModelRouter, AIModelTier } = require('../../utils/aiRouter');
    jest.spyOn(AIModelRouter, 'route').mockReturnValue(AIModelTier.STANDARD);
    jest.spyOn(AIModelRouter, 'getModelConfig').mockReturnValue({
      provider: 'gemini',
      modelId: 'gemini-1.5-flash',
    });

    const { AIService } = require('@/services/ai.service');
    const { TYPES } = require('@/types');

    container = new Container();
    container
      .bind<AnalyticsService>(TYPES.AnalyticsService)
      .toConstantValue(mockAnalyticsService as any);
    container.bind<RagService>(TYPES.RagService).toConstantValue(mockRagService as any);
    container.bind<UsageService>(TYPES.UsageService).toConstantValue(mockUsageService as any);
    container.bind<any>(TYPES.SemanticCacheService).toConstantValue(mockSemanticCache as any);
    container
      .bind<ArbitrationService>(TYPES.ArbitrationService)
      .toConstantValue(mockArbitrationService as any);
    container
      .bind<any>(TYPES.PineconeService)
      .toConstantValue({ upsert: jest.fn(), query: jest.fn() } as any);
    container
      .bind<any>(TYPES.NexusSwarmOrchestrator)
      .toConstantValue({ orchestrate: jest.fn() } as any);
    container.bind<any>(TYPES.JulesGem).toConstantValue({ chat: jest.fn() } as any);
    container.bind<any>(TYPES.NexusStitchGem).toConstantValue({ stitch: jest.fn() } as any);
    container.bind<any>(TYPES.SwarmInternalClient).toConstantValue({ send: jest.fn() } as any);
    container.bind<any>(AIService).toSelf();

    aiService = container.get<any>(AIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('streamChat', () => {
    it('should stream response from AI model', async () => {
      const mockStream = {
        stream: (async function* () {
          yield { text: () => 'Hello', functionCalls: () => [] };
          yield { text: () => ' World', functionCalls: () => [] };
        })(),
      };
      mockSendMessageStream.mockResolvedValue(mockStream);

      const params = {
        prompt: 'Hello',
        userId: 'test-user',
        history: [],
      };

      const stream = await aiService.streamChat(params);

      const chunks: string[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk.toString());
      }

      const output = chunks.join('');
      // The service should stream text chunks — just verify we got text output
      expect(output).toBeTruthy();
      expect(output).toContain('"type":"text"');
    });
  });
});
