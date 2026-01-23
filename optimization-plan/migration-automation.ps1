# Automatización de Migración para Estructura Optimizada
# Migración inteligente de carpetas actuales a nueva estructura

param(
    [string]$SourcePath = "c:\Users\Alejandro",
    [string]$TargetPath = "c:\Users\Alejandro",
    [switch]$DryRun,
    [switch]$Execute,
    [switch]$Report
)

Write-Host "🚀 AUTOMATIZACIÓN DE MIGRACIÓN ALEJANDRO" -ForegroundColor Green
Write-Host "📁 Origen: $SourcePath" -ForegroundColor Yellow
Write-Host "📁 Destino: $TargetPath" -ForegroundColor Yellow

# Reglas de migración definidas
$MigrationRules = @{
    # Workspace - Proyectos profesionales
    "AIGestion"    = @{
        destination = "WORKSPACE\AIGestion"
        priority    = "Máxima"
        action      = "Move"
        description = "Proyecto principal - ya migrado a Workspace"
    }
    "Data"         = @{
        destination = "WORKSPACE\Data"
        priority    = "Máxima"
        action      = "Move"
        description = "Datos de negocio - migrar a Workspace"
    }
    "Projects"     = @{
        destination = "WORKSPACE\Projects"
        priority    = "Alta"
        action      = "Move"
        description = "Proyectos adicionales"
    }

    # Development - Herramientas de desarrollo
    "Dev"          = @{
        destination = "DEVELOPMENT\Dev"
        priority    = "Alta"
        action      = "Move"
        description = "Entorno de desarrollo"
    }
    "scripts"      = @{
        destination = "DEVELOPMENT\Scripts"
        priority    = "Alta"
        action      = "Move"
        description = "Scripts de automatización"
    }
    "Tools"        = @{
        destination = "DEVELOPMENT\Tools"
        priority    = "Alta"
        action      = "Move"
        description = "Herramientas profesionales"
    }
    "backend"      = @{
        destination = "DEVELOPMENT\Backend"
        priority    = "Media"
        action      = "Move"
        description = "Backend development"
    }
    "frontend"     = @{
        destination = "DEVELOPMENT\Frontend"
        priority    = "Media"
        action      = "Move"
        description = "Frontend development"
    }

    # AI Tools - Configuraciones IA
    ".gemini"      = @{
        destination = "AI_TOOLS\Gemini"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Google Gemini"
    }
    ".antigravity" = @{
        destination = "AI_TOOLS\Antigravity"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Antigravity"
    }
    ".codeium"     = @{
        destination = "AI_TOOLS\Codeium"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Codeium"
    }
    ".copilot"     = @{
        destination = "AI_TOOLS\Copilot"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración GitHub Copilot"
    }
    ".fitten"      = @{
        destination = "AI_TOOLS\Fitten"
        priority    = "Media"
        action      = "Copy"
        description = "Configuración Fitten AI"
    }
    ".ai-memory"   = @{
        destination = "AI_TOOLS\Memory"
        priority    = "Media"
        action      = "Copy"
        description = "Memoria IA"
    }

    # System - Configuraciones sistema
    ".vscode"      = @{
        destination = "SYSTEM\Configs\VSCode"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración VSCode"
    }
    ".windsurf"    = @{
        destination = "SYSTEM\Configs\Windsurf"
        priority    = "Alta"
        action      = "Copy"
        description = "Configuración Windsurf"
    }
    ".docker"      = @{
        destination = "SYSTEM\Configs\Docker"
        priority    = "Media"
        action      = "Copy"
        description = "Configuración Docker"
    }
    ".aws"         = @{
        destination = "SYSTEM\Configs\AWS"
        priority    = "Media"
        action      = "Copy"
        description = "Configuración AWS"
    }
    ".azure"       = @{
        destination = "SYSTEM\Configs\Azure"
        priority    = "Media"
        action      = "Copy"
        description = "Configuración Azure"
    }

    # Personal - Archivos personales
    "Desktop"      = @{
        destination = "PERSONAL\Documents\Desktop"
        priority    = "Baja"
        action      = "Move"
        description = "Archivos de escritorio"
    }
    "Documents"    = @{
        destination = "PERSONAL\Documents"
        priority    = "Baja"
        action      = "Move"
        description = "Documentos personales"
    }
    "Downloads"    = @{
        destination = "PERSONAL\Temp\Downloads"
        priority    = "Baja"
        action      = "Move"
        description = "Descargas temporales"
    }
    "Pictures"     = @{
        destination = "PERSONAL\Media\Pictures"
        priority    = "Baja"
        action      = "Move"
        description = "Fotos personales"
    }
    "Videos"       = @{
        destination = "PERSONAL\Media\Videos"
        priority    = "Baja"
        action      = "Move"
        description = "Videos personales"
    }
    "Music"        = @{
        destination = "PERSONAL\Media\Music"
        priority    = "Baja"
        action      = "Move"
        description = "Música personal"
    }
}

# Función para calcular tamaño de directorio
function Get-DirectorySize {
    param($Path)

    $size = 0
    Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
        $size += $_.Length
    }
    return $size
}

# Función para ejecutar migración
function Invoke-MigrationRule {
    param($Rule, $Source, $Target, $DryRun)

    $sourcePath = Join-Path $Source $Rule
    $targetPath = Join-Path $Target $Rule.destination

    if (!(Test-Path $sourcePath)) {
        return @{
            Status = "Skip"
            Reason = "Source not found"
            Size   = 0
        }
    }

    $size = Get-DirectorySize -Path $sourcePath
    $sizeGB = [math]::Round($size / 1GB, 2)

    if ($DryRun) {
        return @{
            Status   = "DryRun"
            Action   = $Rule.action
            Source   = $sourcePath
            Target   = $targetPath
            Size     = $sizeGB
            Priority = $Rule.priority
        }
    }

    try {
        # Crear directorio destino si no existe
        $targetDir = Split-Path $targetPath -Parent
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }

        if ($Rule.action -eq "Move") {
            Move-Item -Path $sourcePath -Destination $targetPath -Force
            $status = "Moved"
        }
        else {
            Copy-Item -Path $sourcePath -Destination $targetPath -Recurse -Force
            $status = "Copied"
        }

        return @{
            Status   = $status
            Source   = $sourcePath
            Target   = $targetPath
            Size     = $sizeGB
            Priority = $Rule.priority
        }
    }
    catch {
        return @{
            Status = "Error"
            Error  = $_.Exception.Message
            Size   = $sizeGB
        }
    }
}

# Función para generar reporte
function New-MigrationReport {
    param($Results)

    $reportPath = "c:\Users\Alejandro\AIGestion\optimization-plan\migration-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"

    $report = @"
# 📊 REPORTE DE MIGRACIÓN ALEJANDRO

**Fecha:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Total Reglas:** $($MigrationRules.Count)

## 📈 RESUMEN DE RESULTADOS

| Estado | Cantidad | Tamaño Total |
|--------|----------|--------------|
| ✅ Exitosos | $(($Results | Where-Object { $_.Status -in @("Moved", "Copied") }).Count) | GB |
| ⏭️ Omitidos | $(($Results | Where-Object { $_.Status -eq "Skip" }).Count) | GB |
| ❌ Errores | $(($Results | Where-Object { $_.Status -eq "Error" }).Count) | GB |

## 📋 DETALLE POR PRIORIDAD

### 🔴 Prioridad Máxima
$($Results | Where-Object { $_.Priority -eq "Máxima" } | ForEach-Object {
    "- **$($_.Source)**: $($_.Status) - $($_.Size) GB"
})

### 🟡 Prioridad Alta
$($Results | Where-Object { $_.Priority -eq "Alta" } | ForEach-Object {
    "- **$($_.Source)**: $($_.Status) - $($_.Size) GB"
})

### 🟢 Prioridad Media
$($Results | Where-Object { $_.Priority -eq "Media" } | ForEach-Object {
    "- **$($_.Source)**: $($_.Status) - $($_.Size) GB"
})

### 🔵 Prioridad Baja
$($Results | Where-Object { $_.Priority -eq "Baja" } | ForEach-Object {
    "- **$($_.Source)**: $($_.Status) - $($_.Size) GB"
})

## ⚠️ ERRORES DETECTADOS

$($Results | Where-Object { $_.Status -eq "Error" } | ForEach-Object {
    "- **$($_.Source)**: $($_.Error)"
})

---
**Reporte generado:** $(Get-Date)
"@

    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "📄 Reporte guardado: $reportPath" -ForegroundColor Green
}

# Ejecutar migración
$results = @()

Write-Host "`n🔄 PROCESANDO REGLAS DE MIGRACIÓN" -ForegroundColor Blue

foreach ($ruleName in $MigrationRules.Keys) {
    $rule = $MigrationRules[$ruleName]

    Write-Host "`n📁 Procesando: $ruleName" -ForegroundColor White
    Write-Host "   🎯 Prioridad: $($rule.priority)" -ForegroundColor Gray
    Write-Host "   📋 Descripción: $($rule.description)" -ForegroundColor Gray

    $result = Invoke-MigrationRule -Rule $rule -Source $SourcePath -Target $TargetPath -DryRun:$DryRun

    $results += [PSCustomObject]@{
        Rule        = $ruleName
        Status      = $result.Status
        Source      = $result.Source
        Target      = $result.Target
        Size        = $result.Size
        Priority    = $rule.priority
        Action      = $rule.action
        Description = $rule.description
        Error       = if ($result.Error) { $result.Error } else { "" }
    }

    switch ($result.Status) {
        "DryRun" { Write-Host "   ⏭️ Simulación: $sizeGB GB" -ForegroundColor Yellow }
        "Moved" { Write-Host "   ✅ Movido: $sizeGB GB" -ForegroundColor Green }
        "Copied" { Write-Host "   📋 Copiado: $sizeGB GB" -ForegroundColor Green }
        "Skip" { Write-Host "   ⏭️ Omitido: $($result.Reason)" -ForegroundColor Gray }
        "Error" { Write-Host "   ❌ Error: $($result.Error)" -ForegroundColor Red }
    }
}

# Generar reporte
if ($Report -or $Execute) {
    New-MigrationReport -Results $results
}

# Resumen final
$totalSize = ($Results | Where-Object { $_.Status -in @("Moved", "Copied") } | Measure-Object -Property Size -Sum).Sum
$successCount = ($Results | Where-Object { $_.Status -in @("Moved", "Copied") }).Count
$errorCount = ($Results | Where-Object { $_.Status -eq "Error" }).Count

Write-Host "`n📊 RESUMEN DE MIGRACIÓN" -ForegroundColor Yellow
Write-Host "✅ Exitosos: $successCount/$($MigrationRules.Count)" -ForegroundColor Green
Write-Host "💾 Tamaño total: $totalSize GB" -ForegroundColor Blue
Write-Host "❌ Errores: $errorCount" -ForegroundColor Red

if ($DryRun) {
    Write-Host "`n💡 Modo simulación activado. Usa -Execute para migrar realmente." -ForegroundColor Cyan
}
elseif ($Execute) {
    Write-Host "`n🚀 Migración ejecutada. Revisa el reporte para detalles." -ForegroundColor Green
}

Write-Host "`n✅ Proceso de migración completado" -ForegroundColor Green
