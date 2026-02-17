import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { SwarmService } from '../src/services/swarm.service';
import { NewsService } from '../src/services/news.service';
import { SearchService } from '../src/services/search.service';
import { JulesGem } from '../src/services/gems/JulesGem';
import { logger } from '../src/utils/logger';

async function verifyAugmentedRedSwarm() {
  logger.info('--- Verifying Augmented Red Swarm Mission ---');

  const container = new Container();

  // Services
  container.bind(TYPES.SearchService).to(SearchService);
  container.bind(TYPES.NewsService).to(NewsService);
  container.bind(TYPES.SwarmService).to(SwarmService);

  // Mocks for agents that we don't want to run full LLM on (save quota, avoid Gemini 400 error)
  container
    .bind(TYPES.AIService)
    .toConstantValue({ generateContent: async () => 'Daniela Mock Response' } as any);
  container.bind(TYPES.BrowserlessService).toConstantValue({} as any);
  container
    .bind(TYPES.EconomyService)
    .toConstantValue({ getInvestmentAdvice: async () => ({ advice: 'Economy Advice' }) } as any);
  container.bind(TYPES.BigQueryService).toConstantValue({} as any);
  container.bind(TYPES.MemoryService).toConstantValue({} as any);
  container.bind(TYPES.DiscoveryService).toConstantValue({} as any);
  container.bind(TYPES.SandboxService).toConstantValue({} as any);
  container.bind(TYPES.ArbitrationService).toConstantValue({} as any);
  container
    .bind(TYPES.NotebookInsightService)
    .toConstantValue({ analyze: async () => 'Notebook Advice' } as any);
  container
    .bind(TYPES.TreasuryService)
    .toConstantValue({ getSovereignHealth: async () => ({ status: 'Healthy' }) } as any);
  container.bind(TYPES.DeFiStrategistService).toConstantValue({} as any);
  container
    .bind(TYPES.NotionManagerService)
    .toConstantValue({ syncSwarmPlan: async () => {} } as any);
  container.bind(TYPES.RagService).toConstantValue({} as any);

  // Gems
  container.bind(JulesGem).toConstantValue({ generateCanonical: async () => 'Jules Logic' } as any);

  const swarm = container.get<SwarmService>(TYPES.SwarmService);

  // Override wisdomMission to capture the payload
  const originalWisdom = (swarm as any).wisdomMission;
  let capturedPayload = '';

  (swarm as any).wisdomMission = async (payload: string) => {
    capturedPayload = payload;
    return { agentName: 'Mock', result: 'Captured', confidence: 1 };
  };

  try {
    logger.info('🚀 Activating Red Swarm for BTC...');
    await swarm.activateRedSwarm('btc', -10.5, 95000);

    logger.info('--- CAPTURED MISSION PAYLOAD ---');
    console.log(capturedPayload);
    logger.info('-------------------------------');

    if (capturedPayload.includes('LIVE NEWS CONTEXT') && capturedPayload.includes('BTC')) {
      logger.info('✅ SUCCESS: Payload contains asset info and live news context.');
    } else {
      logger.warn('⚠️ WARNING: Payload might be missing critical context.');
    }
  } catch (error: any) {
    logger.error(`❌ Red Swarm Verification Failed: ${error.message}`);
  }
}

verifyAugmentedRedSwarm().catch(console.error);
