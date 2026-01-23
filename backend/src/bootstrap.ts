/**
 * AIGestion - Professional Bootstrap Entry Point
 *
 * This file ensures all environment-specific configurations are loaded
 * asynchronously (e.g. from Google Cloud Secret Manager) BEFORE the
 * application logic and Zod validation (env.schema.ts) are initialized.
 */
import dotenv from 'dotenv';
import path from 'path';
import { loadSecrets } from './utils/secret-loader';
import { logger } from './utils/logger';

async function bootstrap() {
  console.log('🌌 [GOD-MODE] Starting AIGestion Bootstrap...');

  // 1. Initial .env load (for local dev and to get Project IDs)
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const isProduction = process.env.NODE_ENV === 'production';

  // 2. Load Pro-Level Secrets from GCP if applicable
  if (projectId && !process.env.SKIP_SECRETS) {
    try {
      // Define critical secrets that must be fetched from GCP
      const criticalSecrets = [
        'MONGODB_URI',
        'REDIS_URL',
        'JWT_SECRET',
        'OPENAI_API_KEY',
        'ANTHROPIC_API_KEY',
        'GEMINI_API_KEY',
        'STRIPE_SECRET_KEY',
        'GOOGLE_MAPS_API_KEY'
      ];

      await loadSecrets(projectId, criticalSecrets);
    } catch (error) {
      console.error('❌ Error during Secret Manager loading:', error);
      if (isProduction) process.exit(1);
    }
  }

  // 3. Handover to the main server
  console.log('🚀 [GOD-MODE] Bootstrap complete. Launching server...');
  await import('./server');
}

bootstrap().catch((err) => {
  console.error('💥 FATAL BOOTSTRAP ERROR:', err);
  process.exit(1);
});
