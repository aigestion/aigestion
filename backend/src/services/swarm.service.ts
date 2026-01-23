import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AIService } from './ai.service';
import { MetaverseService } from './metaverse.service';
import { DeFiStrategistService } from './defi-strategist.service';
import { InfraOptimizerService } from './infra-optimizer.service';
import { RagService } from './rag.service';
import { logger } from '../utils/logger';
import { JobQueue } from '../infrastructure/jobs/JobQueue';
import { JobName } from '../infrastructure/jobs/job-definitions';
import { IMissionRepository } from '../infrastructure/repository/MissionRepository';
import { MissionStatus } from '../models/Mission';

@injectable()
export class SwarmService {
    constructor(
        @inject(TYPES.AIService) private aiService: AIService,
        @inject(TYPES.MetaverseService) private metaverseService: MetaverseService,
        @inject(TYPES.DeFiStrategistService) private defiService: DeFiStrategistService,
        @inject(TYPES.InfraOptimizerService) private infraService: InfraOptimizerService,
        @inject(TYPES.RagService) private ragService: RagService,
        @inject(TYPES.JobQueue) private jobQueue: JobQueue,
        @inject(TYPES.MissionRepository) private missionRepo: IMissionRepository,
    ) { }

    /**
     * Launches a long-running autonomous mission.
     */
    async createMission(objective: string, userId: string): Promise<any> {
        logger.info(`[SwarmService] Creating mission for user ${userId}: ${objective}`);

        try {
            // 1. Persist the mission in the database
            const mission = await this.missionRepo.create({
                objective,
                userId,
                status: MissionStatus.PENDING
            });

            // 2. Enqueue the background job
            await this.jobQueue.addJob(JobName.SWARM_MISSION, {
                objective,
                userId,
                missionId: mission.id,
                context: {
                    startedAt: new Date().toISOString()
                }
            });

            return {
                status: 'success',
                message: 'Mission launched successfully',
                missionId: mission.id,
                objective
            };
        } catch (error) {
            logger.error('[SwarmService] Failed to launch mission:', error);
            throw error;
        }
    }

    /**
     * Retrieves the status and results of a mission.
     */
    async getMission(id: string): Promise<any> {
        const mission = await this.missionRepo.findById(id);
        if (!mission) {
            throw new Error(`Mission not found: ${id}`);
        }
        return mission;
    }

    /**
     * Provides a consolidated "God State" for the Python Swarm.
     * This allows Python agents to know exactly what tools and data are available in Node.js.
     */
    async getGodState(): Promise<any> {
        try {
            const metaverse = await this.metaverseService.getStatus();
            const defi = await this.defiService.getYieldAdvice();
            const infra = await this.infraService.getInfraRecommendations();

            return {
                timestamp: new Date().toISOString(),
                version: '1.0.0-godmode',
                system_status: 'Sovereign',
                realms: {
                    metaverse: {
                        coordinates: metaverse.coordinates,
                        status: metaverse.offline ? 'offline' : 'active',
                        events: metaverse.activeEvents
                    },
                    finance: {
                        health_score: 85, // Meta-score placeholder
                        outlook: defi.marketSentiment,
                        strategy: defi.strategy
                    },
                    infrastructure: {
                        optimization_level: 'pending',
                        top_recommendation: infra.recommendations[0]?.action || 'None',
                        potential_savings: infra.totalPotentialSavings
                    }
                },
                available_tools: [
                    'query_document_brain',
                    'analyze_financial_yield',
                    'get_metaverse_office_status',
                    'deploy_infra_optimization'
                ]
            };
        } catch (error) {
            logger.error('[SwarmService] Failed to compile God State:', error);
            throw error;
        }
    }

    /**
     * Gateway for the Python Swarm to execute Node.js tools.
     */
    async executeTool(toolName: string, args: any): Promise<any> {
        logger.info(`[SwarmService] Python Swarm requesting tool: ${toolName}`, args);

        try {
            switch (toolName) {
                case 'query_document_brain':
                    const results = await this.ragService.queryKnowledgeBase(args.query);
                    return { status: 'success', data: results };

                case 'analyze_financial_yield':
                    const yieldData = await this.defiService.getYieldAdvice();
                    return { status: 'success', data: yieldData };

                case 'get_metaverse_office_status':
                    const officeStatus = await this.metaverseService.getStatus();
                    return { status: 'success', data: officeStatus };

                case 'deploy_infra_optimization':
                    const infraPlan = await this.infraService.optimize(args.target || 'all');
                    return { status: 'success', data: infraPlan };

                default:
                    logger.warn(`[SwarmService] Unknown tool requested: ${toolName}`);
                    return { status: 'error', message: `Unknown tool: ${toolName}` };
            }
        } catch (error) {
            logger.error(`[SwarmService] Tool execution failed: ${toolName}`, error);
            return { status: 'error', message: error instanceof Error ? error.message : 'Execution failed' };
        }
    }
}
