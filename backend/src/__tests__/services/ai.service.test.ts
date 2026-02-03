import 'reflect-metadata';
import { Container } from 'inversify';
import { Readable } from 'stream';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { AnalyticsService } from '../../services/analytics.service';
import type { RagService } from '../../services/rag.service';
import type { UsageService } from '../../services/usage.service';
// import { AIModelRouter, AIModelTier } from '../../utils/aiRouter'; // Removing static import

describe('AIService', () => {
    let container: Container;
    let aiService: any;
    let mockGenerateContent: any;
    let mockSendMessageStream: any;

    const mockAnalyticsService = { getDashboardData: jest.fn() };
    const mockRagService = { getProjectContext: jest.fn() };
    const mockUsageService = { trackUsage: jest.fn() };
    const mockSemanticCache = { getSemantic: jest.fn(), setSemantic: jest.fn() };

    beforeEach(async () => {
        jest.resetModules();

        mockGenerateContent = jest.fn();
        mockSendMessageStream = jest.fn();

        const { AIModelRouter, AIModelTier } = require('../../utils/aiRouter');

        jest.spyOn(AIModelRouter, 'route').mockReturnValue(AIModelTier.STANDARD);
        jest.spyOn(AIModelRouter, 'getModelConfig').mockReturnValue({
            provider: 'gemini',
            modelId: 'gemini-1.5-flash'
        });

        // Mock @google/generative-ai
        jest.mock('@google/generative-ai', () => {
            return {
                GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
                    getGenerativeModel: jest.fn().mockImplementation(() => ({
                        generateContent: mockGenerateContent,
                        startChat: jest.fn().mockImplementation(() => ({
                            sendMessageStream: mockSendMessageStream
                        }))
                    }))
                }))
            };
        });

        const { AIService } = require('../../services/ai.service');
        const { TYPES } = require('../../types');

        container = new Container();
        container.bind<AnalyticsService>(TYPES.AnalyticsService).toConstantValue(mockAnalyticsService as any);
        container.bind<RagService>(TYPES.RagService).toConstantValue(mockRagService as any);
        container.bind<UsageService>(TYPES.UsageService).toConstantValue(mockUsageService as any);
        container.bind<any>(TYPES.SemanticCacheService).toConstantValue(mockSemanticCache as any);
        container.bind<any>(AIService).toSelf();

        aiService = container.get<any>(AIService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('streamChat', () => {
        it('should use Gemini streaming when configured', async () => {
            const mockStream = {
                stream: (async function* () {
                    yield { text: () => 'Hello', functionCalls: () => [] };
                    yield { text: () => ' World', functionCalls: () => [] };
                })()
            };
            mockSendMessageStream.mockResolvedValue(mockStream);

            const params = {
                prompt: 'Hello',
                userId: 'test-user',
                history: []
            };

            const stream = await aiService.streamChat(params);

            const chunks: string[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk.toString());
            }

            const output = chunks.join('');
            expect(output).toContain('data: {"type":"text","content":"Hello"}\n\n');
            expect(output).toContain('data: {"type":"text","content":" World"}\n\n');
            expect(output).toContain('data: [DONE]\n\n');
        });
    });
});
