const { Telegraf } = require('telegraf');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

async function testTelegram() {
  console.log('--- Telegram Diagnostic ---');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  console.log('Token:', token ? '***' + token.slice(-5) : 'MISSING');
  console.log('Chat ID:', chatId);

  if (!token || !chatId) {
    console.error('❌ Token or Chat ID missing in .env');
    return;
  }

  try {
    const bot = new Telegraf(token);
    const me = await bot.telegram.getMe();
    console.log('✅ Bot Verified:', me.username);

    console.log('Sending test message...');
    await bot.telegram.sendMessage(chatId, '🌌 *AIGestion Nexus | Diagnostic Signal*\nSovereign systems are being restored. Connection verified.', {
      parse_mode: 'Markdown',
    });
    console.log('✅ Test message sent successfully!');
  } catch (error) {
    console.error('❌ Telegram Connection Failed!');
    console.error('Error Code:', error.response?.error_code);
    console.error('Description:', error.response?.description);
    console.log('Raw Error:', error.message);
  }
}

testTelegram();
