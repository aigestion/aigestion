# 🚀 PC DEDICADO A AIGESTION.NET - LIMPIEZA COMPLETA
# Optimización total del sistema para el proyecto AIGestion

param(
    [switch]$DryRun,
    [switch]$Execute,
    [switch]$FullCleanup
)

Write-Host "🚀 PC DEDICADO A AIGESTION.NET" -ForegroundColor Green
Write-Host "🎯 Optimización completa del sistema" -ForegroundColor Yellow

# Rutas principales
$basePath = "C:\Users\Alejandro"
$aigestionPath = "$basePath\AIGestion"
$projectsPath = "$basePath\Projects"
$workspacePath = "$basePath\WORKSPACE"
$developmentPath = "$basePath\DEVELOPMENT"

Write-Host "`n📁 Rutas principales:" -ForegroundColor Blue
Write-Host "   🏢 AIGestion: $aigestionPath" -ForegroundColor Gray
Write-Host "   📁 Projects: $projectsPath" -ForegroundColor Gray
Write-Host "   🏗️ WORKSPACE: $workspacePath" -ForegroundColor Gray
Write-Host "   🔧 DEVELOPMENT: $developmentPath" -ForegroundColor Gray

# FASE 1: LIMPIEZA DE BASURA EN AIGESTION
Write-Host "`n🧹 FASE 1: LIMPIEZA DE BASURA EN AIGESTION" -ForegroundColor Red

$trashFolders = @(
    'node_modules',
    'dist',
    'build',
    '.next',
    '.cache',
    'coverage',
    '.venv',
    'out',
    '.turbo',
    '.nuxt',
    '.output',
    'tmp',
    'temp',
    '.parcel-cache',
    '.vite',
    '.nyc_output',
    '.pytest_cache',
    '__pycache__'
)

$aigestionTrash = @()
foreach ($folder in $trashFolders) {
    $found = Get-ChildItem -LiteralPath $aigestionPath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $folder }
    foreach ($f in $found) {
        $size = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $files = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object).Count
        $aigestionTrash += [PSCustomObject]@{
            Path   = $f.FullName
            Name   = $f.Name
            SizeGB = [math]::Round($size / 1GB, 3)
            Files  = $files
        }
    }
}

if ($aigestionTrash.Count -gt 0) {
    $totalSize = ($aigestionTrash | Measure-Object -Property SizeGB -Sum).Sum
    $totalFiles = ($aigestionTrash | Measure-Object -Property Files -Sum).Sum

    Write-Host "   📊 Basura AIGestion: $($aigestionTrash.Count) carpetas, $totalFiles archivos, $totalSize GB" -ForegroundColor Yellow

    if ($Execute) {
        Write-Host "   🚀 Eliminando basura de AIGestion..." -ForegroundColor Red
        foreach ($item in $aigestionTrash) {
            try {
                Write-Host "      🗑️ $($item.Name): $($item.SizeGB) GB" -ForegroundColor Gray
                Remove-Item -LiteralPath $item.Path -Recurse -Force
            }
            catch {
                Write-Host "      ❌ Error: $($item.Path)" -ForegroundColor Red
            }
        }
        Write-Host "   ✅ Basura AIGestion eliminada: $totalSize GB liberados" -ForegroundColor Green
    }
}
else {
    Write-Host "   ✅ AIGestion está limpio" -ForegroundColor Green
}

# FASE 2: LIMPIEZA DE BASURA EN PROJECTS
Write-Host "`n🧹 FASE 2: LIMPIEZA DE BASURA EN PROJECTS" -ForegroundColor Red

$projectsTrash = @()
foreach ($folder in $trashFolders) {
    $found = Get-ChildItem -LiteralPath $projectsPath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $folder }
    foreach ($f in $found) {
        $size = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $files = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object).Count
        $projectsTrash += [PSCustomObject]@{
            Path   = $f.FullName
            Name   = $f.Name
            SizeGB = [math]::Round($size / 1GB, 3)
            Files  = $files
        }
    }
}

if ($projectsTrash.Count -gt 0) {
    $totalSize = ($projectsTrash | Measure-Object -Property SizeGB -Sum).Sum
    $totalFiles = ($projectsTrash | Measure-Object -Property Files -Sum).Sum

    Write-Host "   📊 Basura Projects: $($projectsTrash.Count) carpetas, $totalFiles archivos, $totalSize GB" -ForegroundColor Yellow

    if ($Execute) {
        Write-Host "   🚀 Eliminando basura de Projects..." -ForegroundColor Red
        foreach ($item in $projectsTrash) {
            try {
                Write-Host "      🗑️ $($item.Name): $($item.SizeGB) GB" -ForegroundColor Gray
                Remove-Item -LiteralPath $item.Path -Recurse -Force
            }
            catch {
                Write-Host "      ❌ Error: $($item.Path)" -ForegroundColor Red
            }
        }
        Write-Host "   ✅ Basura Projects eliminada: $totalSize GB liberados" -ForegroundColor Green
    }
}
else {
    Write-Host "   ✅ Projects está limpio" -ForegroundColor Green
}

# FASE 3: LIMPIEZA DE TEMPORALES DEL SISTEMA
if ($FullCleanup) {
    Write-Host "`n🧹 FASE 3: LIMPIEZA DE TEMPORALES DEL SISTEMA" -ForegroundColor Red

    $tempPaths = @(
        "$basePath\AppData\Local\Temp",
        "$basePath\AppData\Local\Microsoft\Windows\INetCache",
        "$basePath\AppData\Roaming\Microsoft\Windows\Recent",
        "$basePath\.npm-cache",
        "$basePath\.pnpm-store",
        "$basePath\.cache",
        "$basePath\.pytest_cache",
        "$basePath\.thumbnails"
    )

    $systemTrash = 0
    foreach ($tempPath in $tempPaths) {
        if (Test-Path $tempPath) {
            $sizeBefore = (Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            if ($Execute) {
                try {
                    Remove-Item -Path "$tempPath\*" -Recurse -Force -ErrorAction SilentlyContinue
                    $sizeAfter = (Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                    $freed = $sizeBefore - $sizeAfter
                    $systemTrash += $freed
                    Write-Host "   🗑️ $(Split-Path $tempPath -Leaf): $([math]::Round($freed/1MB, 2)) MB" -ForegroundColor Gray
                }
                catch {
                    Write-Host "   ❌ Error limpiando: $tempPath" -ForegroundColor Red
                }
            }
            else {
                $systemTrash += $sizeBefore
                Write-Host "   📊 $(Split-Path $tempPath -Leaf): $([math]::Round($sizeBefore/1MB, 2)) MB" -ForegroundColor Gray
            }
        }
    }

    Write-Host "   💾 Temporales sistema: $([math]::Round($systemTrash/1GB, 2)) GB" -ForegroundColor Yellow
}

# FASE 4: VERIFICACIÓN DE ESPACIO
Write-Host "`n📊 FASE 4: VERIFICACIÓN DE ESPACIO" -ForegroundColor Blue

# Espacio después de limpieza
$aigestionSize = (Get-ChildItem -LiteralPath $aigestionPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$projectsSize = (Get-ChildItem -LiteralPath $projectsPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum

Write-Host "   📊 Espacio después de limpieza:" -ForegroundColor White
Write-Host "      🏢 AIGestion: $([math]::Round($aigestionSize/1GB, 2)) GB" -ForegroundColor Cyan
Write-Host "      📁 Projects: $([math]::Round($projectsSize/1GB, 2)) GB" -ForegroundColor Cyan
Write-Host "      🏗️ WORKSPACE: $((Get-ChildItem -LiteralPath $workspacePath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB) GB" -ForegroundColor Cyan
Write-Host "      🔧 DEVELOPMENT: $((Get-ChildItem -LiteralPath $developmentPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB) GB" -ForegroundColor Cyan

# FASE 5: OPTIMIZACIÓN DE ESTRUCTURA
Write-Host "`n🏗️ FASE 5: OPTIMIZACIÓN DE ESTRUCTURA" -ForegroundColor Blue

# Verificar estructura optimizada
$requiredFolders = @(
    "$workspacePath\AIGestion",
    "$workspacePath\Data",
    "$workspacePath\Projects",
    "$workspacePath\Archive",
    "$developmentPath\Dev",
    "$developmentPath\Scripts",
    "$developmentPath\Tools",
    "$developmentPath\Configs"
)

Write-Host "   ✅ Verificando estructura optimizada..." -ForegroundColor Gray
foreach ($folder in $requiredFolders) {
    if (Test-Path $folder) {
        Write-Host "      ✅ $(Split-Path $folder -Parent)\$(Split-Path $folder -Leaf)" -ForegroundColor Green
    }
    else {
        Write-Host "      ❌ $(Split-Path $folder -Parent)\$(Split-Path $folder -Leaf) - NO EXISTE" -ForegroundColor Red
    }
}

# FASE 6: RECOMENDACIONES
Write-Host "`n💡 FASE 6: RECOMENDACIONES" -ForegroundColor Yellow

Write-Host "   🎯 PC dedicado a AIGestion.net:" -ForegroundColor White
Write-Host "      • Mantener solo proyectos activos en Projects" -ForegroundColor Gray
Write-Host "      • Archivar proyectos inactivos en WORKSPACE\Archive" -ForegroundColor Gray
Write-Host "      • Usar WORKSPACE\AIGestion como código principal" -ForegroundColor Gray
Write-Host "      • Mantener DEVELOPMENT para herramientas y scripts" -ForegroundColor Gray
Write-Host "      • Limpiar temporales semanalmente" -ForegroundColor Gray

# Generar reporte final
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = "C:\Users\Alejandro\AIGestion\optimization-plan\pc-dedicated-report-$timestamp.txt"

"=== PC DEDICADO AIGESTION.NET REPORT - $timestamp ===" | Out-File -FilePath $reportPath -Encoding UTF8
"Limpieza completada del sistema para proyecto AIGestion" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Basura AIGestion eliminada: $($aigestionTrash.Count) carpetas" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Basura Projects eliminada: $($projectsTrash.Count) carpetas" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Espacio AIGestion: $([math]::Round($aigestionSize/1GB, 2)) GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Espacio Projects: $([math]::Round($projectsSize/1GB, 2)) GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append

Write-Host "`n📄 Reporte guardado: $reportPath" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "`n💡 MODO SIMULACIÓN - Para ejecutar realmente: .\pc-dedicated-aigestion.ps1 -Execute" -ForegroundColor Cyan
    Write-Host "💡 Para limpieza completa: .\pc-dedicated-aigestion.ps1 -Execute -FullCleanup" -ForegroundColor Cyan
}
elseif ($Execute) {
    Write-Host "`n🎉 PC OPTIMIZADO PARA AIGESTION.NET" -ForegroundColor Green
    Write-Host "✅ Sistema listo para desarrollo dedicado" -ForegroundColor Green
}

Write-Host "`n🚀 AIGESTION.NET - PC DEDICADO COMPLETADO" -ForegroundColor Green
