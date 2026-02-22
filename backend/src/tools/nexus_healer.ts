/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { Redis } from 'ioredis';
import { env } from '../config/env.schema';
import axios from 'axios';
import { SwarmGovernor } from './SwarmGovernor';

// Simple Healer Script
// Intended to be run as a background cron or npm run healer

function checkDatabase(): boolean {
  try {
    if (Number(mongoose.connection.readyState) === 1) {
      return true;
    }
    logger.warn(
      'Healer: Database connection not ready. State: ' + mongoose.connection.readyState.toString(),
    );
    return false;
  } catch (error) {
    logger.error('Healer: Database check failed', error);
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  const redis = new Redis(env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // Fail fast for check
  });

  try {
    await redis.ping();
    await redis.quit();
    return true;
  } catch (error) {
    logger.error('Healer: Redis check failed', error);
    redis.disconnect();
    return false;
  }
}

async function checkHealthEndpoint(): Promise<boolean> {
  try {
    const port = env.PORT || 3000;
    const url = `http://localhost:${port}/api/v1/health`;
    const res = await axios.get(url, { timeout: 2000 });
    return res.status === 200;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('Healer: Health endpoint unreachable', message);
    return false;
  }
}

async function runHealer(): Promise<void> {
  logger.info('🏥 Nexus Healer: Starting Scan...');

  const dbOk = checkDatabase();
  const redisOk = await checkRedis();
  const apiOk = await checkHealthEndpoint();

  if (dbOk && redisOk && apiOk) {
    logger.info('✅ Nexus Healer: System Healthy');
  } else {
    logger.error(
      `❌ Nexus Healer: System Issues Detected. DB: ${String(dbOk)}, Redis: ${String(redisOk)}, API: ${String(apiOk)}`,
    );

    logger.info('🛰️ Nexus Healer: Triggering Autonomous Swarm Governor...');
    try {
      const governor = new SwarmGovernor();
      await governor.executeGovernanceCycle();
    } catch (error) {
      logger.error('💥 Nexus Healer: Failed to trigger Swarm Governor', error);
    }
  }
}

// Entry point for standalone execution
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('nexus_healer.ts') || process.argv[1].endsWith('nexus_healer.js'));

if (isMain) {
  runHealer()
    .then(() => {
      process.exit(0);
    })
    .catch((err: unknown) => {
      console.error(err);
      process.exit(1);
    });
}
