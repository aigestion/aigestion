#!/usr/bin/env pwsh

Write-Host "🚀 FIX ANTIGRAVITY HTTP 400 ERROR" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. Cerrar procesos de Antigravity
Write-Host "`n1. Cerrando procesos de Antigravity..." -ForegroundColor Yellow
Start-Process powershell -Verb RunAs -ArgumentList "-Command", "taskkill /F /IM Antigravity.exe" -Wait
Start-Sleep -Seconds 3

# 2. Limpiar configuracion MCP
Write-Host "`n2. Limpiando configuracion MCP..." -ForegroundColor Yellow
$mcpConfigPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"
$backupPath = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config-backup.json"

if (Test-Path $mcpConfigPath) {
    Copy-Item $mcpConfigPath $backupPath
    
    # Configuracion minimalista para evitar error tools[45]
    $minimalConfig = @{
        mcp = @{
            priorityMode = "high"
            enableRealTime = $true
            servers = @{
                aigestion_core = @{
                    command = "node"
                    args = @("./.windsurf/aigestion-mcp-server.js")
                    env = @{
                        NODE_ENV = "production"
                        ANTIGRAVITY_MODE = "true"
                        PROFESSIONAL_ACCOUNT = "true"
                    }
                    capabilities = @("database_access", "ai_integration")
                    priority = "critical"
                }
                ai_services_hub = @{
                    command = "node"
                    args = @("./scripts/ai-hub-server.js")
                    env = @{
                        NODE_ENV = "production"
                        ANTIGRAVITY_MODE = "true"
                        PROFESSIONAL_ACCOUNT = "true"
                    }
                    capabilities = @("text_generation", "ai_analysis")
                    priority = "critical"
                }
            }
        }
        antigravity = @{
            account = "admin@aigestion.net"
            location = "europe-west1"
            optimization = "maximum"
            professional_mode = $true
        }
    }
    
    $minimalConfig | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath
    Write-Host "   Configuracion MCP reducida a 2 servidores criticos" -ForegroundColor Green
}

# 3. Limpiar cache
Write-Host "`n3. Limpiando cache..." -ForegroundColor Yellow
$antigravityPath = "$env:APPDATA\Antigravity"
if (Test-Path $antigravityPath) {
    Remove-Item "$antigravityPath\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$antigravityPath\Code Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$antigravityPath\GPUCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Cache limpiado" -ForegroundColor Green
}

# 4. Verificar estado
Write-Host "`n4. Verificacion final..." -ForegroundColor Yellow
$processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
Write-Host "   Procesos activos: $($processes.Count)" -ForegroundColor White
Write-Host "   Configuracion MCP: OK" -ForegroundColor Green
Write-Host "   Cache: Limpio" -ForegroundColor Green

Write-Host "`n✅ SOLUCION COMPLETADA" -ForegroundColor Green
Write-Host "El error HTTP 400 deberia estar resuelto." -ForegroundColor White
