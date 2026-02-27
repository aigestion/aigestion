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
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const nodePath = require('node:path');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const { swaggerDefinition: manualDefinition } = require('./api-v1.swagger.ts');

    const options = {
      swaggerDefinition: {
        ...manualDefinition,
        servers: [{ url: process.env.API_BASE_URL || 'http://localhost:3000' }],
      },
      apis: [
        nodePath.join(__dirname, '../routes/**/*.ts'),
        nodePath.join(__dirname, '../controllers/**/*.ts'),
        nodePath.join(__dirname, '../models/**/*.ts'),
      ],
    };

    const specs = swaggerJsdoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

    // ✨ SOVEREIGN SCALAR UI (Premium API Docs)
    app.get('/docs', (_req: any, res: any) => {
      res.send(`
        <!doctype html>
        <html>
          <head>
            <title>AIGestion Nexus API Docs</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <script
              id="api-reference"
              data-url="/api-docs.json"
              src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"
            ></script>
          </body>
        </html>
      `);
    });

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
