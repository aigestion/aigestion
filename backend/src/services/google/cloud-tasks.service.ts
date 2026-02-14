import { injectable } from 'inversify';
import { CloudTasksClient } from '@google-cloud/tasks';
import { logger } from '../../utils/logger';

/**
 * SOVEREIGN CLOUD TASKS SERVICE
 * Resilient asynchronous execution and deferred processing.
 */
@injectable()
export class CloudTasksService {
  private readonly client: CloudTasksClient;

  constructor() {
    this.client = new CloudTasksClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  /**
   * Schedules a resilient task for deferred execution.
   */
  async scheduleTask(queue: string, url: string, payload: any, scheduleDelaySeconds: number = 0) {
    const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.CLOUDRUN_REGION || 'us-central1';
    const parent = this.client.queuePath(project, location, queue);

    logger.info(`[CloudTasks] Scheduling deferred operation on queue: ${queue}`);

    const task: any = {
      httpRequest: {
        httpMethod: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-Sovereign-Internal-Key': process.env.IA_ENGINE_API_KEY,
        },
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
      },
    };

    if (scheduleDelaySeconds > 0) {
      task.scheduleTime = {
        seconds: scheduleDelaySeconds + Date.now() / 1000,
      };
    }

    try {
      const [response] = await this.client.createTask({ parent, task });
      logger.info(`[CloudTasks] Task successfully dispatched: ${response.name}`);
      return response.name;
    } catch (error) {
      logger.error('[CloudTasks] Resource dispatch failure', error);
      throw error;
    }
  }
}
