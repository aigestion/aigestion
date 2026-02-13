import 'reflect-metadata';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { MonitoringService } from '../services/monitoring.service';
import { SovereignHealingService } from '../services/SovereignHealingService';
import { logger } from '../utils/logger';

async function triggerHealingTest() {
  console.log('🚀 Starting Sovereign Healing Loop Verification...');

  const monitoringService = container.get<MonitoringService>(TYPES.MonitoringService);
  const healingService = container.get<SovereignHealingService>(TYPES.SovereignHealingService);

  // 1. Record a critical metric to trigger an alert
  console.log('📡 Recording critical memory metric (95%)...');
  await monitoringService.recordMetric('memory_usage', 95, { type: 'heap' }, '%', 'gauge');

  // 2. Wait for the audit cycle (or trigger it manually for the test)
  console.log('🔍 Triggering manual health audit...');
  await healingService.auditSystemHealth();

  console.log('✅ Audit triggered. Check the Sovereign Intelligence Hub for the healing proposal.');
  process.exit(0);
}

triggerHealingTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
