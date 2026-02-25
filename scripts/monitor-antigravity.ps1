#!/usr/bin/env pwsh

Write-Host "🔍 MONITOR ANTIGRAVITY - PREVENIR ERROR 400" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Verificar estado actual
$processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
$mcpConfigPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"

Write-Host "`nEstado actual:" -ForegroundColor Yellow
Write-Host "Procesos Antigravity: $($processes.Count)" -ForegroundColor White

if (Test-Path $mcpConfigPath) {
    try {
        $config = Get-Content $mcpConfigPath | ConvertFrom-Json
        $serverCount = $config.mcp.servers.PSObject.Properties.Count
        Write-Host "Servidores MCP: $serverCount" -ForegroundColor White
        Write-Host "RealTime enabled: $($config.mcp.enableRealTime)" -ForegroundColor White
        Write-Host "Optimization: $($config.antigravity.optimization)" -ForegroundColor White
    } catch {
        Write-Host "Error leyendo configuracion MCP" -ForegroundColor Red
    }
}

# Alertas
if ($processes.Count -gt 5) {
    Write-Host "`n⚠️  ALERTA: Demasiados procesos ($($processes.Count))" -ForegroundColor Red
    Write-Host "Ejecuta: .\scripts\fix-antigravity-final.ps1" -ForegroundColor Yellow
}

if ($serverCount -gt 3) {
    Write-Host "`n⚠️  ALERTA: Demasiados servidores MCP ($serverCount)" -ForegroundColor Red
    Write-Host "Ejecuta: .\scripts\fix-antigravity-final.ps1" -ForegroundColor Yellow
}

Write-Host "`n✅ Monitoreo completado" -ForegroundColor Green
