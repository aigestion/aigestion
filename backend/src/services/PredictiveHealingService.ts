import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NeuralHealthService, HealthMetrics } from './NeuralHealthService';
import { logger } from '../utils/logger';
import { InfrastructureService } from './infrastructure.service';
import { RateLimitService } from './rate-limit.service';
import { SovereignHealingService } from './SovereignHealingService';

interface AnomalyPattern {
  id: string;
  metric: keyof HealthMetrics;
  threshold: number;
  duration: number; // ms
  count: number;
}

@injectable()
export class PredictiveHealingService {
  private anomalyHistory: { timestamp: number; metrics: HealthMetrics }[] = [];
  private readonly ANOMALY_WINDOW = 60000; // 1 minute history

  constructor(
    @inject(TYPES.NeuralHealthService) private neuralHealthService: NeuralHealthService,
    @inject(TYPES.InfrastructureService) private infraService: InfrastructureService,
    @inject(TYPES.RateLimitService) private rateLimitService: RateLimitService,
    @inject(TYPES.SovereignHealingService) private sovereignHealing: SovereignHealingService,
  ) {
    this.init();
  }

  private init() {
    this.neuralHealthService.on('healthWarning', (metrics: HealthMetrics) => {
      this.analyzeAndHeal(metrics);
    });
    logger.info('Predictive Healing Service activado y escuchando al Núcleo Neural.');
  }

  private async analyzeAndHeal(metrics: HealthMetrics) {
    logger.info(`Analizando patrones predictivos. Sanity Score: ${metrics.sanityScore}%`);

    this.checkAnomalies(metrics);

    if (metrics.status === 'CRITICAL' || metrics.status === 'DEGRADED') {
      await this.sovereignHealing.handlePredictiveAnomaly({
        type: `SYSTEM_STATE_${metrics.status}`,
        description: `El sistema ha entrado en estado ${metrics.status} con un Sanity Score de ${metrics.sanityScore}%`,
        metrics,
      });
    }
  }

  private checkAnomalies(metrics: HealthMetrics) {
    const now = Date.now();
    this.anomalyHistory.push({ timestamp: now, metrics });
    this.anomalyHistory = this.anomalyHistory.filter(h => now - h.timestamp < this.ANOMALY_WINDOW);

    // Detección de anomalías por gradiente (subida rápida de carga)
    if (this.anomalyHistory.length > 5) {
      const first = this.anomalyHistory[0].metrics;
      if (metrics.cpuUsage - first.cpuUsage > 40) {
        logger.error('ANOMALÍA DETECTADA: Gradiente de CPU agresivo. Escalando a Soberano.');
        this.sovereignHealing
          .handlePredictiveAnomaly({
            type: 'CPU_GRADIENT_SPIKE',
            description: `Detección de pico de CPU agresivo: +${metrics.cpuUsage - first.cpuUsage}% en 1 minuto.`,
            metrics,
          })
          .catch(err => logger.error('[PredictiveHealing] Shield escalation failed:', err));
      }
    }
  }

  // Placeholder methods for future autonomous extensions
  private async performEmptyAction() {}
}
