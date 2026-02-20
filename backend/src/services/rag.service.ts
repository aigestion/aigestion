import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { injectable, inject } from 'inversify';

const execAsync = promisify(exec);

import { logger } from '../utils/logger';
import { pineconeService } from './pinecone.service';
import { supabaseService } from './supabase.service';
import { TYPES } from '../types';
import { SovereignVaultService } from './SovereignVaultService';
import { withRetry } from '../utils/RetryHelper';

interface FileContext {
  path: string;
  content: string;
  size: number;
}

// Basic simulation of TF-IDF / BM25 components
interface SearchResult {
  file: FileContext;
  score: number;
  metadata: {
    keywordScore: number;
    semanticScore: number;
    matches: string[];
  };
}

interface RagSearchResult {
  query: string;
  results: Array<{
    content: string;
    metadata: {
      source: string;
      filename: string;
      type: string;
      [key: string]: any;
    };
    distance?: number;
  }>;
}

@injectable()
export class RagService {
  private readonly rootDir: string;
  private readonly maxContextSize: number = 100000; // ~25k tokens (safe limit)
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes
  private cache: { data: string; timestamp: number } | null = null;
  private fileCache: { files: FileContext[]; timestamp: number } | null = null;

  private readonly ignoredDirs = new Set([
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

  private readonly ignoredExtensions = new Set([
    '.lock',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.pdf',
    '.zip',
    '.map',
    '.mp4',
    '.mp3',
  ]);

  constructor(@inject(TYPES.SovereignVaultService) private readonly vault: SovereignVaultService) {
    this.rootDir = path.resolve(__dirname, '../../../');
  }

  /**
   * Scans the codebase and returns a formatted string of the context.
   * Uses in-memory caching and prepends an ASCII tree of the project structure.
   * If query is provided, performs a Hybrid Search simulation to prioritize relevant files.
   * ALSO queries the Sovereign Vault service for documentation context.
   */
  async getProjectContext(query?: string): Promise<string> {
    try {
      logger.info(`[RagService] Getting context${query ? ` for query: "${query}"` : ' (full)'}...`);

      let context = '';

      // 1. Run File Scan and Database Query in parallel
      const [files, vaultResults] = await Promise.all([
        this.getAllFiles(),
        query && query.trim().length > 0 ? this.vault.query(query) : Promise.resolve(null),
      ]);

      // 2. Generate ASCII Tree (always useful for structure)
      const filePaths = files.map(f => f.path);
      const asciiTree = this.generateAsciiTree(filePaths);

      context += `Project Structure:\n${asciiTree}\n\n`;

      let sortedFiles = files;

      // [GOD MODE] Use Rust-powered rag-core if query is provided
      if (query && query.trim().length > 0) {
        context += `[Code Context optimized for query: "${query}"]\n\n`;

        try {
          const rustResults = await this.queryRustCore(query);
          if (rustResults && rustResults.length > 0) {
            logger.info(
              `[RagService] Rust RagCore provided ${rustResults.length} optimized results.`,
            );
            sortedFiles = rustResults;
          } else {
            sortedFiles = this.rankFiles(files, query!);
          }
        } catch (err) {
          logger.warn(`[RagService] Rust RagCore failed, falling back to JS ranking: ${err}`);
          sortedFiles = this.rankFiles(files, query!);
        }

        // Append Sovereign Vault Context (Unified Memory)
        if (vaultResults && vaultResults.length > 0) {
          context += `[Sovereign Vault - Unified Memory Banks]\n`;
          vaultResults.forEach((res, i) => {
            context += `--- Memory Item ${i + 1} [Source: ${res.source.toUpperCase()}] ---\n${
              res.content
            }\n\n`;
          });
        }

        const localContext = await this.queryLocalMemory(query!);
        if (localContext) {
          context += `[Local Neural Memory (NeuroCore)]\n${localContext}\n\n`;
        }
      } else {
        context += `[Full Context - No Query Provided]\n\n`;
        // Default sort by path if no query to maintain stability
        sortedFiles.sort((a, b) => a.path.localeCompare(b.path));
      }

      context += `Here is the codebase context:\n\n`;
      let currentSize = context.length;

      // 4. Context Stuffing with Limit
      let includedCount = 0;
      for (const file of sortedFiles) {
        const fileBlock = `<file path="${file.path}">\n${file.content}\n</file>\n\n`;

        if (currentSize + fileBlock.length > this.maxContextSize) {
          context += `\n<!-- Context truncated due to size limit (${this.maxContextSize} chars). Included ${includedCount} of ${sortedFiles.length} files. -->`;
          break;
        }

        context += fileBlock;
        currentSize += fileBlock.length;
        includedCount++;
      }

      return context;
    } catch (error) {
      logger.error(error, 'Error in RagService:');
      return ''; // Fail gracefully
    }
  }

  /**
   * Public interface to query the knowledge base (Vector DB documentation).
   * Migrated to SovereignVaultService for unified discovery.
   */
  async queryKnowledgeBase(query: string): Promise<string | null> {
    const results = await this.vault.query(query);

    if (!results || results.length === 0) return null;

    return results
      .map(
        (res, i) =>
          `[Source: ${res.source.toUpperCase()} | Score: ${res.score.toFixed(2)}]\n${res.content}`,
      )
      .join('\n\n');
  }

  /**
   * Ingests a new document into the Sovereign Vault.
   */
  async ingestDocument(filename: string, content: string, tags: string[] = []): Promise<void> {
    logger.info(`[RagService] Forwarding ingestion to SovereignVault: ${filename}`);
    await this.vault.ingest(filename, content, tags);
  }

  /**
   * Specifically archives data to the local NeuroCore ML service.
   */
  private async archiveToLocalMemory(
    content: string,
    filename: string,
    tags: string[] = [],
  ): Promise<void> {
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://ml-service:5000';
      const apiKey = process.env.ML_SERVICE_API_KEY || 'LOCAL_DEV_SECRET_KEY_REPLACE_ME';
      await axios.post(
        `${mlServiceUrl}/archive`,
        {
          content,
          source: filename,
          tags,
        },
        { headers: { 'X-API-Key': apiKey } },
      );
      logger.info(`[RagService] Document archived to local NeuroCore: ${filename}`);
    } catch (error: any) {
      logger.warn(`[RagService] Failed to archive to local NeuroCore: ${error.message}`);
    }
  }

  /**
   * Queries the local NeuroCore ML service (ChromaDB) for neural embeddings search.
   * [Sovereign Bridge] This is the primary local memory layer.
   */
  private async queryLocalMemory(query: string): Promise<string | null> {
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
      const apiKey = process.env.ML_SERVICE_API_KEY || 'nexus_sovereign_dev_key_2026';

      return await withRetry(
        async () => {
          logger.debug(
            `[RagService] Recalling from NeuroCore (ChromaDB): ${query.substring(0, 30)}...`,
          );
          const response = await axios.post(
            `${mlServiceUrl}/recall`,
            { query, limit: 5 },
            {
              headers: { 'X-API-Key': apiKey },
              timeout: 5000,
            },
          );

          const results = response.data.results;
          if (results && results.length > 0) {
            logger.info(`[RagService] Recalled ${results.length} results from ChromaDB`);
            return results
              .map(
                (res: any, i: number) =>
                  `[Local Neural Memory Match ${i + 1}] Source: ${res.metadata?.source || 'unknown'}\n${res.content}`,
              )
              .join('\n\n');
          }
          return null;
        },
        { retries: 2, minTimeout: 500 },
      );
    } catch (error: any) {
      logger.warn(`[RagService] Failed to query local NeuroCore: ${error.message}`);
      return null;
    }
  }

  /**
   * Queries the direct Pinecone Vector DB for relevant documentation.
   */
  private async queryVectorDb(query: string): Promise<string | null> {
    try {
      logger.info(`[RagService] Querying Pinecone Vector DB for: "${query}"`);

      const results = await pineconeService.search(query, { topK: 3 });

      if (results && results.length > 0) {
        let docStr = '';
        results.forEach((res, index) => {
          const filename = res.metadata?.filename || 'unknown';
          const content = res.metadata?.text || '';
          docStr += `--- Document ${index + 1} (${filename}) ---\n${content}\n\n`;
        });
        return docStr.trim();
      }
      return null;
    } catch (error: any) {
      // Log but don't crash
      logger.warn(`[RagService] Failed to query Pinecone Vector DB: ${error.message}`);
      return `<!-- Failed to retrieve documentation context from Pinecone: ${error.message} -->`;
    }
  }

  private async getAllFiles(): Promise<FileContext[]> {
    if (this.fileCache && Date.now() - this.fileCache.timestamp < this.cacheTTL) {
      return this.fileCache.files;
    }

    const files = await this.scanDirectory(this.rootDir);
    this.fileCache = {
      files,
      timestamp: Date.now(),
    };
    return files;
  }

  /**
   * Ranks files using a simulated Hybrid Search (Keyword + Structural).
   * Calculates a simple score based on:
   * 1. Path/Filename match (Structural/Semantic proxy)
   * 2. Content keyword frequency (TF proxy)
   */
  private rankFiles(files: FileContext[], query: string): FileContext[] {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(t => t.length > 2);
    if (terms.length === 0) return files;

    const results: SearchResult[] = files.map(file => {
      let keywordScore = 0;
      let semanticScore = 0;
      const matches: string[] = [];
      const contentLower = file.content.toLowerCase();
      const pathLower = file.path.toLowerCase();

      terms.forEach(term => {
        // Structural Score: Filename matches are high signal
        if (pathLower.includes(term)) {
          semanticScore += 10;
          matches.push(`path:${term}`);
        }

        // Keyword Score: Simple frequency count in content
        const regex = new RegExp(this.escapeRegExp(term), 'g');
        const count = (contentLower.match(regex) || []).length;
        if (count > 0) {
          keywordScore += count;
        }
      });

      const finalKeywordScore = keywordScore > 0 ? Math.log(1 + keywordScore) : 0;
      const totalScore = semanticScore * 2 + finalKeywordScore;

      return {
        file,
        score: totalScore,
        metadata: { keywordScore: finalKeywordScore, semanticScore, matches },
      };
    });

    const relevantFiles = results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.file);

    const otherFiles = files.filter(f => !relevantFiles.includes(f));
    return [...relevantFiles, ...otherFiles];
  }

  private escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async scanDirectory(dir: string): Promise<FileContext[]> {
    let results: FileContext[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.rootDir, fullPath);

        if (entry.isDirectory()) {
          if (!this.ignoredDirs.has(entry.name)) {
            const subResults = await this.scanDirectory(fullPath);
            results = results.concat(subResults);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (!this.ignoredExtensions.has(ext)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              results.push({
                path: relativePath,
                content: content,
                size: content.length,
              });
            } catch (err: any) {
              logger.warn(`Could not read file ${fullPath}: ${err.message}`);
            }
          }
        }
      }
    } catch (error) {
      logger.error(error, `Failed to scan dir ${dir}:`);
    }

    return results;
  }

  /**
   * Generates a simple ASCII tree from a list of relative file paths.
   */
  private generateAsciiTree(paths: string[]): string {
    const tree: any = {};
    for (const p of paths) {
      const parts = p.split(path.sep);
      let current = tree;
      for (const part of parts) {
        current[part] = current[part] || {};
        current = current[part];
      }
    }

    return this.printTree(tree);
  }

  private printTree(node: any, prefix = ''): string {
    const keys = Object.keys(node).sort();
    let result = '';

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;
      const connector = isLast ? '└── ' : '├── ';

      result += `${prefix}${connector}${key}\n`;

      const children = node[key];
      if (Object.keys(children).length > 0) {
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        result += this.printTree(children, childPrefix);
      }
    }
    return result;
  }

  /**
   * [GOD MODE] Invokes the Rust RagCore binary for extreme performance.
   */
  private async queryRustCore(query: string): Promise<FileContext[]> {
    const binPath = path.resolve(__dirname, '../../rag-core/target/release/rag-core.exe');
    const rootPath = this.rootDir;

    const cmd = `"${binPath}" --root "${rootPath}" --query "${query}" --limit 25`;
    const { stdout } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 });
    const results = JSON.parse(stdout);

    return results.map((res: any) => ({
      path: res.path,
      content: res.content,
      size: res.content.length,
    }));
  }

  /**
   * Queries the sovereign Supabase Hybrid Search knowledge base.
   */
  private async querySupabaseKnowledge(query: string): Promise<string | null> {
    try {
      logger.info(`[RagService] Querying Supabase Sovereign DB for: "${query}"`);

      // Mock embedding (768d) - In production you would use gemini or openai here
      const mockEmbedding = new Array(768).fill(0).map(() => Math.random());

      const results = await supabaseService.hybridSearchV2(
        undefined, // All projects
        query,
        mockEmbedding,
        0.3,
        3,
      );

      if (results && results.length > 0) {
        return results
          .map(
            (res: any, i: number) =>
              `[Sovereign Match ${i + 1}] Title: ${res.title}\n${res.content}`,
          )
          .join('\n\n');
      }
      return null;
    } catch (error: any) {
      logger.warn(`[RagService] Failed to query Supabase Sovereign DB: ${error.message}`);
      return null;
    }
  }
}

// REMOVED manual instantiation to break circular dependency and support constructor injection via Inversify
// export const ragService = new RagService();
