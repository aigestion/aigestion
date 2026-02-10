import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MonitoringService } from './monitoring.service';
import { logger } from '../utils/logger';
import { VaultService } from './vault.service';
import { IMissionRepository } from '../infrastructure/repository/MissionRepository';
import { MissionStatus, Mission } from '../models/Mission';
import { deriveMissionKey } from '../utils/secrets';
import crypto from 'node:crypto';

export enum HealingAction {
  RESTART_CONTAINER = 'RESTART_CONTAINER',
  PRUNE_CACHE = 'PRUNE_CACHE',
  SCALE_INSTANCES = 'SCALE_INSTANCES',
  REBOOT_SYSTEM = 'REBOOT_SYSTEM'
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
    @inject(TYPES.MissionRepository) private missionRepo: IMissionRepository
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
      createdAt: new Date()
    };

    const encryptedProposal = await this.vaultService.encrypt(
        JSON.stringify(proposal), 
        missionKey.toString('hex')
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
          originalAlertId: alert.id
      }
    });

    logger.warn({ proposalId }, '[SovereignHealing] Repair proposal stored. Awaiting approval.');
  }

  public async executeRepair(proposalId: string, approved: boolean) {
      if (!approved) {
          await this.missionRepo.update(proposalId, { status: MissionStatus.FAILED, error: 'Authorization Denied' });
          return;
      }

      // In Phase 12, we'd trigger actual infrastructure commands here
      logger.info({ proposalId }, '[SovereignHealing] Executing authorized repair...');
      
      // Update mission to COMPLETED
      await this.missionRepo.update(proposalId, { status: MissionStatus.COMPLETED });
  }
}
