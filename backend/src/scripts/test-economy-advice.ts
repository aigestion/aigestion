import 'reflect-metadata';
import { EconomyService } from '../services/economy.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { logger } from '../utils/logger';

async function testAdvice() {
  console.log('🚀 Iniciando prueba de consejos de inversión...');

  const defiService = new DeFiStrategistService();
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
