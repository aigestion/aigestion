import 'reflect-metadata';
import { AIService } from '../services/ai.service';
import { SwarmInternalClient } from '../services/swarm-internal.client';
import { logger } from '../utils/logger';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';

async function testSwarmMission() {
  console.log('--- Phase 56: Swarm Mission Orchestration Verification ---');

  // Verify internal client first
  const swarmClient = container.get<SwarmInternalClient>(TYPES.SwarmInternalClient);
  try {
    const health = await swarmClient.getStatus();
    console.log('1. IA Engine Health:', health);
  } catch (e: any) {
    console.error('FAILED: IA Engine not reachable. Make sure Python backend is running.');
    process.exit(1);
  }

  const aiService = container.get<AIService>(TYPES.AIService);

  console.log(
    '2. Triggering sovereign mission: "Analyze project architecture and suggest performance improvements"',
  );
  const triggerResult = await aiService.triggerSwarmMission(
    'Analyze project architecture and suggest performance improvements',
  );

  if (!triggerResult.success || !triggerResult.jobId) {
    console.error('FAILED: Mission trigger failed', triggerResult.error);
    process.exit(1);
  }

  const jobId = triggerResult.jobId;
  console.log(`Mission dispatched! Job ID: ${jobId}`);

  console.log('3. Polling for status...');
  let completed = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!completed && attempts < maxAttempts) {
    attempts++;
    console.log(`Attempt ${attempts}/${maxAttempts}...`);

    const statusResult = await aiService.getSwarmJobStatus(jobId);
    console.log(`Status: ${statusResult.status}`);

    if (statusResult.status === 'completed') {
      console.log('SUCCESS: Swarm mission completed!');
      console.info('Result:', JSON.stringify(statusResult.result, null, 2));
      completed = true;
    } else if (statusResult.status === 'failed') {
      console.error('FAILED: Mission failed', statusResult.error);
      process.exit(1);
    } else {
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (!completed) {
    console.warn('TIMEOUT: Mission still in progress after 10 attempts.');
  }

  console.log('--- Verification Finished ---');
}

testSwarmMission().catch(err => {
  console.error('Verification Error:', err);
  process.exit(1);
});
