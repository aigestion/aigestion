/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { logger } from '../utils/logger';
import { AIService } from '../services/ai.service';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { TYPES } from '../types';
import { container } from '../config/inversify.config';

const execAsync = promisify(exec);

/**
 * 🛠️ Swarm Auto-Repair
 * Uses AI to automatically fix identified issues.
 * Note: Uses the DI container to ensure all integrated services are available.
 */
async function main(): Promise<void> {
  const issues = process.argv.slice(2);
  if (issues.length === 0) {
    logger.info('No issues provided for auto-repair.');
    return;
  }

  logger.info(`🛠️ Initiating Auto-Repair for: ${issues.join(', ')}`);

  // Protocol 0: Backup
  try {
    logger.info('📦 Creating pre-repair backup...');
    await execAsync('npm run backup:local');
  } catch (error) {
    logger.error('❌ Failed to create backup. Aborting repair.', error);
    process.exit(1);
  }

  // Protocol 1: Repair Logic via AIService
  // Initialize AI service via container
  const aiService = container.get<AIService>(TYPES.AIService);
  const mission = `Repair Mission: Automatically resolve ${issues.join(', ')}. Focus on fixing syntax and semantic errors.`;

  const result = await aiService.triggerSwarmMission(mission);

  if (result.success) {
    logger.info(`✅ Auto-Repair job dispatched. Monitoring: ${result.jobId}`);
  } else {
    logger.error(`❌ Failed to dispatch repair mission: ${result.error}`);
  }
}

main().catch(console.error);
