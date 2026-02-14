import { injectable } from 'inversify';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE] SupabaseService
 * High-performance, singleton client for Supabase integration.
 * Features: Automatic instance management, health checks, and secure config validation.
 */
@injectable()
export class SupabaseService {
  private static instance: SupabaseService;
  private readonly client: SupabaseClient;

  public constructor() {
    this.validateConfig();

    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_KEY;

    if (url && key) {
      this.client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            'x-application-name': 'aigestion-backend',
            'x-app-version': '2.0.0',
          },
          fetch: this.retryFetch.bind(this),
        },
        db: {
          schema: 'public',
        },
      });
      logger.info('[SupabaseService] 🚀 Sovereign Client initialized (God Mode)');
    } else {
      logger.warn(
        '[SupabaseService] ⚠️ Supabase credentials missing. Client is running in DISABLED mode.',
      );
      this.client = null as any;
    }
  }

  /**
   * Retry fetch with exponential backoff (3 retries, skips 4xx errors).
   */
  private async retryFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const maxRetries = 3;
    const baseDelay = 200;
    const timeout = 30000; // 30s timeout

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }
        if (attempt === maxRetries) return response;

        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      } catch (error: any) {
        if (attempt === maxRetries) throw error;
        logger.warn(`[SupabaseService] Fetch attempt ${attempt + 1} failed: ${error.message}`);
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
      }
    }
    return fetch(input, init);
  }

  private validateConfig() {
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      logger.error('❌ Critical: SUPABASE_URL or SUPABASE_KEY missing from environment.');
      logger.warn(
        '⚠️ [SupabaseService] Running without valid credentials. Some features will be disabled.',
      );
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

  /**
   * Test connection and schema health (GOD MODE)
   * Performs an optimized health check with latency measurement.
   */
  public async testConnection(): Promise<{
    connected: boolean;
    latencyMs: number;
    tables: string[];
  }> {
    try {
      if (!this.client) return { connected: false, latencyMs: -1, tables: [] };

      const start = Date.now();
      const tablesChecked: string[] = [];

      // Check profiles table
      const { error: profileError } = await this.client
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!profileError) tablesChecked.push('profiles');
      else logger.warn(`[SupabaseService] profiles check: ${profileError.message}`);

      // Check documents table (RAG)
      const { error: docError } = await this.client
        .from('documents')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!docError) tablesChecked.push('documents');
      else logger.warn(`[SupabaseService] documents check: ${docError.message}`);

      // Check ai_sessions table
      const { error: sessionError } = await this.client
        .from('ai_sessions')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!sessionError) tablesChecked.push('ai_sessions');

      const latencyMs = Date.now() - start;

      logger.info(
        `[SupabaseService] ✅ Health check: ${tablesChecked.length} tables OK, ${latencyMs}ms`,
      );

      return {
        connected: tablesChecked.length > 0,
        latencyMs,
        tables: tablesChecked,
      };
    } catch (err: any) {
      logger.error(`[SupabaseService] 💥 Health check failed: ${err.message}`);
      return { connected: false, latencyMs: -1, tables: [] };
    }
  }

  /**
   * 🌌 Hybrid Search (Vector + Full Text)
   * Advanced RAG capability for backend operations.
   */
  public async hybridSearch(
    projectId: string | undefined,
    queryText: string,
    embedding: number[],
    threshold: number = 0.5,
    count: number = 5,
  ) {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client.rpc('hybrid_search', {
      query_text: queryText,
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: count,
      p_project_id: projectId,
    });

    if (error) {
      logger.error(`[SupabaseService] ❌ Hybrid search failed: ${error.message}`);
      throw error;
    }
    return data;
  }

  /**
   * 📜 Prompt Template Management
   * Retrieve versioned system prompts.
   */
  public async getPromptTemplate(name: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('prompt_templates')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      logger.error(
        `[SupabaseService] ❌ Failed to fetch prompt template [${name}]: ${error.message}`,
      );
      throw error;
    }
    return data;
  }

  /**
   * 📂 Knowledge Base Operations
   */
  public async upsertDocument(document: any) {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('documents')
      .upsert(document, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      logger.error(`[SupabaseService] ❌ Failed to upsert document: ${error.message}`);
      throw error;
    }
    return data;
  }
}

// REMOVED top-level singleton initialization to prevent circular dependency issues during module loading.
// Services should use SupabaseService.getInstance() or better, rely on Inversify injection.
export const supabaseService = SupabaseService.getInstance();
