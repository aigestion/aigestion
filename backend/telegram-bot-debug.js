#!/usr/bin/env node

/**
 * Script de diagnóstico para Telegram Bot
 * Ejecutar: node telegram-bot-debug.js
 */

const BOT_TOKEN = '8507984320:AAFgRw_gQOM6uB4wq2-lSQ6vkWzqU-HjMp8';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

console.log('🤖 Diagnóstico del Bot de Telegram');
console.log('==================================\n');

async function checkBotStatus() {
  try {
    console.log('1️⃣  Verificando estado del bot...');
    const response = await fetch(`${API_URL}/getMe`);
    const data = await response.json();

    if (data.ok) {
      console.log('✅ Bot conectado correctamente');
      console.log(`   ID: ${data.result.id}`);
      console.log(`   Nombre: ${data.result.first_name}`);
      console.log(`   Username: @${data.result.username}\n`);
      return true;
    } else {
      console.log('❌ Error en el bot token');
      console.log(`   Respuesta: ${data.description}\n`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error conectando con Telegram API');
    console.log(`   ${error.message}\n`);
    return false;
  }
}

async function getUpdates() {
  try {
    console.log('2️⃣  Buscando mensajes recientes...');
    const response = await fetch(`${API_URL}/getUpdates?limit=5`);
    const data = await response.json();

    if (data.ok) {
      const updates = data.result;
      if (updates.length === 0) {
        console.log('⚠️  No hay mensajes nuevos');
        console.log('   → Envía un mensaje al bot en Telegram\n');
      } else {
        console.log(`✅ Encontrados ${updates.length} mensajes\n`);
        updates.forEach((update, i) => {
          const msg = update.message || update.channel_post;
          if (msg) {
            console.log(`   Mensaje ${i + 1}:`);
            console.log(`   - Chat ID: ${msg.chat.id}`);
            console.log(`   - Usuario: ${msg.from?.first_name || 'Desconocido'}`);
            console.log(`   - Texto: ${msg.text}`);
            console.log(`   - Fecha: ${new Date(msg.date * 1000).toLocaleString()}\n`);
          }
        });
      }
      return updates.length > 0;
    } else {
      console.log('❌ Error obteniendo mensajes');
      console.log(`   ${data.description}\n`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error');
    console.log(`   ${error.message}\n`);
    return false;
  }
}

async function sendTestMessage() {
  try {
    console.log('3️⃣  Enviando mensaje de prueba...');
    const chatId = process.env.TELEGRAM_CHAT_ID || process.argv[2];

    if (!chatId || chatId === 'your_chat_id_here') {
      console.log('⚠️  Chat ID no configurado');
      console.log('   Uso: node telegram-bot-debug.js <CHAT_ID>');
      console.log('   O configura TELEGRAM_CHAT_ID en .env\n');
      return false;
    }

    const response = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🤖 Mensaje de prueba desde AIGestión Backend\n\n✅ Si ves esto, ¡el bot funciona!',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Mensaje enviado exitosamente');
      console.log(`   Chat ID: ${chatId}`);
      console.log(`   Message ID: ${data.result.message_id}\n`);
      return true;
    } else {
      console.log('❌ Error enviando mensaje');
      console.log(`   ${data.description}`);
      if (data.description.includes('chat_id')) {
        console.log('   → Verifica que el Chat ID sea correcto\n');
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Error');
    console.log(`   ${error.message}\n`);
    return false;
  }
}

async function checkWebhookStatus() {
  try {
    console.log('4️⃣  Verificando configuración de webhook...');
    const response = await fetch(`${API_URL}/getWebhookInfo`);
    const data = await response.json();

    if (data.ok) {
      const webhook = data.result;
      if (webhook.url) {
        console.log('⚠️  Bot está en modo webhook');
        console.log(`   URL: ${webhook.url}`);
        console.log('   ℹ️  El backend espera polling (no webhook)\n');
      } else {
        console.log('✅ Bot en modo polling (correcto)\n');
      }
      return true;
    }
  } catch (error) {
    console.log('❌ Error');
    console.log(`   ${error.message}\n`);
  }
}

async function main() {
  const botOk = await checkBotStatus();
  if (!botOk) {
    console.log('❌ El bot token es inválido. No se puede continuar.\n');
    return;
  }

  await getUpdates();
  await checkWebhookStatus();
  await sendTestMessage();

  console.log('📋 Resumen:');
  console.log('===========');
  console.log('✅ = Funcionando');
  console.log('⚠️  = Advertencia');
  console.log('❌ = Error\n');

  console.log('💡 Próximos pasos:');
  console.log('1. Asegúrate de haber enviado /start a tu bot en Telegram');
  console.log('2. Ejecuta: node telegram-bot-debug.js <tu_chat_id>');
  console.log('3. O configura TELEGRAM_CHAT_ID en .env');
  console.log('4. Reinicia el backend: pnpm run dev\n');

  process.exit(0);
}

main().catch(console.error);
