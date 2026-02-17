import os from 'os';
import { EventEmitter } from 'events';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { SocketService } from './socket.service';
import { logger } from '../utils/logger';

export interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  sanityScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
}

@injectable()
export class NeuralHealthService extends EventEmitter {
  private metrics: HealthMetrics;

  constructor(@inject(TYPES.SocketService) private socketService: SocketService) {
    super();
    this.metrics = this.calculateInitialMetrics();
    this.startMonitoring();
    logger.info('✅ NeuralHealthService (Sovereign Pulse) initialized');
  }

  private calculateInitialMetrics(): HealthMetrics {
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: process.uptime(),
      sanityScore: 100,
      status: 'OPTIMAL',
      timestamp: new Date().toISOString(),
    };
  }

  private startMonitoring() {
    setInterval(() => {
      this.updateMetrics();
      this.emit('healthUpdate', this.metrics);

      // Real-Time Pulse Broadcast
      this.socketService.emit('pulse', this.metrics);
    }, 5000);
  }

  private updateMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;

    // Simulation: using random for demo purposes, can be replaced by real os metrics later
    const cpuUsage = Math.random() * 20;

    let sanityScore = 100 - cpuUsage * 0.5 - memUsage * 0.3;
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
      timestamp: new Date().toISOString(),
    };

    if (status !== 'OPTIMAL') {
      this.emit('healthWarning', this.metrics);
      this.socketService.emit('pulse:warning', this.metrics);
    }
  }

  public getMetrics(): HealthMetrics {
    return this.metrics;
  }
}
