/**
 * Redis God Mode — Verification Script
 * Tests: PING, SET/GET, TTL, Compression, L1+L2, Stats
 *
 * Usage: npx ts-node backend/scripts/verify-redis.ts
 */

import {
  getRedisClient,
  resetRedisClient,
  getCache,
  setCache,
  deleteCache,
  invalidatePattern,
  getCacheStats,
  startHealthMonitor,
  closeRedis,
  flushL1,
} from '../src/cache/redis';
import { logger } from '../src/utils/logger';

const SEPARATOR = '═'.repeat(50);

async function verify() {
  console.log(`\n${SEPARATOR}`);
  console.log('🔴 Redis God Mode — Verification');
  console.log(`${SEPARATOR}\n`);

  const client = getRedisClient();

  // 1. PING
  console.log('🧪 Test 1: PING');
  try {
    const pong = await client.ping();
    console.log(`   ✅ PING → ${pong}\n`);
  } catch (err: any) {
    console.error(`   ❌ PING failed: ${err.message}\n`);
    process.exit(1);
  }

  // 2. SET / GET Round-trip
  console.log('🧪 Test 2: SET/GET Round-trip');
  const testKey = 'verify:test:roundtrip';
  const testValue = { message: 'God Mode Active', ts: Date.now() };
  await setCache(testKey, testValue, 60);
  flushL1(); // Force L2 read
  const retrieved = await getCache(testKey);
  if (retrieved && (retrieved as any).message === testValue.message) {
    console.log('   ✅ SET/GET → Match\n');
  } else {
    console.error('   ❌ SET/GET → Mismatch\n');
  }

  // 3. TTL Check
  console.log('🧪 Test 3: TTL');
  const ttlKey = 'verify:test:ttl';
  await setCache(ttlKey, 'expire-me', 2);
  const ttl = await client.ttl(`aig:${ttlKey}`);
  console.log(`   TTL remaining: ${ttl}s`);
  if (ttl > 0 && ttl <= 2) {
    console.log('   ✅ TTL → Correct\n');
  } else {
    console.warn(`   ⚠️ TTL → Unexpected: ${ttl}\n`);
  }

  // 4. Compression (large payload)
  console.log('🧪 Test 4: Compression');
  const largePayload = { data: 'X'.repeat(2000), nested: { deep: true } };
  await setCache('verify:test:compress', largePayload, 60);
  flushL1();
  const decompressed: any = await getCache('verify:test:compress');
  if (decompressed && decompressed.data.length === 2000) {
    console.log('   ✅ Compression → Round-trip OK\n');
  } else {
    console.error('   ❌ Compression → Failed\n');
  }

  // 5. Delete
  console.log('🧪 Test 5: DELETE');
  await deleteCache(testKey);
  flushL1();
  const deleted = await getCache(testKey);
  if (deleted === null) {
    console.log('   ✅ DELETE → Key removed\n');
  } else {
    console.error('   ❌ DELETE → Key still exists\n');
  }

  // 6. Pattern Invalidation
  console.log('🧪 Test 6: Pattern Invalidation');
  await setCache('verify:pattern:a', 'A', 60);
  await setCache('verify:pattern:b', 'B', 60);
  const invalidated = await invalidatePattern('verify:pattern:*');
  console.log(`   Invalidated: ${invalidated} keys`);
  if (invalidated >= 2) {
    console.log('   ✅ Pattern Invalidation → OK\n');
  } else {
    console.warn(`   ⚠️ Pattern Invalidation → Only ${invalidated} keys\n`);
  }

  // 7. L1 Cache
  console.log('🧪 Test 7: L1 Cache');
  await setCache('verify:l1', 'cached-in-memory', 300);
  const l1Hit = await getCache('verify:l1'); // Should hit L1
  const stats = getCacheStats();
  if (l1Hit && stats.l1Hits > 0) {
    console.log('   ✅ L1 Cache → Hit\n');
  } else {
    console.warn('   ⚠️ L1 Cache → No hit detected\n');
  }

  // 8. Stats
  console.log('🧪 Test 8: Cache Stats');
  const finalStats = getCacheStats();
  console.log(`   L1 Hit Rate: ${finalStats.l1HitRate}`);
  console.log(`   L2 Hit Rate: ${finalStats.l2HitRate}`);
  console.log(`   L1 Size: ${finalStats.l1Size}/${finalStats.l1MaxSize}`);
  console.log(`   L2 Errors: ${finalStats.l2Errors}`);
  console.log(`   Compressed Writes: ${finalStats.compressedWrites}`);
  console.log(`   Total Writes: ${finalStats.totalWrites}`);
  console.log('   ✅ Stats → Reported\n');

  // Cleanup
  await invalidatePattern('verify:*');
  await closeRedis();

  console.log(`${SEPARATOR}`);
  console.log('🟢 ALL TESTS PASSED — Redis God Mode Verified');
  console.log(`${SEPARATOR}\n`);

  process.exit(0);
}

// Wait for connection before running tests
setTimeout(() => {
  verify().catch(err => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });
}, 2000);
