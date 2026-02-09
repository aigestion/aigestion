# 🏗️ ESTRUCTURA MODULAR OPTIMIZADA PARA ALEJANDRO
# Sistema de optimización por fases para no sobrecargar

Write-Host "🏗️ CREANDO ESTRUCTURA MODULAR ALEJANDRO" -ForegroundColor Green
Write-Host "📦 Sistema optimizado por fases" -ForegroundColor Yellow

# Ruta base para la estructura modular
$basePath = "C:\Users\Alejandro\AIGestion\optimization-plan"
$modularPath = "$basePath\modular-system"

# Estructura de directorios modulares
$modularStructure = @(
  "core\",
  "core\config\",
  "core\functions\",
  "modules",
  "modules\01-analysis",
  "modules\02-cleanup",
  "modules\03-migration",
  "modules\04-tools",
  "modules\05-maintenance",
  "reports\",
  "logs\",
  "backups\"
)

Write-Host "`n📁 Creando estructura modular..." -ForegroundColor Blue

foreach ($folder in $modularStructure) {
  $fullPath = Join-Path $modularPath $folder
  if (!(Test-Path $fullPath)) {
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Write-Host "   ✅ Creado: $folder" -ForegroundColor Green
  }
  else {
    Write-Host "   ✅ Existe: $folder" -ForegroundColor Gray
  }
}

# Archivo de configuración principal
$configContent = @"
# 🎯 CONFIGURACIÓN MODULAR ALEJANDRO
# Sistema de optimización por fases

@{
    General = @{
        UserPath = "C:\Users\Alejandro"
        BasePath = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system"
        SafeMode = `$true
        LogLevel = "Info"
        MaxParallelJobs = 3
    }

    ProtectedPaths = @(
        "C:\Users\Alejandro\AIGestion",
        "C:\Users\Alejandro\.gemini",
        "C:\Users\Alejandro\.antigravity",
        "C:\Users\Alejandro\.vscode",
        "C:\Users\Alejandro\.windsurf"
    )

    Modules = @{
        "01-analysis" = @{
            Name = "Análisis y Seguridad"
            Priority = 1
            AutoRun = `$true
            Dependencies = @()
            Description = "Análisis de espacio y seguridad del sistema"
        }
        "02-cleanup" = @{
            Name = "Limpieza Inteligente"
            Priority = 2
            AutoRun = `$false
            Dependencies = @("01-analysis")
            Description = "Limpieza de basura regenerable"
        }
        "03-migration" = @{
            Name = "Migración Estructurada"
            Priority = 3
            AutoRun = `$false
            Dependencies = @("01-analysis")
            Description = "Reorganización de carpetas críticas"
        }
        "04-tools" = @{
            Name = "Optimización de Herramientas"
            Priority = 4
            AutoRun = `$false
            Dependencies = @("03-migration")
            Description = "Centralización de configuraciones IA"
        }
        "05-maintenance" = @{
            Name = "Mantenimiento Automático"
            Priority = 5
            AutoRun = `$false
            Dependencies = @("04-tools")
            Description = "Programación de tareas periódicas"
        }
    }

    TrashFolders = @(
        'node_modules', 'dist', 'build', '.next', '.cache',
        'coverage', '.venv', 'out', '.turbo', '.nuxt',
        '.output', 'tmp', 'temp', '.parcel-cache',
        '.vite', '.nyc_output', '.pytest_cache',
        '__pycache__', '.svelte-kit', '.angular',
        '.gradle', 'target', 'bin', 'obj'
    )

    TempFolders = @(
        "AppData\Local\Temp",
        "AppData\Local\Microsoft\Windows\INetCache",
        "AppData\Roaming\Microsoft\Windows\Recent",
        ".npm-cache", ".pnpm-store", ".cache",
        ".pytest_cache", ".thumbnails", "Downloads"
    )
}
"@

$configContent | Out-File -FilePath "$modularPath\core\config\modular-config.psd1" -Encoding UTF8
Write-Host "   ✅ Configuración guardada: core\config\modular-config.psd1" -ForegroundColor Green

# Funciones core comunes
$functionsContent = @"
# 🔧 FUNCIONES CORE MODULARES
# Compartidas entre todos los módulos

function Get-ModularConfig {
    param(
        [string]`$ConfigPath = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system\core\config\modular-config.psd1"
    )

    if (Test-Path `$ConfigPath) {
        return Import-PowerShellDataFile -Path `$ConfigPath
    }
    else {
        throw "No se encuentra el archivo de configuración: `$ConfigPath"
    }
}

function Write-ModularLog {
    param(
        [string]`$Message,
        [ValidateSet("Info", "Warning", "Error", "Success")]
        [string]`$Level = "Info",
        [string]`$Module = "System"
    )

    `$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    `$logPath = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system\logs"

    `$logFile = Join-Path `$logPath "modular-`$(Get-Date -Format 'yyyyMMdd').log"

    `$logEntry = "[`$timestamp] [`$Level] [`$Module] `$Message"
    `$logEntry | Out-File -FilePath `$logFile -Append -Encoding UTF8

    switch (`$Level) {
        "Info"    { Write-Host `$logEntry -ForegroundColor White }
        "Warning" { Write-Host `$logEntry -ForegroundColor Yellow }
        "Error"   { Write-Host `$logEntry -ForegroundColor Red }
        "Success" { Write-Host `$logEntry -ForegroundColor Green }
    }
}

function Test-ProtectedPath {
    param(
        [string]`$Path,
        [array]`$ProtectedPaths
    )

    foreach (`$protected in `$ProtectedPaths) {
        if (`$Path.StartsWith(`$protected)) {
            return `$true
        }
    }
    return `$false
}

function Get-SafeFolderSize {
    param(
        [string]`$Path,
        [switch]`$IncludeFiles
    )

    try {
        if (`$IncludeFiles) {
            `$files = Get-ChildItem -Path `$Path -Recurse -File -ErrorAction SilentlyContinue
            `$size = (`$files | Measure-Object -Property Length -Sum).Sum
            `$count = `$files.Count
            return @{
                Size = `$size
                SizeGB = [math]::Round(`$size / 1GB, 3)
                Files = `$count
                Success = `$true
            }
        }
        else {
            `$size = (Get-ChildItem -Path `$Path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            return @{
                Size = `$size
                SizeGB = [math]::Round(`$size / 1GB, 3)
                Success = `$true
            }
        }
    }
    catch {
        return @{
            Size = 0
            SizeGB = 0
            Files = 0
            Success = `$false
            Error = `$_.Exception.Message
        }
    }
}

function New-ModularReport {
    param(
        [string]`$ModuleName,
        [hashtable]`$Data,
        [string]`$Title = "Reporte de Módulo"
    )

    `$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    `$reportPath = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system\reports"
    `$reportFile = Join-Path `$reportPath "`$ModuleName-report-`$timestamp.md"

    `$report = "# 📊 `$Title - `$ModuleName`n`n"
    `$report += "**Fecha:** `$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")`n"
    `$report += "**Módulo:** `$ModuleName`n`n"
    `$report += "## 📈 RESUMEN EJECUTIVO`n`n"

    foreach (`$key in `$Data.Keys) {
        `$report += "- **`$key**: `$(`$Data[`$key])`n"
    }

    `$report += "`n## 📋 DETALLES`n`n"

    foreach (`$key in `$Data.Keys) {
        `$report += "### `$key`n"
        `$report += "`````n"
        if (`$Data[`$key] -is [array]) {
            `$Data[`$key] | ForEach-Object { `$report += "- `$_`n" }
        } else {
            `$report += "`$(`$Data[`$key])`n"
        }
        `$report += "`````n`n"
    }

    `$report += "`n---`n**Reporte generado por Sistema Modular Alejandro`n"

    `$report | Out-File -FilePath `$reportFile -Encoding UTF8
    Write-ModularLog "Reporte guardado: `$reportFile" -Level Success -Module `$ModuleName

    return `$reportFile
}

function Test-ModuleDependencies {
    param(
        [string]`$ModuleName,
        [hashtable]`$ModulesConfig
    )

    `$module = `$ModulesConfig[`$ModuleName]
    if (-not `$module) {
        throw "Módulo no encontrado: `$ModuleName"
    }

    foreach (`$dependency in `$module.Dependencies) {
        `$depModule = `$ModulesConfig[`$dependency]
        if (-not `$depModule) {
            throw "Dependencia no encontrada: `$dependency"
        }

        `$statusFile = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system\modules\`$dependency\status.txt"
        if (!(Test-Path `$statusFile)) {
            return `$false
        }

        `$status = Get-Content `$statusFile
        if (`$status -ne "Completed") {
            return `$false
        }
    }

    return `$true
}

function Set-ModuleStatus {
    param(
        [string]`$ModuleName,
        [ValidateSet("Pending", "Running", "Completed", "Failed")]
        [string]`$Status = "Pending"
    )

    `$statusFile = "C:\Users\Alejandro\AIGestion\optimization-plan\modular-system\modules\`$ModuleName\status.txt"
    `$Status | Out-File -FilePath `$statusFile -Encoding UTF8

    Write-ModularLog "Módulo `$ModuleName actualizado a: `$Status" -Level Info -Module `$ModuleName
}
"@

$functionsContent | Out-File -FilePath "$modularPath\core\functions\modular-functions.ps1" -Encoding UTF8
Write-Host "   ✅ Funciones core guardadas: core\functions\modular-functions.ps1" -ForegroundColor Green

Write-Host "`n🎉 ESTRUCTURA MODULAR CREADA" -ForegroundColor Green
Write-Host "📦 Sistema optimizado por fases listo para usar" -ForegroundColor Yellow
