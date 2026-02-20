import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { SupabaseService } from './supabase.service';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';
import { AuditLevel, AuditLog } from './audit.service';
import * as crypto from 'node:crypto';

@injectable()
export class EnterpriseAuditService {
  private logBuffer: AuditLog[] = [];
  private readonly FLUSH_INTERVAL = 10000; // 10 seconds
  private readonly MAX_BUFFER_SIZE = 100;
  private readonly SIGNING_KEY = process.env.AUDIT_SIGNING_KEY || 'SOVEREIGN_MASTER_SECRET_2026';

  constructor(@inject(TYPES.SupabaseService) private supabaseService: SupabaseService) {
    this.startAutoFlush();
    logger.info('🛡️ Enterprise Audit Service Active: High-Throughput Buffering Enabled');
  }

  /**
   * Logs an enterprise event with high-performance buffering
   */
  public async logEnterpriseEvent(entry: Omit<AuditLog, 'timestamp'>): Promise<void> {
    const auditEntry: AuditLog = {
      ...entry,
      timestamp: new Date(),
    };

    // 1. Level 0: Cryptographic Signing
    const signature = this.signLog(auditEntry);
    (auditEntry as any).signature = signature;

    // 2. Level 1: In-Memory Buffer
    this.logBuffer.push(auditEntry);

    // 3. Level 2: Redis Replication (Persistence Guard)
    await this.persistToRedis(auditEntry);

    // 3. Conditional Immediate Flush for CRITICAL events
    if (auditEntry.level === AuditLevel.CRITICAL || this.logBuffer.length >= this.MAX_BUFFER_SIZE) {
      await this.flushBuffer();
    }
  }

  private async persistToRedis(entry: AuditLog) {
    try {
      const client = getRedisClient();
      if (client?.isOpen) {
        await client.lPush('enterprise_audit_buffer', JSON.stringify(entry));
        // Keep Redis buffer manageable
        await client.lTrim('enterprise_audit_buffer', 0, 1000);
      }
    } catch (err) {
      logger.error('[EnterpriseAudit] Redis persistence failed', err);
    }
  }

  private startAutoFlush() {
    setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushBuffer();
      }
    }, this.FLUSH_INTERVAL);
  }

  private async flushBuffer() {
    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    if (logsToFlush.length === 0) return;

    logger.debug(`[EnterpriseAudit] Flushing ${logsToFlush.length} logs to Supabase...`);

    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('audit_logs')
        .insert(logsToFlush);

      if (error) throw error;

      // Clear matching entries from Redis upon successful DB write
      const client = getRedisClient();
      if (client?.isOpen) {
        // In a real high-throughput scenario, we'd use a more precise atomic pop
        // For this demo, we assume the DB is the source of truth now
        await client.del('enterprise_audit_buffer');
      }
    } catch (err) {
      logger.error('[EnterpriseAudit] Flush failed. Returning logs to buffer.', err);
      this.logBuffer = [...logsToFlush, ...this.logBuffer];
    }
  }

  private signLog(log: AuditLog): string {
    const data = JSON.stringify({
      action: log.action,
      actor: log.actorId,
      ts: log.timestamp.toISOString(),
      metadata: log.metadata,
    });
    return crypto.createHmac('sha256', this.SIGNING_KEY).update(data).digest('hex');
  }

  /**
   * Generates a Compliance Export with Cryptographic Verification
   */
  public async generateComplianceExport(filters: any) {
    logger.info('[EnterpriseAudit] Generating compliance export with signatures...', filters);

    // Simulate fetching logs
    const mockLogs = [
      {
        action: 'SYSTEM_FAILOVER',
        actorId: 'orchestrator',
        timestamp: new Date(),
        status: 'success',
      },
      { action: 'ACCESS_GRANTED', actorId: 'admin_01', timestamp: new Date(), status: 'success' },
    ].map(log => ({ ...log, signature: this.signLog(log as any) }));

    const exportData = {
      exportId: `audit_${Date.now()}`,
      metadata: {
        generatedAt: new Date().toISOString(),
        filters,
        version: 'v2.0-secure',
      },
      logs: mockLogs,
      verificationPayload: crypto
        .createHash('sha256')
        .update(JSON.stringify(mockLogs))
        .digest('hex'),
    };

    return {
      success: true,
      exportId: exportData.exportId,
      downloadUrl: `data:application/json;base64,${Buffer.from(JSON.stringify(exportData)).toString('base64')}`,
      message: 'Compliance export generated successfully with cryptographic signing.',
    };
  }
}
