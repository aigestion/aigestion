import * as dotenv from 'dotenv';
import * as path from 'path';
// Load consolidated root env immediately
dotenv.config({ path: path.join(__dirname, '../../.env') });

import 'reflect-metadata';
import { container } from '../src/config/inversify.config';
import { TYPES } from '../src/types';
import { GodModeWorkspaceOrchestrator } from '../src/services/google/god-mode-orchestrator.service';
import { logger } from '../src/utils/logger';

async function verifyGodMode() {
  logger.info('🚀 DATASET | Workspace God Mode Verification');

  try {
    const orchestrator = container.get<GodModeWorkspaceOrchestrator>(
      TYPES.GodModeWorkspaceOrchestrator,
    );

    logger.info('--- 1. Testing Sync Orchestration ---');
    const result = await orchestrator.performSovereignSync();

    logger.info('✅ SYNC SUCCESSFUL');
    console.table(result);

    logger.info('--- 2. Verifying Environment Flags ---');
    logger.info(`GMAIL_GOD_MODE_ENABLED: ${process.env.GMAIL_GOD_MODE_ENABLED}`);
    logger.info(`WORKSPACE_AUTO_CLEANUP_DAYS: ${process.env.WORKSPACE_AUTO_CLEANUP_DAYS}`);

    process.exit(0);
  } catch (error: any) {
    logger.error(`❌ VERIFICATION FAILED: ${error.message}`);
    process.exit(1);
  }
}

verifyGodMode();
