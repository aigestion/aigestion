#!/bin/bash

# Script de verificación del Bot de Telegram

echo "🤖 Verificando configuración del Bot de Telegram"
echo "=================================================="

# Verificar variables de entorno
echo ""
echo "📋 Verificando variables de entorno..."

if grep -q "TELEGRAM_BOT_TOKEN=" .env; then
    TOKEN=$(grep "TELEGRAM_BOT_TOKEN=" .env | cut -d'=' -f2)
    echo "✅ TELEGRAM_BOT_TOKEN configurado"
else
    echo "❌ TELEGRAM_BOT_TOKEN no encontrado en .env"
fi

if grep -q "TELEGRAM_CHAT_ID=" .env; then
    CHAT_ID=$(grep "TELEGRAM_CHAT_ID=" .env | cut -d'=' -f2)
    if [ "$CHAT_ID" = "your_chat_id_here" ]; then
        echo "⚠️  TELEGRAM_CHAT_ID no configurado (valor por defecto)"
    else
        echo "✅ TELEGRAM_CHAT_ID configurado: $CHAT_ID"
    fi
else
    echo "❌ TELEGRAM_CHAT_ID no encontrado en .env"
fi

echo ""
echo "📁 Verificando archivos..."

if [ -f "src/services/telegram-bot.handler.ts" ]; then
    echo "✅ TelegramBotHandler existe"
else
    echo "❌ TelegramBotHandler no encontrado"
fi

if [ -f "src/services/telegram.service.ts" ]; then
    echo "✅ TelegramService existe"
else
    echo "❌ TelegramService no encontrado"
fi

echo ""
echo "📝 Verificando configuración del contenedor..."

if grep -q "TelegramBotHandler" src/config/inversify.config.ts; then
    echo "✅ TelegramBotHandler registrado en contenedor"
else
    echo "❌ TelegramBotHandler no registrado"
fi

echo ""
echo "🚀 Para iniciar el bot:"
echo "1. Asegúrate de tener tu TELEGRAM_CHAT_ID en .env"
echo "2. Ejecuta: pnpm run dev"
echo "3. Busca tu bot en Telegram"
echo "4. Envía /start"

echo ""
echo "✨ Listo para usar el bot de Telegram"
