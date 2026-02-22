import { logger } from '../utils/logger';
import { AIService } from '../services/ai.service';
import { Redis } from 'ioredis';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { env } from '../config/env.schema';
import { TYPES } from '../types';
import { container } from '../config/inversify.config';

const execAsync = promisify(exec);

/**
 * 🌌 Sovereign Swarm Governor
 * The brain of the autonomous self-repair system.
 * Note: Uses the DI container to ensure all integrated services are available.
 */
export class SwarmGovernor {
  private redis: Redis;
  private aiService: AIService;

  constructor() {
    this.redis = new Redis(env.REDIS_URL || 'redis://localhost:6379');
    // Initialize AI service via container
    this.aiService = container.get<AIService>(TYPES.AIService);
  }

  /**
   * Run a full maintenance cycle
   */
  public async executeGovernanceCycle(): Promise<void> {
    logger.info('🚀 Swarm Governor: Initiating Sovereign Maintenance Cycle...');

    try {
      // 1. Diagnostics
      const diagnostics = await this.runDiagnostics();

      if (diagnostics.healthy) {
        logger.info('✨ Swarm Governor: All systems nominal. No repair needed.');
        return;
      }

      logger.warn(`⚠️ Swarm Governor: System issues detected: ${diagnostics.issues.join(', ')}`);

      // 2. Trigger Repair Mission
      await this.triggerRepairMission(diagnostics.issues);
    } catch (error) {
      logger.error('💥 Swarm Governor: Critical failure in governance cycle', error);
    } finally {
      await this.redis.quit();
    }
  }

  private async runDiagnostics(): Promise<{ healthy: boolean; issues: string[] }> {
    logger.info('🔍 Running deep diagnostics...');
    const issues: string[] = [];

    // Check Env
    try {
      await execAsync('node ops/audit_env.js');
    } catch (e) {
      logger.warn('Swarm Governor: ENV audit failed', e);
      issues.push('ENV_AUDIT_FAIL');
    }

    // Check Docker (if in dev/prod)
    try {
      await execAsync('bash scripts/docker-health-check.sh dev');
    } catch (e) {
      logger.warn('Swarm Governor: Docker health check failed', e);
      issues.push('DOCKER_HEALTH_FAIL');
    }

    return {
      healthy: issues.length === 0,
      issues,
    };
  }

  private async triggerRepairMission(issues: string[]): Promise<void> {
    const mission = `Autonomous Self-Repair Mission: Detect and fix the following issues: ${issues.join(', ')}.
    Protocol: Create backup first, then apply fixes and verify.`;

    logger.info(`🛰️ Swarm Governor: Dispatching repair mission to AI Swarm...`);

    const result = await this.aiService.triggerSwarmMission(mission);

    if (result.success) {
      logger.info(`✅ Swarm Governor: Mission dispatched. Job ID: ${result.jobId}`);
      await this.redis.set(
        'swarm:last_mission',
        JSON.stringify({
          jobId: result.jobId,
          issues,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      logger.error(`❌ Swarm Governor: Failed to dispatch mission: ${result.error}`);
    }
  }
}

// Entry point for standalone execution
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('SwarmGovernor.ts') || process.argv[1].endsWith('SwarmGovernor.js'));

if (isMain) {
  const governor = new SwarmGovernor();
  void governor.executeGovernanceCycle();
}
