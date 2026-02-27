import { injectable } from 'inversify';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { Pool, PoolClient } from 'pg';
import { getCache, setCache } from '../cache/redis';
import crypto from 'crypto';

/**
 * [GOD MODE SUPREME] SupabaseService
 * Ultra-high-performance, enterprise-grade Supabase integration.
 * Features: Connection pooling, intelligent caching, advanced RAG, real-time monitoring.
 */
@injectable()
export class SupabaseService {
  private static instance: SupabaseService;
  private client!: SupabaseClient;
  private readonly connectionPool: Map<string, any> = new Map();
  private readonly queryCache = new Map<string, { data: any; timestamp: number }>(); // L1 Local Cache
  private readonly performanceMetrics = new Map<string, number[]>();
  private readonly CACHE_TTL = 3600; // 1 hour by default
  private readonly EMBEDDING_CACHE_TTL = 604800; // 7 days for stable embeddings

  public constructor() {
    this.validateConfig();
    this.initializeClient();
    this.setupPerformanceMonitoring();
    this.initializePostgresPool();
  }

  private initializeClient() {
    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_KEY;
    const dbUrl = env.SUPABASE_DB_URL;

    if (url && key) {
      this.client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          flowType: 'pkce',
        },
        global: {
          headers: {
            'x-application-name': 'aigestion-backend',
            'x-app-version': '2.0.0',
            'x-client-type': 'god-mode-supreme',
          },
          fetch: this.enhancedFetch.bind(this),
        },
        db: {
          schema: 'public',
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });

      // Initialize advanced features
      this.initializeRealtimeSubscriptions();
      this.setupConnectionPooling();

      logger.info('[SupabaseService] Supreme Client initialized (God Mode Supreme)');
    } else {
      logger.warn(
        '[SupabaseService] Supabase credentials missing. Client is running in DISABLED mode.',
      );
      this.client = null as any;
      if (env.SUPABASE_DB_URL) {
        logger.warn('[SupabaseService] SUPABASE_DB_URL provided but Supabase client disabled.');
      }
    }
  }

  /**
   * Enhanced fetch with Redis L2 caching and refined retry logic
   */
  private async enhancedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : (input as Request).url || input.toString();
    const cacheKey = `supabase:fetch:${this.generateHash(url + (init?.body || ''))}`;

    // 1. L1 Local Cache Check (Memory)
    const localCached = this.queryCache.get(cacheKey);
    if (localCached && Date.now() - localCached.timestamp < 60000) {
      // 1 minute L1
      this.recordMetric('cache_hit_l1', 1);
      return new Response(JSON.stringify(localCached.data), {
        status: 200,
        headers: { 'x-cache': 'hit-l1' },
      });
    }

    // 2. L2 Redis Cache Check
    try {
      const redisCached = await getCache(cacheKey);
      if (redisCached) {
        this.recordMetric('cache_hit_l2', 1);
        // Populate L1
        this.queryCache.set(cacheKey, { data: redisCached, timestamp: Date.now() });
        return new Response(JSON.stringify(redisCached), {
          status: 200,
          headers: { 'x-cache': 'hit-l2' },
        });
      }
    } catch (err) {
      logger.debug('[SupabaseService] Redis fetch failed, falling back to network');
    }

    const maxRetries = 3;
    const baseDelay = 150;
    const timeout = 20000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
          headers: {
            'x-attempt': (attempt + 1).toString(),
            'x-god-mode': 'supreme',
            ...init?.headers,
          },
        });

        clearTimeout(timeoutId);

        const latency = Date.now() - start;
        this.recordMetric('api_latency', latency);

        // Cache successful GET responses
        if (response.ok && (!init?.method || init.method === 'GET')) {
          const responseData = await response.clone().json();
          // Update L1
          this.queryCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
          // Update L2
          await setCache(cacheKey, responseData, this.CACHE_TTL);
          this.recordMetric('api_call_success', 1);
        }

        if (response.ok) return response;

        // Specialized handling for rate limits or server errors
        if (response.status === 429 || response.status >= 500) {
          if (attempt === maxRetries) return response;
          const retryAfter = response.headers.get('retry-after');
          const delay = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : baseDelay * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, delay + Math.random() * 100));
          continue;
        }

        return response;
      } catch (error: any) {
        if (attempt === maxRetries) throw error;
        this.recordMetric('fetch_error', 1);
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay + Math.random() * 100));
      }
    }
    return fetch(input, init);
  }

  private generateHash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Performance monitoring setup
   */
  private setupPerformanceMonitoring() {
    // Monitor connection health every 30 seconds
    setInterval(() => {
      this.checkConnectionHealth();
    }, 30000);

    // Cleanup cache every hour
    setInterval(() => {
      this.cleanupCache();
    }, 3600000);
  }

  /**
   * Record performance metrics
   */
  private recordMetric(metric: string, value: number) {
    if (!this.performanceMetrics.has(metric)) {
      this.performanceMetrics.set(metric, []);
    }

    const metrics = this.performanceMetrics.get(metric)!;
    metrics.push(value);

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  /**
   * Cache cleanup
   */
  private cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > 3600000) {
        // 1 hour
        this.queryCache.delete(key);
      }
    }
  }

  /**
   * Initialize realtime subscriptions
   */
  private initializeRealtimeSubscriptions() {
    if (!this.client) return;

    // Monitor document changes
    this.client
      .channel('public:documents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload: any) => {
          logger.info(`[SupabaseService] Document change: ${payload.eventType}`, payload);
          this.invalidateCacheForDocument(payload.new?.id);
        },
      )
      .subscribe();

    // Monitor AI sessions
    this.client
      .channel('public:ai_sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_sessions' },
        (payload: any) => {
          logger.info(`[SupabaseService] AI Session change: ${payload.eventType}`, payload);
        },
      )
      .subscribe();
  }

  /**
   * Invalidate cache for specific document
   */
  private invalidateCacheForDocument(documentId: string) {
    for (const [key, value] of this.queryCache.entries()) {
      if (value.data?.id === documentId) {
        this.queryCache.delete(key);
      }
    }
  }

  /**
   * Setup connection pooling
   */
  private setupConnectionPooling() {
    // Supabase client handles its own pooling; we log for visibility
    logger.info('[SupabaseService] Connection pooling configured');
  }

  /**
   * Enhanced connection health check
   */
  private async checkConnectionHealth() {
    try {
      if (!this.client) return;

      const start = Date.now();
      const tablesChecked: string[] = [];

      // Check core tables with optimized queries
      const tables = ['profiles', 'documents', 'ai_sessions'];
      for (const table of tables) {
        try {
          const { error } = await this.client.from(table).select('id').limit(1).maybeSingle();

          if (!error) tablesChecked.push(table);
        } catch (err: any) {
          logger.warn(
            `[SupabaseService] Health check failed for ${table}: ${err?.message || String(err)}`,
          );
        }
      }

      const latency = Date.now() - start;
      this.recordMetric('health_check_latency', latency);

      if (tablesChecked.length === tables.length) {
        logger.info(
          `[SupabaseService] Supreme Health check: ${tablesChecked.length} tables OK, ${latency}ms`,
        );
      } else {
        logger.warn(
          `[SupabaseService] Health check: ${tables.length - tablesChecked.length} tables failed`,
        );
      }
    } catch (err: any) {
      logger.error(`[SupabaseService] Health check failed: ${err?.message || String(err)}`);
      this.recordMetric('health_check_error', 1);
    }
  }

  private validateConfig() {
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      logger.error('Critical: SUPABASE_URL or SUPABASE_KEY missing from environment.');
      logger.warn(
        '[SupabaseService] Running without valid credentials. Some features will be disabled.',
      );
    }
    if (env.SUPABASE_DB_URL) {
      logger.info('[SupabaseService] SUPABASE_DB_URL detected, initializing Postgres pool.');
    }
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  // New method to get a Postgres client from SUPABASE_DB_URL
  private pgPool: Pool | null = null;

  private initializePostgresPool() {
    const dbUrl = env.SUPABASE_DB_URL;
    if (dbUrl) {
      this.pgPool = new Pool({
        connectionString: dbUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      logger.info('[SupabaseService] Postgres pool initialized (God Mode).');
    }
  }

  /**
   * Obtain a Postgres client from the pool. Caller must release the client.
   */
  public async getPostgresClient(): Promise<PoolClient> {
    if (!this.pgPool) {
      throw new Error('Postgres pool not initialized. Ensure SUPABASE_DB_URL is set.');
    }
    return this.pgPool.connect();
  }

  /**
   * Ultimate hybrid search v2
   */
  public async hybridSearchV2(
    projectId: string | undefined,
    queryText: string,
    embedding: number[],
    threshold: number = 0.7,
    count: number = 10,
    searchMode: 'hybrid' | 'vector' | 'fulltext' | 'semantic' = 'hybrid',
  ) {
    if (!this.client) throw new Error('Supabase client not initialized');

    const cacheKey = `supabase:search:${this.generateHash(queryText + (projectId || ''))}`;

    try {
      // 1. Check Cache
      const cached = await getCache(cacheKey);
      if (cached) {
        this.recordMetric('search_cache_hit', 1);
        return cached;
      }

      const { data, error } = await this.client.rpc('hybrid_search_v2', {
        query_text: queryText,
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: count,
        p_project_id: projectId,
        p_metadata_filter: {},
        search_mode: searchMode,
      });

      if (error) {
        logger.error(`[SupabaseService] Hybrid search v2 failed: ${error.message}`);
        throw error;
      }

      // 2. Set Cache (Stable for 10 minutes)
      await setCache(cacheKey, data, 600);

      this.recordMetric('hybrid_search_v2', 1);
      return data;
    } catch (error: any) {
      logger.error(`[SupabaseService] Hybrid search v2 error: ${error?.message || String(error)}`);
      throw error;
    }
  }

  /**
   * Get performance metrics
   */
  /**
   * Upsert a document for RAG
   */
  public async upsertDocument(doc: { title: string; content: string; metadata?: any }) {
    if (!this.client) throw new Error('Supabase client not initialized');

    try {
      const { data, error } = await this.client.from('documents').upsert({
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata || {},
      });

      if (error) {
        logger.error(`[SupabaseService] Upsert document failed: ${error.message}`);
        throw error;
      }

      // Invalidate related caches
      const cacheKey = `supabase:search:${this.generateHash(doc.title)}`;
      await setCache(cacheKey, null, 0);

      return data;
    } catch (error: any) {
      logger.error(`[SupabaseService] Upsert error: ${error.message}`);
      throw error;
    }
  }

  /**
   * [GOD MODE] Batch Upsert Document Engine
   * High-throughput parallel ingestion with resilience.
   */
  public async upsertDocBatch(docs: { title: string; content: string; metadata?: any }[]) {
    if (!this.client || docs.length === 0) return [];

    const BATCH_SIZE = 50;
    const batches = [];

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      batches.push(docs.slice(i, i + BATCH_SIZE));
    }

    logger.info(
      `[SupabaseService] Starting batch upsert of ${docs.length} documents in ${batches.length} chunks.`,
    );

    const results = await Promise.all(
      batches.map(async (batch, idx) => {
        try {
          const { data, error } = await this.client.from('documents').upsert(
            batch.map(d => ({
              title: d.title,
              content: d.content,
              metadata: d.metadata || {},
            })),
          );

          if (error) {
            logger.error(`[SupabaseService] Batch ${idx} failed: ${error.message}`);
            return null;
          }
          return data;
        } catch (err) {
          logger.error(`[SupabaseService] Batch ${idx} catch error:`, err);
          return null;
        }
      }),
    );

    this.recordMetric('batch_upsert_doc', docs.length);
    return results.filter(Boolean);
  }

  public getPerformanceMetrics() {
    const metrics: any = {};
    for (const [key, values] of this.performanceMetrics.entries()) {
      metrics[key] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        recent: values.slice(-10),
      };
    }
    return metrics;
  }

  /**
   * Auto-optimize database
   */
  public async autoOptimize() {
    if (!this.client) return;

    try {
      const { data, error } = await this.client.rpc('auto_optimize');
      if (error) {
        logger.warn(`[SupabaseService] Auto-optimization warning: ${error.message}`);
      } else {
        logger.info(`[SupabaseService] Auto-optimization: ${data}`);
      }
    } catch (err: any) {
      logger.error(`[SupabaseService] Auto-optimization failed: ${err?.message || String(err)}`);
    }
  }

  /**
   * Session performance analytics
   */
  public async analyzeSessionPerformance(days: number = 7) {
    if (!this.client) return;

    try {
      const { data, error } = await this.client.rpc('analyze_session_performance', {
        p_days: days,
      });

      if (error) {
        logger.error(`[SupabaseService] Session analysis failed: ${error.message}`);
        throw error;
      }

      return data;
    } catch (err: any) {
      logger.error(`[SupabaseService] Session analysis error: ${err?.message || String(err)}`);
      throw err;
    }
  }
}

// Initialize singleton instance for dependency injection
export const supabaseService = SupabaseService.getInstance();
