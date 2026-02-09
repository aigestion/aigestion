# God-Level Development Desktop Launcher for AIGestion
# ---------------------------------------------------
# This script sets up the full development environment on the Mini PC.
# It starts required services, opens VS Code, launches browsers, and configures Windows Terminal.

param(
    [switch]$NoDocker,      # Skip Docker compose start
    [switch]$NoVSCode,      # Skip opening VS Code
    [switch]$NoBrowser,     # Skip opening browser UI
    [switch]$NoTerminal     # Skip opening Windows Terminal
)

# 1. Ensure we're in the project root
$projectRoot = "C:\\Users\\Alejandro\\AIGestion"
Set-Location $projectRoot

# 2. Load GodMode utilities (if needed)
$godModeScript = Join-Path $projectRoot "scripts\\GodMode.ps1"
if (Test-Path $godModeScript) {
    Write-Host "Loading GodMode utilities..." -ForegroundColor Cyan
    . $godModeScript -DryRun
}

# 3. Start Docker services (backend, redis, mongo, etc.)
if (-not $NoDocker) {
    Write-Host "Starting Docker compose..." -ForegroundColor Green
    docker compose up -d
    # Give containers a moment to settle
    Start-Sleep -Seconds 5
    Write-Host "Docker containers are up." -ForegroundColor Green
}

# 4. Launch VS Code with the workspace
if (-not $NoVSCode) {
    Write-Host "Opening VS Code..." -ForegroundColor Yellow
    code .
}

# 5. Open the main web UI in the default browser
# 5️⃣ Navegador (frontend) - Integration with ChromeGodMode
if (-not $NoBrowser) {
    $chromeLauncher = Join-Path $projectRoot "scripts\ChromeGodMode.ps1"
    if (Test-Path $chromeLauncher) {
        Write-Host "Launching Chrome God Mode..." -ForegroundColor Magenta
        . $chromeLauncher
    }
    else {
        $frontendUrl = "http://localhost:3000"
        Write-Host "Chrome launcher not found. Opening default browser at $frontendUrl" -ForegroundColor Yellow
        Start-Process $frontendUrl
    }
}

# 6. Windows Terminal (opcional) – bloque desactivado por problemas de quoting
# Si deseas abrir terminales manualmente, usa los siguientes comandos:
#   wt new-tab pwsh -NoLogo -NoProfile -Command "Set-Location '$projectRoot'; npm run dev"
#   wt new-tab pwsh -NoLogo -NoProfile -Command "Set-Location '$projectRoot'; docker logs -f aigestion-backend"
#   wt new-tab pwsh -NoLogo -NoProfile -Command "Set-Location '$projectRoot'; docker logs -f aigestion-frontend-v2"
Write-Host "⚠️ Windows Terminal launch desactivado. Usa -NoTerminal o abre manualmente." -ForegroundColor Yellow

Write-Host "✅ God‑Level Development Desktop is ready!" -ForegroundColor Green
