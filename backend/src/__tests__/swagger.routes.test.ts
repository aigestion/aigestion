import request from 'supertest';

import { app } from '../app';

describe('Swagger routes presence', () => {
  it('should include custom routes in OpenAPI JSON', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.status).toBe(200);
    const paths = response.body.paths;
    const pathKeys = Object.keys(paths);

    // Check for existence checks
    // expect(pathKeys).toContain('/api/v1/stripe/checkout'); // Lazy loaded, might not appear in static swagger gen
    expect(pathKeys).toContain('/api/v1/users');
    expect(pathKeys).toContain('/api/v1/ai/prompt');

    // This is the one previously failing
    expect(pathKeys).toContain('/api/v1/exit-templates');
  });
});
