// fileCacheHelper.ts
// Helper module for file scanning and caching used by RagService

import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

export interface FileContext {
  path: string;
  content: string;
  size: number;
}

export class FileCacheHelper {
  private readonly rootDir: string;
  private readonly cacheTTL: number = 5 * 60 * 1000; // 5 minutes
  private fileCache: { files: FileContext[]; timestamp: number } | null = null;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  /**
   * Returns all files in the project, using an in‑memory cache.
   */
  async getAllFiles(): Promise<FileContext[]> {
    if (this.fileCache && Date.now() - this.fileCache.timestamp < this.cacheTTL) {
      return this.fileCache.files;
    }
    const files = await this.scanDirectory(this.rootDir);
    this.fileCache = { files, timestamp: Date.now() };
    return files;
  }

  /**
   * Recursively scans a directory, respecting ignored directories and extensions.
   */
  private async scanDirectory(dir: string): Promise<FileContext[]> {
    const ignoredDirs = new Set([
      'node_modules',
      'dist',
      'build',
      '.git',
      '.turbo',
      'coverage',
      'logs',
      '.trunk',
      '.vscode',
      '.idea',
    ]);
    const ignoredExtensions = new Set([
      '.lock', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.map', '.mp4', '.mp3',
    ]);

    let results: FileContext[] = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const promises = entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.rootDir, fullPath);
        if (entry.isDirectory()) {
          if (!ignoredDirs.has(entry.name)) {
            const sub = await this.scanDirectory(fullPath);
            results = results.concat(sub);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (!ignoredExtensions.has(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              results.push({ path: relativePath, content, size: content.length });
            } catch (err: any) {
              logger.warn(`Could not read file ${fullPath}: ${err.message}`);
            }
          }
        }
      });
      await Promise.all(promises);
    } catch (error) {
      logger.error(error, `Failed to scan dir ${dir}:`);
    }
    return results;
  }
}
