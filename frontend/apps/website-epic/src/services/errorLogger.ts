/**
 * Error Logger Service
 * Centralizes error logging and reporting for production monitoring
 * Can be extended to integrate with Sentry, LogRocket, or other services
 */

export interface ErrorLog {
  readonly message: string;
  readonly stack?: string;
  readonly componentStack?: string;
  readonly timestamp: number;
  readonly url: string;
  readonly userAgent: string;
  readonly level: 'error' | 'warning' | 'info';
  readonly context?: Record<string, unknown>;
}

class ErrorLoggerService {
  private logs: ErrorLog[] = [];
  private maxLogs = 50;
  private endpoint: string | null = null;

  constructor() {
    // Configure endpoint from environment if available
    this.endpoint = import.meta.env.VITE_ERROR_LOGGING_ENDPOINT || null;

    // Listen for unhandled errors
    if (typeof globalThis !== 'undefined') {
      globalThis.addEventListener('error', this.handleGlobalError.bind(this));
      globalThis.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
  }

  /**
   * Log an error to the service
   */
  logError(
    error: Error,
    level: 'error' | 'warning' | 'info' = 'error',
    context?: Record<string, unknown>
  ): void {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack || undefined,
      timestamp: Date.now(),
      url: globalThis.location.href,
      userAgent: navigator.userAgent,
      level,
      context,
    } as ErrorLog;

    // Store locally
    this.addToLocalLogs(errorLog);

    // Send to external service if configured
    if (this.endpoint && import.meta.env.PROD) {
      this.sendToExternalService(errorLog).catch(err => {
        console.warn('Failed to send error to logging service:', err);
      });
    }

    // Console logging based on environment
    if (import.meta.env.DEV) {
      console.error('[ErrorLogger]', errorLog);
    }
  }

  /**
   * Log React component errors
   */
  logComponentError(
    error: Error,
    componentStack?: string,
    context?: Record<string, unknown>
  ): void {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack || undefined,
      componentStack,
      timestamp: Date.now(),
      url: globalThis.location.href,
      userAgent: navigator.userAgent,
      level: 'error',
      context: {
        ...context,
        type: 'react-component-error',
      },
    } as ErrorLog;

    this.addToLocalLogs(errorLog);

    if (this.endpoint && import.meta.env.PROD) {
      this.sendToExternalService(errorLog).catch(err => {
        console.warn('Failed to send component error:', err);
      });
    }

    if (import.meta.env.DEV) {
      console.error('[ComponentError]', errorLog);
    }
  }

  /**
   * Handle global window errors
   */
  private handleGlobalError(event: ErrorEvent): void {
    this.logError(new Error(event.message), 'error', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    this.logError(error, 'error', { type: 'unhandled-promise-rejection' });
  }

  /**
   * Add error to local storage with rotation
   */
  private addToLocalLogs(errorLog: ErrorLog): void {
    this.logs.push(errorLog);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for debugging
    try {
      globalThis.localStorage.setItem('error-logs', JSON.stringify(this.logs.slice(-10)));
    } catch (e) {
      // Storage quota exceeded or disabled
    }
  }

  /**
   * Send error to external logging service
   */
  private async sendToExternalService(errorLog: ErrorLog): Promise<void> {
    if (!this.endpoint) return;

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (error) {
      // Silently fail - don't create error loops
      if (import.meta.env.DEV) {
        console.warn('Error sending to logging service:', error);
      }
    }
  }

  /**
   * Get recent error logs (for debugging)
   */
  getRecentLogs(count = 10): ErrorLog[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.logs = [];
    try {
      globalThis.localStorage.removeItem('error-logs');
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Configure external logging endpoint
   */
  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }
}

// Singleton instance
export const errorLogger = new ErrorLoggerService();

// Export convenient logging functions
export const logError = (error: Error, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'error', context);

export const logWarning = (error: Error, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'warning', context);

export const logInfo = (error: Error, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'info', context);

export const logComponentError = (
  error: Error,
  componentStack?: string,
  context?: Record<string, unknown>
) => errorLogger.logComponentError(error, componentStack, context);
