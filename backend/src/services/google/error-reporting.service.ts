import { ErrorReporting } from '@google-cloud/error-reporting';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';
import { config } from '../../config/config';

@injectable()
export class ErrorReportingService {
  private errors: ErrorReporting | null = null;

  constructor() {
    if (config.nodeEnv === 'production') {
      try {
        this.errors = new ErrorReporting({
          reportMode: 'always',
          serviceContext: {
            service: 'aigestion-backend',
            version: '1.0.0',
          },
        });
        logger.info('Google Cloud Error Reporting initialized');
      } catch (err) {
        logger.error('Failed to initialize Google Cloud Error Reporting', err);
      }
    }
  }

  /**
   * Report an error to Google Cloud
   */
  public report(err: any, req?: any): void {
    if (this.errors) {
      this.errors.report(err, req);
    } else {
      // Fallback for development or if initialization failed
      logger.error('[ErrorReporting Fallback]:', err);
    }
  }

  /**
   * Report a specific security violation or custom event
   */
  public reportViolation(type: string, details: any): void {
    const error = new Error(`Security Violation: ${type}`);
    (error as any).details = details;

    this.report(error);
  }
}
