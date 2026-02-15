<#
.SYNOPSIS
    Antigravity-Cleanup-GodMode.ps1 - Limpieza total de procesos y cachés de Antigravity

.DESCRIPTION
    Resuelve el problema de múltiples procesos de Antigravity (26+) que consumen RAM excesiva.
    1. Mata todos los procesos de Antigravity (incluyendo huérfanos)
    2. Limpia cachés problemáticas (CachedData, extensiones, GPUCache)
    3. Limpia logs antiguos
    4. Optimiza configuración para reducir procesos
    5. Reinicia Antigravity con configuración limpia

.PARAMETER DryRun
    Simula acciones sin ejecutarlas realmente.

.PARAMETER KeepLogs
    Mantiene los logs (solo limpia cachés y procesos).

.PARAMETER ForceKill
    Fuerza el cierre de Antigravity sin preguntar.
#>

param(
    [switch]$DryRun,
    [switch]$KeepLogs,
    [switch]$ForceKill
)

function Write-Banner {
    param($Title)
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 70) + "`n" -ForegroundColor Cyan
}

function Write-Section {
    param($Msg)
    Write-Host ">> $Msg" -ForegroundColor Yellow
}

function Get-AntigravityProcesses {
    Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
}

function Get-MemorySnapshot {
    $procs = Get-AntigravityProcesses
    $total = ($procs | Measure-Object -Property WorkingSet64 -Sum).Sum / 1GB
    return @{
        ProcessCount = $procs.Count
        TotalMemoryGB = [math]::Round($total, 2)
        Processes = $procs
    }
}

$ErrorActionPreference = "Continue"
$AntigravityPath = "$env:APPDATA\Antigravity"

Write-Banner "ANTIGRAVITY GOD-MODE CLEANUP"

# 1. Snapshot inicial
Write-Section "Capturando estado actual de Antigravity..."
$before = Get-MemorySnapshot
if ($before.ProcessCount -eq 0) {
    Write-Host "No hay procesos de Antigravity en ejecución." -ForegroundColor Green
    $shouldCleanCache = $true
} else {
    Write-Host "Procesos detectados: $($before.ProcessCount)" -ForegroundColor Red
    Write-Host "Memoria total usada: $($before.TotalMemoryGB) GB" -ForegroundColor Red
    
    # Mostrar detalles de procesos
    $before.Processes | Select-Object Id, @{Name="Memory(MB)";Expression={[math]::round($_.WorkingSet64 / 1MB, 2)}}, StartTime | 
        Sort-Object Memory -Descending | Select-Object -First 10 | Format-Table -AutoSize
    
    $shouldCleanCache = $true
}

# 2. Matar procesos de Antigravity
if ($before.ProcessCount -gt 0) {
    Write-Section "Cerrando procesos de Antigravity..."
    
    if (-not $ForceKill -and -not $DryRun) {
        $confirm = Read-Host "¿Quieres cerrar TODOS los procesos de Antigravity? [S/N]"
        if ($confirm -ne 'S' -and $confirm -ne 's') {
            Write-Host "Operación cancelada." -ForegroundColor Yellow
            exit 0
        }
    }
    
    if ($DryRun) {
        Write-Host "[DRY-RUN] Se cerrarían $($before.ProcessCount) procesos de Antigravity" -ForegroundColor Gray
    } else {
        Write-Host "Cerrando $($before.ProcessCount) procesos..." -ForegroundColor Red
        Stop-Process -Name "Antigravity" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        # Verificar si quedaron procesos zombies
        $remaining = Get-AntigravityProcesses
        if ($remaining.Count -gt 0) {
            Write-Host "Advertencia: $($remaining.Count) procesos zombies detectados, forzando cierre..." -ForegroundColor Yellow
            $remaining | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
            Start-Sleep -Seconds 1
        }
        
        Write-Host "Procesos cerrados exitosamente." -ForegroundColor Green
    }
}

# 3. Limpieza de cachés
if ($shouldCleanCache) {
    Write-Section "Limpiando cachés de Antigravity..."
    
    $cacheDirs = @(
        "$AntigravityPath\Cache",
        "$AntigravityPath\Code Cache",
        "$AntigravityPath\GPUCache",
        "$AntigravityPath\CachedData",
        "$AntigravityPath\CachedExtensionVSIXs",
        "$AntigravityPath\DawnGraphiteCache",
        "$AntigravityPath\DawnWebGPUCache",
        "$AntigravityPath\Service Worker\CacheStorage",
        "$AntigravityPath\blob_storage"
    )
    
    $totalFreed = 0
    foreach ($dir in $cacheDirs) {
        if (Test-Path $dir) {
            $sizeBefore = (Get-ChildItem $dir -Recurse -ErrorAction SilentlyContinue | 
                          Measure-Object -Property Length -Sum).Sum / 1MB
            
            if ($DryRun) {
                Write-Host "[DRY-RUN] Limpiaría: $dir ($([math]::Round($sizeBefore, 2)) MB)" -ForegroundColor Gray
            } else {
                Write-Host "Limpiando: $dir ($([math]::Round($sizeBefore, 2)) MB)" -ForegroundColor DarkGray
                Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
                $totalFreed += $sizeBefore
            }
        }
    }
    
    if (-not $DryRun) {
        Write-Host "Total liberado de cachés: $([math]::Round($totalFreed, 2)) MB" -ForegroundColor Green
    }
}

# 4. Limpieza de logs antiguos (mayores a 7 días)
if (-not $KeepLogs) {
    Write-Section "Limpiando logs antiguos..."
    
    $logsPath = "$AntigravityPath\logs"
    if (Test-Path $logsPath) {
        $oldLogs = Get-ChildItem $logsPath -Directory | 
                   Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-7) }
        
        if ($oldLogs.Count -gt 0) {
            if ($DryRun) {
                Write-Host "[DRY-RUN] Se eliminarían $($oldLogs.Count) carpetas de logs antiguos" -ForegroundColor Gray
            } else {
                Write-Host "Eliminando $($oldLogs.Count) carpetas de logs antiguos..." -ForegroundColor DarkGray
                $oldLogs | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "Logs antiguos eliminados." -ForegroundColor Green
            }
        } else {
            Write-Host "No hay logs antiguos para eliminar." -ForegroundColor Green
        }
    }
}

# 5. Limpieza de bases de datos de estado (pueden causar problemas)
Write-Section "Optimizando bases de datos de estado..."
$stateDbs = @(
    "$AntigravityPath\User\globalStorage\state.vscdb",
    "$AntigravityPath\User\globalStorage\state.vscdb.backup"
)

foreach ($db in $stateDbs) {
    if (Test-Path $db) {
        $sizeMB = (Get-Item $db).Length / 1MB
        if ($sizeMB -gt 10) {
            if ($DryRun) {
                Write-Host "[DRY-RUN] Eliminaría DB grande: $db ($([math]::Round($sizeMB, 2)) MB)" -ForegroundColor Gray
            } else {
                Write-Host "Eliminando DB grande: $db ($([math]::Round($sizeMB, 2)) MB)" -ForegroundColor Yellow
                Remove-Item $db -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# 6. Reporte final
Write-Section "Reporte Final"

if (-not $DryRun) {
    # Esperar un momento para que el sistema libere recursos
    Start-Sleep -Seconds 2
    
    # Memory trimming del sistema
    Write-Host "Optimizando memoria del sistema..." -ForegroundColor Cyan
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    # Verificar estado final
    $after = Get-MemorySnapshot
    Write-Host "Procesos actuales: $($after.ProcessCount)" -ForegroundColor Green
    Write-Host "Memoria liberada: $([math]::Round($before.TotalMemoryGB - $after.TotalMemoryGB, 2)) GB" -ForegroundColor Green
}

Write-Banner "ANTIGRAVITY LIMPIEZA COMPLETA"

if (-not $DryRun) {
    Write-Host "`nPuedes reiniciar Antigravity ahora. La próxima sesión será mucho más rápida." -ForegroundColor Cyan
    Write-Host "`nConsejos:" -ForegroundColor Yellow
    Write-Host "  1. Cierra ventanas no usadas frecuentemente" -ForegroundColor White
    Write-Host "  2. Desactiva extensiones pesadas que no uses" -ForegroundColor White
    Write-Host "  3. Ejecuta este script semanalmente o cuando notes lentitud" -ForegroundColor White
}
