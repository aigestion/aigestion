/**
 * AI Routes Test (SSE Streaming)
 *
 * This test requires a fully booted Express app with IoC-resolved controllers.
 * The `danielaController.chat` is resolved via InversifyJS and cannot be easily
 * mocked without a full container setup. Test is conditionally skipped in unit mode.
 *
 * To run: RUN_INTEGRATION_TESTS=true npx jest --runInBand ai.routes.test.ts
 */

const SKIP_INTEGRATION = process.env.NODE_ENV === 'test' && !process.env.RUN_INTEGRATION_TESTS;

(SKIP_INTEGRATION ? describe.skip : describe)('POST /api/v1/ai/chat (SSE streaming)', () => {
  let originalAIService: any;
  const { container, TYPES } = require('../../config/inversify.config');
  const { Readable } = require('stream');

  beforeAll(() => {
    // Mock AIService
    originalAIService = container.get(TYPES.AIService);
    const mockAIService = {
      streamChat: jest.fn().mockImplementation(() => {
        const stream = new Readable({ read() {} });
        setTimeout(() => {
          stream.push(`data: ${JSON.stringify({ type: 'text', content: 'Hello' })}\n\n`);
          setTimeout(() => {
            stream.push('data: [DONE]\n\n');
            stream.push(null);
          }, 100);
        }, 100);
        return Promise.resolve(stream);
      }),
      generateContent: jest.fn().mockResolvedValue('Hello from mock'),
    };
    container.rebind(TYPES.AIService).toConstantValue(mockAIService);
  });

  afterAll(() => {
    container.rebind(TYPES.AIService).toConstantValue(originalAIService);
  });

  it('should stream tokens and finish with DONE', async () => {
    const request = require('supertest');
    const { app } = require('../../app');

    const response = await request(app)
      .post('/api/v1/ai/chat')
      .send({ prompt: 'Hi', history: [] })
      .set('Accept', 'text/event-stream')
      .expect('Content-Type', /text\/event-stream/)
      .expect(200);

    const payload = response.text;
    expect(payload).toContain('"type":"text"');
    expect(payload).toContain('Hello');
    expect(payload).toContain('[DONE]');
  }, 60000);
});
