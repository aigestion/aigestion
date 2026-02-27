#!/bin/bash

# 🔥 PROTOCOLO NUKE-IT - AIGESTION NEXUS
# Uso: ./scripts/nuke-it.sh
# ¡Peligro! Limpieza nuclear del entorno.

echo "⚠️ ADVERTENCIA: Iniciando Protocolo Nuke-It..."
echo "Esta acción eliminará node_modules, dist, y cachés en todo el monorepo."
sleep 2

# Eliminar node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
echo "✅ node_modules eliminados."

# Eliminar carpetas build/dist
find . -name "dist" -type d -prune -exec rm -rf '{}' +
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
echo "✅ Artefactos de build eliminados."

# Limpiar caché de pnpm
pnpm store prune
echo "✅ Caché de pnpm limpiada."

echo "🚀 Protocolo Completado. Ejecuta 'pnpm install' para reconstruir el Nexus."
