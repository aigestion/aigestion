import { getRedisClient, resetRedisClient } from '../src/cache/redis';

// Mocking process.env
const runTest = async () => {
  console.log('--- STARTING MANUAL VERIFICATION ---');

  console.log('\nTest 1: Standalone (Default)');
  resetRedisClient();
  delete process.env.REDIS_CLUSTER_NODES;
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';

  try {
    const client = getRedisClient();
    console.log('Client created.');
    if ((client as any)._options?.url) {
      // Inspect internal state if possible, or just checks logs
      console.log('SUCCESS: URL found:', (client as any)._options.url);
    } else {
      // Redis v4 client structure is different, let's just rely on the logs we added to redis.ts
    }
  } catch (e) {
    console.error('ERROR:', e);
  }

  console.log('\nTest 2: Cluster');
  resetRedisClient();
  process.env.REDIS_CLUSTER_NODES = 'redis://node1:6379,redis://node2:6379';

  try {
    const client = getRedisClient();
    console.log('Client created.');
    // We expect logs from redis.ts to show Cluster initialization
  } catch (e) {
    console.error('ERROR:', e);
  }

  console.log('--- END MANUAL VERIFICATION ---');
};

runTest();
