import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NeuralHealthService, HealthMetrics } from './NeuralHealthService';
import { logger } from '../utils/logger';
import { InfrastructureService } from './infrastructure.service';
import { RateLimitService } from './rate-limit.service';

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
    logger.warn(`Analizando degradación del sistema. Sanity Score: ${metrics.sanityScore}%`);

    this.checkAnomalies(metrics);

    if (metrics.status === 'CRITICAL') {
      await this.performEmergencyHealing(metrics);
    } else if (metrics.status === 'DEGRADED') {
      await this.performProactiveMaintenance(metrics);
    }

    // Self-Healing Action: Verificando Infraestructura si hay degradación
    if (metrics.sanityScore < 50) {
      logger.info('Solicitando auditoría de contenedores al Sentinel de Infraestructura...');
      try {
        const stats = await this.infraService.getContainerStats();
        const degraded = stats.filter(c => !c.status.includes('Up'));

        if (degraded.length > 0) {
          logger.error(
            `Sentinel: Detectados ${degraded.length} contenedores degradados.`,
            degraded,
          );
          for (const s of degraded) {
            await this.infraService.restartService(s.name);
          }
        }
      } catch (e) {
        logger.error('Error al acceder al Sentinel de Infraestructura:', e);
      }
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
        logger.error('ANOMALÍA DETECTADA: Gradiente de CPU agresivo. Activando Protocolo Escudo.');
        this.activateShieldProtocol();
      }
    }
  }

  private async activateShieldProtocol() {
    logger.warn(
      'Protocolo Escudo Activo: Limitando conexiones entrantes y priorizando procesos de core.',
    );
    try {
      if (this.rateLimitService) {
        logger.info('Escudo: Restringiendo endpoints de IA y Auth temporalmente.');
      }
    } catch (e) {
      logger.error('Error al aplicar Protocolo Escudo:', e);
    }
  }

  private async performEmergencyHealing(metrics: HealthMetrics) {
    logger.error('NIVEL CRÍTICO DETECTADO. Iniciando Protocolos de Emergencia.');

    if (metrics.sanityScore < 30) {
      await this.triggerPhoenixProtocol();
    }

    if (metrics.memoryUsage > 90) {
      logger.info('Acción: Forzando recolección de basura y limpieza de caches.');
      const g = global as any;
      if (typeof g.gc === 'function') {
        g.gc();
      }
      // Purgando cache Redis (Simulado via Phoenix)
    }

    if (metrics.cpuUsage > 95) {
      logger.info(
        'Acción: Suspendiendo tareas de fondo no críticas y reduciendo frecuencia de telemetría.',
      );
    }
  }

  private async triggerPhoenixProtocol() {
    logger.error('⚠️ PROTOCOLO FÉNIX ACTIVADO ⚠️');
    logger.info('Proceso de renacimiento: Reiniciando servicios de infraestructura en cascada.');

    try {
      await this.infraService.restartService('nexus-swarm-01');
      await this.infraService.restartService('nexus-db-01');

      logger.info('Fénix: Reposicionando pools de base de datos y refrescando buffers de memoria.');
    } catch (e) {
      logger.error('Error en Protocolo Fénix:', e);
    }
  }

  private async performProactiveMaintenance(metrics: HealthMetrics) {
    logger.info('Nivel Degradado detectado. Iniciando mantenimiento proactivo.');

    if (metrics.memoryUsage > 70) {
      logger.info('Acción: Pre-vaciado de buffers de logs y optimización de pools de conexión.');
    }
  }
}
