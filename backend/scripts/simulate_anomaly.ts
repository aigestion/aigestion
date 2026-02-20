import * as fs from 'fs';
import * as path from 'path';

/**
 * Sovereign Sentinel Log Simulator
 * This script appends a critical error to the logs to trigger AI analysis.
 */
async function simulateAnomaly() {
  const today = new Date().toISOString().split('T')[0];
  const logDir = path.join(__dirname, '..', 'logs');
  const logFile = path.join(logDir, `nexus-${today}.log`);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const errorLog = {
    level: 50,
    time: Date.now(),
    pid: 1234,
    hostname: 'sentinel-test',
    msg: 'CRITICAL: Database connection pool exhausted. System autarchic fallback engaged. (SIMULATED ERROR)',
    stack: 'Error: ConnectionPoolExhausted\n    at Database.connect (/src/db.ts:42)\n    at ...'
  };

  console.log(`[Sentinel Simulator] Injecting anomaly into ${logFile}...`);
  fs.appendFileSync(logFile, JSON.stringify(errorLog) + '\n');
  console.log('[Sentinel Simulator] Injection complete. Check backend logs for AI analysis output.');
}

simulateAnomaly().catch(console.error);
