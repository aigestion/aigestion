import { injectable } from 'inversify';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

@injectable()
export class FeatureFlagService {
  private readonly CACHE_KEY = 'nexus:feature_flags';

  /**
   * Checks if a feature is enabled for a specific user or globally.
   */
  async isEnabled(flagName: string, userId?: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client?.isOpen) return false;

    // 1. Check user-specific override
    if (userId) {
      const userOverride = await client.hGet(`${this.CACHE_KEY}:user:${userId}`, flagName);
      if (userOverride !== null) return userOverride === 'true';
    }

    // 2. Check global state
    const globalState = await client.hGet(this.CACHE_KEY, flagName);
    return globalState === 'true';
  }

  /**
   * Sets a global feature flag.
   */
  async setGlobalFlag(flagName: string, enabled: boolean): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    await client.hSet(this.CACHE_KEY, flagName, enabled.toString());
    logger.info(`[FeatureFlag] Global flag ${flagName} set to ${enabled}`);
  }

  /**
   * Sets a user-specific feature flag override.
   */
  async setUserOverride(userId: string, flagName: string, enabled: boolean): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    await client.hSet(`${this.CACHE_KEY}:user:${userId}`, flagName, enabled.toString());
    logger.info(`[FeatureFlag] User ${userId} override for ${flagName} set to ${enabled}`);
  }
}
