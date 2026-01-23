<#
.SYNOPSIS
    AIGestion - Nexus V1 God Mode Initialization Script.
    Prepares the entire environment for development.
#>

$ErrorActionPreference = "Stop"

Write-Host "🌌 Starting AIGestion / NEXUS God Mode Initialization..." -ForegroundColor Cyan

# 1. Check Prerequisites
Write-Host "🔍 checking prerequisites..." -ForegroundColor Yellow

function Check-Command($cmd) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        Write-Host "✅ $cmd is installed." -ForegroundColor Green
    } else {
        Write-Error "❌ $cmd is not installed. Please install it before continuing."
    }
}

Check-Command "node"
Check-Command "pnpm"
Check-Command "docker"
Check-Command "git"

# 2. Environment Setup
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"

    # Generate a random JWT secret
    $jwt = [System.Guid]::NewGuid().ToString()
    (Get-Content ".env") -replace "JWT_SECRET=.*", "JWT_SECRET=$jwt" | Set-Content ".env"
    Write-Host "✨ Generated new JWT_SECRET." -ForegroundColor Green
} else {
    Write-Host "ℹ️ .env already exists. Skipping..." -ForegroundColor Gray
}

# 3. Install Dependencies
Write-Host "📦 Installing project dependencies via pnpm..." -ForegroundColor Yellow
pnpm install

# 4. Success Dashboard
Write-Host "`n"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 INITIALIZATION COMPLETE - SYSTEM IS AT GOD LEVEL" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`n"
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Populate secrets in your .env file."
Write-Host "  2. Run 'docker-compose up -d' to start databases."
Write-Host "  3. Start dev servers: 'pnpm dev' (from root)."
Write-Host "`n"
Write-Host "Endpoints:" -ForegroundColor Gray
Write-Host "  - UI: http://localhost:5173"
Write-Host "  - API: http://localhost:3000"
Write-Host "  - pgAdmin: http://localhost:5050"
Write-Host "  - RedisInsight: http://localhost:8001"
Write-Host "  - MongoExpress: http://localhost:8081"
Write-Host "`n"
Write-Host "Check TUTORIAL_FULL.md for the complete manual. Happy coding!" -ForegroundColor Cyan
