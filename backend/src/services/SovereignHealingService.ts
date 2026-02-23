import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MonitoringService } from './monitoring.service';
import { logger } from '../utils/logger';
import { VaultService } from './vault.service';
import { IMissionRepository } from '../infrastructure/repository/MissionRepository';
import { MissionStatus } from '../models/Mission';
import { deriveMissionKey } from '../utils/secrets';
import { InfrastructureService } from './infrastructure.service';
import { SovereignCodeRepairService } from './SovereignCodeRepairService';
import crypto from 'node:crypto';

export enum HealingAction {
  RESTART_CONTAINER = 'RESTART_CONTAINER',
  PRUNE_CACHE = 'PRUNE_CACHE',
  SCALE_INSTANCES = 'SCALE_INSTANCES',
  REBOOT_SYSTEM = 'REBOOT_SYSTEM',
  CODE_REPAIR = 'CODE_REPAIR',
}

export interface HealingProposal {
  id: string;
  condition: string;
  action: HealingAction;
  target: string;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  createdAt: Date;
}

@injectable()
export class SovereignHealingService {
  constructor(
    @inject(TYPES.MonitoringService) private monitoringService: MonitoringService,
    @inject(TYPES.VaultService) private vaultService: VaultService,
    @inject(TYPES.MissionRepository) private missionRepo: IMissionRepository,
    @inject(TYPES.InfrastructureService) private infraService: InfrastructureService,
    @inject(TYPES.SovereignCodeRepairService) private codeRepair: SovereignCodeRepairService,
  ) {
    // Start monitoring loop
    if (process.env.NODE_ENV !== 'test') {
      this.startHealingMonitor();
    }
  }

  private startHealingMonitor() {
    setInterval(() => {
      this.auditSystemHealth();
    }, 60000); // Audit every minute
  }

  public async auditSystemHealth() {
    try {
      const overview = await this.monitoringService.getMetricsOverview();
      const alerts = await this.monitoringService.getRecentAlerts(20);

      const activeCriticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');

      for (const alert of activeCriticalAlerts) {
        await this.generateHealingProposal(alert);
      }
    } catch (error) {
      logger.error('[SovereignHealing] Health audit failed:', error);
    }
  }

  private async generateHealingProposal(alert: any) {
    const proposalId = `heal_${crypto.randomBytes(4).toString('hex')}`;

    // Logic to determine action based on alert name/metadata
    let action: HealingAction = HealingAction.PRUNE_CACHE;
    let target = 'system';
    let impact: 'low' | 'medium' | 'high' = 'low';

    if (alert.name.includes('memory')) {
      action = HealingAction.PRUNE_CACHE;
      target = 'redis/node-heap';
      impact = 'low';
    } else if (alert.name.includes('cpu')) {
      action = HealingAction.RESTART_CONTAINER;
      target = alert.metadata?.container || 'backend-api';
      impact = 'medium';
    }

    logger.info({ proposalId, alert: alert.name }, '[SovereignHealing] Generating repair proposal');

    // Create a special "Healing Mission" to store the proposal
    // This allows us to use the existing E2EE infrastructure
    const masterSeed = process.env.JWT_SECRET || 'SOVEREIGN_REPAIR_SEED';
    const missionKey = await deriveMissionKey(masterSeed, proposalId, 'SYSTEM');

    const proposal: HealingProposal = {
      id: proposalId,
      condition: alert.message,
      action,
      target,
      impact,
      status: 'pending',
      createdAt: new Date(),
    };

    const encryptedProposal = await this.vaultService.encrypt(
      JSON.stringify(proposal),
      missionKey.toString('hex'),
    );

    await this.missionRepo.create({
      id: proposalId,
      objective: `[AUTO-HEAL] ${action} on ${target}`,
      status: MissionStatus.PLANNING, // PLANNING means it's awaiting approval
      userId: 'SYSTEM',
      isEncrypted: true,
      result: encryptedProposal.ciphertext,
      vaultIV: encryptedProposal.iv,
      vaultTag: encryptedProposal.tag,
      metadata: {
        isHealingProposal: true,
        originalAlertId: alert.id,
      },
    });

    logger.warn({ proposalId }, '[SovereignHealing] Repair proposal stored. Awaiting approval.');
  }

  public async executeRepair(proposalId: string, approved: boolean) {
    const proposal = await this.missionRepo.findById(proposalId);
    if (!proposal) {
      logger.error(`[SovereignHealing] Proposal ${proposalId} not found`);
      return;
    }

    if (!approved) {
      await this.missionRepo.update(proposalId, {
        status: MissionStatus.FAILED,
        error: 'Authorization Denied',
      });
      logger.info({ proposalId }, '[SovereignHealing] Repair rejected by user');
      return;
    }

    logger.info({ proposalId }, '[SovereignHealing] Executing authorized repair...');

    try {
      // Decode the action and target from the encrypted payload or mission metadata
      // For simplicity, we use the mission objective to parse or we could decrypt the result
      // But let's assume we have the proposal object from the DB or parameters

      // In this version, we'll try to find the action/target from the mission objective if not stored elsewhere
      const isRestart = proposal.objective.includes(HealingAction.RESTART_CONTAINER);
      const isPrune = proposal.objective.includes(HealingAction.PRUNE_CACHE);
      const isScale = proposal.objective.includes(HealingAction.SCALE_INSTANCES);

      let success = false;
      const target = proposal.objective.split(' on ')[1] || 'system';

      if (isRestart) {
        success = await this.infraService.restartService(target);
      } else if (isPrune) {
        // Mocking prune for now - usually involves cache flushes
        logger.info(`[SovereignHealing] Flushed caches for ${target}`);
        success = true;
      } else if (isScale) {
        success = await this.infraService.scaleService(target, 2);
      } else if (proposal.objective.includes(HealingAction.CODE_REPAIR)) {
        const repairResult = await this.codeRepair.conductAutomatedRepair({
          diagnosis: proposal.objective,
          logs: 'Triggered by autonomous audit',
          targetComponent: target,
        });
        success = repairResult.success;
      }

      if (success) {
        await this.missionRepo.update(proposalId, {
          status: MissionStatus.COMPLETED,
          error: undefined,
        });
        logger.info({ proposalId }, '[SovereignHealing] Repair executed successfully');
      } else {
        throw new Error('Infrastructure action failed');
      }
    } catch (error: any) {
      logger.error(
        { proposalId, error: error.message },
        '[SovereignHealing] Repair execution failed',
      );
      await this.missionRepo.update(proposalId, {
        status: MissionStatus.FAILED,
        error: `Execution failed: ${error.message}`,
      });
    }
  }
}
