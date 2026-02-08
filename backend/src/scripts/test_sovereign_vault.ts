import 'reflect-metadata';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { SovereignVaultService } from '../services/SovereignVaultService';
import { logger } from '../utils/logger';

async function testVault() {
  logger.info('🚀 Starting Sovereign Vault Verification...');

  try {
    const vault = container.get<SovereignVaultService>(TYPES.SovereignVaultService);

    // Test Query
    const query = 'NEXUS Sovereign Architecture';
    logger.info(`🔍 Querying vault: "${query}"`);

    const results = await vault.query(query, 2);

    logger.info(`✅ Received ${results.length} results from the vault.`);

    results.forEach((res, i) => {
      console.log(`[Result ${i + 1}] Source: ${res.source} | Score: ${res.score}`);
      console.log(`Content: ${res.content.substring(0, 100)}...`);
      console.log('---');
    });

    if (results.length > 0) {
      logger.info('🌟 Sovereign Vault is operational!');
    } else {
      logger.warn('⚠️ Vault returned 0 results. Check backend logs for connectivity issues.');
    }

    process.exit(0);
  } catch (error: any) {
    logger.error(`💥 Verification failed: ${error.message}`);
    process.exit(1);
  }
}

testVault();
