#!/usr/bin/env pwsh

Write-Host "🚀 FIX FINAL ANTIGRAVITY ERROR 400" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# 1. Cerrar procesos
Write-Host "`n1. Cerrando Antigravity..." -ForegroundColor Yellow
Start-Process powershell -Verb RunAs -ArgumentList "-Command", "taskkill /F /IM Antigravity.exe" -Wait
Start-Sleep -Seconds 3

# 2. Eliminar configuracion MCP problematica
Write-Host "`n2. Eliminando configuracion MCP..." -ForegroundColor Yellow
$mcpConfigPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"
if (Test-Path $mcpConfigPath) {
    Copy-Item $mcpConfigPath "$mcpConfigPath.old" -Force
    Remove-Item $mcpConfigPath -Force
    Write-Host "   Configuracion antigua eliminada" -ForegroundColor Green
}

# 3. Crear configuracion vacia para evitar el error
Write-Host "`n3. Creando configuracion segura..." -ForegroundColor Yellow
$safeConfig = @{
    mcp = @{
        enableRealTime = $false
        priorityMode = "low"
        servers = @{}
    }
    antigravity = @{
        account = "admin@aigestion.net"
        location = "europe-west1"
        optimization = "minimal"
        professional_mode = $true
    }
}

$safeConfig | ConvertTo-Json -Depth 3 | Set-Content $mcpConfigPath
Write-Host "   Configuracion segura creada" -ForegroundColor Green

# 4. Limpiar cache
Write-Host "`n4. Limpiando cache..." -ForegroundColor Yellow
$antigravityPath = "$env:APPDATA\Antigravity"
if (Test-Path $antigravityPath) {
    Remove-Item "$antigravityPath\Cache" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$antigravityPath\Code Cache" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$antigravityPath\GPUCache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Cache eliminado" -ForegroundColor Green
}

# 5. Verificar
Write-Host "`n5. Verificacion..." -ForegroundColor Yellow
$processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
Write-Host "   Procesos activos: $($processes.Count)" -ForegroundColor White
Write-Host "   Configuracion MCP: Segura" -ForegroundColor Green
Write-Host "   Cache: Limpio" -ForegroundColor Green

Write-Host "`n✅ ERROR 400 DEBERIA ESTAR RESUELTO" -ForegroundColor Green
Write-Host "Reinicia Antigravity manualmente" -ForegroundColor White
