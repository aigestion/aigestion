
import 'reflect-metadata';
import { Container } from 'inversify';
import dotenv from 'dotenv';
import path from 'path';
import { TYPES } from '../src/types';
import { logger } from '../src/utils/logger';

// Services
import { Gemini2Service } from '../src/services/gemini-2.service';
import { CoinGeckoService } from '../src/services/coingecko.service';
import { DeFiStrategistService } from '../src/services/defi-strategist.service';

async function main() {
  // 1. Force Load Environment
  const envPath = path.join(__dirname, '../.env');
  const envConfig = dotenv.parse(require('fs').readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }

  console.log('--- Verifying Sovereign Finance Activation ---');
  console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING'}`);

  // 2. Setup Container
  const container = new Container();
  container.bind(TYPES.Gemini2Service).to(Gemini2Service).inSingletonScope();
  container.bind(TYPES.CoinGeckoService).to(CoinGeckoService).inSingletonScope();
  container.bind(TYPES.DeFiStrategistService).to(DeFiStrategistService).inSingletonScope();

  // 3. Initialize Gemini
  const gemini = container.get<Gemini2Service>(TYPES.Gemini2Service);
  await gemini.initialize();

  // 4. Execute DeFi Strategy Scan
  const strategist = container.get<DeFiStrategistService>(TYPES.DeFiStrategistService);

  try {
    console.log('\n🤖 Asking Wolf of Wall Street (Gemini 2.0) for advice...');
    const result = await strategist.scanYieldOpportunities();

    console.log('\n--- Strategic Analysis ---');
    console.log(JSON.stringify(result, null, 2));

    if (result.action && result.action !== 'STABLECOIN_FARM' && result.action !== 'HOLD') {
        // Broad check, basically we want to see if it *could* be something else,
        // but acts mostly to check it didn't crash to the 'catch' block default.
        // The default catch returns action: 'STABLECOIN_FARM' and reasoning: 'Market data unavailable...'
    }

    if (result.reasoning === 'Market data unavailable, defaulting to safety.') {
        console.error('\n❌ FAILED: Service fell back to safety default.');
        process.exit(1);
    } else {
        console.log('\n✅ SUCCESS: Real AI Analysis Generated.');
    }

  } catch (error) {
    console.error('❌ Script failed', error);
    process.exit(1);
  }
}

main();
