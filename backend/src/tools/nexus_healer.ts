import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { Redis } from 'ioredis';
import { env } from '../config/env.schema';
import axios from 'axios';

// Simple Healer Script
// Intended to be run as a background cron or interval process
// npm run healer

const CHECK_INTERVAL = 60000; // 1 minute

async function checkDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    logger.warn('Healer: Database connection not ready. State: ' + mongoose.connection.readyState);
    return false;
  } catch (error) {
    logger.error('Healer: Database check failed', error);
    return false;
  }
}

async function checkRedis() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null // Fail fast for check
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

async function checkHealthEndpoint() {
  try {
    // Assuming running on localhost/port from env or default 3000
    const port = process.env.PORT || 3000;
    const url = `http://localhost:${port}/api/v1/health`;
    const res = await axios.get(url, { timeout: 2000 });
    return res.status === 200;
  } catch (error) {
    // It's possible the server isn't running if we are just running this script standalone
    // But in a real scenario, this would detect a down API.
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('Healer: Health endpoint unreachable', message);
    return false;
  }
}

async function runHealer() {
  logger.info('🏥 Nexus Healer: Starting Scan...');

  const dbOk = await checkDatabase();
  const redisOk = await checkRedis();
  const apiOk = await checkHealthEndpoint();

  if (dbOk && redisOk && apiOk) {
    logger.info('✅ Nexus Healer: System Healthy');
  } else {
    logger.error(`❌ Nexus Healer: System Issues Detected. DB: ${dbOk}, Redis: ${redisOk}, API: ${apiOk}`);
    // In a real V2, we would trigger self-healing actions here
    // e.g., restart docker containers, flush redis, etc.
    // For now, we just log critical alerts which would be picked up by external monitoring
  }
}

if (require.main === module) {
  // If run directly
  runHealer().then(() => {
    // If we want it to run once and exit:
    process.exit(0);
    // If we want it to verify continuously:
    // setInterval(runHealer, CHECK_INTERVAL);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
