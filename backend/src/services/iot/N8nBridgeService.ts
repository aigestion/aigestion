import { injectable } from 'inversify';
import axios from 'axios';
import { logger } from '../../utils/logger';

/**
 * 🔗 N8N BRIDGE SERVICE
 * Triggers N8N workflows from the Nexus backend.
 * Bridges sensor events, IoT data, and system events to N8N automation.
 */

export interface N8nWebhookPayload {
  event: string;
  source: string;
  timestamp: string;
  data: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

export interface N8nTriggerResult {
  success: boolean;
  workflowId?: string;
  executionId?: string;
  error?: string;
}

@injectable()
export class N8nBridgeService {
  private readonly n8nBaseUrl: string;
  private readonly n8nWebhookUrl: string;

  constructor() {
    this.n8nBaseUrl = process.env.N8N_BASE_URL || 'http://aigestion-n8n:5678';
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || `${this.n8nBaseUrl}/webhook`;
    logger.info('[N8nBridge] 🔗 N8N Bridge Service initialized');
  }

  /**
   * Triggers a specific N8N workflow by its webhook path.
   */
  async triggerWorkflow(webhookPath: string, data: Record<string, any>): Promise<N8nTriggerResult> {
    const url = `${this.n8nWebhookUrl}/${webhookPath}`;

    try {
      logger.info({ webhookPath }, '[N8nBridge] Triggering N8N workflow');

      const response = await axios.post(
        url,
        {
          source: 'nexus_backend',
          timestamp: new Date().toISOString(),
          ...data,
        },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      logger.info(
        { webhookPath, status: response.status },
        '[N8nBridge] Workflow triggered successfully',
      );

      return {
        success: true,
        executionId: response.data?.executionId,
      };
    } catch (error: any) {
      logger.error({ webhookPath, error: error.message }, '[N8nBridge] Failed to trigger workflow');
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Sends a Pixel sensor event to the N8N general sensor webhook.
   */
  async sendSensorEvent(
    eventType: string,
    sensorData: Record<string, any>,
  ): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('pixel-sensor-event', {
      event: eventType,
      source: 'pixel_sensor',
      sensorData,
    });
  }

  /**
   * Sends a zone transition event (arrival/departure).
   */
  async sendZoneTransition(
    zone: string,
    direction: 'enter' | 'leave',
    context: Record<string, any> = {},
  ): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('zone-transition', {
      event: `zone_${direction}`,
      zone,
      direction,
      ...context,
    });
  }

  /**
   * Triggers the morning briefing workflow.
   */
  async triggerMorningBriefing(sensorContext: Record<string, any>): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('morning-briefing', {
      event: 'morning_briefing',
      context: sensorContext,
    });
  }

  /**
   * Triggers the daily fitness summary workflow.
   */
  async triggerFitnessSummary(stats: Record<string, any>): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('fitness-summary', {
      event: 'daily_fitness',
      stats,
    });
  }

  /**
   * Sends a battery alert to N8N for notification routing.
   */
  async sendBatteryAlert(
    level: number,
    state: string,
    temperature?: number,
  ): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('battery-alert', {
      event: 'battery_alert',
      batteryLevel: level,
      batteryState: state,
      temperature,
      priority: level <= 10 ? 'critical' : 'high',
    });
  }

  /**
   * Sends an incoming call event for N8N to prepare context.
   */
  async sendIncomingCall(callInfo: Record<string, any>): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('incoming-call', {
      event: 'incoming_call',
      priority: 'high',
      ...callInfo,
    });
  }

  /**
   * Sends a deep synchronization of the physical context level.
   */
  async sendDeepContextSync(context: Record<string, any>): Promise<N8nTriggerResult> {
    return this.triggerWorkflow('context-sync', {
      event: 'context_sync',
      source: 'pixel_sensor',
      context,
    });
  }

  /**
   * Health check for N8N connectivity.
   */
  async healthCheck(): Promise<{ connected: boolean; url: string }> {
    try {
      await axios.get(`${this.n8nBaseUrl}/healthz`, { timeout: 5000 });
      return { connected: true, url: this.n8nBaseUrl };
    } catch {
      return { connected: false, url: this.n8nBaseUrl };
    }
  }
}
