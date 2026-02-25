#!/usr/bin/env pwsh

Write-Host "🧹 ANTIGRAVITY DEEP CLEAN - ELIMINAR ERROR 400" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Cerrar todos los procesos de Antigravity
Write-Host "`n1. CERRANDO TODOS LOS PROCESOS ANTIGRAVITY..." -ForegroundColor Red
Start-Process powershell -Verb RunAs -ArgumentList "-Command", "taskkill /F /IM Antigravity.exe /T" -Wait
Start-Sleep -Seconds 5

# 2. Eliminar completamente la configuracion MCP antigua
Write-Host "`n2. ELIMINANDO CONFIGURACION MCP CORRUPTA..." -ForegroundColor Yellow

$mcpConfigPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"
$mcpBackupPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config-backup.json"

# Hacer backup y eliminar
if (Test-Path $mcpConfigPath) {
    Copy-Item $mcpConfigPath $mcpBackupPath -Force
    Remove-Item $mcpConfigPath -Force
    Write-Host "   Configuracion MCP antigua eliminada" -ForegroundColor Green
}

# 3. Crear configuracion MCP ultra-minimalista
Write-Host "`n3. CREANDO CONFIGURACION MCP ULTRA-MINIMALISTA..." -ForegroundColor Yellow

$ultraMinimalConfig = @{
    mcp = @{
        enableRealTime = $false  # Desactivar para evitar problemas
        priorityMode = "low"
        servers = @{
            # Solo un servidor esencial para evitar el error tools[45]
            aigestion_core = @{
                command = "node"
                args = @("./.windsurf/aigestion-mcp-server.js")
                env = @{
                    NODE_ENV = "production"
                    ANTIGRAVITY_MODE = "false"  # Desactivar modo problematico
                    PROFESSIONAL_ACCOUNT = "true"
                }
                capabilities = @("basic_access")
                priority = "low"
            }
        }
    }
    antigravity = @{
        account = "admin@aigestion.net"
        location = "europe-west1"
        optimization = "minimal"  # Minima optimizacion
        professional_mode = $true
        god_mode = $false  # Desactivar god mode
    }
}

# Guardar configuracion ultra-minimalista
$ultraMinimalConfig | ConvertTo-Json -Depth 5 | Set-Content $mcpConfigPath
Write-Host "   Configuracion ultra-minimalista creada" -ForegroundColor Green

# 4. Limpiar todos los caches de Antigravity
Write-Host "`n4. LIMPIANDO TODOS LOS CACHES..." -ForegroundColor Yellow

$antigravityPath = "$env:APPDATA\Antigravity"
if (Test-Path $antigravityPath) {
    $cacheDirs = @("Cache", "Code Cache", "GPUCache", "CachedData", "ShaderCache", "Crashpad")
    
    foreach ($dir in $cacheDirs) {
        $cachePath = Join-Path $antigravityPath $dir
        if (Test-Path $cachePath) {
            try {
                Remove-Item $cachePath -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "   $dir eliminado completamente" -ForegroundColor Green
            } catch {
                Write-Host "   $dir: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
    
    # Limpiar archivos temporales
    $tempFiles = @("*.tmp", "*.log", "*.cache", "*.lock")
    foreach ($pattern in $tempFiles) {
        Remove-Item "$antigravityPath\$pattern" -Force -ErrorAction SilentlyContinue
    }
}

# 5. Limpiar configuracion de Windows Registry
Write-Host "`n5. LIMPIANDO REGISTRY DE WINDOWS..." -ForegroundColor Yellow

try {
    # Eliminar claves de registro problematicas
    $regPaths = @(
        "HKCU:\Software\Antigravity",
        "HKLM:\Software\Antigravity"
    )
    
    foreach ($path in $regPaths) {
        if (Test-Path $path) {
            Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "   Registro limpiado: $path" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   Registry: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 6. Reiniciar servicios de red
Write-Host "`n6. REINICIANDO SERVICIOS DE RED..." -ForegroundColor Yellow

try {
    Restart-Service "Dnscache" -Force -ErrorAction SilentlyContinue
    Restart-Service "LmHosts" -Force -ErrorAction SilentlyContinue
    Write-Host "   Servicios de red reiniciados" -ForegroundColor Green
} catch {
    Write-Host "   Servicios de red: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 7. Verificacion final
Write-Host "`n7. VERIFICACION FINAL..." -ForegroundColor Yellow

$processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
$configExists = Test-Path $mcpConfigPath
$cacheSize = 0

if (Test-Path $antigravityPath) {
    $cacheSize = (Get-ChildItem $antigravityPath -Recurse -ErrorAction SilentlyContinue | 
                Measure-Object -Property Length -Sum).Sum / 1MB
}

Write-Host "   Procesos activos: $($processes.Count)" -ForegroundColor $(if ($processes.Count -eq 0) { 'Green' } else { 'Red' })
Write-Host "   Configuracion MCP: $(if ($configExists) { 'OK' } else { 'Faltante' })" -ForegroundColor $(if ($configExists) { 'Green' } else { 'Red' })
Write-Host "   Cache restante: $([math]::Round($cacheSize, 2)) MB" -ForegroundColor $(if ($cacheSize -lt 10) { 'Green' } else { 'Yellow' })

Write-Host "`n🎯 LIMPIEZA COMPLETADA" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "1. Reinicia Antigravity manualmente" -ForegroundColor White
Write-Host "2. Inicia sesion con admin@aigestion.net" -ForegroundColor White
Write-Host "3. El error HTTP 400 deberia estar resuelto" -ForegroundColor White
Write-Host "4. Si persiste, contacta soporte de Antigravity" -ForegroundColor White
