import { register } from 'tsconfig-paths';
import tsConfig from '../tsconfig.json';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables via dotenv only if not already provided by host/dotenvx
if (!process.env.PORT && !process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(process.cwd(), '../.env') });
}

// Register path aliases from tsconfig.json
register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

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
