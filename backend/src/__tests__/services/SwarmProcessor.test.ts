import 'reflect-metadata';
import { SwarmProcessor } from '../../infrastructure/jobs/SwarmProcessor';
import { Job } from 'bullmq';
import { container } from '../../config/inversify.config';
import { TYPES } from '../../types';
import { MissionStatus } from '../../models/Mission';

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock secrets utility
jest.mock('../../utils/secrets', () => ({
  deriveMissionKey: jest.fn().mockResolvedValue(Buffer.from('mock-key')),
}));

const mockAIService = {
  generateContent: jest.fn(),
};
const mockMissionRepo = {
  update: jest.fn(),
};
const mockSocketService = {
  emitMissionUpdate: jest.fn(),
};
const mockNotificationService = {
  createNotification: jest.fn(),
};
const mockVaultService = {
  encrypt: jest.fn().mockResolvedValue({ iv: 'iv', ciphertext: 'cipher', tag: 'tag' }),
};
const mockSwarmClient = {
  post: jest.fn(),
};
const mockKGService = {
  indexMissionFindings: jest.fn(),
};

// Mock container
jest.mock('../../config/inversify.config', () => ({
  container: {
    get: jest.fn(),
  },
}));

describe('SwarmProcessor', () => {
  let mockJob: Partial<Job>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJob = {
      id: 'job-123',
      data: {
        objective: 'Test Mission',
        userId: 'user-1',
        missionId: 'mission-1',
        context: {},
      },
    };

    (container.get as jest.Mock).mockImplementation(type => {
      if (type === TYPES.AIService) return mockAIService;
      if (type === TYPES.MissionRepository) return mockMissionRepo;
      if (type === TYPES.SocketService) return mockSocketService;
      if (type === TYPES.NotificationService) return mockNotificationService;
      if (type === TYPES.VaultService) return mockVaultService;
      if (type === TYPES.SwarmInternalClient) return mockSwarmClient;
      if (type === TYPES.KnowledgeGraphService) return mockKGService;
      return {};
    });
  });

  it('should execute mission lifecycle successfully', async () => {
    // Setup mocks
    mockAIService.generateContent
      .mockResolvedValueOnce('Step 1: Plan') // Planning phase
      .mockResolvedValueOnce('Mission Success Report'); // Final report phase

    // Execute
    await SwarmProcessor.process(mockJob as Job);

    // Verify Planning Phase
    expect(mockMissionRepo.update).toHaveBeenCalledWith('mission-1', {
      status: MissionStatus.PLANNING,
    });
    expect(mockSocketService.emitMissionUpdate).toHaveBeenCalledWith('mission-1', {
      status: MissionStatus.PLANNING,
    });

    // Verify AI Planning
    expect(mockAIService.generateContent).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('Develop a concise step-by-step strategy'),
      'user-1',
    );

    // Verify Executing Phase
    expect(mockMissionRepo.update).toHaveBeenCalledWith('mission-1', {
      plan: 'Step 1: Plan',
      status: MissionStatus.EXECUTING,
    });

    // Verify Final Reporting
    expect(mockAIService.generateContent).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('Generate a final summary'),
      'user-1',
    );

    // Verify Completion
    expect(mockMissionRepo.update).toHaveBeenCalledWith(
      'mission-1',
      expect.objectContaining({
        result: 'cipher',
        vaultIV: 'iv',
        vaultTag: 'tag',
        isEncrypted: true,
        status: MissionStatus.COMPLETED,
        completedAt: expect.any(Date),
      }),
    );

    // Verify Notification — uses positional args:
    // createNotification(userId, type, title, message, metadata)
    expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
      'user-1',
      expect.anything(), // NotificationType.MISSION_COMPLETED enum value
      expect.any(String), // title
      expect.stringContaining('Test Mission'), // message
      expect.objectContaining({ missionId: 'mission-1' }), // metadata
    );
  });

  it('should handle failures and update status to FAILED', async () => {
    const error = new Error('AI Service Down');
    mockAIService.generateContent.mockRejectedValue(error);

    await expect(SwarmProcessor.process(mockJob as Job)).rejects.toThrow('AI Service Down');

    // Verify Failure Update
    expect(mockMissionRepo.update).toHaveBeenCalledWith(
      'mission-1',
      expect.objectContaining({
        status: MissionStatus.FAILED,
        error: 'AI Service Down',
        completedAt: expect.any(Date),
      }),
    );

    // Verify Socket Error Emit
    expect(mockSocketService.emitMissionUpdate).toHaveBeenCalledWith(
      'mission-1',
      expect.objectContaining({
        status: MissionStatus.FAILED,
        error: 'AI Service Down',
      }),
    );

    // Verify Failure Notification — uses positional args:
    // createNotification(userId, type, title, message, metadata)
    expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
      'user-1',
      expect.anything(), // NotificationType.MISSION_FAILED enum value
      expect.any(String), // title
      expect.stringContaining('AI Service Down'), // message
      expect.objectContaining({ missionId: 'mission-1' }), // metadata
    );
  });

  it('should log error when updating failure status fails', async () => {
    const primaryError = new Error('AI Service Down');
    const secondaryError = new Error('DB Update Failed');

    mockAIService.generateContent.mockRejectedValue(primaryError);
    // First update (planning) succeeds (or we can make AI fail immediately so 1st update is skipped?)
    // The code does:
    // 1. MissionRepo.update(PLANNING)
    // 2. AI Service...

    // If AI Service fails, it goes to catch block.
    // inside catch: MissionRepo.update(FAILED)

    // So we want MissionRepo.update to fail ONLY when called with FAILED status, or just generally fail to simulate the catch-catch block.
    // It's easier if we make it fail on the second call?
    // Actually, let's just make it throw when called with user-1 or something?
    // Or using mockImplementation to throw if status is FAILED.

    mockMissionRepo.update.mockImplementation((id, data) => {
      if (data.status === MissionStatus.FAILED) {
        return Promise.reject(secondaryError);
      }
      return Promise.resolve();
    });

    // We expect the PRIMARY error to be thrown, not the secondary one.
    await expect(SwarmProcessor.process(mockJob as Job)).rejects.toThrow('AI Service Down');

    // And we expect the secondary error to be logged
    // We need to import logger to verify this?
    // Or we can rely on console?
    // We mocked logger, let's verify it.
    // We need access to the mocked logger instance.
    // Since we didn't save the mocked logger instance in a variable outside, we can import it.
    const { logger } = require('../../utils/logger');
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to update mission failure status'),
      secondaryError,
    );
  });
});
