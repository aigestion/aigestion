/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { logger } from '../utils/logger';
import { AIService } from '../services/ai.service';
import { Redis } from 'ioredis';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { env } from '../config/env.schema';

const execAsync = promisify(exec);

/**
 * 🌌 Sovereign Swarm Governor
 * The brain of the autonomous self-repair system.
 * Note: This is a standalone bridge script. AI/DI dependencies are intentionally
 * initialized with null to allow standalone execution outside the DI container.
 */
export class SwarmGovernor {
  private redis: Redis;
  private aiService: AIService;

  constructor() {
    this.redis = new Redis(env.REDIS_URL || 'redis://localhost:6379');
    // Standalone bridge — AI service used without full DI container
    this.aiService = new AIService(null as any, null as any, null as any);
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

    const result = await this.aiService.triggerSwarmMission(mission, {
      governor: 'Sovereign-v1',
      timestamp: new Date().toISOString(),
    });

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
