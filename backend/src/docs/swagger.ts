// src/docs/swagger.ts
import type { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Basic OpenAPI definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AIGestion API',
    version: '1.0.0',
    description: 'Auto‑generated API documentation for AIGestion backend',
  },
  servers: [{ url: process.env.API_BASE_URL || 'http://localhost:3000' }],
};

import path from 'path';

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: [
    path.join(process.cwd(), 'src/routes/**/*.ts'),
    path.join(process.cwd(), 'src/controllers/**/*.ts'),
    path.join(process.cwd(), 'src/models/**/*.ts'),
  ],
};

const specs = swaggerJsdoc(options);

/**
 * Sets up Swagger UI for API documentation.
 * @param app Express application instance
 */
export function setupSwagger(app: Express): void {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(specs, { explorer: true }) as any);

  // Provide raw OpenAPI JSON at /api-docs.json
  app.get('/api-docs.json', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(
    '📚 API Documentation available at http://localhost:${process.env.PORT || 3000}/api-docs'
  );
}
