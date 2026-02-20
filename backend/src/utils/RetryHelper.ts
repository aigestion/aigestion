import { logger } from './logger';

export interface RetryOptions {
  retries: number;
  minTimeout: number;
  factor: number;
  onRetry?: (error: any, attempt: number) => void;
}

const DEFAULT_OPTIONS: RetryOptions = {
  retries: 3,
  minTimeout: 1000,
  factor: 2,
};

/**
 * Professional Retry Utility with Exponential Backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 1;
  let delay = config.minTimeout;

  while (attempt <= config.retries + 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt > config.retries) {
        throw error;
      }

      if (config.onRetry) {
        config.onRetry(error, attempt);
      } else {
        logger.warn(
          `[RetryHelper] Attempt ${attempt} failed. Retrying in ${delay}ms... Error: ${
            (error as any).message || error
          }`
        );
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= config.factor;
      attempt++;
    }
  }

  throw new Error('[RetryHelper] Maximum retries exceeded');
}
