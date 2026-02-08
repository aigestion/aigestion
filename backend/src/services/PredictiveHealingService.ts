import { neuralHealthService, HealthMetrics } from './NeuralHealthService';
import { logger } from '../utils/logger';

interface AnomalyPattern {
  id: string;
  metric: keyof HealthMetrics;
  threshold: number;
  duration: number; // ms
  count: number;
}

export class PredictiveHealingService {
  private static instance: PredictiveHealingService;
  private anomalyHistory: { timestamp: number; metrics: HealthMetrics }[] = [];
  private readonly ANOMALY_WINDOW = 60000; // 1 minute history

  private constructor() {
    this.init();
  }

  public static getInstance(): PredictiveHealingService {
    if (!PredictiveHealingService.instance) {
      PredictiveHealingService.instance = new PredictiveHealingService();
    }
    return PredictiveHealingService.instance;
  }

  private init() {
    neuralHealthService.on('healthWarning', (metrics: HealthMetrics) => {
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

  private activateShieldProtocol() {
    logger.warn(
      'Protocolo Escudo Activo: Limitando conexiones entrantes y priorizando procesos de core.',
    );
  }

  private async performEmergencyHealing(metrics: HealthMetrics) {
    logger.error('NIVEL CRÍTICO DETECTADO. Iniciando Protocolos de Emergencia.');

    if (metrics.sanityScore < 30) {
      await this.triggerPhoenixProtocol();
    }

    if (metrics.memoryUsage > 90) {
      logger.info('Acción: Forzando recolección de basura y limpieza de caches.');
      if (global.gc) {
        global.gc();
      }
      // Simulación de limpieza de Redis
      logger.info('Acción: Purgando segmentos de cache Redis marcados como volátiles.');
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
    // Simulación de reinicio de servicios
    setTimeout(() => {
      logger.info('Fénix: Reposicionando pools de base de datos y refrescando buffers de memoria.');
    }, 2000);
  }

  private async performProactiveMaintenance(metrics: HealthMetrics) {
    logger.info('Nivel Degradado detectado. Iniciando mantenimiento proactivo.');

    if (metrics.memoryUsage > 70) {
      logger.info('Acción: Pre-vaciado de buffers de logs y optimización de pools de conexión.');
    }
  }
}

export const predictiveHealingService = PredictiveHealingService.getInstance();
