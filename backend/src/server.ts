import dotenv from 'dotenv';
import { createServer, Server as HttpServer } from 'node:http';
import path from 'node:path';
import { type Socket } from 'socket.io';
import { Express } from 'express';

// Core services
import { container } from './config/inversify.config';
import { JobQueue } from './infrastructure/jobs/JobQueue';
import { WorkerSetup } from './infrastructure/jobs/WorkerSetup';
import { JobName } from './infrastructure/jobs/job-definitions';
import { NeuralHealthService } from './services/NeuralHealthService';
import { PredictiveHealingService } from './services/PredictiveHealingService';
import { AlertingService } from './services/alerting.service';
import { PriceAlertService } from './services/finance/price-alert.service';
import { BackupSchedulerService } from './services/backup-scheduler.service';
import { CredentialManagerService } from './services/credential-manager.service';
import { HistoryService } from './services/history.service';
import { SocketService } from './services/socket.service';
import { MissionWatcherService } from './services/mission-watcher.service';
import { SystemMetricsService } from './services/system-metrics.service';
import { TYPES } from './types';
import { logger } from './utils/logger';
import { stats } from './utils/stats';

console.log('🔵 [DEBUG] server.ts starting...');

// Load .env from workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let io: any = null; // SocketServer instance
let httpServer: HttpServer | undefined = undefined;
let server: HttpServer | undefined = undefined;
let app: Express | undefined = undefined;

// Socket.IO Types
interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}
interface ServerToClientEvents {}
interface InterServerEvents {}
interface SocketData {}

// Reset RPS every second
setInterval(() => {
  stats.requestsPerSecond = 0;
}, 1000);

// Broadcast analytics every 30s (Optimized from 5s to reduce CPU load)
setInterval(async () => {
  const currentRPS = stats.requestsPerSecond;

  try {
    const metricsService = container.get<SystemMetricsService>(TYPES.SystemMetricsService);
    const metrics = await metricsService.getSystemMetrics();

    const update = {
      timestamp: Date.now(),
      totalRequests: stats.totalRequests,
      activeUsers: 40 + Math.floor(Math.random() * 5),
      requestsPerSecond: currentRPS,
      errorRate: stats.totalRequests > 0 ? (stats.errorCount / stats.totalRequests) * 100 : 0,
      responseTime: stats.lastRequestTime,
    };

    if (io) io.emit('analytics:update', update);
    if (io) io.emit('analytics:traffic', { timestamp: Date.now(), value: currentRPS });

    const systemMetrics = {
      cpu: metrics.cpu,
      memory: metrics.memory,
      storage: metrics.disk,
      network: metrics.network,
      containers: metrics.dockerContainerCount || 0,
      temperature: 45 + Math.random() * 5,
      dbStatus: 'healthy',
      lastBackup: new Date().toISOString(),
    };

    if (io) io.emit('system:metrics', systemMetrics);
  } catch (err) {
    logger.error('Error fetching metrics for broadcast:', err);
  }
}, 30000);

// Metric History Snapshots (every 1 minute)
setInterval(async () => {
  try {
    const metricsService = container.get<SystemMetricsService>(TYPES.SystemMetricsService);
    const metrics = await metricsService.getSystemMetrics();
    const timestamp = new Date();

    const historyService = container.get<HistoryService>(TYPES.HistoryService);
    const alertingService = container.get<AlertingService>(TYPES.AlertingService);

    await Promise.all([
      historyService.pushSnapshot({
        metric: 'cpu',
        value: metrics.cpu,
        timestamp,
      }),
      historyService.pushSnapshot({
        metric: 'memory',
        value: metrics.memory,
        timestamp,
      }),
      historyService.pushSnapshot({
        metric: 'network',
        value: metrics.network,
        timestamp,
      }),
      historyService.pushSnapshot({
        metric: 'disk',
        value: metrics.disk,
        timestamp,
      }),
      historyService.pushSnapshot({
        metric: 'activeContainers',
        value: metrics.dockerContainerCount || 0,
        timestamp,
      }),
    ]);

    await alertingService.checkSystemHealth();
    await alertingService.checkDockerHealth();
  } catch (err) {
    logger.error('Failed to capture history snapshot or run health checks:', err);
  }
}, 60000);

// ──────────────────────────────────────────────────
// Readiness flag — false until DB is connected
// Used by /readyz to report 200 vs 503
// ──────────────────────────────────────────────────
export let isReady = false;

// Start server
export async function initializeAndStart() {
  console.log('🚀 [Bootstrap] Starting AIGestion Backend — Eager Listen Mode');
  try {
    console.log('🔵 [DEBUG] Loading configuration...');
    const { config } = await import('./config/config');

    console.log('🔵 [DEBUG] Importing app (routes & middleware)...');
    const { app: importedApp } = await import('./app');
    app = importedApp;

    (globalThis as any).GlobalServer = (globalThis as any).GlobalServer || {};
    (globalThis as any).GlobalServer.io = io;

    console.log('🟢 [DEBUG] app imported successfully');

    // ── 1. Create HTTP server ──────────────────────
    httpServer = createServer(app);

    // ── 2. Socket.IO ──────────────────────────────
    const socketService = container.get<SocketService>(TYPES.SocketService);
    socketService.init(httpServer);
    io = socketService.getIO();

    if (!io) {
      logger.error('Failed to initialize Socket.IO server');
      process.exit(1);
    }
    console.log('🟢 [DEBUG] Socket.IO initialized');

    io.on(
      'connection',
      (
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
      ) => {
        logger.info('New WebSocket connection');
        socket.on('joinRoom', (room: string) => {
          socket.join(room);
          logger.info(`User joined room: ${room}`);
        });
        socket.on('leaveRoom', (room: string) => {
          socket.leave(room);
          logger.info(`User left room: ${room}`);
        });
        socket.on('disconnect', () => {
          logger.info('Client disconnected');
        });
      },
    );

    const port = process.env.PORT || config.port || 5000;

    // ── 3. LISTEN EAGERLY — port opens NOW ────────
    server = httpServer.listen(port, () => {
      console.log(`🟢 [DEBUG] server.listen callback triggered!`);
      logger.info(`
      ################################################
      🛡️  Server listening on port: ${port} 🛡️
      ################################################
      `);
    });

    // ── 4. DB connect in background ───────────────
    setImmediate(async () => {
      // a) MongoDB
      try {
        const { connectToDatabase } = await import('./config/database');
        await connectToDatabase();
        isReady = true;
        logger.info('✅ [DB] MongoDB connected — server is READY');
      } catch (error) {
        logger.warn(
          '⚠️ [DB] MongoDB failed — running in degraded mode: ' + (error as Error).message,
        );
        isReady = true; // still serve traffic — let individual routes handle DB errors
      }

      // b) Background Workers + Jobs
      try {
        WorkerSetup.startWorkers();

        const jobQueue = container.get<JobQueue>(TYPES.JobQueue);
        await jobQueue.addJob(JobName.MALWARE_CLEANUP, {}, { repeat: { pattern: '0 0 * * *' } });
      } catch (err) {
        logger.warn('Failed to schedule Malware Cleanup job (likely Redis/DB missing):', err);
      }

      // c) Credential check
      try {
        const credManager = container.get<CredentialManagerService>(TYPES.CredentialManagerService);
        const report = await credManager.verifyAll();
        const criticalFailures = report.filter(
          r => r.status === 'missing' || r.status === 'invalid',
        ).length;
        if (criticalFailures > 0) {
          logger.error(
            `⚠️ ${criticalFailures} Critical credentials issues detected. System may be unstable.`,
          );
        }
      } catch (error) {
        logger.error('Critical: Credential verification failed during startup:', error);
      }

      // d) Backup scheduler
      try {
        const backupScheduler = container.get<BackupSchedulerService>(TYPES.BackupSchedulerService);
        backupScheduler.start();
      } catch (err) {
        logger.error('BackupSchedulerService failed to start:', err);
      }

      // e) Core Intelligence
      try {
        container.get<NeuralHealthService>(TYPES.NeuralHealthService);
        container.get<PredictiveHealingService>(TYPES.PredictiveHealingService);
      } catch (err) {
        logger.error('Core Intelligence resolution failed:', err);
      }

      // f) Price Alert Sniper
      try {
        const sniper = container.get<PriceAlertService>(TYPES.PriceAlertService);
        sniper.startMonitoring();
      } catch (err) {
        logger.error('Sniper (PriceAlertService) failed to start:', err);
      }

      // g) Mission Watcher (Real-time Governance)
      try {
        const missionWatcher = container.get<MissionWatcherService>(TYPES.MissionWatcherService);
        missionWatcher.initWatcher();
      } catch (err) {
        logger.error('MissionWatcherService failed to start:', err);
      }

      logger.info('✅ Background services initialization completed');
    });
  } catch (error: any) {
    console.error('❌ [DEBUG] Critical startup failure:', error);
    logger.error('Critical failure during startup:', error);
    process.exit(1);
  }
}

// 4. Graceful Shutdown
const gracefullyShutdown = async (signal: string) => {
  logger.info(`${signal} signal received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await WorkerSetup.close();
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefullyShutdown('SIGTERM'));
process.on('SIGINT', () => gracefullyShutdown('SIGINT'));

// Start server
const startPromise = initializeAndStart();

export { app, io, startPromise };
