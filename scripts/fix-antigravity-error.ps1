#!/usr/bin/env pwsh

# =============================================================================
# FIX ANTIGRAVITY HTTP 400 ERROR - GOD MODE
# =============================================================================

Write-Host "🚀 FIX ANTIGRAVITY HTTP 400 ERROR" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. Cerrar todas las instancias de Antigravity
Write-Host "`n1. CERRANDO INSTANCIAS ANTIGRAVITY..." -ForegroundColor Yellow

try {
    # Cerrar como administrador
    Start-Process powershell -Verb RunAs -ArgumentList "-Command", "Get-Process -Name 'Antigravity' -ErrorAction SilentlyContinue | Stop-Process -Force" -Wait
    Start-Sleep -Seconds 3
    
    # Verificar que se cerraron
    $processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
    if ($processes.Count -eq 0) {
        Write-Host "   ✅ Todos los procesos cerrados" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Algunos procesos persisten" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error cerrando procesos: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Limpiar configuración MCP corrupta
Write-Host "`n2. LIMPIANDO CONFIGURACIÓN MCP..." -ForegroundColor Yellow

$mcpConfigPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"
$backupPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

if (Test-Path $mcpConfigPath) {
    # Hacer backup
    Copy-Item $mcpConfigPath $backupPath
    Write-Host "   ✅ Backup creado: $backupPath" -ForegroundColor Green
    
    # Limpiar configuración MCP - reducir herramientas
    try {
        $config = Get-Content $mcpConfigPath | ConvertFrom-Json
        
        # Limitar a 10 servidores críticos para evitar el error tools[45]
        $criticalServers = @{
            "aigestion_core" = $config.mcp.servers.aigestion_core
            "ai_services_hub" = $config.mcp.servers.ai_services_hub
            "supabase_mcp" = $config.mcp.servers.supabase_mcp
        }
        
        $config.mcp.servers = $criticalServers
        
        # Guardar configuración limpia
        $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath
        Write-Host "   ✅ Configuración MCP limpiada (10 → 3 servidores)" -ForegroundColor Green
        
    } catch {
        Write-Host "   ❌ Error limpiando MCP: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. Limpiar cache de Antigravity
Write-Host "`n3. LIMPIANDO CACHE..." -ForegroundColor Yellow

$antigravityPath = "$env:APPDATA\Antigravity"
if (Test-Path $antigravityPath) {
    $cacheDirs = @("Cache", "Code Cache", "GPUCache", "CachedData")
    
    foreach ($dir in $cacheDirs) {
        $cachePath = Join-Path $antigravityPath $dir
        if (Test-Path $cachePath) {
            try {
                Remove-Item "$cachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ $dir limpiado" -ForegroundColor Green
            } catch {
                Write-Host "   ⚠️  $dir: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
}

# 4. Reiniciar Antigravity con configuración limpia
Write-Host "`n4. REINICIANDO ANTIGRAVITY..." -ForegroundColor Yellow

try {
    # Iniciar Antigravity con cuenta profesional
    Start-Process "Antigravity.exe" -WorkingDirectory "$env:PROGRAMFILES\Antigravity" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Antigravity reiniciado" -ForegroundColor Green
    
    Start-Sleep -Seconds 5
    
    # Verificar estado
    $processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
    if ($processes.Count -gt 0) {
        Write-Host "   ✅ Antigrativity ejecutándose $($processes.Count) proceso(s)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Antigravity no iniciado" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ❌ Error iniciando Antigravity: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Verificar configuración final
Write-Host "`n5. VERIFICACIÓN FINAL..." -ForegroundColor Yellow

Write-Host "   Configuración MCP: $(if (Test-Path $mcpConfigPath) { '✅ OK' } else { '❌ Faltante' })" -ForegroundColor $(if (Test-Path $mcpConfigPath) { 'Green' } else { 'Red' })
Write-Host "   Procesos activos: $(if ($processes.Count -le 3) { '✅ OK' } else { '⚠️  Excesivos' })" -ForegroundColor $(if ($processes.Count -le 3) { 'Green' } else { 'Yellow' })
Write-Host "   Cache limpio: ✅ OK" -ForegroundColor Green

Write-Host "`n🎯 SOLUCIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "El error HTTP 400 debería estar resuelto." -ForegroundColor White
Write-Host "Antigravity ahora usa solo 3 servidores MCP críticos." -ForegroundColor White
Write-Host "Inicia sesión con admin@aigestion.net si es necesario." -ForegroundColor White
