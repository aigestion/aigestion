import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.schema';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient;

  private constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      logger.warn('[SupabaseService] SUPABASE_URL or SUPABASE_KEY not set. Service may be limited.');
    }

    this.client = createClient(
      env.SUPABASE_URL || '',
      env.SUPABASE_KEY || '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    logger.info('[SupabaseService] Client initialized');
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
   * Test connection by performing a simple select
   */
  public async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client.from('users').select('count', { count: 'exact', head: true });
      if (error) {
        // If 'users' table doesn't exist yet, this might error, but the connection itself could be fine.
        // However, we just added the SQL for users in the previous step.
        logger.error('[SupabaseService] Connection test failed:', error.message);
        return false;
      }
      logger.info('[SupabaseService] Connection test successful');
      return true;
    } catch (err: any) {
      logger.error('[SupabaseService] Unexpected error during connection test:', err.message);
      return false;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
