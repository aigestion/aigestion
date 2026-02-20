import 'reflect-metadata';
import { EconomyService } from '../services/economy.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { CoinGeckoService } from '../services/coingecko.service';
import { logger } from '../utils/logger';

import { Gemini2Service } from '../services/gemini-2.service';

async function testAdvice() {
  console.log('🚀 Iniciando prueba de consejos de inversión...');

  const geminiService = new Gemini2Service();
  const coingeckoService = new CoinGeckoService();
  const defiService = new DeFiStrategistService(geminiService, coingeckoService);
  const service = new EconomyService(defiService);

  // Force some mock data/behavior if needed for the test to be impressive
  // For now, we rely on the logic we just wrote

  try {
    const report = await service.generateFormattedReport();
    console.log('\n📊 REPORTE DE MERCADO:');
    console.log(report);

    const advice = await service.getInvestmentAdvice();
    console.log('\n💡 CONSEJO DE INVERSIÓN:');
    console.log(advice.advice);

    console.log('\n🔍 OPORTUNIDADES DETECTADAS:');
    console.log(advice.opportunities);
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testAdvice();
