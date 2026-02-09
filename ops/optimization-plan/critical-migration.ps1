# MIGRACIÓN CRÍTICA - ACCIONES IMPRESCINDIBLES
# Versión simplificada y corregida para ejecución inmediata

param(
    [switch]$DryRun,
    [switch]$Execute,
    [switch]$Report
)

Write-Host "🚀 MIGRACIÓN CRÍTICA ALEJANDRO" -ForegroundColor Green
Write-Host "📁 Ejecutando acciones imprescindibles" -ForegroundColor Yellow

# Rutas base
$SourcePath = "c:\Users\Alejandro"
$TargetPath = "c:\Users\Alejandro"

# Reglas críticas simplificadas
$CriticalRules = @{
    "AIGestion"    = @{
        destination = "WORKSPACE\AIGestion"
        priority    = "Máxima"
        action      = "Move"
        description = "Proyecto principal - mantener actual"
    }
    "Data"         = @{
        destination = "WORKSPACE\Data"
        priority    = "Máxima"
        action      = "Move"
        description = "Datos de negocio - migrar urgente"
    }
    "Dev"          = @{
        destination = "DEVELOPMENT\Dev"
        priority    = "Alta"
        action      = "Move"
        description = "Entorno desarrollo - organizar"
    }
    "scripts"      = @{
        destination = "DEVELOPMENT\Scripts"
        priority    = "Alta"
        action      = "Move"
        description = "Scripts automatización - preservar"
    }
    ".vscode"      = @{
        destination = "SYSTEM\Configs\VSCode"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración VSCode - backup"
    }
    ".gemini"      = @{
        destination = "AI_TOOLS\Gemini"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Gemini - preservar"
    }
    ".antigravity" = @{
        destination = "AI_TOOLS\Antigravity"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Antigravity - respaldar"
    }
}

# Función para obtener tamaño
function Get-FolderSize {
    param($Path)
    try {
        $size = 0
        Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
            $size += $_.Length
        }
        return [math]::Round($size / 1GB, 2)
    }
    catch {
        return 0
    }
}

# Función para crear estructura
function New-CriticalStructure {
    Write-Host "`n🏗️ CREANDO ESTRUCTURA CRÍTICA" -ForegroundColor Blue

    $criticalFolders = @(
        "WORKSPACE\AIGestion",
        "WORKSPACE\Data",
        "WORKSPACE\Projects",
        "DEVELOPMENT\Dev",
        "DEVELOPMENT\Scripts",
        "DEVELOPMENT\Configs",
        "AI_TOOLS\Gemini",
        "AI_TOOLS\Antigravity",
        "SYSTEM\Configs\VSCode",
        "SYSTEM\Backups"
    )

    foreach ($folder in $criticalFolders) {
        $fullPath = Join-Path $TargetPath $folder
        if (!(Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Host "   ✅ Creado: $folder" -ForegroundColor Green
        }
        else {
            Write-Host "   ✅ Existe: $folder" -ForegroundColor Gray
        }
    }
}

# Función para analizar reglas
function Test-CriticalRules {
    Write-Host "`n📊 ANÁLISIS DE REGLAS CRÍTICAS" -ForegroundColor Blue

    $results = @()

    foreach ($ruleName in $CriticalRules.Keys) {
        $rule = $CriticalRules[$ruleName]
        $sourcePath = Join-Path $SourcePath $ruleName

        Write-Host "`n📁 Analizando: $ruleName" -ForegroundColor White
        Write-Host "   🎯 Prioridad: $($rule.priority)" -ForegroundColor Gray
        Write-Host "   📋 Descripción: $($rule.description)" -ForegroundColor Gray

        if (Test-Path $sourcePath) {
            $size = Get-FolderSize -Path $sourcePath
            $targetPath = Join-Path $TargetPath $rule.destination

            Write-Host "   📊 Tamaño: $size GB" -ForegroundColor Cyan
            Write-Host "   🔄 Acción: $($rule.action)" -ForegroundColor Cyan
            Write-Host "   📍 Destino: $targetPath" -ForegroundColor Cyan

            $results += [PSCustomObject]@{
                Rule     = $ruleName
                Status   = "Found"
                Size     = $size
                Action   = $rule.action
                Source   = $sourcePath
                Target   = $targetPath
                Priority = $rule.priority
            }
        }
        else {
            Write-Host "   ❌ No encontrado: $sourcePath" -ForegroundColor Red

            $results += [PSCustomObject]@{
                Rule     = $ruleName
                Status   = "NotFound"
                Size     = 0
                Action   = $rule.action
                Source   = $sourcePath
                Target   = ""
                Priority = $rule.priority
            }
        }
    }

    return $results
}

# Función para ejecutar migración
function Invoke-CriticalMigration {
    param($Results, $DryRun)

    Write-Host "`n🚀 EJECUTANDO MIGRACIÓN CRÍTICA" -ForegroundColor Blue

    if ($DryRun) {
        Write-Host "   ⚠️ MODO SIMULACIÓN - Sin cambios reales" -ForegroundColor Yellow
    }

    foreach ($result in $Results) {
        if ($result.Status -eq "Found") {
            Write-Host "`n📁 Procesando: $($result.Rule)" -ForegroundColor White

            if ($DryRun) {
                Write-Host "   ⏭️ SIMULACIÓN: $($result.Action) $($result.Size) GB" -ForegroundColor Yellow
            }
            else {
                try {
                    # Crear directorio destino
                    $targetDir = Split-Path $result.Target -Parent
                    if (!(Test-Path $targetDir)) {
                        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                    }

                    if ($result.Action -eq "Move") {
                        Move-Item -Path $result.Source -Destination $result.Target -Force
                        Write-Host "   ✅ MOVIDO: $($result.Size) GB" -ForegroundColor Green
                    }
                    else {
                        Copy-Item -Path $result.Source -Destination $result.Target -Recurse -Force
                        Write-Host "   📋 COPIADO: $($result.Size) GB" -ForegroundColor Green
                    }
                }
                catch {
                    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
    }
}

# Función para generar reporte
function New-CriticalReport {
    param($Results)

    $reportPath = "c:\Users\Alejandro\AIGestion\optimization-plan\critical-migration-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"

    $foundCount = ($Results | Where-Object { $_.Status -eq "Found" }).Count
    $totalSize = ($Results | Where-Object { $_.Status -eq "Found" } | Measure-Object -Property Size -Sum).Sum

    $report = @"
# 📊 REPORTE DE MIGRACIÓN CRÍTICA

**Fecha:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Total Reglas:** $($CriticalRules.Count)
**Encontradas:** $foundCount
**Tamaño Total:** $totalSize GB

## 📈 RESUMEN POR PRIORIDAD

### 🔴 Prioridad Máxima
$($Results | Where-Object { $_.Priority -eq "Máxima" -and $_.Status -eq "Found" } | ForEach-Object {
    "- **$($_.Rule)**: $($_.Size) GB - $($_.Action)"
})

### 🟡 Prioridad Alta
$($Results | Where-Object { $_.Priority -eq "Alta" -and $_.Status -eq "Found" } | ForEach-Object {
    "- **$($_.Rule)**: $($_.Size) GB - $($_.Action)"
})

## 📋 DETALLE COMPLETO

| Regla | Estado | Tamaño | Acción | Prioridad |
|-------|--------|--------|--------|-----------|
$($Results | ForEach-Object {
    "| $($_.Rule) | $($_.Status) | $($_.Size) GB | $($_.Action) | $($_.Priority) |"
})

## 🎯 ACCIONES RECOMENDADAS

1. **Ejecutar migración de datos críticos** (Prioridad Máxima)
2. **Backup configuraciones importantes** (Prioridad Alta)
3. **Organizar entorno de desarrollo** (Prioridad Alta)
4. **Verificar integración post-migración**

---
**Reporte generado:** $(Get-Date)
"@

    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "`n📄 Reporte guardado: $reportPath" -ForegroundColor Green
}

# Ejecución principal
try {
    # Paso 1: Crear estructura crítica
    New-CriticalStructure

    # Paso 2: Analizar reglas
    $results = Test-CriticalRules

    # Paso 3: Ejecutar migración si se solicita
    if ($DryRun -or $Execute) {
        Invoke-CriticalMigration -Results $results -DryRun:$DryRun
    }

    # Paso 4: Generar reporte
    if ($Report -or $Execute) {
        New-CriticalReport -Results $results
    }

    # Resumen final
    $foundCount = ($results | Where-Object { $_.Status -eq "Found" }).Count
    $totalSize = ($results | Where-Object { $_.Status -eq "Found" } | Measure-Object -Property Size -Sum).Sum

    Write-Host "`n📊 RESUMEN DE MIGRACIÓN CRÍTICA" -ForegroundColor Yellow
    Write-Host "✅ Carpetas encontradas: $foundCount/$($CriticalRules.Count)" -ForegroundColor Green
    Write-Host "💾 Tamaño total: $totalSize GB" -ForegroundColor Blue

    if ($DryRun) {
        Write-Host "`n💡 Para ejecutar realmente: .\critical-migration.ps1 -Execute" -ForegroundColor Cyan
    }
    elseif ($Execute) {
        Write-Host "`n🚀 Migración ejecutada - Revisa el reporte" -ForegroundColor Green
    }

}
catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Proceso de migración crítica completado" -ForegroundColor Green
