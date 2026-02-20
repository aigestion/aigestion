import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { MonitoringService } from './monitoring.service';
import { logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

@injectable()
export class LogMonitoringService {
  private logFilePath: string;
  private isWatching: boolean = false;
  private errorBuffer: string[] = [];
  private lastAnalysisTime: number = 0;
  private readonly ANALYSIS_COOLDOWN = 60000; // 1 minute

  constructor(
    @inject(TYPES.AIService) private aiService: AIService,
    @inject(TYPES.MonitoringService) private monitoringService: MonitoringService
  ) {
    // Default log path
    const today = new Date().toISOString().split('T')[0];
    this.logFilePath = path.join(process.cwd(), 'logs', `nexus-${today}.log`);

    // Fallback if not exists
    if (!fs.existsSync(this.logFilePath)) {
      this.logFilePath = path.join(process.cwd(), 'logs', 'app.log');
    }
  }

  public startMonitoring() {
    if (this.isWatching) return;

    if (!fs.existsSync(this.logFilePath)) {
      logger.warn(`[LogMonitoring] Log file not found: ${this.logFilePath}. Creation pending.`);
      // We could wait or create it, but usually the logger creates it
    }

    logger.info(`[LogMonitoring] Starting real-time observation of ${this.logFilePath}`);

    try {
      let fileSize = fs.existsSync(this.logFilePath) ? fs.statSync(this.logFilePath).size : 0;

      fs.watch(path.dirname(this.logFilePath), (event, filename) => {
        if (filename && (this.logFilePath.includes(filename) || filename === 'app.log')) {
          this.processNewLogs(fileSize);
          // Update file size for next check
          if (fs.existsSync(this.logFilePath)) {
            fileSize = fs.statSync(this.logFilePath).size;
          }
        }
      });

      this.isWatching = true;
    } catch (err) {
      logger.error('[LogMonitoring] Failed to start sentinel watch', err);
    }
  }

  private async processNewLogs(oldSize: number) {
    try {
      const newSize = fs.statSync(this.logFilePath).size;
      if (newSize <= oldSize) return;

      const stream = fs.createReadStream(this.logFilePath, {
        start: oldSize,
        end: newSize
      });

      const rl = readline.createInterface({
        input: stream,
        terminal: false
      });

      for await (const line of rl) {
        if (line.includes('"level":50') || line.includes('ERROR') || line.includes('error')) {
          this.handleDetectedError(line);
        }
      }
    } catch (err) {
      logger.debug('[LogMonitoring] Log processing skip (rotation likely)');
    }
  }

  private handleDetectedError(logLine: string) {
    this.errorBuffer.push(logLine);

    // Performance Guard: Aggregate errors before analyzing
    if (this.errorBuffer.length >= 5 || (Date.now() - this.lastAnalysisTime > this.ANALYSIS_COOLDOWN && this.errorBuffer.length > 0)) {
      this.performAIAnalysis();
    }
  }

  private async performAIAnalysis() {
    const logsToAnalyze = [...this.errorBuffer];
    this.errorBuffer = [];
    this.lastAnalysisTime = Date.now();

    logger.info(`[LogMonitoring] Analyzing ${logsToAnalyze.length} anomalies with Sovereign AI...`);

    const prompt = `Analyze the following system logs and identify:
1. The root cause of the error.
2. Recommended Sovereign Auto-Healing action (e.g., Restart service, Clear Redis, Re-sync DB).
3. Severity (CRITICAL, WARNING).

LOGS:
${logsToAnalyze.join('\n')}

Response format: JSON { "cause": "...", "action": "...", "severity": "..." }`;

    try {
      const analysis = await this.aiService.generateContent(prompt, 'system-sentinel', 'admin');
      logger.warn('[Sovereign Sentinel] AI Insight Detected:', analysis);

      // Parse and report to monitoring
      try {
        const parsed = JSON.parse(analysis.replace(/```json|```/g, ''));
        this.monitoringService.recordMetric('sentinel_anomaly_detected', 1, {
          severity: parsed.severity,
          action: parsed.action
        });

        // This could trigger the actual auto-healing in HealthService
      } catch (e) {
        logger.error('[LogMonitoring] Failed to parse AI insight', e);
      }
    } catch (err) {
      logger.error('[LogMonitoring] AI Analysis failed', err);
    }
  }
}
