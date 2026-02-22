import { inject, injectable } from 'inversify';
import { Message } from 'firebase-admin/messaging';
import * as admin from 'firebase-admin';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { FirebaseService } from './google/firebase.service';
import { SocketService } from './socket.service';

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  channel?: string;
  priority?: 'normal' | 'high';
}

// ──────────────────────────────────────────────────────
// 🌌 NEXUS Push Notification Service
// Sends rich Firebase FCM pushes to sovereign devices
// ──────────────────────────────────────────────────────
@injectable()
export class NexusPushService {
  private fcmTokens = new Map<string, string[]>(); // userId → [tokens]

  constructor(
    @inject(TYPES.FirebaseService) private firebaseService: FirebaseService,
    @inject(TYPES.SocketService) private socketService: SocketService,
  ) {
    logger.info('[NexusPush] 🔔 Sovereign Push Notification Service initialized');
  }

  // ──────────────────────────────────────────────────
  // Token Management
  // ──────────────────────────────────────────────────

  registerToken(userId: string, fcmToken: string): void {
    const existing = this.fcmTokens.get(userId) || [];
    if (!existing.includes(fcmToken)) {
      existing.push(fcmToken);
      this.fcmTokens.set(userId, existing);
      logger.info(`[NexusPush] 📱 FCM token registered for user ${userId}`);
    }
  }

  getTokens(userId: string): string[] {
    return this.fcmTokens.get(userId) || [];
  }

  // ──────────────────────────────────────────────────
  // Core Push Method
  // ──────────────────────────────────────────────────

  async sendToUser(userId: string, payload: PushPayload): Promise<boolean> {
    const tokens = this.getTokens(userId);
    if (tokens.length === 0) {
      logger.debug(`[NexusPush] No FCM tokens for user ${userId}`);
      return false;
    }
    return this.sendMulticast(tokens, payload);
  }

  async sendToToken(fcmToken: string, payload: PushPayload): Promise<boolean> {
    return this.sendMulticast([fcmToken], payload);
  }

  async sendMulticast(tokens: string[], payload: PushPayload): Promise<boolean> {
    if (tokens.length === 0) return false;

    try {
      const messaging = admin.messaging();
      const results = await Promise.allSettled(
        tokens.map(token =>
          messaging.send({
            token,
            notification: {
              title: payload.title,
              body: payload.body,
              ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
            },
            android: {
              priority: 'high',
              notification: {
                channelId: payload.channel || 'nexus_default',
                priority: 'max',
                defaultSound: true,
                defaultVibrateTimings: true,
              },
            },
            data: Object.fromEntries(
              Object.entries(payload.data || {}).map(([k, v]) => [k, String(v)]),
            ),
          } as Message),
        ),
      );

      const successes = results.filter(r => r.status === 'fulfilled').length;
      logger.info(
        { successes, total: tokens.length, title: payload.title },
        '[NexusPush] 🔔 Push notifications sent',
      );
      return successes > 0;
    } catch (error) {
      logger.error(error, '[NexusPush] Failed to send push notifications');
      return false;
    }
  }

  // ──────────────────────────────────────────────────
  // Sovereign Event Notifications
  // ──────────────────────────────────────────────────

  async notifyCallComplete(
    userId: string,
    callerName: string,
    contactName: string,
    summary: string,
  ): Promise<void> {
    await this.sendToUser(userId, {
      title: `📞 Daniela llamó a ${contactName}`,
      body: summary || `Mensaje entregado a ${contactName} de parte de ${callerName}`,
      channel: 'daniela_calls',
      priority: 'high',
      data: { type: 'call_complete', contact: contactName },
    });
  }

  async notifyEconomyAlert(
    userId: string,
    asset: string,
    changePercent: number,
    price: number,
  ): Promise<void> {
    const direction = changePercent > 0 ? '📈' : '📉';
    const sign = changePercent > 0 ? '+' : '';
    await this.sendToUser(userId, {
      title: `${direction} Alerta: ${asset}`,
      body: `${asset} ${sign}${changePercent.toFixed(2)}% · $${price.toLocaleString()}`,
      channel: 'nexus_economy',
      priority: 'high',
      data: { type: 'economy_alert', asset, change: String(changePercent) },
    });
  }

  async notifySystemEvent(
    userId: string,
    event: string,
    severity: 'info' | 'warning' | 'critical',
  ): Promise<void> {
    const icons = { info: 'ℹ️', warning: '⚠️', critical: '🚨' };
    await this.sendToUser(userId, {
      title: `${icons[severity]} NEXUS: ${severity.toUpperCase()}`,
      body: event,
      channel: 'nexus_system',
      priority: severity === 'critical' ? 'high' : 'normal',
      data: { type: 'system_event', severity },
    });
  }

  async notifyTaskComplete(userId: string, taskTitle: string, completedBy: string): Promise<void> {
    await this.sendToUser(userId, {
      title: '✅ Tarea completada',
      body: `"${taskTitle}" completada por ${completedBy}`,
      channel: 'nexus_tasks',
      data: { type: 'task_complete', task: taskTitle },
    });
  }

  async notifyDanielaMessage(userId: string, preview: string): Promise<void> {
    await this.sendToUser(userId, {
      title: '💜 Daniela',
      body: preview,
      channel: 'daniela_messages',
      data: { type: 'daniela_message' },
    });
  }

  // Sovereign Alert with Voice Support
  async sendSovereignAlert(alert: {
    title: string;
    message: string;
    type: string;
    priority: 'normal' | 'high' | 'critical';
    voiceEnabled: boolean;
  }): Promise<void> {
    logger.info({ alert }, '[NexusPush] 🌌 Broadcasting Sovereign Alert');

    // 1. Send FCM Push to all registered tokens
    const allTokens = Array.from(this.fcmTokens.values()).flat();
    if (allTokens.length > 0) {
      await this.sendMulticast(allTokens, {
        title: alert.title,
        body: alert.message,
        data: {
          type: 'sovereign_alert',
          severity: alert.type,
          priority: alert.priority,
          voiceEnabled: String(alert.voiceEnabled),
        },
        priority: alert.priority === 'critical' || alert.priority === 'high' ? 'high' : 'normal',
      });
    }

    // 2. Broadcast via Socket for web players
    this.socketService.emit('sovereign:alert', alert);
  }

  // Test notification for verification
  async sendTestNotification(fcmToken: string): Promise<boolean> {
    return this.sendToToken(fcmToken, {
      title: '🌌 NEXUS God Mode',
      body: 'Push notifications activas. Daniela está en línea.',
      channel: 'nexus_default',
      priority: 'high',
      data: { type: 'test' },
    });
  }
}
