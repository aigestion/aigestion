import { injectable } from 'inversify';
import { BigQuery } from '@google-cloud/bigquery';
import { logger } from '../../utils/logger';

/**
 * SOVEREIGN BIGQUERY SERVICE
 * Enterprise-grade data warehousing and trend analysis.
 */
@injectable()
export class BigQueryService {
  private readonly bq: BigQuery;
  private readonly datasetId: string = 'aigestion_analytics';
  private readonly tableId: string = 'ai_events_tracing';

  constructor() {
    this.bq = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  /**
   * Tracks a high-fidelity event into the Sovereign Warehouse.
   */
  async trackEvent(agentName: string, action: string, metadata: any) {
    logger.debug(`[BigQuery] Ingesting event node: ${agentName} - ${action}`);
    try {
      const rows = [
        {
          timestamp: BigQuery.timestamp(new Date()),
          agent: agentName,
          action: action,
          metadata: JSON.stringify(metadata),
          environment: process.env.NODE_ENV || 'production',
        },
      ];

      await this.bq.dataset(this.datasetId).table(this.tableId).insert(rows);
    } catch (error) {
      // Non-blocking error for performance
      logger.warn(`[BigQuery] Ingestion latency/fault: ${error.message}`);
    }
  }

  /**
   * Performs deep trend analysis using SQL.
   */
  async runDeepTrendQuery(query: string) {
    logger.info('[BigQuery] Executing Sovereign SQL Analysis...');
    try {
      const options = {
        query: query,
        location: 'US',
      };
      const [job] = await this.bq.createQueryJob(options);
      const [rows] = await job.getQueryResults();
      return rows;
    } catch (error) {
      logger.error('[BigQuery] Analytical query fault', error);
      throw error;
    }
  }

  /**
   * Health Check: Verifies dataset accessibility.
   */
  async checkHealth() {
    try {
      const [exists] = await this.bq.dataset(this.datasetId).exists();
      return exists ? 'ready' : 'down';
    } catch (err) {
      return 'error';
    }
  }
}
