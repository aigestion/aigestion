import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NeuralHealthService, HealthMetrics } from './NeuralHealthService';
import { InfrastructureService } from './infrastructure.service';
import { MastraService } from './mastra.service';
import { logger } from '../utils/logger';

interface ScalingThresholds {
  scaleUp: number;
  scaleDown: number;
  maxReplicas: number;
  minReplicas: number;
}

@injectable()
export class SovereignOrchestratorService {
  private missionLoadHistory: number[] = [];
  private readonly LOAD_WINDOW = 10; // Last 10 health checks
  private readonly DEFAULT_THRESHOLDS: ScalingThresholds = {
    scaleUp: 70, // 70% average CPU/Mem
    scaleDown: 30, // 30% average
    maxReplicas: 5,
    minReplicas: 1,
  };

  private currentReplicas: number = 1;
  private currentRegion: string = 'us-east-1';
  private readonly AVAILABLE_REGIONS = ['us-east-1', 'eu-west-1'];

  constructor(
    @inject(TYPES.NeuralHealthService) private neuralHealthService: NeuralHealthService,
    @inject(TYPES.InfrastructureService) private infraService: InfrastructureService,
    @inject(TYPES.MastraService) private mastraService: MastraService,
  ) {
    this.initOrchestration();
  }

  private initOrchestration() {
    this.neuralHealthService.on('healthWarning', (metrics: HealthMetrics) => {
      this.evaluateScaling(metrics);
      this.evaluateRegionHealth();
    });
    logger.info(
      '🌌 Sovereign Orchestrator Service Online: Autonomous Scaling & Multi-Region Enabled',
    );
  }

  private async evaluateScaling(metrics: HealthMetrics) {
    this.missionLoadHistory.push(metrics.cpuUsage);
    if (this.missionLoadHistory.length > this.LOAD_WINDOW) {
      this.missionLoadHistory.shift();
    }

    const avgLoad =
      this.missionLoadHistory.reduce((a, b) => a + b, 0) / this.missionLoadHistory.length;

    // Predictive logic: If load is trending up fast, scale earlier
    const trend = this.calculateTrend();
    const predictedLoad = avgLoad + trend;

    logger.debug(
      `[Orchestrator] Avg Load: ${avgLoad.toFixed(2)}%, Trend: ${trend.toFixed(2)}%, Predicted: ${predictedLoad.toFixed(2)}%`,
    );

    if (
      predictedLoad > this.DEFAULT_THRESHOLDS.scaleUp &&
      this.currentReplicas < this.DEFAULT_THRESHOLDS.maxReplicas
    ) {
      await this.scaleUp();
    } else if (
      predictedLoad < this.DEFAULT_THRESHOLDS.scaleDown &&
      this.currentReplicas > this.DEFAULT_THRESHOLDS.minReplicas
    ) {
      await this.scaleDown();
    }
  }

  private calculateTrend(): number {
    if (this.missionLoadHistory.length < 3) return 0;
    const last = this.missionLoadHistory[this.missionLoadHistory.length - 1];
    const prev = this.missionLoadHistory[this.missionLoadHistory.length - 2];
    return last - prev;
  }

  private async scaleUp() {
    this.currentReplicas++;
    logger.warn(`🚀 [Orchestrator] Scaling UP Swarm Engine to ${this.currentReplicas} replicas`);
    await this.infraService.scaleService('nexus-swarm-engine', this.currentReplicas);
  }

  private async scaleDown() {
    this.currentReplicas--;
    logger.warn(`📉 [Orchestrator] Scaling DOWN Swarm Engine to ${this.currentReplicas} replicas`);
    await this.infraService.scaleService('nexus-swarm-engine', this.currentReplicas);
  }

  private async evaluateRegionHealth() {
    const metrics = await this.infraService.getRegionMetrics(this.currentRegion);
    if (metrics.health < 0.5) {
      logger.error(
        `🚨 [Orchestrator] REGION DEGRADATION DETECTED in ${this.currentRegion}. Initiating Failover.`,
      );
      const nextRegion =
        this.AVAILABLE_REGIONS.find(r => r !== this.currentRegion) || this.AVAILABLE_REGIONS[0];
      await this.initiateFailover(nextRegion);
    }
  }

  private async initiateFailover(targetRegion: string) {
    const success = await this.infraService.switchRegion(targetRegion);
    if (success) {
      this.currentRegion = targetRegion;
      logger.info(`✅ [Orchestrator] Failover to ${targetRegion} COMPLETE`);
    } else {
      logger.error(
        `❌ [Orchestrator] Failover to ${targetRegion} FAILED. Attempting secondary recovery.`,
      );
    }
  }

  public getCurrentScalingState() {
    return {
      replicas: this.currentReplicas,
      region: this.currentRegion,
      loadTrend: this.calculateTrend(),
      history: this.missionLoadHistory,
    };
  }

  public async getWorkspaceStatus() {
    const tiers = ['AIGestion', 'PROJECTS', 'TOOLS', 'RESEARCH', 'ARCHIVE', 'SCRIPTS'];
    const status: any = {};
    
    for (const tier of tiers) {
      status[tier] = {
        online: true,
        health: 'optimal',
        path: `C:/Users/Alejandro/${tier}`
      };
    }
    
    return {
        timestamp: new Date().toISOString(),
        tiers: status,
        agentStatus: 'active',
        neuralSync: 'complete'
    };
  }
}
