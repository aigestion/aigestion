import {
  getCache as gc,
  getRedisClient,
  setCache as sc,
  deleteCache as dc,
  invalidatePattern as ip,
  getCacheStats,
  closeRedis,
  startHealthMonitor,
  flushL1,
} from '../cache/redis';

export const getCache = gc;
export const setCache = sc;
export const deleteCache = dc;
export const invalidatePattern = ip;
export const getClient = getRedisClient;
export { getCacheStats, closeRedis, startHealthMonitor, flushL1 };

export default getRedisClient;
