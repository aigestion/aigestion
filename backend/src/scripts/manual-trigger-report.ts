import 'reflect-metadata';
import axios from 'axios';
import { EconomyService } from '../services/economy.service';
import { DeFiStrategistService } from '../services/defi-strategist.service';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

async function sendManualReport() {
  console.log('🚀 Generando y enviando reporte a Telegram...');

  const defiService = new DeFiStrategistService();
  const economyService = new EconomyService(defiService);
  const chatId = env.TELEGRAM_CHAT_ID_DEV || env.TELEGRAM_CHAT_ID;
  const token = env.TELEGRAM_BOT_TOKEN_DEV || env.TELEGRAM_BOT_TOKEN;

  if (!chatId || !token) {
    console.error('❌ Faltan credenciales de Telegram (.env)');
    process.exit(1);
  }

  try {
    // 1. Get Data
    const report = await economyService.generateFormattedReport();
    const adviceData = await economyService.getInvestmentAdvice();

    // 2. Format Message
    const fullMessage = `${report}\n\n${adviceData.advice}`;

    // 3. Send via Telegram API
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: fullMessage,
      parse_mode: 'Markdown',
    });

    console.log(`✅ Reporte enviado correctamente a ${chatId}`);
  } catch (error) {
    console.error('❌ Error enviando reporte:', error);
  }
}

sendManualReport();
