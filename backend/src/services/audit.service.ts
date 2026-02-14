import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import { supabaseService as supabaseGodService } from './supabase.service';
import { telegramService } from './telegram.service';

export enum AuditLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AuditLog {
  timestamp: Date;
  action: string;
  actorId: string;
  target?: string;
  metadata: any;
  level: AuditLevel;
  status: 'success' | 'failure';
}

/**
 * SOVEREIGN AUDIT SERVICE (Sentinel)
 * Engineered for immutable logging and high-fidelity activity monitoring.
 */
@injectable()
export class AuditService {

  /**
   * Dispatches a sentinel log across the sovereign network (DB + Logs + Alerts).
   */
  async log(entry: Omit<AuditLog, 'timestamp'>): Promise<void> {
    const auditEntry: AuditLog = {
      ...entry,
      timestamp: new Date()
    };

    // 1. High-Speed Local Log
    logger.info(`[SENTINEL AUDIT] ${auditEntry.action} | Actor: ${auditEntry.actorId} | Level: ${auditEntry.level}`);

    try {
      // 2. Database Persistence (Immutable Ledger)
      await supabaseGodService.getClient()
        .from('audit_logs')
        .insert([auditEntry]);

      // 3. Critical Escalation
      if (auditEntry.level === AuditLevel.CRITICAL || (auditEntry.level === AuditLevel.HIGH && auditEntry.status === 'failure')) {
        await this.escalateCriticalEvent(auditEntry);
      }
    } catch (error) {
      logger.error('[AuditService] Failed to synchronize sentinel log', error);
      // Fallback: Ensure critical errors are still visible in console at least
      if (auditEntry.level === AuditLevel.CRITICAL) {
          console.error('🛑 CRITICAL AUDIT FAILURE:', auditEntry);
      }
    }
  }

  /**
   * Escalates high-priority threats to the Sovereign Bridge (Telegram).
   */
  private async escalateCriticalEvent(entry: AuditLog): Promise<void> {
    const message = `🚨 *CRITICAL SECURITY ALERT*\n\n` +
      `*Action:* ${entry.action}\n` +
      `*Actor:* \`${entry.actorId}\`\n` +
      `*Status:* ${entry.status.toUpperCase()}\n` +
      `*Device:* \`${entry.metadata.userAgent || 'Unknown'}\`\n` +
      `*Timestamp:* ${entry.timestamp.toISOString()}`;

    await telegramService.sendMessage(message);
  }

  /**
   * Retrieves audit insights for the Command Center.
   */
  async getInsights(limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await supabaseGodService.getClient()
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export const auditService = new AuditService();
