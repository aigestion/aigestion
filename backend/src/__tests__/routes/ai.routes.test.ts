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
  }, 30000);
});
