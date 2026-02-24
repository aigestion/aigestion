#!/usr/bin/env pwsh

# =============================================================================
# ANTIGRAVITY STATUS CHECK - GOD MODE
# =============================================================================

Write-Host "ANTIGRAVITY STATUS CHECK - GOD MODE" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 1. Verificar procesos de Antigravity
Write-Host "`n1. PROCESOS ANTIGRAVITY" -ForegroundColor Yellow
$processes = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue

if ($processes.Count -eq 0) {
    Write-Host "   No hay procesos de Antigravity en ejecucion" -ForegroundColor Green
} else {
    Write-Host "   Procesos detectados: $($processes.Count)" -ForegroundColor Red
    $totalMemory = ($processes | Measure-Object -Property WorkingSet64 -Sum).Sum / 1MB
    Write-Host "   Memoria total usada: $([math]::Round($totalMemory, 2)) MB" -ForegroundColor Red
    
    $processes | Select-Object Id, @{Name="Memory(MB)";Expression={[math]::round($_.WorkingSet64 / 1MB, 2)}}, StartTime | 
        Sort-Object "Memory(MB)" -Descending | Format-Table -AutoSize
}

# 2. Verificar configuracion en .env
Write-Host "`n2. CONFIGURACION .ENV" -ForegroundColor Yellow
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    $antigravityKey = Select-String -Path $envFile -Pattern "ANTIGRAVITY_MODEL_API_KEY"
    if ($antigravityKey) {
        $key = $antigravityKey.Line.Split('=')[1]
        $maskedKey = $key.Substring(0, 10) + "..." + $key.Substring($key.Length - 5)
        Write-Host "   API Key configurada: $maskedKey" -ForegroundColor Green
    } else {
        Write-Host "   API Key no encontrada" -ForegroundColor Red
    }
} else {
    Write-Host "   Archivo .env no encontrado" -ForegroundColor Red
}

# 3. Verificar archivos de configuracion MCP
Write-Host "`n3. CONFIGURACION MCP" -ForegroundColor Yellow
$mcpConfig = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-mcp-config.json"
if (Test-Path $mcpConfig) {
    Write-Host "   Configuracion MCP encontrada" -ForegroundColor Green
    
    try {
        $config = Get-Content $mcpConfig | ConvertFrom-Json
        $antigravityConfig = $config.antigravity
        
        Write-Host "   Account: $($antigravityConfig.account)" -ForegroundColor White
        Write-Host "   Location: $($antigravityConfig.location)" -ForegroundColor White
        Write-Host "   Optimization: $($antigravityConfig.optimization)" -ForegroundColor White
        Write-Host "   Professional Mode: $($antigravityConfig.professional_mode)" -ForegroundColor White
        Write-Host "   Divine Level: $($antigravityConfig.divine_level)" -ForegroundColor White
        
        # Contar servidores MCP
        $serverCount = $config.mcp.servers.PSObject.Properties.Count
        Write-Host "   Servidores MCP configurados: $serverCount" -ForegroundColor Cyan
        
    } catch {
        Write-Host "   Error leyendo configuracion MCP" -ForegroundColor Red
    }
} else {
    Write-Host "   Configuracion MCP no encontrada" -ForegroundColor Red
}

# 4. Verificar archivos de log y estado
Write-Host "`n4. ARCHIVOS DE ESTADO" -ForegroundColor Yellow
$antigravityPath = "$env:APPDATA\Antigravity"
if (Test-Path $antigravityPath) {
    Write-Host "   Directorio Antigravity encontrado" -ForegroundColor Green
    
    # Verificar tamaño de caches
    $cacheDirs = @("Cache", "Code Cache", "GPUCache", "CachedData")
    $totalCacheSize = 0
    
    foreach ($dir in $cacheDirs) {
        $cachePath = Join-Path $antigravityPath $dir
        if (Test-Path $cachePath) {
            $size = (Get-ChildItem $cachePath -Recurse -ErrorAction SilentlyContinue | 
                    Measure-Object -Property Length -Sum).Sum / 1MB
            $totalCacheSize += $size
            Write-Host "   $dir`: $([math]::Round($size, 2)) MB" -ForegroundColor Gray
        }
    }
    
    Write-Host "   Total cache: $([math]::Round($totalCacheSize, 2)) MB" -ForegroundColor Cyan
    
    if ($totalCacheSize -gt 500) {
        Write-Host "   ADVERTENCIA: Cache muy grande, considera limpieza" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "   Directorio Antigravity no encontrado" -ForegroundColor Red
}

# 5. Verificar scripts de mantenimiento
Write-Host "`n5. SCRIPTS DE MANTENIMIENTO" -ForegroundColor Yellow
$cleanupScript = "c:\Users\Alejandro\AIGestion\ops\Antigravity-Cleanup-GodMode.ps1"
if (Test-Path $cleanupScript) {
    Write-Host "   Script de limpieza God Mode disponible" -ForegroundColor Green
} else {
    Write-Host "   Script de limpieza no encontrado" -ForegroundColor Red
}

# 6. Verificar estado de checklist
Write-Host "`n6. CHECKLIST DE MIGRACION" -ForegroundColor Yellow
$checklist = "c:\Users\Alejandro\AIGestion\ops\workspace-config\antigravity-checklist.md"
if (Test-Path $checklist) {
    Write-Host "   Checklist de migracion encontrado" -ForegroundColor Green
    
    # Contar items completados
    $content = Get-Content $checklist
    $completed = ($content | Where-Object { $_ -match "\[x\]" }).Count
    $total = ($content | Where-Object { $_ -match "\[" }).Count
    
    Write-Host "   Tareas completadas: $completed/$total" -ForegroundColor Cyan
    
    if ($completed -eq $total) {
        Write-Host "   MIGRACION COMPLETADA" -ForegroundColor Green
    } else {
        Write-Host "   Migracion incompleta" -ForegroundColor Yellow
    }
} else {
    Write-Host "   Checklist no encontrado" -ForegroundColor Red
}

# 7. Diagnostico final
Write-Host "`n7. DIAGNOSTICO FINAL" -ForegroundColor Yellow

$issues = @()
if ($processes.Count -gt 5) { $issues += "Multiples procesos consumiendo memoria" }
if ($totalCacheSize -gt 500) { $issues += "Cache excesivo" }
if (-not (Test-Path $mcpConfig)) { $issues += "Configuracion MCP faltante" }
if (-not (Test-Path $cleanupScript)) { $issues += "Script de limpieza faltante" }

if ($issues.Count -eq 0) {
    Write-Host "   ✅ ANTIGRAVITY CONFIGURADO A NIVEL DIOS" -ForegroundColor Green
    Write-Host "   Sistema optimizado y listo para uso profesional" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Issues detectados:" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "      - $_" -ForegroundColor White }
}

Write-Host "`nCHECK COMPLETADO" -ForegroundColor Cyan
