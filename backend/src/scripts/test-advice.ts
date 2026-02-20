import 'reflect-metadata';
import { EconomyService } from '../services/economy.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { CoinGeckoService } from '../services/coingecko.service';

import { Gemini2Service } from '../services/gemini-2.service';

async function run() {
  console.log('--- TEST START ---');
  const geminiService = new Gemini2Service();
  const coingeckoService = new CoinGeckoService();
  const defiService = new DeFiStrategistService(geminiService, coingeckoService);
  const service = new EconomyService(defiService);

  console.log('Fetching Advice...');
  try {
    const advice = await service.getInvestmentAdvice();
    console.log('ADVICE:', advice.advice);
    console.log('SENTIMENT:', advice.sentiment);
    console.log('OPPORTUNITIES:', advice.opportunities);
  } catch (error) {
    console.error('ERROR:', error);
  }
  console.log('--- TEST END ---');
}

run();
