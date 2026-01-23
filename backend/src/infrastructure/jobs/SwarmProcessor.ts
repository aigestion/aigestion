import { Job } from 'bullmq';
import { logger } from '../../utils/logger';
import { container } from '../../config/inversify.config';
import { TYPES } from '../../types';
import { AIService } from '../../services/ai.service';
import { IMissionRepository } from '../repository/MissionRepository';
import { MissionStatus } from '../../models/Mission';
import { SocketService } from '../../services/socket.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationType } from '../../models/Notification';

export class SwarmProcessor {
  /**
   * Main entry point for processing an autonomous swarm mission.
   */
  public static async process(job: Job): Promise<void> {
    const { objective, userId, missionId, context } = job.data;
    logger.info(`[SwarmProcessor] Starting mission [${job.id} / ${missionId}] for user ${userId}: ${objective}`);

    try {
      // Resolve services from the container
      const aiService = container.get<AIService>(TYPES.AIService);
      const missionRepo = container.get<IMissionRepository>(TYPES.MissionRepository);
      const socketService = container.get<SocketService>(TYPES.SocketService);
      const notificationService = container.get<NotificationService>(TYPES.NotificationService);

      // 0. Update status to PLANNING
      await missionRepo.update(missionId, { status: MissionStatus.PLANNING });
      socketService.emitMissionUpdate(missionId, { status: MissionStatus.PLANNING });

      // 1. Initial Research & Analysis
      logger.info(`[SwarmProcessor] [${job.id}] Phase 1: Planning mission strategy...`);
      const plan = await aiService.generateContent(`
                You are the Orchestrator for an autonomous AI agent swarm.
                A user has launched a mission with the following objective: "${objective}".

                Develop a concise step-by-step strategy to accomplish this.
                The system has access to metaverse data, financial yields, and infrastructure metrics.
                The God Mode dashboard is active.

                Respond only with the technical plan.
            `, userId);

      // 1.5 Save Plan to DB & update status
      await missionRepo.update(missionId, {
        plan,
        status: MissionStatus.EXECUTING
      });
      socketService.emitMissionUpdate(missionId, { plan, status: MissionStatus.EXECUTING });

      // 2. Execution (Simulated complex steps for now)
      logger.info(`[SwarmProcessor] [${job.id}] Phase 2: Executing strategy...`);
      // Here we would call other services based on the plan.
      // For now, let's just log progress.

      // 3. Final Report
      logger.info(`[SwarmProcessor] [${job.id}] Phase 3: Compiling final mission report...`);
      const report = await aiService.generateContent(`
                The mission objective was: "${objective}".
                The plan was executed.

                Generate a final summary of results and recommendations for the user.
            `, userId);

      // 4. Update Final Status
      await missionRepo.update(missionId, {
        result: report,
        status: MissionStatus.COMPLETED,
        completedAt: new Date()
      });
      socketService.emitMissionUpdate(missionId, { result: report, status: MissionStatus.COMPLETED });

      // 5. Create Notification
      await notificationService.createNotification(
        userId,
        NotificationType.MISSION_COMPLETED,
        'Mission Completed',
        `Mission "${objective}" completed successfully.`,
        { missionId, resultPreview: report.substring(0, 100) }
      );

      logger.info(`[SwarmProcessor] Mission [${job.id}] completed successfully.`);

      // In a real implementation, we might save this results to a DB or notify user via Telegram/Email
    } catch (error) {
      logger.error(`[SwarmProcessor] Mission [${job.id} / ${missionId}] failed:`, error);

      try {
        const missionRepo = container.get<IMissionRepository>(TYPES.MissionRepository);
        const socketService = container.get<SocketService>(TYPES.SocketService);
        const notificationService = container.get<NotificationService>(TYPES.NotificationService);

        await missionRepo.update(missionId, {
          status: MissionStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        });

        socketService.emitMissionUpdate(missionId, {
          status: MissionStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        await notificationService.createNotification(
          userId,
          NotificationType.MISSION_FAILED,
          'Mission Failed',
          `Mission "${objective}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { missionId, error: error instanceof Error ? error.message : 'Unknown error' }
        );
      } catch (repoError) {
        logger.error('[SwarmProcessor] Failed to update mission failure status/notification:', repoError);
      }

      throw error;
    }
  }
}
