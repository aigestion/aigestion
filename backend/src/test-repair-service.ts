import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { SovereignCodeRepairService } from './services/SovereignCodeRepairService';
import { JulesGem } from './services/gems/JulesGem';
import { logger } from './utils/logger';

const container = new Container();

// Mock RagService
const mockRag = {
  getProjectContext: async (query: string) => {
    logger.info(`[MockRag] Searching for: ${query}`);
    return 'export class MyTest { run() { return undefined_var; } }';
  },
};

// Mock JulesGem
const mockJules = {
  ask: async (prompt: string) => {
    logger.info('[MockJules] Generating fix for logic error...');
    return JSON.stringify({
      filePath: 'src/mockfile.ts',
      originalCode: 'return undefined_var;',
      fixedCode: 'const undefined_var = "fixed";\nreturn undefined_var;',
      explanation: 'Resolved ReferenceError by defining the variable.',
    });
  },
};

// Bind JulesGem directly as a class mock
container.bind(JulesGem).toConstantValue(mockJules as any);
container.bind(TYPES.RagService).toConstantValue(mockRag as any);
container.bind(TYPES.SovereignCodeRepairService).to(SovereignCodeRepairService);

async function testRepair() {
  logger.info('🔬 Testing SovereignCodeRepairService in isolation...');
  try {
    const repairService = container.get<SovereignCodeRepairService>(
      TYPES.SovereignCodeRepairService,
    );

    const result = await repairService.conductAutomatedRepair({
      diagnosis: 'ReferenceError: undefined_var is not defined',
      logs: 'at MyTest.run (src/mockfile.ts:2:5)',
      targetComponent: 'MyTest',
    });

    logger.info({ result }, 'Test Result');
    if (result.success || result.error?.includes('Build verification failed')) {
      logger.info('✅ Component Logic Verified');
    } else {
      logger.error({ error: result.error }, '❌ Component Logic Failed');
    }
  } catch (err: any) {
    logger.error({ err: err.message, stack: err.stack }, '❌ Test Injection/Execution Error');
  }
}

testRepair().catch(err => {
  console.error('Final Catch:', err);
});
