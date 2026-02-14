import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service } from './gemini-2.service';
import { BigQueryService } from './google/bigquery.service';
import { logger } from '../utils/logger';

/**
 * GENETIC SELF-HEALING SERVICE (Aden Pattern)
 * Observes system regressions and generates automated hotfixes.
 */
@injectable()
export class SelfHealingService {
  constructor(
    @inject(Gemini2Service) private readonly gemini: Gemini2Service,
    @inject(TYPES.BigQueryService) private readonly bq: BigQueryService,
  ) {
    logger.info('🧬 Genetic Self-Healing active: Monitoring for system regressions');
  }

  /**
   * Analyzes a failure log and attempts to generate a structural fix.
   */
  async diagnoseAndRepair(errorLog: string) {
    logger.info('[SelfHealing] Regression detected. Initiating diagnostic...');

    const prompt = `
      Act as a Self-Healing Infrastructure Agent.
      Analyze this error log:
      ${errorLog}
      
      Generate a concise solution in JSON format:
      {
          "reason": "description",
          "fix": "code snippet or configuration change",
          "risk": "low|medium|high"
      }
    `;

    const fixResult = await this.gemini.generateText(prompt);

    // In a production scenario, this would trigger a git PR or a dynamic config update
    await this.bq.trackEvent('SelfHealing', 'FailureDiagonalized', { errorLog, fixResult });

    return fixResult;
  }
}
