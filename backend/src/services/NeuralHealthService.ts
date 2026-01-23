import os from 'os';
import { EventEmitter } from 'events';

export interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  sanityScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
}

export class NeuralHealthService extends EventEmitter {
  private static instance: NeuralHealthService;
  private metrics: HealthMetrics;

  private constructor() {
    super();
    this.metrics = this.calculateInitialMetrics();
    this.startMonitoring();
  }

  public static getInstance(): NeuralHealthService {
    if (!NeuralHealthService.instance) {
      NeuralHealthService.instance = new NeuralHealthService();
    }
    return NeuralHealthService.instance;
  }

  private calculateInitialMetrics(): HealthMetrics {
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: process.uptime(),
      sanityScore: 100,
      status: 'OPTIMAL',
      timestamp: new Date().toISOString()
    };
  }

  private startMonitoring() {
    setInterval(() => {
      this.updateMetrics();
      this.emit('healthUpdate', this.metrics);
    }, 5000);
  }

  private updateMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;

    // Simulación de carga de CPU (basada en el número de procesos activos en el sistema)
    const cpuUsage = Math.random() * 20; // En un entorno real usaríamos librerías como 'node-os-utils'

    let sanityScore = 100 - (cpuUsage * 0.5) - (memUsage * 0.3);
    sanityScore = Math.max(0, Math.min(100, sanityScore));

    let status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' = 'OPTIMAL';
    if (sanityScore < 30) status = 'CRITICAL';
    else if (sanityScore < 70) status = 'DEGRADED';

    this.metrics = {
      cpuUsage,
      memoryUsage: memUsage,
      uptime: process.uptime(),
      sanityScore,
      status,
      timestamp: new Date().toISOString()
    };

    if (status !== 'OPTIMAL') {
      this.emit('healthWarning', this.metrics);
    }
  }

  public getMetrics(): HealthMetrics {
    return this.metrics;
  }
}

export const neuralHealthService = NeuralHealthService.getInstance();
