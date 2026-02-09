import request from 'supertest';

import { app } from '../app';

describe('Swagger routes presence', () => {
  it('should include custom routes in OpenAPI JSON', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.status).toBe(200);
    const paths = response.body.paths;
    expect(paths).toHaveProperty('/api/v1/stripe');
    expect(paths).toHaveProperty('/api/v1/youtube');
    expect(paths).toHaveProperty('/api/v1/users');
    expect(paths).toHaveProperty('/api/v1/ai');
    expect(paths).toHaveProperty('/api/v1/exit-templates');
  });
});
