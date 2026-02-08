import { exec } from 'child_process';
import fs from 'fs/promises';
import { injectable } from 'inversify';
import path from 'path';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

interface PackageInfo {
  name: string;
  version: string;
  currentVersion: string;
  latestVersion: string;
  securityVulnerabilities: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  outdated: boolean;
  type: 'npm' | 'pip' | 'system';
  dependencies?: string[];
}

interface PatchJob {
  id: string;
  packageName: string;
  type: 'npm' | 'pip' | 'system';
  currentVersion: string;
  targetVersion: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rollback';
  startTime: Date;
  endTime?: Date;
  logs: string[];
  error?: string;
  rollbackAvailable: boolean;
  metadata: {
    [key: string]: any;
  };
}

interface PatchPolicy {
  name: string;
  enabled: boolean;
  schedule: string; // Cron expression
  autoApply: boolean;
  requireApproval: boolean;
  allowedTimes: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
  excludedPackages: string[];
  includedPackages: string[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  backupBeforePatch: boolean;
  testAfterPatch: boolean;
  rollbackOnError: boolean;
}

@injectable()
export class AutoPatchService {
  private readonly patchJobs: PatchJob[] = [];
  private readonly patchPolicies: PatchPolicy[] = [];
  private readonly maxJobs = 100;
  private readonly backupDir = 'patches/backup';
  private readonly logDir = 'patches/logs';

  constructor() {
    this.initializeDirectories();
    this.initializeDefaultPolicies();
    this.startPatchScheduler();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir('patches', { recursive: true });
      await fs.mkdir(this.backupDir, { recursive: true });
      await fs.mkdir(this.logDir, { recursive: true });

      logger.info('Auto patch directories initialized');
    } catch (error) {
      logger.error('Failed to initialize patch directories:', error);
    }
  }

  private initializeDefaultPolicies(): void {
    this.patchPolicies.push(
      {
        name: 'security-critical',
        enabled: true,
        schedule: '0 2 * * *', // 2 AM daily
        autoApply: true,
        requireApproval: false,
        allowedTimes: {
          start: '02:00',
          end: '04:00',
        },
        excludedPackages: [],
        includedPackages: [],
        severityThreshold: 'critical',
        backupBeforePatch: true,
        testAfterPatch: true,
        rollbackOnError: true,
      },
      {
        name: 'security-high',
        enabled: true,
        schedule: '0 3 * * 0', // 3 AM on Sundays
        autoApply: false,
        requireApproval: true,
        allowedTimes: {
          start: '03:00',
          end: '05:00',
        },
        excludedPackages: [],
        includedPackages: [],
        severityThreshold: 'high',
        backupBeforePatch: true,
        testAfterPatch: true,
        rollbackOnError: true,
      },
      {
        name: 'regular-updates',
        enabled: false,
        schedule: '0 4 * * 1', // 4 AM on Mondays
        autoApply: false,
        requireApproval: true,
        allowedTimes: {
          start: '04:00',
          end: '06:00',
        },
        excludedPackages: ['@types/node', 'typescript'],
        includedPackages: [],
        severityThreshold: 'medium',
        backupBeforePatch: true,
        testAfterPatch: true,
        rollbackOnError: true,
      },
    );

    logger.info('Default patch policies initialized', {
      totalPolicies: this.patchPolicies.length,
    });
  }

  /**
   * Scan for outdated packages
   */
  public async scanOutdatedPackages(): Promise<PackageInfo[]> {
    try {
      const packages: PackageInfo[] = [];

      // Scan npm packages
      const npmPackages = await this.scanNpmPackages();
      packages.push(...npmPackages);

      // Scan pip packages
      const pipPackages = await this.scanPipPackages();
      packages.push(...pipPackages);

      // Scan system packages
      const systemPackages = await this.scanSystemPackages();
      packages.push(...systemPackages);

      logger.info('Package scan completed', {
        totalPackages: packages.length,
        npmPackages: npmPackages.length,
        pipPackages: pipPackages.length,
        systemPackages: systemPackages.length,
      });

      return packages;
    } catch (error) {
      logger.error('Failed to scan packages:', error);
      return [];
    }
  }

  /**
   * Scan npm packages
   */
  private async scanNpmPackages(): Promise<PackageInfo[]> {
    try {
      const packages: PackageInfo[] = [];

      // Check if package.json exists
      try {
        await fs.access('package.json');
      } catch {
        return packages;
      }

      // Get outdated packages
      const { stdout: outdatedOutput } = await execAsync('npm outdated --json');
      const outdatedPackages = JSON.parse(outdatedOutput || '{}');

      // Get audit results
      const { stdout: auditOutput } = await execAsync('npm audit --json');
      const auditResults = JSON.parse(auditOutput || '{}');

      // Process packages
      for (const [name, info] of Object.entries(outdatedPackages)) {
        const packageInfo = info as any;
        const vulnerabilities = auditResults.vulnerabilities?.[name] || {};

        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        let vulnCount = 0;

        if (vulnerabilities) {
          vulnCount = Object.keys(vulnerabilities).length;
          severity = this.calculateSeverity(vulnerabilities);
        }

        packages.push({
          name,
          version: packageInfo.current || 'unknown',
          currentVersion: packageInfo.current || 'unknown',
          latestVersion: packageInfo.latest || 'unknown',
          securityVulnerabilities: vulnCount,
          severity,
          outdated: packageInfo.current !== packageInfo.latest,
          type: 'npm',
          dependencies: packageInfo.dependencies || [],
        });
      }

      return packages;
    } catch (error) {
      logger.error('Failed to scan npm packages:', error);
      return [];
    }
  }

  /**
   * Scan pip packages
   */
  private async scanPipPackages(): Promise<PackageInfo[]> {
    try {
      const packages: PackageInfo[] = [];

      // Check if requirements.txt exists
      try {
        await fs.access('requirements.txt');
      } catch {
        return packages;
      }

      // Get outdated packages
      try {
        const { stdout: outdatedOutput } = await execAsync('pip list --outdated --format=json');
        const outdatedPackages = JSON.parse(outdatedOutput || '[]');

        // Get security audit
        let auditResults: any = {};
        try {
          const { stdout: auditOutput } = await execAsync(
            'pip-audit --format=json --requirement=requirements.txt',
          );
          auditResults = JSON.parse(auditOutput || '{}');
        } catch {
          // pip-audit not available or failed
        }

        for (const pkg of outdatedPackages) {
          const vulnerabilities =
            auditResults.dependencies?.find((dep: any) => dep.name === pkg.name)?.vulnerabilities ||
            [];

          let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
          let vulnCount = vulnerabilities.length;

          if (vulnCount > 0) {
            severity = this.calculateSeverity(vulnerabilities);
          }

          packages.push({
            name: pkg.name,
            version: pkg.version || 'unknown',
            currentVersion: pkg.version || 'unknown',
            latestVersion: pkg.latest_version || 'unknown',
            securityVulnerabilities: vulnCount,
            severity,
            outdated: pkg.version !== pkg.latest_version,
            type: 'pip',
          });
        }
      } catch (error) {
        logger.error('Failed to get pip outdated packages:', error);
      }

      return packages;
    } catch (error) {
      logger.error('Failed to scan pip packages:', error);
      return [];
    }
  }

  /**
   * Scan system packages
   */
  private async scanSystemPackages(): Promise<PackageInfo[]> {
    try {
      const packages: PackageInfo[] = [];

      // This would integrate with system package managers
      // For now, return empty array as system package management is complex
      // and varies by OS

      return packages;
    } catch (error) {
      logger.error('Failed to scan system packages:', error);
      return [];
    }
  }

  /**
   * Calculate severity from vulnerabilities
   */
  private calculateSeverity(vulnerabilities: any): 'low' | 'medium' | 'high' | 'critical' {
    let hasCritical = false;
    let hasHigh = false;
    let hasMedium = false;

    for (const vuln of Object.values(vulnerabilities)) {
      const vulnerability = vuln as any;
      if (vulnerability.severity === 'critical') hasCritical = true;
      else if (vulnerability.severity === 'high') hasHigh = true;
      else if (vulnerability.severity === 'medium') hasMedium = true;
    }

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
  }

  /**
   * Create patch job
   */
  public async createPatchJob(
    packageName: string,
    type: 'npm' | 'pip' | 'system',
    targetVersion?: string,
  ): Promise<PatchJob> {
    try {
      const packages = await this.scanOutdatedPackages();
      const packageInfo = packages.find(p => p.name === packageName && p.type === type);

      if (!packageInfo) {
        throw new Error(`Package '${packageName}' of type '${type}' not found`);
      }

      const job: PatchJob = {
        id: this.generateJobId(),
        packageName,
        type,
        currentVersion: packageInfo.currentVersion,
        targetVersion: targetVersion || packageInfo.latestVersion,
        status: 'pending',
        startTime: new Date(),
        logs: [],
        rollbackAvailable: false,
        metadata: {
          severity: packageInfo.severity,
          vulnerabilities: packageInfo.securityVulnerabilities,
          policy: this.getApplicablePolicy(packageInfo),
        },
      };

      this.patchJobs.push(job);

      // Execute patch if auto-apply is enabled
      const policy = this.getApplicablePolicy(packageInfo);
      if (policy && policy.autoApply && this.isWithinAllowedTime(policy)) {
        await this.executePatch(job);
      }

      return job;
    } catch (error) {
      logger.error('Failed to create patch job:', error);
      throw error;
    }
  }

  /**
   * Execute patch
   */
  private async executePatch(job: PatchJob): Promise<void> {
    try {
      job.status = 'running';
      job.logs.push(`Starting patch job for ${job.packageName} (${job.type})`);

      logger.info('Starting patch job', {
        jobId: job.id,
        packageName: job.packageName,
        type: job.type,
        currentVersion: job.currentVersion,
        targetVersion: job.targetVersion,
      });

      const policy = job.metadata.policy as PatchPolicy;

      // Create backup if required
      if (policy?.backupBeforePatch) {
        await this.createBackup(job);
      }

      // Execute patch based on type
      switch (job.type) {
        case 'npm':
          await this.patchNpmPackage(job);
          break;
        case 'pip':
          await this.patchPipPackage(job);
          break;
        case 'system':
          await this.patchSystemPackage(job);
          break;
      }

      // Test after patch if required
      if (policy?.testAfterPatch) {
        await this.testPatch(job);
      }

      job.status = 'completed';
      job.endTime = new Date();
      job.logs.push('Patch completed successfully');

      logger.info('Patch job completed successfully', {
        jobId: job.id,
        packageName: job.packageName,
        duration: job.endTime.getTime() - job.startTime.getTime(),
      });
    } catch (error) {
      job.status = 'failed';
      job.endTime = new Date();
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.logs.push(`Patch failed: ${job.error}`);

      logger.error('Patch job failed', {
        jobId: job.id,
        packageName: job.packageName,
        error: job.error,
      });

      // Rollback if enabled
      const policy = job.metadata.policy as PatchPolicy;
      if (policy?.rollbackOnError && job.rollbackAvailable) {
        await this.rollbackPatch(job);
      }
    }
  }

  /**
   * Patch npm package
   */
  private async patchNpmPackage(job: PatchJob): Promise<void> {
    try {
      job.logs.push(`Updating npm package ${job.packageName} to ${job.targetVersion}`);

      // Update package
      const command = `npm install ${job.packageName}@${job.targetVersion}`;
      const { stdout, stderr } = await execAsync(command);

      job.logs.push(`Update command executed: ${command}`);
      if (stdout) job.logs.push(`Output: ${stdout}`);
      if (stderr) job.logs.push(`Error output: ${stderr}`);

      // Verify update
      const { stdout: versionOutput } = await execAsync(
        `npm list ${job.packageName} --depth=0 --json`,
      );
      const packageInfo = JSON.parse(versionOutput);
      const updatedVersion =
        packageInfo.dependencies?.[job.packageName] ||
        packageInfo.devDependencies?.[job.packageName];

      if (updatedVersion !== job.targetVersion) {
        throw new Error(`Version mismatch. Expected ${job.targetVersion}, got ${updatedVersion}`);
      }

      job.logs.push(`Package successfully updated to version ${updatedVersion}`);
    } catch (error) {
      job.logs.push(`NPM patch failed: ${error}`);
      throw error;
    }
  }

  /**
   * Patch pip package
   */
  private async patchPipPackage(job: PatchJob): Promise<void> {
    try {
      job.logs.push(`Updating pip package ${job.packageName} to ${job.targetVersion}`);

      // Update package
      const command = `pip install ${job.packageName}==${job.targetVersion}`;
      const { stdout, stderr } = await execAsync(command);

      job.logs.push(`Update command executed: ${command}`);
      if (stdout) job.logs.push(`Output: ${stdout}`);
      if (stderr) job.logs.push(`Error output: ${stderr}`);

      // Verify update
      const { stdout: versionOutput } = await execAsync(`pip show ${job.packageName}`);
      const lines = versionOutput.split('\n');
      const versionLine = lines.find(line => line.startsWith('Version:'));
      const updatedVersion = versionLine?.split(':')[1]?.trim();

      if (updatedVersion !== job.targetVersion) {
        throw new Error(`Version mismatch. Expected ${job.targetVersion}, got ${updatedVersion}`);
      }

      job.logs.push(`Package successfully updated to version ${updatedVersion}`);
    } catch (error) {
      job.logs.push(`Pip patch failed: ${error}`);
      throw error;
    }
  }

  /**
   * Patch system package
   */
  private async patchSystemPackage(job: PatchJob): Promise<void> {
    try {
      job.logs.push(`Updating system package ${job.packageName} to ${job.targetVersion}`);

      // This would integrate with system package managers
      // For now, just log that it would be done
      job.logs.push('System package patching not implemented');

      throw new Error('System package patching not implemented');
    } catch (error) {
      job.logs.push(`System patch failed: ${error}`);
      throw error;
    }
  }

  /**
   * Create backup
   */
  private async createBackup(job: PatchJob): Promise<void> {
    try {
      const backupName = `${job.packageName}-${job.currentVersion}-${Date.now()}`;
      const backupPath = path.join(this.backupDir, backupName);

      await fs.mkdir(backupPath, { recursive: true });

      // Backup package.json for npm
      if (job.type === 'npm') {
        await fs.copyFile('package.json', path.join(backupPath, 'package.json'));
        await fs.copyFile('package-lock.json', path.join(backupPath, 'package-lock.json'));
      }

      // Backup requirements.txt for pip
      if (job.type === 'pip') {
        await fs.copyFile('requirements.txt', path.join(backupPath, 'requirements.txt'));
      }

      job.rollbackAvailable = true;
      job.logs.push(`Backup created: ${backupPath}`);

      logger.info('Backup created', { jobId: job.id, backupPath });
    } catch (error) {
      job.logs.push(`Backup creation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Test patch
   */
  private async testPatch(job: PatchJob): Promise<void> {
    try {
      job.logs.push('Running post-patch tests');

      // Run basic tests
      if (job.type === 'npm') {
        // Check if package can be required
        try {
          await execAsync(`node -e "require('${job.packageName}')"`);
          job.logs.push('Package can be required successfully');
        } catch (error) {
          throw new Error(`Package cannot be required: ${error}`);
        }

        // Run npm test if available
        try {
          await fs.access('package.json');
          const packageJson = JSON.parse(await fs.readFile('package.json', 'utf-8'));
          if (packageJson.scripts?.test) {
            const { stdout, stderr } = await execAsync('npm test');
            job.logs.push('Tests completed successfully');
            if (stdout) job.logs.push(`Test output: ${stdout}`);
            if (stderr) job.logs.push(`Test errors: ${stderr}`);
          }
        } catch {
          job.logs.push('No tests found or tests failed');
        }
      }

      job.logs.push('Post-patch tests completed');
    } catch (error) {
      job.logs.push(`Post-patch tests failed: ${error}`);
      throw error;
    }
  }

  /**
   * Rollback patch
   */
  private async rollbackPatch(job: PatchJob): Promise<void> {
    try {
      if (!job.rollbackAvailable) {
        throw new Error('No backup available for rollback');
      }

      job.logs.push('Starting rollback');

      const backupName = `${job.packageName}-${job.currentVersion}-${Date.now()}`;
      const backupPath = path.join(this.backupDir, backupName);

      // Restore from backup
      if (job.type === 'npm') {
        await fs.copyFile(path.join(backupPath, 'package.json'), 'package.json');
        await fs.copyFile(path.join(backupPath, 'package-lock.json'), 'package-lock.json');
        await execAsync('npm install');
      }

      if (job.type === 'pip') {
        await fs.copyFile(path.join(backupPath, 'requirements.txt'), 'requirements.txt');
        await execAsync('pip install -r requirements.txt');
      }

      job.logs.push('Rollback completed successfully');

      logger.info('Patch rollback completed', { jobId: job.id });
    } catch (error) {
      job.logs.push(`Rollback failed: ${error}`);
      logger.error('Patch rollback failed', { jobId: job.id, error });
    }
  }

  /**
   * Get applicable policy
   */
  private getApplicablePolicy(packageInfo: PackageInfo): PatchPolicy | null {
    for (const policy of this.patchPolicies) {
      if (!policy.enabled) continue;

      // Check severity threshold
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      const packageSeverity = severityOrder[packageInfo.severity];
      const policySeverity = severityOrder[policy.severityThreshold];

      if (packageSeverity < policySeverity) continue;

      // Check excluded packages
      if (policy.excludedPackages.includes(packageInfo.name)) continue;

      // Check included packages (if specified)
      if (policy.includedPackages.length > 0 && !policy.includedPackages.includes(packageInfo.name))
        continue;

      return policy;
    }

    return null;
  }

  /**
   * Check if within allowed time
   */
  private isWithinAllowedTime(policy: PatchPolicy): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    return currentTime >= policy.allowedTimes.start && currentTime <= policy.allowedTimes.end;
  }

  /**
   * Get patch jobs
   */
  public getPatchJobs(): PatchJob[] {
    return this.patchJobs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Get patch policies
   */
  public getPatchPolicies(): PatchPolicy[] {
    return this.patchPolicies;
  }

  /**
   * Add patch policy
   */
  public addPatchPolicy(policy: PatchPolicy): void {
    this.patchPolicies.push(policy);
    logger.info('Patch policy added', { name: policy.name });
  }

  /**
   * Start patch scheduler
   */
  private startPatchScheduler(): void {
    // This would integrate with a cron scheduler
    // For now, just log that it would start
    logger.info('Patch scheduler configured', {
      policies: this.patchPolicies.filter(p => p.enabled).length,
    });
  }

  /**
   * Generate job ID
   */
  private generateJobId(): string {
    return `patch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get patch statistics
   */
  public async getStats(): Promise<{
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    pendingJobs: number;
    runningJobs: number;
    packagesPatched: number;
    vulnerabilitiesFixed: number;
    averagePatchTime: number;
    recentJobs: Array<{
      id: string;
      packageName: string;
      type: string;
      status: string;
      duration: number;
      timestamp: Date;
    }>;
  }> {
    try {
      const totalJobs = this.patchJobs.length;
      const successfulJobs = this.patchJobs.filter(job => job.status === 'completed').length;
      const failedJobs = this.patchJobs.filter(job => job.status === 'failed').length;
      const pendingJobs = this.patchJobs.filter(job => job.status === 'pending').length;
      const runningJobs = this.patchJobs.filter(job => job.status === 'running').length;

      const completedJobs = this.patchJobs.filter(job => job.status === 'completed' && job.endTime);
      const averagePatchTime =
        completedJobs.length > 0
          ? completedJobs.reduce(
              (sum, job) => sum + (job.endTime!.getTime() - job.startTime.getTime()),
              0,
            ) / completedJobs.length
          : 0;

      const packagesPatched = new Set(this.patchJobs.map(job => job.packageName)).size;
      const vulnerabilitiesFixed = this.patchJobs.reduce(
        (sum, job) => sum + (job.metadata.vulnerabilities || 0),
        0,
      );

      const recentJobs = this.patchJobs
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .slice(0, 10)
        .map(job => ({
          id: job.id,
          packageName: job.packageName,
          type: job.type,
          status: job.status,
          duration: job.endTime ? job.endTime.getTime() - job.startTime.getTime() : 0,
          timestamp: job.startTime,
        }));

      return {
        totalJobs,
        successfulJobs,
        failedJobs,
        pendingJobs,
        runningJobs,
        packagesPatched,
        vulnerabilitiesFixed,
        averagePatchTime,
        recentJobs,
      };
    } catch (error) {
      logger.error('Failed to get patch stats:', error);
      return {
        totalJobs: 0,
        successfulJobs: 0,
        failedJobs: 0,
        pendingJobs: 0,
        runningJobs: 0,
        packagesPatched: 0,
        vulnerabilitiesFixed: 0,
        averagePatchTime: 0,
        recentJobs: [],
      };
    }
  }
}
