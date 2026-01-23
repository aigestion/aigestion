# COMANDOS PARA ANTIGRAVITY - ANÁLISIS DE MIGRACIÓN
# Estos comandos están listos para que Antigravity los ejecute

# ANÁLISIS DE PROJECTS
Write-Host "🔍 ANALIZANDO PROJECTS..." -ForegroundColor Green
$projectsRoot = "C:\Users\Alejandro\Projects"
$projectsAnalysis = @()

# Obtener subcarpetas principales
$projectFolders = Get-ChildItem -Path $projectsRoot -Directory -Force -ErrorAction SilentlyContinue

foreach ($folder in $projectFolders) {
    $path = $folder.FullName
    $name = $folder.Name

    # Detectar si es un repo git
    $isGitRepo = Test-Path (Join-Path $path ".git")

    # Calcular tamaño total
    $totalSize = (Get-ChildItem -Path $path -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum

    # Contar archivos basura
    $nodeModulesSize = 0
    $distSize = 0
    $buildSize = 0

    $nmPath = Join-Path $path "node_modules"
    if (Test-Path $nmPath) {
        $nodeModulesSize = (Get-ChildItem -Path $nmPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    $distPath = Join-Path $path "dist"
    if (Test-Path $distPath) {
        $distSize = (Get-ChildItem -Path $distPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    $buildPath = Join-Path $path "build"
    if (Test-Path $buildPath) {
        $buildSize = (Get-ChildItem -Path $buildPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    # Calcular tamaño real (sin basura)
    $realSize = $totalSize - $nodeModulesSize - $distSize - $buildSize

    # Última modificación
    $lastModified = $folder.LastWriteTime

    $projectsAnalysis += [PSCustomObject]@{
        Name              = $name
        Path              = $path
        IsGitRepo         = $isGitRepo
        TotalSizeGB       = [math]::Round($totalSize / 1GB, 3)
        RealSizeGB        = [math]::Round($realSize / 1GB, 3)
        NodeModulesSizeGB = [math]::Round($nodeModulesSize / 1GB, 3)
        DistSizeGB        = [math]::Round($distSize / 1GB, 3)
        BuildSizeGB       = [math]::Round($buildSize / 1GB, 3)
        LastModified      = $lastModified
        Priority          = if ($isGitRepo -and $realSize -gt 0) { "Alta" } elseif ($realSize -gt 0) { "Media" } else { "Baja" }
    }
}

# ANÁLISIS DE AIGESTION
Write-Host "🔍 ANALIZANDO AIGESTION..." -ForegroundColor Green
$aigestionRoot = "C:\Users\Alejandro\AIGestion"
$aigestionAnalysis = @()

$aigestionFolders = Get-ChildItem -Path $aigestionRoot -Directory -Force -ErrorAction SilentlyContinue

foreach ($folder in $aigestionFolders) {
    $path = $folder.FullName
    $name = $folder.Name

    # Detectar si es un repo git
    $isGitRepo = Test-Path (Join-Path $path ".git")

    # Detectar tipo de componente
    $isPackageJson = Test-Path (Join-Path $path "package.json")
    $isPython = Test-Path (Join-Path $path "requirements.txt") -or (Test-Path (Join-Path $path "pyproject.toml"))

    # Calcular tamaño total
    $totalSize = (Get-ChildItem -Path $path -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum

    # Contar archivos basura
    $nodeModulesSize = 0
    $distSize = 0
    $buildSize = 0
    $cacheSize = 0

    $nmPath = Join-Path $path "node_modules"
    if (Test-Path $nmPath) {
        $nodeModulesSize = (Get-ChildItem -Path $nmPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    $distPath = Join-Path $path "dist"
    if (Test-Path $distPath) {
        $distSize = (Get-ChildItem -Path $distPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    $buildPath = Join-Path $path "build"
    if (Test-Path $buildPath) {
        $buildSize = (Get-ChildItem -Path $buildPath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    $cachePath = Join-Path $path ".cache"
    if (Test-Path $cachePath) {
        $cacheSize = (Get-ChildItem -Path $cachePath -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    }

    # Calcular tamaño real (sin basura)
    $realSize = $totalSize - $nodeModulesSize - $distSize - $buildSize - $cacheSize

    $aigestionAnalysis += [PSCustomObject]@{
        Name              = $name
        Path              = $path
        IsGitRepo         = $isGitRepo
        IsPackageJson     = $isPackageJson
        IsPython          = $isPython
        TotalSizeGB       = [math]::Round($totalSize / 1GB, 3)
        RealSizeGB        = [math]::Round($realSize / 1GB, 3)
        NodeModulesSizeGB = [math]::Round($nodeModulesSize / 1GB, 3)
        DistSizeGB        = [math]::Round($distSize / 1GB, 3)
        BuildSizeGB       = [math]::Round($buildSize / 1GB, 3)
        CacheSizeGB       = [math]::Round($cacheSize / 1GB, 3)
        Priority          = if ($realSize -gt 0.1) { "Alta" } elseif ($realSize -gt 0) { "Media" } else { "Baja" }
    }
}

# GENERAR REPORTES
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportPath = "C:\Users\Alejandro\AIGestion\optimization-plan\antigravity-analysis-$timestamp.txt"

"=== ANTIGRAVITY ANALYSIS REPORT - $timestamp ===" | Out-File -FilePath $reportPath -Encoding UTF8

"" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"PROJECTS ANALYSIS" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"==================" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
$projectsAnalysis | Sort-Object -Property RealSizeGB -Descending | ForEach-Object {
    "$($_.Name) | Git:$($_.IsGitRepo) | RealSize:$($_.RealSizeGB)GB | Total:$($_.TotalSizeGB)GB | Priority:$($_.Priority)" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
}

"" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"AIGESTION ANALYSIS" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"===================" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
$aigestionAnalysis | Sort-Object -Property RealSizeGB -Descending | ForEach-Object {
    "$($_.Name) | Git:$($_.IsGitRepo) | Package:$($_.IsPackageJson) | Python:$($_.IsPython) | RealSize:$($_.RealSizeGB)GB | Total:$($_.TotalSizeGB)GB | Priority:$($_.Priority)" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
}

"" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"RECOMMENDATIONS" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"================" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"1. Copy Projects with Git repos and RealSize > 0 first" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"2. Exclude node_modules, dist, build, .cache folders" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"3. Prioritize AIGestion components with RealSize > 0.1GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append

Write-Host "✅ Análisis completado. Reporte guardado en: $reportPath" -ForegroundColor Green
Write-Host "📊 Projects analizados: $($projectsAnalysis.Count)" -ForegroundColor Cyan
Write-Host "📊 AIGestion componentes analizados: $($aigestionAnalysis.Count)" -ForegroundColor Cyan

# Mostrar resumen
$projectsRealTotal = ($projectsAnalysis | Measure-Object -Property RealSizeGB -Sum).Sum
$aigestionRealTotal = ($aigestionAnalysis | Measure-Object -Property RealSizeGB -Sum).Sum

Write-Host "💾 Tamaño real Projects: $([math]::Round($projectsRealTotal, 2))GB" -ForegroundColor Yellow
Write-Host "💾 Tamaño real AIGestion: $([math]::Round($aigestionRealTotal, 2))GB" -ForegroundColor Yellow
Write-Host "💾 Total a copiar: $([math]::Round($projectsRealTotal + $aigestionRealTotal, 2))GB" -ForegroundColor Green
