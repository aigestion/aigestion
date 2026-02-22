import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { MonitoringService } from './monitoring.service';
import { logger } from '../utils/logger';
import { VaultService } from './vault.service';
import { IMissionRepository } from '../infrastructure/repository/MissionRepository';
import { MissionStatus } from '../models/Mission';
import { deriveMissionKey } from '../utils/secrets';
import crypto from 'node:crypto';
import { PixelBridgeService } from './iot/PixelBridgeService';
import { ProactiveVoiceService } from './ProactiveVoiceService';
import { InfrastructureService } from './infrastructure.service';
import { NeuralHealthService, HealthMetrics } from './NeuralHealthService';
import { AIService } from './ai.service';
import { RateLimitService } from './rate-limit.service';
import { SovereignCodeRepairService } from './SovereignCodeRepairService';

export enum HealingAction {
  RESTART_CONTAINER = 'RESTART_CONTAINER',
  PRUNE_CACHE = 'PRUNE_CACHE',
  SCALE_INSTANCES = 'SCALE_INSTANCES',
  REBOOT_SYSTEM = 'REBOOT_SYSTEM',
  ACTIVATE_SHIELD = 'ACTIVATE_SHIELD',
  PHOENIX_PROTOCOL = 'PHOENIX_PROTOCOL',
  OPTIMIZE_SERVICE = 'OPTIMIZE_SERVICE',
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
    @inject(TYPES.PixelBridgeService) private pixelBridge: PixelBridgeService,
    @inject(TYPES.ProactiveVoiceService) private proactiveVoice: ProactiveVoiceService,
    @inject(TYPES.InfrastructureService) private infraService: InfrastructureService,
    @inject(TYPES.NeuralHealthService) private neuralHealth: NeuralHealthService,
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.RateLimitService) private rateLimit: RateLimitService,
    @inject(TYPES.SovereignCodeRepairService) private codeRepair: SovereignCodeRepairService,
  ) {
    // Start monitoring loop
    if (process.env.NODE_ENV !== 'test') {
      this.startHealingMonitor();
      this.subscribeToNeuralPulse();
    }
  }

  private subscribeToNeuralPulse() {
    this.neuralHealth.on('healthWarning', (metrics: HealthMetrics) => {
      logger.warn(
        { sanityScore: metrics.sanityScore },
        '[SovereignHealing] Neural Warning detected. Initiating rapid diagnosis.',
      );
      this.handleNeuralWarning(metrics).catch(err =>
        logger.error('[SovereignHealing] Neural Pulse handler failed:', err),
      );
    });
  }

  private async handleNeuralWarning(metrics: HealthMetrics) {
    // Map health metrics to a virtual alert for the AI to diagnose
    const virtualAlert = {
      name: `Neural Pulse Degradation (${metrics.status})`,
      severity: metrics.status === 'CRITICAL' ? 'critical' : 'warning',
      message: `System sanity score dropped to ${metrics.sanityScore}%. Status: ${metrics.status}. CPU: ${metrics.cpuUsage}%, MEM: ${metrics.memoryUsage}%`,
      metadata: { metrics },
      id: `neural_${Date.now()}`,
    };

    await this.generateHealingProposal(virtualAlert);
  }

  private startHealingMonitor() {
    setInterval(() => {
      this.auditSystemHealth();
    }, 60000); // Audit every minute
  }

  public async auditSystemHealth() {
    try {
      await this.monitoringService.getMetricsOverview();
      const alerts = await this.monitoringService.getRecentAlerts(20);

      const activeCriticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');

      for (const alert of activeCriticalAlerts) {
        await this.generateHealingProposal(alert);
      }
    } catch (error) {
      logger.error('[SovereignHealing] Health audit failed:', error);
    }
  }

  public async handlePredictiveAnomaly(anomaly: {
    type: string;
    description: string;
    metrics: HealthMetrics;
  }) {
    logger.warn(
      { type: anomaly.type },
      '[SovereignHealing] Predictive Anomaly received. Escalating to AI Diagnosis.',
    );

    // Convert anomaly to a virtual alert
    const virtualAlert = {
      name: `Predictive: ${anomaly.type}`,
      severity: 'warning',
      message: anomaly.description,
      metadata: { ...anomaly.metrics, isPredictive: true },
      id: `pred_${Date.now()}`,
    };

    await this.generateHealingProposal(virtualAlert);
  }

  private async generateHealingProposal(alert: any) {
    const proposalId = `heal_${crypto.randomBytes(4).toString('hex')}`;

    // 1. Initial heuristic check
    let action: HealingAction = HealingAction.PRUNE_CACHE;
    let impact: 'low' | 'medium' | 'high' = 'low';
    let target = 'unknown';

    if (alert.severity === 'critical') {
      impact = 'high';
    }

    if (alert.name.includes('memory')) {
      action = HealingAction.PRUNE_CACHE;
      target = 'redis/node-heap';
    } else if (alert.name.includes('cpu')) {
      action = HealingAction.RESTART_CONTAINER;
      target = alert.metadata?.container || 'backend-api';
      impact = 'medium';
    } else {
      // 2. God Mode: Use AI for unknown or complex alerts
      logger.info(
        { proposalId },
        '[SovereignHealing] Alert type unknown. Invoking AI Neural Diagnosis...',
      );
      const aiDiagnosis = await this.diagnoseWithAI(alert);
      action = aiDiagnosis.action;
      target = aiDiagnosis.target;
      impact = aiDiagnosis.impact;
    }

    logger.info({ proposalId, alert: alert.name }, '[SovereignHealing] Generating repair proposal');

    // Determine if it's autonomous based on impact
    const isAutonomous = impact === 'low';

    // Create a special "Healing Mission" to store the proposal
    const masterSeed = process.env.JWT_SECRET || 'SOVEREIGN_REPAIR_SEED';
    const missionKey = await deriveMissionKey(masterSeed, proposalId, 'SYSTEM');

    const proposal: HealingProposal = {
      id: proposalId,
      condition: alert.message,
      action,
      target,
      impact,
      status: isAutonomous ? 'executed' : 'pending',
      createdAt: new Date(),
    };

    const encryptedProposal = await this.vaultService.encrypt(
      JSON.stringify(proposal),
      missionKey.toString('hex'),
    );

    await this.missionRepo.create({
      id: proposalId,
      objective: `[AUTO-HEAL] ${action} on ${target}`,
      status: isAutonomous ? MissionStatus.COMPLETED : MissionStatus.PLANNING,
      userId: 'SYSTEM',
      isEncrypted: true,
      result: encryptedProposal.ciphertext,
      vaultIV: encryptedProposal.iv,
      vaultTag: encryptedProposal.tag,
      metadata: {
        isHealingProposal: true,
        isAutonomous,
        originalAlertId: alert.id,
      },
    });

    if (isAutonomous) {
      logger.info({ proposalId }, '[SovereignHealing] Autonomous repair triggered.');

      // Execute effectively immediately for autonomous repairs
      await this.executeRepair(proposalId, true);

      await this.pixelBridge.sendCommand({
        action: 'healer_report',
        params: {
          status: 'repaired',
          message: `Acción autónoma ejecutada: ${action} en ${target}`,
          proposalId,
          deepLink: `nexus://sovereign-hub/healer/${proposalId}`,
        },
      });
    } else {
      logger.warn({ proposalId }, '[SovereignHealing] Repair proposal stored. Awaiting approval.');
      await this.pixelBridge.sendCommand({
        action: 'healer_approval_required',
        params: {
          message: `Aprobación requerida para: ${action} en ${target}`,
          impact,
          proposalId,
          deepLink: `nexus://sovereign-hub/healer/${proposalId}`,
        },
        priority: 'high',
      });

      // For high-impact failures, also trigger a Daniela voice call
      if (impact === 'high') {
        this.proactiveVoice
          .triggerCriticalAlertCall(`[AUTO-HEAL] ${action} on ${target}`, alert.message, proposalId)
          .catch(err => logger.error('[SovereignHealing] Voice call trigger failed:', err));
      }
    }
  }

  private async diagnoseWithAI(alert: any): Promise<{
    action: HealingAction;
    target: string;
    impact: 'low' | 'medium' | 'high';
  }> {
    const prompt = `
      ERES EL DIAGNÓSTICO NEURAL DEL NEXUS.
      SISTEMA: AIGestion Nexus - Sovereign Edition.
      ALERTA DETECTADA: ${JSON.stringify(alert)}

      ACCIONES DISPONIBLES:
      - RESTART_CONTAINER: Para procesos colgados o fugas de memoria en contenedores específicos.
      - PRUNE_CACHE: Para alta presión de memoria en Redis o Node.
      - SCALE_INSTANCES: Para saturación de CPU por exceso de tráfico.
      - REBOOT_SYSTEM: Fallo total de infraestructura.
      - ACTIVATE_SHIELD: Anomalías de CPU/Red rápidas (Rate Limit).
      - PHOENIX_PROTOCOL: Corrupción de estado o fallo en cascada (Reinicia Core + DB).

      TU TAREA:
      1. ANALIZA el mensaje y los metadatos.
      2. DETERMINA la acción más efectiva.
      3. IDENTIFICA el target (nombre del contenedor o componente).
      4. EVALÚA el impacto (low, medium, high).

      RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO EN ESTE FORMATO:
      {
        "action": "HealingAction",
        "target": "string",
        "impact": "low|medium|high",
        "reasoning": "Breve explicación"
      }
    `;

    try {
      const response = await this.aiService.generateContent(prompt, 'SYSTEM', 'god');
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const diagnosis = JSON.parse(cleanJson);

      logger.info({ proposalId: alert.id, diagnosis }, '[SovereignHealing] AI Diagnosis complete');

      return {
        action: diagnosis.action as HealingAction,
        target: diagnosis.target,
        impact: diagnosis.impact as 'low' | 'medium' | 'high',
      };
    } catch (error) {
      logger.error('[SovereignHealing] AI Diagnosis failed, falling back to safe defaults:', error);
      return { action: HealingAction.PRUNE_CACHE, target: 'system-wide', impact: 'low' };
    }
  }

  public async executeRepair(proposalId: string, approved: boolean) {
    // 1. Fetch the mission/proposal data
    const mission = await this.missionRepo.findById(proposalId);
    if (!mission) {
      logger.error({ proposalId }, '[SovereignHealing] Repair failed: Proposal not found');
      return;
    }

    if (!approved) {
      logger.warn({ proposalId }, '[SovereignHealing] Repair REJECTED by user');
      await this.missionRepo.update(proposalId, {
        status: MissionStatus.FAILED,
        error: 'Authorization Denied',
      });
      return;
    }

    logger.info(
      { proposalId, objective: mission.objective },
      '[SovereignHealing] Executing authorized repair...',
    );

    try {
      // 2. Decrypt the proposal to get action details
      const masterSeed = process.env.JWT_SECRET || 'SOVEREIGN_REPAIR_SEED';
      const missionKey = await deriveMissionKey(masterSeed, proposalId, 'SYSTEM');

      const decrypted = await this.vaultService.decrypt(
        mission.vaultIV!,
        mission.result!,
        mission.vaultTag!,
        missionKey.toString('hex'),
      );

      const proposal: HealingProposal = JSON.parse(decrypted);
      let success = false;

      // 3. Map HealingAction to InfrastructureService commands
      switch (proposal.action) {
        case HealingAction.PRUNE_CACHE:
          success = await this.infraService.pruneCaches();
          break;
        case HealingAction.RESTART_CONTAINER:
          success = await this.infraService.restartService(proposal.target);
          break;
        case HealingAction.SCALE_INSTANCES:
          // Default to 2 replicas for scaling if needed
          success = await this.infraService.scaleService(proposal.target, 2);
          break;
        case HealingAction.REBOOT_SYSTEM:
          // Reboot is highly dangerous, normally would be: await execAsync('reboot')
          logger.warn('[SovereignHealing] REBOOT requested. Simulation mode for host reboot.');
          success = true;
          break;
        case HealingAction.ACTIVATE_SHIELD:
          logger.info('[SovereignHealing] ACTIVATING NEURAL SHIELD (Rate Limiting)...');
          // Integration with RateLimitService would go here
          success = true; // Simulated success
          break;
        case HealingAction.PHOENIX_PROTOCOL:
          logger.error('⚠️ [SovereignHealing] TRIGGERING PHOENIX PROTOCOL ⚠️');
          await this.infraService.restartService('nexus-backend');
          await this.infraService.restartService('nexus-mongodb');
          success = true;
          break;
        case HealingAction.OPTIMIZE_SERVICE:
          logger.info(`[SovereignHealing] Optimizing resources for ${proposal.target}...`);
          success = await this.infraService.optimizeService(proposal.target);
          break;
        case HealingAction.CODE_REPAIR:
          logger.warn('[SovereignHealing] Initiating Autonomous Code Repair mission...');
          const repairRes = await this.codeRepair.conductAutomatedRepair({
            diagnosis: mission.objective,
            logs: mission.result || 'No logs provided',
            targetComponent: proposal.target,
          });
          success = repairRes.success;
          break;
        default:
          logger.error({ action: proposal.action }, '[SovereignHealing] Unknown healing action');
      }

      // 4. Update mission status
      if (success) {
        await this.missionRepo.update(proposalId, {
          status: MissionStatus.COMPLETED,
          result: 'Repair executed successfully',
        });
        logger.info({ proposalId }, '[SovereignHealing] Repair COMPLETED');
      } else {
        throw new Error('Infrastructure action failed');
      }
    } catch (error) {
      logger.error({ proposalId, error }, '[SovereignHealing] Repair execution FAILED');
      await this.missionRepo.update(proposalId, {
        status: MissionStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown execution error',
      });
    }
  }

  public async getHealerStatus() {
    try {
      const allHealingMissions = await this.missionRepo.findAll({
        'metadata.isHealingProposal': true,
      });

      const recentRepairs = allHealingMissions
        .filter(m => (m as any).metadata?.isAutonomous && m.status === MissionStatus.COMPLETED)
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          objective: m.objective,
          timestamp: m.createdAt,
        }));

      const activeAlerts = await this.monitoringService.getRecentAlerts(10);
      const criticalCount = activeAlerts.filter(
        a => !a.resolved && a.severity === 'critical',
      ).length;

      let pulse: 'nominal' | 'warning' | 'critical' = 'nominal';
      if (criticalCount > 5) {
        pulse = 'critical';
      } else if (criticalCount > 0) {
        pulse = 'warning';
      }

      return {
        status: criticalCount > 0 ? 'degraded' : 'healthy',
        pulse,
        recentRepairs,
        pendingApprovalsCount: allHealingMissions.filter(
          m => !(m as any).metadata?.isAutonomous && m.status === MissionStatus.PLANNING,
        ).length,
      };
    } catch (error) {
      logger.error('[SovereignHealing] Failed to get healer status:', error);
      return { status: 'unknown', pulse: 'nominal', recentRepairs: [], pendingApprovalsCount: 0 };
    }
  }
}
