import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE] SupabaseService
 * High-performance, singleton client for Supabase integration.
 * Features: Automatic instance management, health checks, and secure config validation.
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private readonly client: SupabaseClient;

  private constructor() {
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
          headers: { 'x-application-name': 'aigestion-backend' },
        },
        db: {
          schema: 'public',
        },
      });
      logger.info('[SupabaseService] 🚀 Sovereign Client initialized');
    } else {
      logger.warn(
        '[SupabaseService] ⚠️ Supabase credentials missing. Client is running in DISABLED mode.',
      );
      this.client = null as any;
    }
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
   * Performs an optimized health check against the new Sovereign Schema.
   */
  public async testConnection(): Promise<boolean> {
    try {
      // Check for profiles table
      const { error: profileError } = await this.client
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (profileError) {
        logger.error(`[SupabaseService] ❌ Profiles check failed: ${profileError.message}`);
        return false;
      }

      // Check for documents table (RAG Support)
      const { error: docError } = await this.client
        .from('documents')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (docError) {
        logger.warn(`[SupabaseService] ⚠️ Documents table (RAG) check failed: ${docError.message}`);
      }

      logger.info('[SupabaseService] ✅ Sovereign Schema health check successful');
      return true;
    } catch (err: any) {
      logger.error(
        `[SupabaseService] 💥 Catastrophic failure during God Mode health check: ${err.message}`,
      );
      return false;
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

export const supabaseService = SupabaseService.getInstance();
