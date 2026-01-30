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
  private client: SupabaseClient;

  private constructor() {
    this.validateConfig();

    this.client = createClient(
      env.SUPABASE_URL || '',
      env.SUPABASE_KEY || '',
      {
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
      }
    );

    logger.info('[SupabaseService] 🚀 Sovereign Client initialized');
  }

  private validateConfig() {
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      logger.error('❌ Critical: SUPABASE_URL or SUPABASE_KEY missing from environment.');
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Supabase configuration is required in production');
      }
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
   * Test connection and schema health
   * Performs an optimized health check against the Supabase edge.
   */
  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.client.from('users').select('id').limit(1).maybeSingle();

      if (error) {
        logger.error(`[SupabaseService] ❌ Health check failed: ${error.message}`);
        return false;
      }

      logger.info('[SupabaseService] ✅ Health check successful');
      return true;
    } catch (err: any) {
      logger.error(`[SupabaseService] 💥 Catastrophic failure during health check: ${err.message}`);
      return false;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
