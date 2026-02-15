import { RateLimitMiddleware } from './rate-limit.middleware';
import getRedisClient from '../utils/redis';
import { logger } from '../utils/logger';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;

let redisClient: any;
if (!isTest) {
  redisClient = getRedisClient();
}

export const rateLimiter = new RateLimitMiddleware(redisClient, logger);
