# Finish Architecture Migration
# Run this AFTER the main npm install completes!

Write-Host "🚀 Finalizing Backend Migration..."

# 1. Logging Migration (Winston -> Pino)
Write-Host "📦 Migrating Logging dependencies..."
npm uninstall winston winston-daily-rotate-file @types/winston -w nexus-v1-dashboard-backend
npm install pino pino-pretty pino-http -w nexus-v1-dashboard-backend

# 2. Testing Migration (Jest -> Vitest)
Write-Host "🧪 Migrating Testing dependencies..."
npm uninstall jest ts-jest @types/jest @jest/globals -w nexus-v1-dashboard-backend
npm install vitest unplugin-swc @swc/core -D -w nexus-v1-dashboard-backend

Write-Host "✅ Migration Complete! Run 'npm run lint' and 'npm test' to verify."
