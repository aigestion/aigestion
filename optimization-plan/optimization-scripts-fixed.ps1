# Scripts de Optimización para Sistema de Alejandro - VERSIÓN CORREGIDA
# Automatización de organización y mantenimiento

param(
    [string]$BasePath = "c:\Users\Alejandro",
    [switch]$Analyze,
    [switch]$Organize,
    [switch]$Backup,
    [switch]$Cleanup
)

Write-Host "🚀 SISTEMA DE OPTIMIZACIÓN ALEJANDRO" -ForegroundColor Green
Write-Host "📁 Ruta base: $BasePath" -ForegroundColor Yellow

# Estructura optimizada definida
$OptimizedStructure = @{
    "WORKSPACE"   = @{
        description = "Integración con Google Workspace"
        subfolders  = @("AIGestion", "Data", "Projects", "Archive")
        priority    = "Máxima"
    }
    "DEVELOPMENT" = @{
        description = "Herramientas de desarrollo"
        subfolders  = @("Scripts", "Tools", "Configs", "Learning")
        priority    = "Alta"
    }
    "AI_TOOLS"    = @{
        description = "Herramientas IA unificadas"
        subfolders  = @("Gemini", "Antigravity", "Codeium", "Copilot")
        priority    = "Alta"
    }
    "SYSTEM"      = @{
        description = "Configuraciones sistema"
        subfolders  = @("Backups", "Temp", "Logs")
        priority    = "Media"
    }
    "PERSONAL"    = @{
        description = "Archivos personales"
        subfolders  = @("Documents", "Media", "Archive")
        priority    = "Baja"
    }
}

# Función de análisis
function Analyze-Directory {
    param($Path)

    Write-Host "`n📊 ANÁLISIS DE DIRECTORIO: $Path" -ForegroundColor Blue

    $analysis = @{}
    $totalSize = 0
    $fileCount = 0

    Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
        $totalSize += $_.Length
        $fileCount++

        $ext = $_.Extension.ToLower()
        if ($analysis.ContainsKey($ext)) {
            $analysis[$ext] += $_.Length
        }
        else {
            $analysis[$ext] = $_.Length
        }
    }

    Write-Host "   📁 Total archivos: $fileCount" -ForegroundColor White
    Write-Host "   💾 Tamaño total: $([math]::Round($totalSize/1GB, 2)) GB" -ForegroundColor White

    Write-Host "`n   📋 Tipos de archivo:" -ForegroundColor Gray
    $analysis.GetEnumerator() | Sort-Object -Property Value -Descending | ForEach-Object {
        $sizeGB = [math]::Round($_.Value / 1GB, 2)
        Write-Host "      $($_.Key): $sizeGB GB" -ForegroundColor Gray
    }
}

# Función de organización
function New-OptimizedStructure {
    param($BasePath)

    Write-Host "`n🏗️ CREANDO ESTRUCTURA OPTIMIZADA" -ForegroundColor Blue

    foreach ($folder in $OptimizedStructure.Keys) {
        $folderPath = Join-Path $BasePath $folder
        $info = $OptimizedStructure[$folder]

        Write-Host "   📁 Creando: $folder (Prioridad: $($info.priority))" -ForegroundColor White

        if (!(Test-Path $folderPath)) {
            New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
        }

        foreach ($subfolder in $info.subfolders) {
            $subPath = Join-Path $folderPath $subfolder
            if (!(Test-Path $subPath)) {
                New-Item -ItemType Directory -Path $subPath -Force | Out-Null
                Write-Host "      📄 $subfolder" -ForegroundColor Gray
            }
        }
    }
}

# Función de backup
function Backup-Configurations {
    param($BasePath)

    Write-Host "`n💾 BACKUP DE CONFIGURACIONES CRÍTICAS" -ForegroundColor Blue

    $backupPath = Join-Path $BasePath "SYSTEM\Backups\Configurations"
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = Join-Path $backupPath "backup-$timestamp"

    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

    # Configuraciones críticas a respaldar
    $criticalConfigs = @(
        ".vscode",
        ".windsurf",
        ".gitconfig",
        ".docker",
        ".aws",
        ".azure",
        ".gemini",
        ".antigravity",
        ".codeium",
        ".copilot"
    )

    foreach ($config in $criticalConfigs) {
        $sourcePath = Join-Path $BasePath $config
        if (Test-Path $sourcePath) {
            $targetPath = Join-Path $backupDir $config
            Copy-Item -Path $sourcePath -Destination $targetPath -Recurse -Force
            Write-Host "   ✅ $config" -ForegroundColor Green
        }
    }

    Write-Host "   📍 Backup completado: $backupDir" -ForegroundColor Yellow
}

# Función de limpieza
function Remove-TempFiles {
    param($BasePath)

    Write-Host "`n🧹 LIMPIEZA DE ARCHIVOS TEMPORALES" -ForegroundColor Blue

    $tempPaths = @(
        "Temp",
        ".npm-cache",
        ".pnpm-store",
        ".cache",
        ".pytest_cache",
        ".thumbnails",
        "AppData\Local\Temp"
    )

    $totalFreed = 0

    foreach ($tempPath in $tempPaths) {
        $fullPath = Join-Path $BasePath $tempPath
        if (Test-Path $fullPath) {
            $sizeBefore = (Get-ChildItem -Path $fullPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum

            Remove-Item -Path "$fullPath\*" -Recurse -Force -ErrorAction SilentlyContinue

            $sizeAfter = (Get-ChildItem -Path $fullPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $freed = $sizeBefore - $sizeAfter
            $totalFreed += $freed

            if ($freed -gt 0) {
                $freedMB = [math]::Round($freed / 1MB, 2)
                Write-Host "   🗑️ ${tempPath}: $freedMB MB liberados" -ForegroundColor Green
            }
        }
    }

    $totalFreedGB = [math]::Round($totalFreed / 1GB, 2)
    Write-Host "   💾 Total liberado: $totalFreedGB GB" -ForegroundColor Yellow
}

# Ejecutar según parámetros
if ($Analyze) {
    Analyze-Directory -Path $BasePath
}

if ($Organize) {
    New-OptimizedStructure -BasePath $BasePath
}

if ($Backup) {
    Backup-Configurations -BasePath $BasePath
}

if ($Cleanup) {
    Remove-TempFiles -BasePath $BasePath
}

# Si no se especifican parámetros, mostrar menú
if (-not ($Analyze -or $Organize -or $Backup -or $Cleanup)) {
    Write-Host "`n🎯 MENÚ DE OPTIMIZACIÓN" -ForegroundColor Yellow
    Write-Host "1. 📊 Analizar directorio actual" -ForegroundColor White
    Write-Host "2. 🏗️ Crear estructura optimizada" -ForegroundColor White
    Write-Host "3. 💾 Backup configuraciones críticas" -ForegroundColor White
    Write-Host "4. 🧹 Limpiar archivos temporales" -ForegroundColor White
    Write-Host "5. 🚀 Ejecutar optimización completa" -ForegroundColor White
    Write-Host "`n💡 Uso: .\optimization-scripts-fixed.ps1 -Analyze -Organize -Backup -Cleanup" -ForegroundColor Cyan
}

Write-Host "`n✅ Sistema de optimización listo" -ForegroundColor Green
