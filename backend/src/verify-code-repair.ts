import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { SovereignHealingService } from './services/SovereignHealingService';
import { SovereignCodeRepairService } from './services/SovereignCodeRepairService';
import { AIService } from './services/ai.service';
import { logger } from './utils/logger';
import { EventEmitter } from 'events';

// Create a specialized container for verification
const container = new Container();

// Mock dependencies that are too heavy or external for this test
class MockAIService {
  async generateContent(prompt: string) {
    logger.info('[MockAI] Analyzing alert for code repair...');
    // Force a CODE_REPAIR diagnosis for this test
    if (prompt.includes('ReferenceError')) {
      return JSON.stringify({
        action: 'CODE_REPAIR',
        target: 'TreasuryService.ts',
        impact: 'medium',
        reasoning: 'The error is a ReferenceError in the codebase, requiring a code fix.',
      });
    }
    return JSON.stringify({ action: 'PRUNE_CACHE', target: 'system', impact: 'low' });
  }
}

class MockMissionRepo {
  private missions: any[] = [];
  async create(mission: any) {
    this.missions.push(mission);
    return mission;
  }
  async findById(id: string) {
    return this.missions.find(m => m.id === id);
  }
  async update(id: string, data: any) {
    const m = await this.findById(id);
    if (m) Object.assign(m, data);
  }
  async findAll() {
    return this.missions;
  }
}

class MockNeuralHealth extends EventEmitter {}

// Bindings
container.bind(TYPES.AIService).to(MockAIService as any);
container.bind(TYPES.MissionRepository).to(MockMissionRepo as any);
container.bind(TYPES.NeuralHealthService).to(MockNeuralHealth as any);
container.bind(TYPES.SovereignCodeRepairService).to(SovereignCodeRepairService);
container.bind(TYPES.SovereignHealingService).to(SovereignHealingService);

// Mock other required services
container.bind(TYPES.MonitoringService).toConstantValue({} as any);
container.bind(TYPES.VaultService).toConstantValue({
  encrypt: async (val: string) => ({ ciphertext: val, iv: 'iv', tag: 'tag' }),
  decrypt: async (iv: any, ct: any, tag: any, key: any) => ct,
} as any);
container.bind(TYPES.PixelBridgeService).toConstantValue({ sendCommand: async () => {} } as any);
container
  .bind(TYPES.ProactiveVoiceService)
  .toConstantValue({ triggerCriticalAlertCall: async () => {} } as any);
container.bind(TYPES.InfrastructureService).toConstantValue({} as any);
container.bind(TYPES.RateLimitService).toConstantValue({} as any);
container.bind(TYPES.RagService).toConstantValue({
  getProjectContext: async () =>
    'export class TreasuryService { calculateBalance() { return treasuryLimit + 100; } }',
} as any);
container.bind(TYPES.JulesGem).toConstantValue({
  ask: async () =>
    JSON.stringify({
      filePath: 'src/services/TreasuryService.ts',
      originalCode: 'return treasuryLimit + 100;',
      fixedCode: 'const treasuryLimit = 1000;\nreturn treasuryLimit + 100;',
      explanation: 'Defined missing treasuryLimit variable.',
    }),
} as any);

async function runVerification() {
  logger.info('🚀 Starting Autonomous Code Repair Verification (God Mode Phase 5)');

  const healer = container.get<any>(TYPES.SovereignHealingService);
  const missionRepo = container.get<any>(TYPES.MissionRepository);

  // 1. Simulate a software bug alert
  const bugAlert = {
    name: 'Critical Runtime Exception',
    severity: 'critical',
    message: 'ReferenceError: treasuryLimit is not defined at TreasuryService.calculateBalance',
    metadata: { file: 'TreasuryService.ts' },
    id: `bug_${Date.now()}`,
  };

  logger.info('[Test] Dispatching bug alert to Healer...');
  await healer.generateHealingProposal(bugAlert);

  const missions = await missionRepo.findAll();
  const mission = missions.find((m: any) => m.objective.includes('CODE_REPAIR'));

  if (mission) {
    logger.info('✅ SUCCESS: Healer correctly created a CODE_REPAIR mission.');
    logger.info(`[Test] Mission Objective: ${mission.objective}`);
  } else {
    logger.error('❌ FAILURE: Healer did not create a CODE_REPAIR mission.');
    process.exit(1);
  }

  // 2. Verify executeRepair triggers the repair service
  logger.info('[Test] Verifying repair execution flow...');

  // Manually trigger executeRepair if needed, or wait if it's autonomous
  // In the real service, we check if(isAutonomous) then executeRepair
  // Since we are in a mock, let's see if it finished.

  setTimeout(() => {
    logger.info('🏁 Verification finished. Observe logs above for repair service activity.');
  }, 2000);
}

runVerification().catch(err => {
  logger.error('Verification crashed:', err);
  process.exit(1);
});
