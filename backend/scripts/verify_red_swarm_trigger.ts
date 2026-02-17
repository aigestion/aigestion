import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { PriceAlertService } from '../src/services/finance/price-alert.service';
import { SwarmService } from '../src/services/swarm.service';
import { CoinGeckoService } from '../src/services/coingecko.service';
import { WhatsAppCommandService } from '../src/services/whatsapp-command.service';
import { logger } from '../src/utils/logger';

// Simple Mock Factory
const createMock = (name: string) => {
  const fn: any = async (...args: any[]) => {
    fn.mock.calls.push(args);
    return fn.returnValue;
  };
  fn.mock = { calls: [] };
  fn.returnValue = undefined;
  fn.mockResolvedValue = (val: any) => {
    fn.returnValue = val;
  };
  return fn;
};

// Mock dependencies
const mockCoinGecko = {
  getPrices: createMock('getPrices'),
  getGlobalMetrics: createMock('getGlobalMetrics'),
};

const mockWhatsApp = {
  sendAlert: createMock('sendAlert'),
};

const mockSwarm = {
  activateRedSwarm: createMock('activateRedSwarm'),
};

// Set default return for activateRedSwarm to avoid errors if awaited
mockSwarm.activateRedSwarm.mockResolvedValue({
  agentName: 'Sovereign-Wisdom',
  result: 'Protocol Initiated',
  confidence: 1,
});

async function checkTrigger() {
  logger.info('--- Verifying Red Swarm Trigger Logic ---');

  const container = new Container();
  container.bind(TYPES.CoinGeckoService).toConstantValue(mockCoinGecko);
  container.bind(TYPES.WhatsAppCommandService).toConstantValue(mockWhatsApp);
  container.bind(TYPES.SwarmService).toConstantValue(mockSwarm);
  container.bind(TYPES.PriceAlertService).to(PriceAlertService);

  const sniper = container.get<PriceAlertService>(TYPES.PriceAlertService);

  // 1. Establish Baseline
  logger.info('1. Setting Baseline Price ($100,000)');
  mockCoinGecko.getPrices.mockResolvedValue({
    bitcoin: { usd: 100000, usd_24h_change: 0 },
  });
  await sniper.checkPrices(); // First run sets history

  // 2. Simulate Normal Move (-1%)
  logger.info('2. Simulating Normal Fluctuation ($99,000 / -1%)');
  mockCoinGecko.getPrices.mockResolvedValue({
    bitcoin: { usd: 99000, usd_24h_change: -1 },
  });
  await sniper.checkPrices(); // Should NOT trigger anything (Threshold is 5%)

  if (mockSwarm.activateRedSwarm.mock.calls.length === 0) {
    logger.info('✅ No Trigger on -1% drop.');
  } else {
    logger.error('❌ Triggered incorrectly on small drop.');
  }

  // 3. Simulate CRASH (-10%)
  logger.info('3. Simulating MARKET CRASH ($89,100 / -10% from previous)');
  // Note: Previous was 99,000. 10% drop is 9900. Price = 89100.
  mockCoinGecko.getPrices.mockResolvedValue({
    bitcoin: { usd: 89100, usd_24h_change: -10 },
  });
  await sniper.checkPrices();

  // Verify Swarm Call
  if (mockSwarm.activateRedSwarm.mock.calls.length > 0) {
    const callArgs = mockSwarm.activateRedSwarm.mock.calls[0];
    logger.info(`✅ RED SWARM TRIGGERED SUCCESSFULLY!`);
    logger.info(`   Asset: ${callArgs[0]}`);
    logger.info(`   Drop: ${callArgs[1].toFixed(2)}%`);
    logger.info(`   Price: $${callArgs[2]}`);
  } else {
    logger.error('❌ FAILED to trigger Red Swarm on crash.');
  }
}

checkTrigger().catch(console.error);
