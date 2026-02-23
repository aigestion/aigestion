/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/docs/swagger.ts — Dynamic swagger setup, no @types dependencies
// Uses require() to avoid module resolution failures in monorepo builds where
// @types/* packages are in devDependencies (excluded by pnpm filter install)

/**
 * Sets up Swagger UI for API documentation.
 * @param app Express application instance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupSwagger(app: any): void {
  try {
    /* eslint-disable @typescript-eslint/no-var-requires */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swaggerJsdoc = require('swagger-jsdoc') as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swaggerUi = require('swagger-ui-express') as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodePath = require('path') as any;
    /* eslint-enable @typescript-eslint/no-var-requires */

    const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'AIGestion API',
        version: '1.0.0',
        description: 'Auto-generated API documentation for AIGestion backend',
      },
      servers: [{ url: process.env.API_BASE_URL || 'http://localhost:3000' }],
    };

    const options = {
      swaggerDefinition,
      apis: [
        nodePath.join(process.cwd(), 'src/routes/**/*.ts'),
        nodePath.join(process.cwd(), 'src/controllers/**/*.ts'),
        nodePath.join(process.cwd(), 'src/models/**/*.ts'),
      ],
    };

    const specs = swaggerJsdoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

    app.get('/api-docs.json', (_req: unknown, res: unknown) => {
      const r = res as { setHeader: (k: string, v: string) => void; send: (d: unknown) => void };
      r.setHeader('Content-Type', 'application/json');
      r.send(specs);
    });

    console.log(`📚 Swagger docs at http://localhost:${process.env.PORT || 3000}/api-docs`);
  } catch {
    console.warn('⚠️ Swagger setup skipped');
  }
}
