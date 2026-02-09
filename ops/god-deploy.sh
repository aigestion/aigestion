#!/bin/bash
set -e

echo "🚀 Starting GOD MODE Deployment Build"

echo "📦 Installing Monorepo Dependencies..."
pnpm install

echo "📦 Building Design System..."
pnpm --filter @aigestion/design-system-v2 build

echo "📦 Building Website Epic..."
cd frontend/apps/website-epic

# Force production mode
export NODE_ENV=production

echo "🔨 Running Vite Build..."
pnpm build

echo "✅ Build Complete!"
ls -la dist/
