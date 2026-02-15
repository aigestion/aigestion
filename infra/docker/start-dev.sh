#!/bin/sh
echo "🚀 [Monorail] Starting AIGestion Full-Stack..."

# Start Frontend
echo "🔵 [Frontend] Booting website-epic..."
pnpm --filter aigestion-website-epic dev &

# Start Backend
echo "🔵 [Backend] Booting nexus-v1-backend..."
pnpm --filter nexus-v1-dashboard-backend dev &

# Keep container alive
wait
