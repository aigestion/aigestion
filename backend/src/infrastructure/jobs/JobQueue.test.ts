import 'reflect-metadata';
import { JobQueue } from './JobQueue';
import { JobName } from './job-definitions';
import { Queue } from 'bullmq';

// Mock BullMQ Queue
jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      close: jest.fn(),
    })),
    Worker: jest.fn(),
  };
});

// Mock config to enable Redis
jest.mock('../../config/config', () => ({
  config: {
    redis: {
      host: 'localhost',
      port: '6379',
      password: '',
      enabled: true,
    },
  },
}));

describe('JobQueue', () => {
  let jobQueue: JobQueue;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENABLE_REDIS = 'true';
    jobQueue = new JobQueue();
  });

  afterEach(async () => {
    await jobQueue.close();
  });

  it('should initialize queues for all JobNames', () => {
    // We expect the internal map to be populated
    // Since 'queues' is private, we can't check it directly without casting to any or testing behavior.
    // However, the constructor calls new Queue for each JobName.
    expect(Queue).toHaveBeenCalledTimes(Object.keys(JobName).length);
  });

  it('should add a job to the correct queue', async () => {
    const queueInstance = (Queue as unknown as jest.Mock).mock.results[0].value;

    await jobQueue.addJob(JobName.EMAIL_SEND, {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Body',
    });

    expect(queueInstance.add).toHaveBeenCalledWith(
      JobName.EMAIL_SEND,
      {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      },
      undefined
    );
  });
});
