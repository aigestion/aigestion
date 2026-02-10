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
import { SwarmInternalClient } from '../../services/swarm-internal.client';
import { KnowledgeGraphService } from '../../services/knowledge-graph.service';
import { VaultService } from '../../services/vault.service';
import { deriveMissionKey } from '../../utils/secrets';

const TOKEN_SAFETY_LIMIT = 50000; // Auto-freeze if mission exceeds this estimated limit

export class SwarmProcessor {
  /**
   * Main entry point for processing an autonomous swarm mission.
   */
  public static async process(job: Job): Promise<void> {
    const { objective, userId, missionId, context } = job.data;
    logger.info(
      `[SwarmProcessor] Starting mission [${job.id} / ${missionId}] for user ${userId}: ${objective}`,
    );

    try {
      // Resolve services from the container
      const aiService = container.get<AIService>(TYPES.AIService);
      const missionRepo = container.get<IMissionRepository>(TYPES.MissionRepository);
      const socketService = container.get<SocketService>(TYPES.SocketService);
      const notificationService = container.get<NotificationService>(TYPES.NotificationService);
      const swarmClient = container.get<SwarmInternalClient>(TYPES.SwarmInternalClient);
      const kgService = container.get<KnowledgeGraphService>(TYPES.KnowledgeGraphService);
      const vaultService = container.get<VaultService>(TYPES.VaultService);

      // 0. Update status to PLANNING
      await missionRepo.update(missionId, { status: MissionStatus.PLANNING });
      socketService.emitMissionUpdate(missionId, { status: MissionStatus.PLANNING });

      // 1. Initial Research & Analysis
      logger.info(`[SwarmProcessor] [${job.id}] Phase 1: Planning mission strategy...`);
      const plan = await aiService.generateContent(
        `
                You are the Orchestrator for an autonomous AI agent swarm.
                A user has launched a mission with the following objective: "${objective}".

                Develop a concise step-by-step strategy to accomplish this.
                The system has access to metaverse data, financial yields, and infrastructure metrics.
                The God Mode dashboard is active.

                Respond only with the technical plan.
            `,
        userId,
      );

      await missionRepo.update(missionId, {
        plan,
        status: MissionStatus.EXECUTING,
      });
      socketService.emitMissionUpdate(missionId, { plan, status: MissionStatus.EXECUTING });

      // 2. Execution & Autonomous Research
      logger.info(
        `[SwarmProcessor] [${job.id}] Phase 2: Executing strategy & autonomous research...`,
      );

      let specializedResearch = '';
      const lowerObjective = objective.toLowerCase();

      // Autonomous Decision: Do we need external market research or browsing?
      if (
        lowerObjective.includes('mercado') ||
        lowerObjective.includes('investiga') ||
        lowerObjective.includes('competidor')
      ) {
        logger.info(
          `[SwarmProcessor] [${job.id}] Autonomous decision: Triggering Swarm Engine Research.`,
        );

        try {
          const researchResult = await swarmClient.post('/daniela/market-research', {
            topic: objective,
          });

          specializedResearch = researchResult.report || JSON.stringify(researchResult);
          logger.info(`[SwarmProcessor] [${job.id}] Swarm research completed.`);

          // 2.1 Persist findings to Knowledge Graph (Sovereign Memory)
          await kgService.indexMissionFindings(missionId, objective, specializedResearch);
        } catch (researchError) {
          logger.warn(
            `[SwarmProcessor] [${job.id}] Autonomous research failed (using internal fallback):`,
            researchError,
          );
          specializedResearch = 'Mission proceeded with internal knowledge context.';
        }
      }

      // 3. Final Report (Incorporate research if available)
      logger.info(`[SwarmProcessor] [${job.id}] Phase 3: Compiling final mission report...`);
      const report = await aiService.generateContent(
        `
                The mission objective was: "${objective}".
                The plan was: "${plan}".
                
                Additional Swarm Research Context:
                ${specializedResearch}

                Generate a final summary of results and recommendations for the user.
                Express why this mission strengthens the AIGestion ecosystem.
            `,
        userId,
      );

      // 3.1 Sovereign Guardrails: Anomaly Detection
      const estimatedTokens = (plan?.length || 0) / 4 + (report?.length || 0) / 4;
      if (estimatedTokens > TOKEN_SAFETY_LIMIT) {
        logger.warn(`[SwarmProcessor] [${job.id}] Sovereign Guardrail triggered: Excessive resource usage detected (${estimatedTokens} tokens). Freezing mission.`);
        await missionRepo.update(missionId, { 
          status: MissionStatus.FAILED, 
          error: 'SOVEREIGN_RESOURCE_GUARD: Excessive tokens detected. Mission frozen for audit.' 
        });
        throw new Error('SOVEREIGN_GUARD_FREEZE');
      }

      // 4. Encrypt Findings for Sovereignty
      logger.info(`[SwarmProcessor] [${job.id}] Phase 4: Securing findings in Sovereign Vault...`);

      // Derive Mission-Specific Key via HKDF
      const masterSeed = process.env.JWT_SECRET || 'SOVEREIGN_FALLBACK_SEED'; // In production, derived from user HW key via WebAuthn
      const missionKey = await deriveMissionKey(masterSeed, missionId, userId);

      const encrypted = await vaultService.encrypt(report, missionKey.toString('hex'));

      // 5. Update Final Status with E2EE
      await missionRepo.update(missionId, {
        result: encrypted.ciphertext,
        vaultIV: encrypted.iv,
        vaultTag: encrypted.tag,
        isEncrypted: true,
        status: MissionStatus.COMPLETED,
        completedAt: new Date(),
      });

      socketService.emitMissionUpdate(missionId, {
        result: '[ENCRYPTED_SOVEREIGN_DATA]',
        isEncrypted: true,
        status: MissionStatus.COMPLETED,
      });

      // 5. Create Notification
      await notificationService.createNotification(
        userId,
        NotificationType.MISSION_COMPLETED,
        'Mission Completed',
        `Mission "${objective}" completed successfully.`,
        { missionId, resultPreview: report.substring(0, 100) },
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
          completedAt: new Date(),
        });

        socketService.emitMissionUpdate(missionId, {
          status: MissionStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        await notificationService.createNotification(
          userId,
          NotificationType.MISSION_FAILED,
          'Mission Failed',
          `Mission "${objective}" failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          { missionId, error: error instanceof Error ? error.message : 'Unknown error' },
        );
      } catch (repoError) {
        logger.error(
          '[SwarmProcessor] Failed to update mission failure status/notification:',
          repoError,
        );
      }

      throw error;
    }
  }
}
