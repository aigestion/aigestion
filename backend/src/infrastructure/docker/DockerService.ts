/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { exec } from 'child_process';
import { injectable } from 'inversify';
import { promisify } from 'util';

import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../utils/redis';

const execAsync = promisify(exec);

/**
 * 🌌 [GOD MODE] DockerService
 * Advanced container orchestration layer with structured metrics and caching.
 * Optimized for high-frequency environment monitoring and management.
 */
@injectable()
export class DockerService {
  private readonly CACHE_TTL = 5; // Seconds

  /**
   * Get all containers with advanced metadata
   */
  async getContainers(): Promise<unknown[]> {
    const cacheKey = 'docker:containers:list';
    const cachedData = await getCache<string>(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    try {
      const { stdout } = await execAsync('docker ps -a --format "{{json .}}"');
      const containers = this.parseJsonStdout(stdout);

      await setCache(cacheKey, JSON.stringify(containers), this.CACHE_TTL);
      logger.debug('[DockerService] Containers list refreshed');
      return containers;
    } catch (error: unknown) {
      this.handleError('getContainers', error);
      return [];
    }
  }

  /**
   * Get container stats with millisecond precision
   */
  async getContainerStats(id: string): Promise<unknown> {
    this.validateId(id);
    try {
      const { stdout } = await execAsync(`docker stats ${id} --no-stream --format "{{json .}}"`);
      return JSON.parse(stdout.trim()) as unknown;
    } catch (error: unknown) {
      this.handleError(`getContainerStats(${id})`, error);
      throw error;
    }
  }

  /**
   * Safe container operations (Start/Stop/Restart)
   */
  async startContainer(id: string): Promise<void> {
    this.validateId(id);
    try {
      await execAsync(`docker start ${id}`);
      logger.info(`[DockerService] 🚀 Container ${id} launched successfully`);
    } catch (error: unknown) {
      this.handleError('startContainer', error);
      throw error;
    }
  }

  async stopContainer(id: string): Promise<void> {
    this.validateId(id);
    try {
      await execAsync(`docker stop ${id}`);
      logger.info(`[DockerService] 🛑 Container ${id} halted cleanly`);
    } catch (error: unknown) {
      this.handleError('stopContainer', error);
      throw error;
    }
  }

  async restartContainer(id: string): Promise<void> {
    this.validateId(id);
    try {
      await execAsync(`docker restart ${id}`);
      logger.info(`[DockerService] ♻️  Container ${id} recycled successfully`);
    } catch (error: unknown) {
      this.handleError('restartContainer', error);
      throw error;
    }
  }

  /**
   * Resource inventory (Images/Volumes/Networks)
   */
  async getImages(): Promise<unknown[]> {
    try {
      const { stdout } = await execAsync('docker images --format "{{json .}}"');
      return this.parseJsonStdout(stdout);
    } catch (error: unknown) {
      this.handleError('getImages', error);
      return [];
    }
  }

  async getVolumes(): Promise<unknown[]> {
    try {
      const { stdout } = await execAsync('docker volume ls --format "{{json .}}"');
      return this.parseJsonStdout(stdout);
    } catch (error: unknown) {
      this.handleError('getVolumes', error);
      return [];
    }
  }

  async getNetworks(): Promise<unknown[]> {
    try {
      const { stdout } = await execAsync('docker network ls --format "{{json .}}"');
      return this.parseJsonStdout(stdout);
    } catch (error: unknown) {
      this.handleError('getNetworks', error);
      return [];
    }
  }

  /**
   * Private utilities and security guards
   */
  private parseJsonStdout(stdout: string): unknown[] {
    return stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line) as unknown;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  private validateId(id: string): void {
    // Simple regex to prevent command injection
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error('Invalid Docker resource ID: Security validation failed');
    }
  }

  private handleError(operation: string, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown Docker Error';
    logger.error(`[DockerService] 💥 Failure in ${operation}: ${message}`, { error });
  }
}
