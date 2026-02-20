import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { DanielaEnhancedService } from './daniela-enhanced.service';
import { NeuralHealthService } from './NeuralHealthService';
import { TelegramService } from './telegram.service';

@injectable()
export class DanielaProactiveService {
  private reportInterval: NodeJS.Timeout | null = null;

  constructor(
    @inject(TYPES.DanielaEnhancedService) private readonly daniela: DanielaEnhancedService,
    @inject(TYPES.NeuralHealthService) private readonly healthService: NeuralHealthService,
    @inject(TYPES.TelegramService) private readonly telegram: TelegramService
  ) {
    this.startProactiveMonitoring();
  }

  private startProactiveMonitoring() {
    logger.info('🚀 Daniela Proactive Monitoring (Sovereign Watch) active.');

    // 1. Scheduled Health Summaries (Every 4 hours)
    this.reportInterval = setInterval(() => {
      void this.generateScheduledReport();
    }, 1000 * 60 * 60 * 4);

    // 2. Event-based Critical Alerts
    this.healthService.on('healthWarning', (metrics) => {
      void this.handleCriticalPulse(metrics);
    });
  }

  private async generateScheduledReport() {
    logger.info('🧠 Daniela is synthesizing a scheduled health report...');
    const message = "Genera un reporte ejecutivo breve del estado actual del sistema basándote en los últimos diagnósticos.";
    const report = await this.daniela.processMessage(message, 'system-cron');

    // Broadcast to Telegram/Admin channel
    await this.telegram.sendMessage(process.env.TELEGRAM_PRO_CHAT_ID || '', `[SYSTEM REPORT] 🧠 Daniela Intelligence:\n\n${report}`);
  }

  private async handleCriticalPulse(metrics: any) {
    const alertMessage = `⚠️ ALERTA CRÍTICA: Se ha detectado una anomalía en el pulso soberano. Sanity: ${metrics.sanityScore.toFixed(2)}%. Ejecuta protocolo de contención.`;
    const response = await this.daniela.processMessage(alertMessage, 'system-alert');

    await this.telegram.sendMessage(process.env.TELEGRAM_PRO_CHAT_ID || '', `🚨 ALERT-EXEC:\n\n${response}`);
  }

  public stop() {
    if (this.reportInterval) clearInterval(this.reportInterval);
  }
}
