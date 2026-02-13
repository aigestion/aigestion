import { exec } from 'child_process';
import crypto from 'crypto';
import fs from 'fs/promises';
import { injectable } from 'inversify';
import path from 'path';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

interface BackupConfig {
  name: string;
  type: 'database' | 'files' | 'logs' | 'config' | 'full';
  schedule: string; // Cron expression
  enabled: boolean;
  retention: number; // Days
  compression: boolean;
  encryption: boolean;
  destinations: BackupDestination[];
}

interface BackupDestination {
  type: 'local' | 's3' | 'gcs' | 'azure';
  path: string;
  credentials?: {
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    region?: string;
    connectionString?: string;
  };
}

interface BackupJob {
  id: string;
  config: BackupConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  size: number;
  files: string[];
  checksum: string;
  error?: string;
  metadata: {
    [key: string]: any;
  };
}

interface RestoreJob {
  id: string;
  backupId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  files: string[];
  error?: string;
  metadata: {
    [key: string]: any;
  };
}

@injectable()
export class BackupRestoreService {
  private readonly backupDir = 'backups';
  private readonly encryptionKey: string;
  private readonly backupConfigs: BackupConfig[] = [];
  private readonly backupJobs: BackupJob[] = [];
  private readonly restoreJobs: RestoreJob[] = [];
  private readonly maxJobs = 1000;

  constructor() {
    this.encryptionKey =
      process.env.BACKUP_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    this.initializeBackupDirectory();
    this.initializeDefaultConfigs();
    this.startScheduledBackups();
  }

  private async initializeBackupDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.mkdir(path.join(this.backupDir, 'database'), { recursive: true });
      await fs.mkdir(path.join(this.backupDir, 'files'), { recursive: true });
      await fs.mkdir(path.join(this.backupDir, 'logs'), { recursive: true });
      await fs.mkdir(path.join(this.backupDir, 'config'), { recursive: true });

      logger.info('Backup directory initialized');
    } catch (error) {
      logger.error('Failed to initialize backup directory:', error);
    }
  }

  private initializeDefaultConfigs(): void {
    this.backupConfigs.push(
      {
        name: 'daily-database',
        type: 'database',
        schedule: '0 2 * * *', // 2 AM daily
        enabled: true,
        retention: 30,
        compression: true,
        encryption: true,
        destinations: [
          {
            type: 'local',
            path: path.join(this.backupDir, 'database'),
          },
        ],
      },
      {
        name: 'weekly-full',
        type: 'full',
        schedule: '0 3 * * 0', // 3 AM on Sundays
        enabled: true,
        retention: 90,
        compression: true,
        encryption: true,
        destinations: [
          {
            type: 'local',
            path: this.backupDir,
          },
        ],
      },
      {
        name: 'hourly-logs',
        type: 'logs',
        schedule: '0 * * * *', // Every hour
        enabled: true,
        retention: 7,
        compression: true,
        encryption: false,
        destinations: [
          {
            type: 'local',
            path: path.join(this.backupDir, 'logs'),
          },
        ],
      },
      {
        name: 'daily-files',
        type: 'files',
        schedule: '0 1 * * *', // 1 AM daily
        enabled: true,
        retention: 30,
        compression: true,
        encryption: true,
        destinations: [
          {
            type: 'local',
            path: path.join(this.backupDir, 'files'),
          },
        ],
      }
    );

    logger.info('Default backup configurations initialized', {
      totalConfigs: this.backupConfigs.length,
    });
  }

  /**
   * Create backup job
   */
  public async createBackup(
    configName: string,
    customOptions?: Partial<BackupConfig>
  ): Promise<BackupJob> {
    try {
      const config = this.backupConfigs.find(c => c.name === configName);
      if (!config) {
        throw new Error(`Backup configuration '${configName}' not found`);
      }

      const mergedConfig = { ...config, ...customOptions };
      const job: BackupJob = {
        id: this.generateJobId(),
        config: mergedConfig,
        status: 'pending',
        startTime: new Date(),
        size: 0,
        files: [],
        checksum: '',
        metadata: {
          createdBy: 'system',
          environment: process.env.NODE_ENV || 'development',
        },
      };

      this.backupJobs.push(job);
      await this.executeBackup(job);

      return job;
    } catch (error) {
      logger.error('Failed to create backup job:', error);
      throw error;
    }
  }

  /**
   * Execute backup
   */
  private async executeBackup(job: BackupJob): Promise<void> {
    try {
      job.status = 'running';
      logger.info('Starting backup job', { jobId: job.id, config: job.config.name });

      const startTime = Date.now();
      let totalSize = 0;
      const files: string[] = [];

      switch (job.config.type) {
        case 'database':
          await this.backupDatabase(job, files, totalSize);
          break;
        case 'files':
          await this.backupFiles(job, files, totalSize);
          break;
        case 'logs':
          await this.backupLogs(job, files, totalSize);
          break;
        case 'config':
          await this.backupConfig(job, files, totalSize);
          break;
        case 'full':
          await this.backupFull(job, files, totalSize);
          break;
      }

      // Process backup (compress and encrypt)
      const processedFiles = await this.processBackup(job, files);

      // Store backup
      await this.storeBackup(job, processedFiles);

      // Update job status
      job.status = 'completed';
      job.endTime = new Date();
      job.size = totalSize;
      job.files = processedFiles;
      job.checksum = await this.calculateChecksum(processedFiles);

      const duration = Date.now() - startTime;
      logger.info('Backup completed successfully', {
        jobId: job.id,
        config: job.config.name,
        duration,
        size: job.size,
        files: job.files.length,
      });

      // Cleanup old backups
      await this.cleanupOldBackups(job.config);
    } catch (error) {
      job.status = 'failed';
      job.endTime = new Date();
      job.error = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Backup failed', {
        jobId: job.id,
        config: job.config.name,
        error: job.error,
      });
    }
  }

  /**
   * Backup database
   */
  private async backupDatabase(job: BackupJob, files: string[], totalSize: number): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, 'database', `database-${timestamp}.sql`);

      // MongoDB backup
      if (process.env.MONGODB_URI) {
        const command = `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupFile}"`;
        await execAsync(command);
        files.push(backupFile);

        const stats = await fs.stat(backupFile);
        totalSize += stats.size;
      }

      // PostgreSQL backup
      if (process.env.DATABASE_URL) {
        const pgBackupFile = path.join(this.backupDir, 'database', `postgres-${timestamp}.sql`);
        const command = `pg_dump "${process.env.DATABASE_URL}" > "${pgBackupFile}"`;
        await execAsync(command);
        files.push(pgBackupFile);

        const stats = await fs.stat(pgBackupFile);
        totalSize += stats.size;
      }

      logger.info('Database backup completed', { files: files.length, size: totalSize });
    } catch (error) {
      logger.error('Database backup failed:', error);
      throw error;
    }
  }

  /**
   * Backup files
   */
  private async backupFiles(job: BackupJob, files: string[], totalSize: number): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, 'files', `files-${timestamp}.tar.gz`);

      // Create tar archive of important directories
      const directories = ['uploads', 'quarantine', 'data'];

      let tarCommand = `tar -czf "${backupFile}"`;
      for (const dir of directories) {
        try {
          await fs.access(dir);
          tarCommand += ` ${dir}`;
        } catch {
          // Directory doesn't exist, skip
        }
      }

      await execAsync(tarCommand);
      files.push(backupFile);

      const stats = await fs.stat(backupFile);
      totalSize += stats.size;

      logger.info('Files backup completed', { files: files.length, size: totalSize });
    } catch (error) {
      logger.error('Files backup failed:', error);
      throw error;
    }
  }

  /**
   * Backup logs
   */
  private async backupLogs(job: BackupJob, files: string[], totalSize: number): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, 'logs', `logs-${timestamp}.tar.gz`);

      // Create tar archive of logs
      const logDirs = ['logs', 'monitoring'];

      let tarCommand = `tar -czf "${backupFile}"`;
      for (const dir of logDirs) {
        try {
          await fs.access(dir);
          tarCommand += ` ${dir}`;
        } catch {
          // Directory doesn't exist, skip
        }
      }

      await execAsync(tarCommand);
      files.push(backupFile);

      const stats = await fs.stat(backupFile);
      totalSize += stats.size;

      logger.info('Logs backup completed', { files: files.length, size: totalSize });
    } catch (error) {
      logger.error('Logs backup failed:', error);
      throw error;
    }
  }

  /**
   * Backup configuration
   */
  private async backupConfig(job: BackupJob, files: string[], totalSize: number): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, 'config', `config-${timestamp}.tar.gz`);

      // Create tar archive of configuration files
      const configFiles = ['.env', 'package.json', 'tsconfig.json', 'docker-compose.yml'];

      let tarCommand = `tar -czf "${backupFile}"`;
      for (const file of configFiles) {
        try {
          await fs.access(file);
          tarCommand += ` ${file}`;
        } catch {
          // File doesn't exist, skip
        }
      }

      await execAsync(tarCommand);
      files.push(backupFile);

      const stats = await fs.stat(backupFile);
      totalSize += stats.size;

      logger.info('Configuration backup completed', { files: files.length, size: totalSize });
    } catch (error) {
      logger.error('Configuration backup failed:', error);
      throw error;
    }
  }

  /**
   * Full backup
   */
  private async backupFull(job: BackupJob, files: string[], totalSize: number): Promise<void> {
    try {
      // Run all backup types
      await this.backupDatabase(job, files, totalSize);
      await this.backupFiles(job, files, totalSize);
      await this.backupLogs(job, files, totalSize);
      await this.backupConfig(job, files, totalSize);

      logger.info('Full backup completed', { files: files.length, size: totalSize });
    } catch (error) {
      logger.error('Full backup failed:', error);
      throw error;
    }
  }

  /**
   * Process backup (compress and encrypt)
   */
  private async processBackup(job: BackupJob, files: string[]): Promise<string[]> {
    const processedFiles: string[] = [];

    for (const file of files) {
      let processedFile = file;

      // Compression
      if (job.config.compression && !file.endsWith('.gz')) {
        processedFile = await this.compressFile(file);
        await fs.unlink(file); // Remove original
      }

      // Encryption
      if (job.config.encryption) {
        processedFile = await this.encryptFile(processedFile);
        await fs.unlink(processedFile.replace('.enc', '')); // Remove unencrypted
      }

      processedFiles.push(processedFile);
    }

    return processedFiles;
  }

  /**
   * Compress file
   */
  private async compressFile(filePath: string): Promise<string> {
    const compressedPath = `${filePath}.gz`;
    await execAsync(`gzip "${filePath}"`);
    return compressedPath;
  }

  /**
   * Encrypt file
   */
  private async encryptFile(filePath: string): Promise<string> {
    const encryptedPath = `${filePath}.enc`;
    const data = await fs.readFile(filePath);

    // Simple XOR encryption (in production, use proper encryption)
    const encrypted = Buffer.from(data.map(byte => byte ^ this.encryptionKey.charCodeAt(0)));
    await fs.writeFile(encryptedPath, encrypted);

    return encryptedPath;
  }

  /**
   * Store backup
   */
  private async storeBackup(job: BackupJob, files: string[]): Promise<void> {
    try {
      for (const destination of job.config.destinations) {
        switch (destination.type) {
          case 'local':
            await this.storeBackupLocal(job, files, destination.path);
            break;
          case 's3':
            await this.storeBackupS3(job, files, destination);
            break;
          case 'gcs':
            await this.storeBackupGCS(job, files, destination);
            break;
          case 'azure':
            await this.storeBackupAzure(job, files, destination);
            break;
        }
      }
    } catch (error) {
      logger.error('Failed to store backup:', error);
      throw error;
    }
  }

  /**
   * Store backup locally
   */
  private async storeBackupLocal(
    job: BackupJob,
    files: string[],
    destinationPath: string
  ): Promise<void> {
    try {
      await fs.mkdir(destinationPath, { recursive: true });

      for (const file of files) {
        const fileName = path.basename(file);
        const destPath = path.join(destinationPath, `${job.id}_${fileName}`);
        await fs.copyFile(file, destPath);
      }

      // Store backup metadata
      const metadataPath = path.join(destinationPath, `${job.id}_metadata.json`);
      await fs.writeFile(
        metadataPath,
        JSON.stringify(
          {
            job,
            files,
            storedAt: new Date(),
          },
          null,
          2
        )
      );

      logger.info('Backup stored locally', { destination: destinationPath, files: files.length });
    } catch (error) {
      logger.error('Failed to store backup locally:', error);
      throw error;
    }
  }

  /**
   * Store backup to S3 (placeholder)
   */
  private async storeBackupS3(
    job: BackupJob,
    files: string[],
    destination: BackupDestination
  ): Promise<void> {
    // Implementation would use AWS SDK
    logger.info('S3 backup storage not implemented', { destination });
  }

  /**
   * Store backup to GCS (placeholder)
   */
  private async storeBackupGCS(
    job: BackupJob,
    files: string[],
    destination: BackupDestination
  ): Promise<void> {
    // Implementation would use Google Cloud SDK
    logger.info('GCS backup storage not implemented', { destination });
  }

  /**
   * Store backup to Azure (placeholder)
   */
  private async storeBackupAzure(
    job: BackupJob,
    files: string[],
    destination: BackupDestination
  ): Promise<void> {
    // Implementation would use Azure SDK
    logger.info('Azure backup storage not implemented', { destination });
  }

  /**
   * Calculate checksum
   */
  private async calculateChecksum(files: string[]): Promise<string> {
    const hash = crypto.createHash('sha256');

    for (const file of files) {
      try {
        const data = await fs.readFile(file);
        hash.update(data);
      } catch (error) {
        logger.error('Failed to read file for checksum:', { file, error });
      }
    }

    return hash.digest('hex');
  }

  /**
   * Cleanup old backups
   */
  private async cleanupOldBackups(config: BackupConfig): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - config.retention * 24 * 60 * 60 * 1000);

      for (const destination of config.destinations) {
        if (destination.type === 'local') {
          const files = await fs.readdir(destination.path);

          for (const file of files) {
            if (file.endsWith('_metadata.json')) {
              const metadataPath = path.join(destination.path, file);
              try {
                const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));

                if (new Date(metadata.storedAt) < cutoffDate) {
                  // Remove backup files
                  for (const backupFile of metadata.files) {
                    const filePath = path.join(destination.path, backupFile);
                    try {
                      await fs.unlink(filePath);
                    } catch (error) {
                      logger.error('Failed to delete backup file:', { filePath, error });
                    }
                  }

                  // Remove metadata file
                  await fs.unlink(metadataPath);

                  logger.info('Cleaned up old backup', { backupId: metadata.job.id });
                }
              } catch (error) {
                logger.error('Failed to read backup metadata:', { metadataPath, error });
              }
            }
          }
        }
      }
    } catch (error) {
      logger.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Restore from backup
   */
  public async restoreFromBackup(backupId: string): Promise<RestoreJob> {
    try {
      const backupJob = this.backupJobs.find(job => job.id === backupId);
      if (!backupJob) {
        throw new Error(`Backup '${backupId}' not found`);
      }

      const restoreJob: RestoreJob = {
        id: this.generateJobId(),
        backupId,
        status: 'pending',
        startTime: new Date(),
        files: [],
        metadata: {
          restoredBy: 'system',
          environment: process.env.NODE_ENV || 'development',
        },
      };

      this.restoreJobs.push(restoreJob);
      await this.executeRestore(restoreJob, backupJob);

      return restoreJob;
    } catch (error) {
      logger.error('Failed to create restore job:', error);
      throw error;
    }
  }

  /**
   * Execute restore
   */
  private async executeRestore(restoreJob: RestoreJob, backupJob: BackupJob): Promise<void> {
    try {
      restoreJob.status = 'running';
      logger.info('Starting restore job', { restoreJobId: restoreJob.id, backupId: backupJob.id });

      // Find backup files
      const backupFiles = await this.findBackupFiles(backupJob);

      if (backupFiles.length === 0) {
        throw new Error('No backup files found');
      }

      // Decrypt and decompress files
      const processedFiles = await this.processRestoreFiles(backupFiles, backupJob);

      // Restore data
      await this.restoreData(processedFiles, backupJob);

      // Update job status
      restoreJob.status = 'completed';
      restoreJob.endTime = new Date();
      restoreJob.files = processedFiles;

      logger.info('Restore completed successfully', {
        restoreJobId: restoreJob.id,
        backupId: backupJob.id,
        files: restoreJob.files.length,
      });
    } catch (error) {
      restoreJob.status = 'failed';
      restoreJob.endTime = new Date();
      restoreJob.error = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Restore failed', {
        restoreJobId: restoreJob.id,
        backupId: backupJob.id,
        error: restoreJob.error,
      });
    }
  }

  /**
   * Find backup files
   */
  private async findBackupFiles(backupJob: BackupJob): Promise<string[]> {
    const files: string[] = [];

    for (const destination of backupJob.config.destinations) {
      if (destination.type === 'local') {
        const dirFiles = await fs.readdir(destination.path);

        for (const file of dirFiles) {
          if (file.startsWith(backupJob.id)) {
            files.push(path.join(destination.path, file));
          }
        }
      }
      // Add other destination types as needed
    }

    return files;
  }

  /**
   * Process restore files (decrypt and decompress)
   */
  private async processRestoreFiles(files: string[], backupJob: BackupJob): Promise<string[]> {
    const processedFiles: string[] = [];

    for (const file of files) {
      let processedFile = file;

      // Decrypt
      if (backupJob.config.encryption && file.endsWith('.enc')) {
        processedFile = await this.decryptFile(file);
        await fs.unlink(file); // Remove encrypted
      }

      // Decompress
      if (backupJob.config.compression && processedFile.endsWith('.gz')) {
        processedFile = await this.decompressFile(processedFile);
        await fs.unlink(processedFile); // Remove compressed
      }

      processedFiles.push(processedFile);
    }

    return processedFiles;
  }

  /**
   * Decrypt file
   */
  private async decryptFile(filePath: string): Promise<string> {
    const decryptedPath = filePath.replace('.enc', '');
    const encrypted = await fs.readFile(filePath);

    // Simple XOR decryption (in production, use proper decryption)
    const decrypted = Buffer.from(encrypted.map(byte => byte ^ this.encryptionKey.charCodeAt(0)));
    await fs.writeFile(decryptedPath, decrypted);

    return decryptedPath;
  }

  /**
   * Decompress file
   */
  private async decompressFile(filePath: string): Promise<string> {
    const decompressedPath = filePath.replace('.gz', '');
    await execAsync(`gunzip "${filePath}"`);
    return decompressedPath;
  }

  /**
   * Restore data
   */
  private async restoreData(files: string[], backupJob: BackupJob): Promise<void> {
    try {
      switch (backupJob.config.type) {
        case 'database':
          await this.restoreDatabase(files);
          break;
        case 'files':
          await this.restoreFiles(files);
          break;
        case 'logs':
          await this.restoreLogs(files);
          break;
        case 'config':
          await this.restoreConfig(files);
          break;
        case 'full':
          await this.restoreFull(files);
          break;
      }

      logger.info('Data restored successfully', {
        files: files.length,
        type: backupJob.config.type,
      });
    } catch (error) {
      logger.error('Data restore failed:', error);
      throw error;
    }
  }

  /**
   * Restore database
   */
  private async restoreDatabase(files: string[]): Promise<void> {
    for (const file of files) {
      if (file.includes('database-') && file.endsWith('.sql')) {
        if (file.includes('mongodb')) {
          const command = `mongorestore --uri="${process.env.MONGODB_URI}" --drop "${file}"`;
          await execAsync(command);
        } else if (file.includes('postgres')) {
          const command = `psql "${process.env.DATABASE_URL}" < "${file}"`;
          await execAsync(command);
        }
        break;
      }
    }
  }

  /**
   * Restore files
   */
  private async restoreFiles(files: string[]): Promise<void> {
    for (const file of files) {
      if (file.includes('files-') && file.endsWith('.tar.gz')) {
        const command = `tar -xzf "${file}" -C .`;
        await execAsync(command);
      }
    }
  }

  /**
   * Restore logs
   */
  private async restoreLogs(files: string[]): Promise<void> {
    for (const file of files) {
      if (file.includes('logs-') && file.endsWith('.tar.gz')) {
        const command = `tar -xzf "${file}" -C .`;
        await execAsync(command);
      }
    }
  }

  /**
   * Restore configuration
   */
  private async restoreConfig(files: string[]): Promise<void> {
    for (const file of files) {
      if (file.includes('config-') && file.endsWith('.tar.gz')) {
        const command = `tar -xzf "${file}" -C .`;
        await execAsync(command);
      }
    }
  }

  /**
   * Full restore
   */
  private async restoreFull(files: string[]): Promise<void> {
    await this.restoreDatabase(files);
    await this.restoreFiles(files);
    await this.restoreLogs(files);
    await this.restoreConfig(files);
  }

  /**
   * Get backup jobs
   */
  public getBackupJobs(): BackupJob[] {
    return this.backupJobs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Get restore jobs
   */
  public getRestoreJobs(): RestoreJob[] {
    return this.restoreJobs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Get backup configurations
   */
  public getBackupConfigs(): BackupConfig[] {
    return this.backupConfigs;
  }

  /**
   * Add backup configuration
   */
  public addBackupConfig(config: BackupConfig): void {
    this.backupConfigs.push(config);
    logger.info('Backup configuration added', { name: config.name });
  }

  /**
   * Start scheduled backups
   */
  private startScheduledBackups(): void {
    // This would integrate with a cron scheduler
    // For now, just log that it would start
    logger.info('Scheduled backups configured', {
      configs: this.backupConfigs.filter(c => c.enabled).length,
    });
  }

  /**
   * Generate job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get backup statistics
   */
  public async getStats(): Promise<{
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
    totalSize: number;
    averageSize: number;
    backupsByType: { [key: string]: number };
    recentBackups: Array<{
      id: string;
      type: string;
      status: string;
      size: number;
      timestamp: Date;
    }>;
  }> {
    try {
      const totalBackups = this.backupJobs.length;
      const successfulBackups = this.backupJobs.filter(job => job.status === 'completed').length;
      const failedBackups = this.backupJobs.filter(job => job.status === 'failed').length;
      const totalSize = this.backupJobs.reduce((sum, job) => sum + job.size, 0);
      const averageSize = totalBackups > 0 ? totalSize / totalBackups : 0;

      const backupsByType: { [key: string]: number } = {};
      this.backupJobs.forEach(job => {
        backupsByType[job.config.type] = (backupsByType[job.config.type] || 0) + 1;
      });

      const recentBackups = this.backupJobs
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .slice(0, 10)
        .map(job => ({
          id: job.id,
          type: job.config.type,
          status: job.status,
          size: job.size,
          timestamp: job.startTime,
        }));

      return {
        totalBackups,
        successfulBackups,
        failedBackups,
        totalSize,
        averageSize,
        backupsByType,
        recentBackups,
      };
    } catch (error) {
      logger.error('Failed to get backup stats:', error);
      return {
        totalBackups: 0,
        successfulBackups: 0,
        failedBackups: 0,
        totalSize: 0,
        averageSize: 0,
        backupsByType: {},
        recentBackups: [],
      };
    }
  }
}
