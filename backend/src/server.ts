import dotenv from 'dotenv';
// import fs from 'fs';
import { createServer } from 'http';
import path from 'path';
import { type Socket } from 'socket.io';

import { app } from './app';
import { connectToDatabase } from './config/database';
import { config } from './config/index';
import { container, TYPES } from './config/inversify.config';
import { AlertingService } from './services/alerting.service';
import { BackupSchedulerService } from './services/backup-scheduler.service';
import { CredentialManagerService } from './services/credential-manager.service';
import { HistoryService } from './services/history.service';
// import { youtubeTranscriptionQueue } from './queue/youtube-transcription.queue';
// import { youtubeWatcherService } from './utils/youtube-watcher.service';
// import { GoogleSecretManagerService } from './services/google/secret-manager.service';
import { neuralHealthService } from './services/NeuralHealthService';
import { SocketService } from './services/socket.service';
import { SystemMetricsService } from './services/system-metrics.service';
import { TelegramBotHandlerGodMode } from './services/telegram-bot-godmode';
import { TelegramBotHandler } from './services/telegram-bot.handler';
import { TelegramService } from './services/telegram.service';
import { logger } from './utils/logger';
import { stats } from './utils/stats';
import { WorkerSetup } from './infrastructure/jobs/WorkerSetup';
import { JobQueue } from './infrastructure/jobs/JobQueue';
import { JobName } from './infrastructure/jobs/job-definitions';

console.log('🔵 [DEBUG] server.ts starting...');

// Load .env from workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const httpServer = createServer(app);

// Socket.IO Types
interface ClientToServerEvents {
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}
interface ServerToClientEvents {}
interface InterServerEvents {}
interface SocketData {}

// Initialize Socket.IO via SocketService
const socketService = container.get<SocketService>(TYPES.SocketService);
socketService.init(httpServer);
const io = socketService.getIO();
if (!io) {
  logger.error('Failed to initialize Socket.IO server');
  process.exit(1);
}

// Neural Heartbeat: Bridge service events to WebSockets
neuralHealthService.on('healthUpdate', metrics => {
  (io as any).emit('nexus:neural_heartbeat', metrics);
});

neuralHealthService.on('healthWarning', metrics => {
  (io as any).emit('nexus:neural_warning', metrics);
});

// Socket.IO connection handling
io.on(
  'connection',
  (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
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

// Reset RPS every second
setInterval(() => {
  stats.requestsPerSecond = 0;
}, 1000);

// Broadcast analytics every 5s
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

    (io as any).emit('analytics:update', update);
    (io as any).emit('analytics:traffic', { timestamp: Date.now(), value: currentRPS });

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

    (io as any).emit('system:metrics', systemMetrics);
  } catch (err) {
    logger.error('Error fetching metrics for broadcast:', err);
  }
}, 5000);

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

// Start server
const initializeAndStart = async () => {
  // 1. Determine Port (Cloud Run uses PORT)
  const port = process.env.PORT || config.port || 5000;

  // 2. Start HTTP Server Immediately (for Cloud Run Health Check)
  const server = httpServer.listen(port, () => {
    logger.info(`
    ################################################
    🛡️  Server listening on port: ${port} 🛡️
    ################################################
      `);
  });

  // 3. Non-blocking Background Initialization
  (async () => {
    try {
      const shouldLoadSecrets =
        process.env.NODE_ENV === 'production' ||
        (!!process.env.GOOGLE_CLOUD_PROJECT_ID && !process.env.SKIP_SECRETS);

      if (shouldLoadSecrets) {
        // Secrets loading logic (optional, currently disabled per original file)
      } else {
        logger.info('Skipping Google Secret Manager (Dev mode or missing Project ID)');
      }

      // Start Background Workers
      WorkerSetup.startWorkers();

      // Schedule Recurring Jobs
      try {
        const jobQueue = container.get<JobQueue>(TYPES.JobQueue);
        await jobQueue.addJob(
          JobName.MALWARE_CLEANUP,
          {},
          {
            repeat: {
              pattern: '0 0 * * *', // Every day at midnight
            },
          },
        );
      } catch (err) {
        logger.warn('Failed to schedule Malware Cleanup job (likely Redis/DB missing):', err);
      }

      // Resilient DB Connection
      await connectToDatabase();

      // Post-startup logic (Credential verification, Telegram, etc.)
      const credManager = container.get<CredentialManagerService>(TYPES.CredentialManagerService);
      const telegramService = container.get<TelegramService>(TYPES.TelegramService);

      credManager
        .verifyAll()
        .then(async (report: any[]) => {
          const failures = report.filter((r: any) => r.status !== 'valid');
          if (failures.length > 0) {
            const message = `🚨 *Credential Audit Failed*:\n${failures
              .map((f: any) => `• ${f.provider}: ${f.status} (${f.message || 'No details'})`)
              .join('\n')}`;
            await telegramService.sendMessage(message);
            logger.error('Credential audit failed, alert sent.');
          } else {
            logger.info('✅ All critical credentials verified successfully.');
          }
        })
        .catch((err: any) => logger.error('Credential audit system error:', err));

      // Start Backup Scheduler
      try {
        const backupScheduler = container.get<BackupSchedulerService>(TYPES.BackupSchedulerService);
        backupScheduler.start();
      } catch (err: any) {
        logger.error('Failed to start BackupSchedulerService:', err);
      }

      // YouTube & Telegram Bots
      logger.info('✅ Background services initialization completed');
    } catch (error) {
      logger.error('Critical failure during background initialization:', error);
    }
  })();

  // 4. Graceful Shutdown
  const gracefullyShutdown = async (signal: string) => {
    logger.info(`${signal} signal received. Shutting down gracefully...`);
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
    setTimeout(() => {
      logger.error('Forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefullyShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefullyShutdown('SIGINT'));
};

initializeAndStart();

export { app, io };
