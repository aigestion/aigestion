import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { hkdf } from 'node:crypto';
import { promisify } from 'node:util';
import { logger } from './logger';

const hkdfAsync = promisify(hkdf);

export async function loadSecrets(): Promise<void> {
  // Only fetching secrets in production or if explicitly enabled
  // We skip if we are in CI/CD (GITHUB_ACTIONS) unless specifically required
  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_GCP_SECRETS !== 'true') {
    logger.info('Skipping Google Secret Manager (Dev mode)');
    return;
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    logger.warn('Skipping Secret Manager: GOOGLE_CLOUD_PROJECT_ID not set');
    return;
  }

  const client = new SecretManagerServiceClient();
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  // List of critical secrets to fetch
  // Add new secrets here as needed
  const secretNames = [
    'MONGODB_URI',
    'GEMINI_API_KEY',
    'GOOGLE_GENAI_API_KEY',
    'MONGO_ROOT_PASSWORD',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'SESSION_SECRET',
    'ENCRYPTION_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'ML_SERVICE_API_KEY',
    'IA_ENGINE_API_KEY',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_PRO_CHAT_ID',
    'ELEVENLABS_API_KEY',
    'TAVILY_API_KEY',
    'WHATSAPP_TOKEN',
    'META_ACCESS_TOKEN',
    'REDIS_PASSWORD',
    'OPENAI_API_KEY',
    'DEEPSEEK_API_KEY',
    'PINECONE_API_KEY',
    'VAPI_PRIVATE_KEY',
    'SUPABASE_KEY',
    'FIGMA_ACCESS_TOKEN',
    'NOTION_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'DATADOG_API_KEY',
    'SENTRY_AUTH_TOKEN',
    'GITHUB_API_TOKEN',
  ];

  logger.info(`Fetching ${secretNames.length} secrets from GCP Secret Manager...`);

  const results = await Promise.allSettled(
    secretNames.map(async name => {
      try {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectId}/secrets/${name}/versions/latest`,
        });
        const payload = version.payload?.data?.toString();
        if (payload) {
          process.env[name] = payload;
          return name;
        } else {
          throw new Error('Empty payload');
        }
      } catch (err: any) {
        // Don't crash, just log warning. Some secrets might not exist yet.
        // We throw so Promise.allSettled marks as rejected
        throw new Error(`Failed to fetch ${name}: ${err.message}`);
      }
    }),
  );

  const loaded = results.filter(r => r.status === 'fulfilled').map((r: any) => r.value);
  const failed = results.filter(r => r.status === 'rejected').map((r: any) => r.reason.message);

  if (loaded.length > 0) {
    logger.info(`✅ Successfully loaded secrets: ${loaded.join(', ')}`);
  }
  if (failed.length > 0) {
    // We log warnings but don't crash - let env.schema validation catch missing required envs later
    logger.warn(`⚠️  Failed to load some secrets:\n${failed.join('\n')}`);
  }
}

/**
 * Derives a mission-specific sub-key from a Master Sovereign Seed using HKDF.
 * This ensures that even if one mission key is compromised, others remain secure.
 */
export async function deriveMissionKey(
  masterSeed: string,
  missionId: string,
  userId: string,
): Promise<Buffer> {
  const salt = Buffer.from(userId);
  const info = `AIG_SOVEREIGN_MISSION_${missionId}`;
  const keyLength = 32; // AES-256

  try {
    const derivedKey = await hkdfAsync(
      'sha256',
      Buffer.from(masterSeed),
      salt,
      Buffer.from(info),
      keyLength,
    );
    return Buffer.from(derivedKey);
  } catch (error) {
    logger.error('[Secrets] HKDF derivation failed:', error);
    throw new Error('Failed to derive Sovereign mission key');
  }
}
