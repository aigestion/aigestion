import { inject, injectable } from 'inversify';
import path from 'path';

import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { Sentry } from '../config/sentry';
import { BackupService } from './backup.service';
import { TelegramService } from './telegram.service';

@injectable()
export class BackupSchedulerService {
  private timer: NodeJS.Timeout | null = null;
  // Default: run every 24 hours
  private readonly INTERVAL_MS = 24 * 60 * 60 * 1000;
  // Default source: User's 'ale' folder (adjust as needed)
  private readonly SOURCE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', 'ale');

  constructor(
    @inject(TYPES.BackupService) private backupService: BackupService,
    @inject(TYPES.TelegramService) private telegramService: TelegramService,
  ) {}

  public start() {
    logger.info(
      'BackupSchedulerService started. First backup will run immediately (async) and then daily.',
    );

    // Run initial backup after a short delay to let server startup finish
    setTimeout(() => {
      void this.runBackupJob();
    }, 10000);

    this.timer = setInterval(() => {
      void this.runBackupJob();
    }, this.INTERVAL_MS);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async runBackupJob() {
    // 🌌 Sentry CRON check-in: monitors daily backup health
    const checkInId = Sentry.captureCheckIn({
      monitorSlug: 'daily-backup',
      status: 'in_progress',
    });

    logger.info(`Starting scheduled backup for ${this.SOURCE_DIR}`);
    try {
      await this.backupService.backupDirectory(this.SOURCE_DIR);
      const msg = `✅ Backup Successful: ${this.SOURCE_DIR}`;
      logger.info(msg);

      Sentry.captureCheckIn({ checkInId, monitorSlug: 'daily-backup', status: 'ok' });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const cloudMsg = `🚨 Cloud Backup FAILED: ${error.message}. Initiating Local Fallback...`;
      logger.error(cloudMsg, error);
      Sentry.captureException(error, { tags: { service: 'backup-scheduler' } });

      try {
        await this.telegramService.sendMessage(cloudMsg);

        // Local Fallback
        const localDest = await this.backupService.localBackup(this.SOURCE_DIR);
        const localMsg = `✅ Local Fallback Successful: Saved to ${localDest}`;
        logger.info(localMsg);
        await this.telegramService.sendMessage(localMsg);

        // Mark as OK since fallback succeeded
        Sentry.captureCheckIn({ checkInId, monitorSlug: 'daily-backup', status: 'ok' });
      } catch (localErr: unknown) {
        const localError = localErr instanceof Error ? localErr : new Error(String(localErr));
        const criticalMsg = `💀 CRITICAL: All Backup Systems FAILED. Local Error: ${localError.message}`;
        logger.error(criticalMsg);
        Sentry.captureException(localError, {
          tags: { service: 'backup-scheduler', fallback: 'failed' },
        });
        Sentry.captureCheckIn({ checkInId, monitorSlug: 'daily-backup', status: 'error' });
        await this.telegramService.sendMessage(criticalMsg);
      }
    }
  }
}
