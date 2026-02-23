import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { NotionManagerService } from './notion-manager.service';
import { SovereignOrchestratorService } from './SovereignOrchestratorService';
import { NeuralHealthService } from './NeuralHealthService';
import { logger } from '../utils/logger';

@injectable()
export class SovereignNotionSync {
    private readonly dashboardPageId: string;

    constructor(
        @inject(TYPES.NotionManagerService) private notionManager: NotionManagerService,
        @inject(TYPES.SovereignOrchestratorService) private orchestrator: SovereignOrchestratorService,
        @inject(TYPES.NeuralHealthService) private healthService: NeuralHealthService,
    ) {
        this.dashboardPageId = process.env.NOTION_OS_PAGE_ID || '';
    }

    /**
     * Triggers a full synchronization of the Sovereign Dashboard in Notion
     */
    async syncDashboard() {
        if (!this.dashboardPageId) {
            logger.warn('[SovereignNotionSync] NOTION_OS_PAGE_ID not found. Skipping sync.');
            return;
        }

        try {
            logger.info('[SovereignNotionSync] Starting Sovereign Dashboard Sync...');

            // 1. Collect Data
            const scalingState = this.orchestrator.getCurrentScalingState();
            const metrics = await this.notionManager.getAIGestionMetrics();
            
            // 2. Clear & Initialize Dashboard
            const timestamp = new Date().toLocaleString('es-ES');
            
            const statusBlocks = [
                NotionManagerService.createDivider(),
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [{ type: 'text', text: { content: '🌌 Sovereign Status | ' + timestamp } }]
                    }
                },
                NotionManagerService.createSovereignCallout(
                    `Replicas: ${scalingState.replicas} | Región: ${scalingState.region} | Tendencia: ${scalingState.loadTrend > 0 ? '🔺' : '🟢'}`,
                    '🚀',
                    'purple_background'
                ),
                NotionManagerService.createSovereignCallout(
                    `Tareas: ${metrics.totalTasks} | Items de Conocimiento: ${metrics.totalContent}`,
                    '🧠',
                    'blue_background'
                ),
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ 
                            type: 'text', 
                            text: { content: 'Estado del Sistema: OPERATIVO - NIVEL DIOS ACTIVADO' },
                            annotations: { bold: true, italic: true }
                        }]
                    }
                }
            ];

            await this.notionManager.appendBlocks(this.dashboardPageId, statusBlocks);

            logger.info('[SovereignNotionSync] Dashboard Sync Complete.');
        } catch (error: any) {
            logger.error(`[SovereignNotionSync] Sync Failed: ${error.message}`);
        }
    }
}
