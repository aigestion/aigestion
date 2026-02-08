import { injectable } from 'inversify';
import { CircuitBreakerFactory } from '../infrastructure/resilience/CircuitBreakerFactory';
import { logger } from '../utils/logger';

export enum CloudProvider {
  GCP = 'gcp',
  AWS = 'aws',
}

@injectable()
export class CloudFailoverService {
  private currentProvider: CloudProvider = CloudProvider.GCP;
  private breaker: any;

  constructor() {
    // Circuit Breaker monitors GCP health. If it opens, we failover.
    this.breaker = CircuitBreakerFactory.create(async () => this.checkGCPHealth(), {
      name: 'GCP-Health-Check',
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });

    this.breaker.on('open', () => this.triggerFailover(CloudProvider.AWS));
    this.breaker.on('close', () => this.triggerFailover(CloudProvider.GCP));
  }

  /**
   * returns the current active cloud provider.
   */
  public getCurrentProvider(): CloudProvider {
    return this.currentProvider;
  }

  /**
   * Executes a critical operation with automatic failover logic.
   * @param gcpFn Function to execute on GCP
   * @param awsFn Function to execute on AWS
   */
  public async execute<T>(gcpFn: () => Promise<T>, awsFn: () => Promise<T>): Promise<T> {
    if (this.currentProvider === CloudProvider.AWS) {
      return awsFn();
    }

    try {
      // Attempt GCP via breaker
      return await this.breaker.fire();
    } catch (error) {
      logger.warn(`[Failover] GCP call failed, attempting fallback to AWS. Error: ${error}`);
      // Force failover state? Maybe not for single error, but breaker handles state.
      // For now, simple fallback execution:
      return awsFn();
    }
  }

  private async checkGCPHealth(): Promise<boolean> {
    // In a real app, ping a GCP metadata server or health endpoint.
    // Simulation: Random failure chance if enabled?
    // True = Healthy
    return true;
  }

  private triggerFailover(to: CloudProvider) {
    if (this.currentProvider !== to) {
      logger.warn(
        `[CloudFailover] 🚨 SWITCHING CLOUD PROVIDER: ${this.currentProvider.toUpperCase()} -> ${to.toUpperCase()}`,
      );
      this.currentProvider = to;
    }
  }
}
