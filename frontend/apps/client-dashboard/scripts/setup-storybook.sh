#!/bin/bash

# 🔥 STORYBOOK SOVEREIGN SETUP
# Configura Storybook con la estética oficial de AIGestion Nexus.

echo "🎨 Iniciando configuración de Storybook Soberano..."

if [ ! -d ".storybook" ]; then
  echo "🚀 Inicializando Storybook..."
  npx storybook@latest init --yes
fi

# Inyectar estilos globales
echo "import '../src/index.css';" > .storybook/preview.ts
echo "import { Preview } from '@storybook/react';" >> .storybook/preview.ts
echo "" >> .storybook/preview.ts
echo "const preview: Preview = {" >> .storybook/preview.ts
echo "  parameters: {" >> .storybook/preview.ts
echo "    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#09090b' }] }," >> .storybook/preview.ts
echo "  }," >> .storybook/preview.ts
echo "};" >> .storybook/preview.ts
echo "" >> .storybook/preview.ts
echo "export default preview;" >> .storybook/preview.ts

echo "✅ Storybook configurado con ADN Soberano."
