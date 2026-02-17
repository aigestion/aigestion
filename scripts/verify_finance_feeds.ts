
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Container } from 'inversify';
import { TYPES } from '../backend/src/types';
import { CoinGeckoService } from '../backend/src/services/coingecko.service';
import { DeFiStrategistService } from '../backend/src/services/defi-strategist.service';
import { Gemini2Service } from '../backend/src/services/gemini-2.service';
import { logger } from '../backend/src/utils/logger';

// Load env
dotenv.config();

// Mock Config if needed
const container = new Container();

// Bind Services
container.bind<CoinGeckoService>(TYPES.CoinGeckoService).to(CoinGeckoService).inSingletonScope();
container.bind<Gemini2Service>(TYPES.Gemini2Service).to(Gemini2Service).inSingletonScope();
container.bind<DeFiStrategistService>(TYPES.DeFiStrategistService).to(DeFiStrategistService).inSingletonScope();

async function runTest() {
    console.log('--- Sovereign Finance Diagnostic ---');

    const coingecko = container.get<CoinGeckoService>(TYPES.CoinGeckoService);
    const strategist = container.get<DeFiStrategistService>(TYPES.DeFiStrategistService);

    try {
        // 1. Test CoinGecko
        console.log('\nTesting CoinGecko Feed...');
        const prices = await coingecko.getPrices();
        console.log('✅ Prices Fetched:', JSON.stringify(prices, null, 2));

        const global = await coingecko.getGlobalMetrics();
        console.log('✅ Global Data:', JSON.stringify(global, null, 2));

        // 2. Test Strategist (AI Analysis)
        console.log('\nTesting DeFi Strategist (Gemini 2.5)...');
        const advice = await strategist.scanYieldOpportunities();
        console.log('✅ Strategic Advice:', JSON.stringify(advice, null, 2));

        const yieldSummary = await strategist.getYieldAdvice();
        console.log('✅ Yield Summary:', JSON.stringify(yieldSummary, null, 2));

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

runTest();
