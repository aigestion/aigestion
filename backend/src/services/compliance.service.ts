import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { User } from '../models/User';
import { UsageRecord } from '../models/UsageRecord';
import { Mission } from '../models/Mission';
import { Persona } from '../models/Persona';
import { logger } from '../utils/logger';
import { getRedisClient } from '../cache/redis';

@injectable()
export class ComplianceService {
  /**
   * 📁 Sovereign Data Export
   * Generates a complete JSON snapshot of all user data.
   */
  public async exportUserData(userId: string): Promise<any> {
    logger.info({ userId }, '[ComplianceService] Generating data export');

    const [user, usage, missions, personas] = await Promise.all([
      User.findById(userId).lean(),
      UsageRecord.find({ userId }).lean(),
      Mission.find({ userId }).lean(),
      Persona.find({ ownerId: userId }).lean(),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      exportTimestamp: new Date().toISOString(),
      userProfile: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: (user as any).createdAt,
      },
      activityRecords: usage,
      missions,
      personas,
      metadata: {
        system: 'AIGestion Sovereign Backend',
        version: '60.0.0',
      }
    };
  }

  /**
   * 💀 Sovereign Purge (Right to be Forgotten)
   * Irreversibly deletes all user data from DB and active caches.
   */
  public async purgeUser(userId: string): Promise<{ deleted: boolean; recordsCleared: number }> {
    logger.warn({ userId }, '[ComplianceService] INITIATING SOVEREIGN PURGE');

    const redis = getRedisClient();
    
    // 1. Parallel DB Purge
    const results = await Promise.all([
      User.findByIdAndDelete(userId),
      UsageRecord.deleteMany({ userId }),
      Mission.deleteMany({ userId }),
      Persona.deleteMany({ ownerId: userId }),
    ]);

    const recordsCleared = results.reduce((acc: number, res: any) => {
      if (res && res.deletedCount) return acc + res.deletedCount;
      if (res && res._id) return acc + 1;
      return acc;
    }, 0);

    // 2. Cache Purge
    if (redis?.isOpen) {
      const keys = await redis.keys(`*:${userId}*`);
      if (keys.length > 0) {
        await Promise.all(keys.map(key => redis.del(key)));
        logger.info({ userId, keysCleared: keys.length }, '[ComplianceService] Cache purged for user');
      }
    }

    logger.info({ userId, recordsCleared }, '[ComplianceService] Sovereign Purge complete');

    return {
      deleted: true,
      recordsCleared
    };
  }
}
