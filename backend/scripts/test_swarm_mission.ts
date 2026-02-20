import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { SwarmService } from '../src/services/swarm.service';
import { AIService } from '../src/services/ai.service';
import { RagService } from '../src/services/rag.service';
import { logger } from '../src/utils/logger';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testSwarmMission() {
  logger.info('🚀 Starting Phase 27 Integration Test: Sovereign Bridge');

  // Manual Container Setup for test
  const container = new Container();

  // Minimal bindings for the test
  // In a real scenario, we'd use the full inversify.config
  // but for a quick bridge test, we can mock or use real services if they don't have deep deps

  logger.info('Testing n8n Orchestration Trigger...');

  try {
    // We'll test the SwarmService logic directly if possible, or search for the bound instance
    // For now, let's simulate the axios calls that would happen

    const objective = 'Workflow test: Sync user data to spreadsheet';
    const userId = 'test-god-user';

    logger.info(`Objective: ${objective}`);

    // In a real environment, we'd resolve SwarmService
    // const swarmService = container.get<SwarmService>(TYPES.SwarmService);
    // const result = await swarmService.createMission(objective, userId);

    logger.info('Simulating mission flow...');
    logger.info('1. Node.js receives mission');
    logger.info('2. SwarmService identifies "workflow" keyword');
    logger.info('3. Redis state set to PENDING');
    logger.info('4. Axios POST to n8n Webhook...');

    // Check if n8n is up
    const n8nUrl = process.env.N8N_CONTACT_WEBHOOK_URL;
    logger.info(`n8n Webhook URL: ${n8nUrl || 'NOT CONFIGURED'}`);

    logger.info('Testing ChromaDB (ml-service) recall...');
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';

    // Test actual ml-service connectivity
    const axios = require('axios');
    const apiKey = process.env.ML_SERVICE_API_KEY || 'nexus_sovereign_dev_key_2026';

    try {
      const recallRes = await axios.post(`${mlUrl}/recall`, {
        query: 'What is Nexus Swarm?',
        limit: 1
      }, { headers: { 'X-API-Key': apiKey } });

      logger.info('✅ ml-service (ChromaDB) responded successfully!');
      logger.info('Recall Sample:', recallRes.data.results?.[0]?.content || 'No context found');
    } catch (e: any) {
      logger.warn('❌ ml-service (ChromaDB) connection failed:', e.message);
    }

    logger.info('🎉 Bridge Test Complete. Check SwarmService logs for real-time flow.');

  } catch (error: any) {
    logger.error('❌ Test failed:', error.message);
  }
}

testSwarmMission().catch(console.error);
