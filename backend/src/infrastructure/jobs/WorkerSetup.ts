import { JobName } from './job-definitions';
import { Worker, Job } from 'bullmq';
import { logger } from '../../utils/logger';
import { container, TYPES } from '../../config/inversify.config';
import { MalwareScannerService } from '../../services/malware-scanner.service';

export class WorkerSetup {
  private static workers: Worker[] = [];

  public static startWorkers() {
    const redisOptions = {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
      password: process.env.REDIS_PASSWORD ?? undefined,
    };

    // Example worker for EMAIL_SEND
    const emailWorker = new Worker(
      JobName.EMAIL_SEND,
      async (job: Job) => {
        logger.info(`Processing email job: ${job.id}`);
        // Logic to send email would go here
        // const { to, subject, body } = job.data;
        // await emailService.send(to, subject, body);
        logger.info(`Email job completed: ${job.id}`);
      },
      { connection: redisOptions }
    );

    emailWorker.on('failed', (job: Job | undefined, err: Error) => {
      logger.error({ err, jobId: job?.id }, 'Job failed');
    });

    this.workers.push(emailWorker);

    // Swarm Mission Worker
    const swarmWorker = new Worker(
      JobName.SWARM_MISSION,
      async (job: Job) => {
        const { SwarmProcessor } = await import('./SwarmProcessor');
        await SwarmProcessor.process(job);
      },
      { connection: redisOptions }
    );

    swarmWorker.on('failed', (job: Job | undefined, err: Error) => {
      logger.error({ err, jobId: job?.id }, 'Swarm mission job failed');
    });

    this.workers.push(swarmWorker);

    // Malware Cleanup Worker
    const malwareWorker = new Worker(
      JobName.MALWARE_CLEANUP,
      async (job: Job) => {
        logger.info(`Starting malware quarantine cleanup job: ${job.id}`);
        const scannerService = container.get<MalwareScannerService>(TYPES.MalwareScannerService);
        await scannerService.cleanupQuarantine();
        logger.info(`Malware quarantine cleanup job completed: ${job.id}`);
      },
      { connection: redisOptions }
    );

    malwareWorker.on('failed', (job: Job | undefined, err: Error) => {
      logger.error({ err, jobId: job?.id }, 'Malware cleanup job failed');
    });

    this.workers.push(malwareWorker);

    // Data Processing Worker
    const dataWorker = new Worker(
      JobName.DATA_PROCESSING,
      async (job: Job) => {
        const { DocumentProcessor } = await import('./DocumentProcessor');
        await DocumentProcessor.process(job);
      },
      { connection: redisOptions }
    );

    dataWorker.on('failed', (job: Job | undefined, err: Error) => {
      logger.error({ err, jobId: job?.id }, 'Data processing job failed');
    });

    this.workers.push(dataWorker);

    logger.info('Workers initialized');
  }

  public static async close() {
    for (const worker of this.workers) {
      await worker.close();
    }
  }
}
