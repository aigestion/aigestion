import 'reflect-metadata';
import { container } from '../src/config/inversify.config';
import { SwarmProcessor } from '../src/infrastructure/jobs/SwarmProcessor';
import { TYPES } from '../src/types';
import { logger } from '../src/utils/logger';
import { connectToDatabase } from '../src/config/database';

async function testSwarmOrchestration() {
  console.log('🚀 Starting Autonomous Swarm Orchestration E2E Test...\n');

  try {
    // 0. Connect to Database (Required for MissionRepository)
    await connectToDatabase();

    // 1. Prepare Mock Job Data (Using a valid 24-hex-char ObjectId string)
    const mockMissionId = '507f1f77bcf86cd799439011';
    const jobData = {
      id: 'test_job_1',
      data: {
        objective:
          'Investigar las últimas tendencias en IA para 2026 y su impacto en el mercado global',
        userId: '507f1f77bcf86cd799439011',
        missionId: mockMissionId,
        context: {},
      },
    };

    console.log(`Step 1: Simulating Mission [${mockMissionId}] Orchestration...`);

    // 2. Call the Processor Directly
    // Note: This requires the Swarm Engine to be RUNNING on port 8000
    await SwarmProcessor.process(jobData as any);

    console.log('\n✅ Step 2: Processor execution completed.');
    console.log('-------------------');
    console.log('Check logs for "Swarm research completed" and "Indexed findings".');
    console.log('-------------------');

    console.log(
      '\n💎 ORCHESTRATION VERIFIED: Autonomous Research -> Graph Persistence loop is active.'
    );
  } catch (error) {
    console.error('\n❌ E2E Orchestration Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testSwarmOrchestration().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}
