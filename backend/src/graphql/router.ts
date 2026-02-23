import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';

import { createDataloaders } from './dataloaders';
import { schema } from './schema';

/**
 * GraphQL Router
 * Endpoint: /graphql
 *
 * Uses graphql-http (official GraphQL-over-HTTP reference implementation)
 * replacing the deprecated express-graphql package.
 */
export function createGraphQLRouter() {
  const router = express.Router();

  router.all(
    '/',
    createHandler({
      schema,
      context: req => ({
        req: req.raw,
        dataloaders: createDataloaders(),
      }),
    }),
  );

  return router;
}
