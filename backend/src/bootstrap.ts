// MUST run before ANY imports to register @/ alias
import path from 'path';
import Module from 'module';

// Register @/ path alias → dist/ directory at runtime
// This replaces tsc-alias which incorrectly transforms npm package names
// that collide with directory names (e.g., 'graphql' → '../graphql')
const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (
  request: string,
  parent: any,
  isMain: boolean,
  options: any,
) {
  if (request.startsWith('@/')) {
    const resolved = path.join(__dirname, request.substring(2));
    return originalResolveFilename.call(this, resolved, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

import { loadSecrets } from './utils/secrets';
import { logger } from './utils/logger';

async function bootstrap() {
  console.log('🚀 [Bootstrap] Starting AIGestion Backend...');

  try {
    // 1. Load Secrets first (async)
    // This ensures process.env is populated before config/env.schema.ts runs
    await loadSecrets();

    // 2. Import Server (which imports Config, App, etc.)
    // We use dynamic import to ensure it runs AFTER secrets are loaded
    logger.info('[Bootstrap] Secrets phase complete. Initializing server...');
    await import('./server');
  } catch (err) {
    console.error('❌ [Bootstrap] Critical failure:', err);
    // In production, we MUST fail fast if connectivity is broken
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

bootstrap();
