import 'reflect-metadata';
import { EconomyService } from '../services/economy.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';

async function run() {
  console.log('--- TEST START ---');
  const defiService = new DeFiStrategistService();
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
