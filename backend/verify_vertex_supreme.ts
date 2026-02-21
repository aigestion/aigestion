import 'reflect-metadata';
import { VertexAIService } from './src/services/google/vertex-ai.service';
import { logger } from './src/utils/logger';
import { getRedisClient, setCache, getCache } from './src/cache/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const vertexAI = new VertexAIService();

async function runVerification() {
  logger.info('🚀 Starting Vertex AI Supreme Verification...');

  const testText = `God Level Optimization Test - ${Date.now()}`;

  // 1. First Call (Miss)
  logger.info('--- Step 1: Cold Call (Internal API) ---');
  const start1 = Date.now();
  const embedding1 = await vertexAI.generateEmbeddings(testText);
  const duration1 = Date.now() - start1;
  logger.info(`Cold Duration: ${duration1}ms`);

  if (!embedding1 || embedding1.length === 0) {
    logger.error('❌ Failed to get embedding in Step 1');
    process.exit(1);
  }

  // 2. Second Call (Hit)
  logger.info('--- Step 2: Warm Call (Redis L2 Hit) ---');
  const start2 = Date.now();
  const embedding2 = await vertexAI.generateEmbeddings(testText);
  const duration2 = Date.now() - start2;
  logger.info(`Warm Duration: ${duration2}ms`);

  if (duration2 > duration1 / 2) {
    logger.warn(`⚠️ Cache hit took ${duration2}ms, which is not significantly faster than cold call (${duration1}ms)`);
  } else {
    logger.info(`✅ L2 Cache Hit confirmed. Speedup: ${(duration1 / duration2).toFixed(2)}x`);
  }

  // 3. Batch Call
  logger.info('--- Step 3: Batch Call (Partial Hits) ---');
  const batchTexts = [
    testText, // Cache Hit
    `New unique text for batch 1 - ${Date.now()}`, // Cache Miss
    `New unique text for batch 2 - ${Date.now()}`, // Cache Miss
  ];

  const start3 = Date.now();
  const batchResults = await vertexAI.generateEmbeddingsBatch(batchTexts);
  const duration3 = Date.now() - start3;
  logger.info(`Batch (3 items, 1 hit) Duration: ${duration3}ms`);

  if (batchResults.length === 3) {
    logger.info('✅ Batch processing successful');
  } else {
    logger.error(`❌ Batch processing returned ${batchResults.length} items instead of 3`);
  }

  logger.info('--- Verification Complete ---');
  process.exit(0);
}

runVerification().catch(err => {
  logger.error(err, 'Verification Script Crash:');
  process.exit(1);
});
