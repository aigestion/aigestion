# 🌌 Sovereign Knowledge Sync to Notion
# Version: 1.0.0 (Nexus Nexus)

Write-Host "🚀 Initializing Sovereign Knowledge Sync..." -ForegroundColor Cyan

$BackendPath = "C:\Users\Alejandro\Aigestion\backend"
$ScriptPath = "src\scripts\sync_knowledge_notion.ts"

if (-not (Test-Path "$BackendPath\$ScriptPath")) {
    Write-Error "❌ Backend script not found at $BackendPath\$ScriptPath"
    exit 1
}

Set-Location $BackendPath

Write-Host "🧠 Analyzing Neural Brain Items..." -ForegroundColor Magenta

# Requires ts-node to be installed or available via npx
# Using pnpm if available as it aligns with the monorepo standards
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm exec ts-node $ScriptPath
} else {
    npx ts-node $ScriptPath
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Sync Successful. Notion Dashboard updated with Neural Brain metadata." -ForegroundColor Gold
} else {
    Write-Host "❌ Sync Failed. Check backend logs for details." -ForegroundColor Red
}
