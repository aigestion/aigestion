import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from './utils/logger';

const client = new SecretManagerServiceClient();

/**
 * Professional Secret Loader
 * Fetches secrets from GCP Secret Manager and populates process.env
 */
export async function loadSecrets(projectId: string, secretNames: string[]): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Skipping Secret Manager in non-production environment');
    return;
  }

  logger.info(`Fetching ${secretNames.length} secrets from GCP Secret Manager for project: ${projectId}`);

  const tasks = secretNames.map(async (name) => {
    try {
      // If the variable is already set (e.g. by Cloud Run injection), skip fetching
      if (process.env[name]) {
        logger.debug(`Secret ${name} already present in environment, skipping fetch`);
        return;
      }

      const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${name}/versions/latest`,
      });

      const payload = version.payload?.data?.toString();
      if (payload) {
        process.env[name] = payload;
        logger.debug(`Successfully loaded secret: ${name}`);
      }
    } catch (error) {
      logger.warn(`Failed to load secret ${name} from Secret Manager: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  await Promise.all(tasks);
  logger.info('Secret loading process complete');
}
