# 🧹 LIMPIEZA COMPLETA DE ALEJANDRO - PC DEDICADO A AIGESTION.NET
# Eliminar basura de todo el sistema, dejando AIGestion para Antigravity

param(
    [switch]$DryRun,
    [switch]$Execute
)

Write-Host "🧹 LIMPIEZA COMPLETA DE ALEJANDRO" -ForegroundColor Green
Write-Host "🎯 PC dedicado a AIGestion.net" -ForegroundColor Yellow

# Rutas principales
$basePath = "C:\Users\Alejandro"
$excludePaths = @(
    "$basePath\AIGestion",  # Dejar intacto para Antigravity
    "$basePath\WORKSPACE", # Estructura optimizada
    "$basePath\DEVELOPMENT", # Herramientas copiadas
    "$basePath\.gemini", # Configuración Gemini
    "$basePath\.antigravity", # Configuración Antigravity
    "$basePath\.vscode", # Config VSCode
    "$basePath\.windsurf" # Config Windsurf
)

Write-Host "`n📁 Rutas protegidas (no se tocarán):" -ForegroundColor Blue
foreach ($path in $excludePaths) {
    Write-Host "   🛡️ $path" -ForegroundColor Gray
}

# Carpetas basura a eliminar en todo el sistema
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
    '__pycache__',
    '.nuxt',
    '.svelte-kit',
    '.angular',
    '.gradle',
    'target',
    'bin',
    'obj'
)

# Carpetas temporales del sistema
$tempSystemFolders = @(
    "$basePath\AppData\Local\Temp",
    "$basePath\AppData\Local\Microsoft\Windows\INetCache",
    "$basePath\AppData\Roaming\Microsoft\Windows\Recent",
    "$basePath\.npm-cache",
    "$basePath\.pnpm-store",
    "$basePath\.cache",
    "$basePath\.pytest_cache",
    "$basePath\.thumbnails",
    "$basePath\Downloads",
    "$basePath\Desktop",
    "$basePath\Music",
    "$basePath\Videos",
    "$basePath\Pictures"
)

Write-Host "`n🔍 ANALIZANDO BASURA EN TODO EL SISTEMA..." -ForegroundColor Red

$systemTrash = @()
$totalSize = 0
$totalFiles = 0

# Buscar basura en todo el sistema excepto rutas protegidas
foreach ($folder in $trashFolders) {
    $found = Get-ChildItem -LiteralPath $basePath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -eq $folder -and
        -not ($excludePaths | Where-Object { $_.FullName.StartsWith($_) })
    }

    foreach ($f in $found) {
        try {
            $size = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $files = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object).Count

            $systemTrash += [PSCustomObject]@{
                Path   = $f.FullName
                Name   = $f.Name
                SizeGB = [math]::Round($size / 1GB, 3)
                Files  = $files
            }

            $totalSize += $size
            $totalFiles += $files
        }
        catch {
            # Ignorar errores de acceso
        }
    }
}

Write-Host "📊 BASURA DETECTADA:" -ForegroundColor Yellow
Write-Host "   🗑️ Carpetas: $($systemTrash.Count)" -ForegroundColor White
Write-Host "   📄 Archivos: $totalFiles" -ForegroundColor White
Write-Host "   💾 Tamaño: $([math]::Round($totalSize/1GB, 2)) GB" -ForegroundColor White

# Mostrar las 10 carpetas más grandes
Write-Host "`n📋 CARPETAS MÁS GRANDES:" -ForegroundColor Blue
$systemTrash | Sort-Object -Property SizeGB -Descending | Select-Object -First 10 | ForEach-Object {
    $relativePath = $_.Path.Replace($basePath, '')
    Write-Host "   🗑️ $($_.Name): $($_.SizeGB) GB ($($_.Files) archivos)" -ForegroundColor Gray
    Write-Host "      📍 $relativePath" -ForegroundColor DarkGray
}

# Agrupar por tipo
Write-Host "`n📈 RESUMEN POR TIPO:" -ForegroundColor Blue
$grouped = $systemTrash | Group-Object Name | Sort-Object -Property { ($_.Group | Measure-Object -Property SizeGB -Sum).Sum } -Descending
foreach ($group in $grouped) {
    $groupSize = [math]::Round(($group.Group | Measure-Object -Property SizeGB -Sum).Sum, 2)
    $groupFiles = ($group.Group | Measure-Object -Property Files -Sum).Sum
    Write-Host "   🗑️ $($group.Name): $groupSize GB ($groupFiles archivos) en $($group.Count) ubicaciones" -ForegroundColor White
}

# Limpieza de temporales del sistema
Write-Host "`n🧹 LIMPIEZA DE TEMPORALES DEL SISTEMA:" -ForegroundColor Red
$tempSize = 0

foreach ($tempPath in $tempSystemFolders) {
    if (Test-Path $tempPath) {
        try {
            $size = (Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $files = (Get-ChildItem -Path $tempPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count

            Write-Host "   📁 $(Split-Path $tempPath -Leaf): $([math]::Round($size/1GB, 2)) GB ($files archivos)" -ForegroundColor Gray
            $tempSize += $size
        }
        catch {
            Write-Host "   ❌ Error accediendo a: $tempPath" -ForegroundColor Red
        }
    }
}

Write-Host "   💾 Temporales sistema: $([math]::Round($tempSize/1GB, 2)) GB" -ForegroundColor Yellow

# Ejecutar limpieza si se solicita
if ($Execute) {
    Write-Host "`n🚀 EJECUTANDO LIMPIEZA COMPLETA..." -ForegroundColor Red

    # Eliminar basura de proyectos
    $deletedSize = 0
    $deletedFiles = 0

    foreach ($item in $systemTrash) {
        try {
            Write-Host "   🗑️ Eliminando: $($item.Name) ($($item.SizeGB) GB)" -ForegroundColor Yellow
            Remove-Item -LiteralPath $item.Path -Recurse -Force
            $deletedSize += $item.SizeGB
            $deletedFiles += $item.Files
        }
        catch {
            Write-Host "   ❌ Error eliminando: $($item.Path)" -ForegroundColor Red
        }
    }

    # Limpiar temporales
    foreach ($tempPath in $tempSystemFolders) {
        if (Test-Path $tempPath) {
            try {
                Write-Host "   🗑️ Limpiando: $(Split-Path $tempPath -Leaf)" -ForegroundColor Yellow
                Remove-Item -Path "$tempPath\*" -Recurse -Force -ErrorAction SilentlyContinue
            }
            catch {
                Write-Host "   ❌ Error limpiando: $tempPath" -ForegroundColor Red
            }
        }
    }

    Write-Host "`n✅ LIMPIEZA COMPLETADA:" -ForegroundColor Green
    Write-Host "   🗑️ Carpetas eliminadas: $($systemTrash.Count)" -ForegroundColor White
    Write-Host "   📄 Archivos eliminados: $deletedFiles" -ForegroundColor White
    Write-Host "   💾 Espacio liberado: $([math]::Round($deletedSize, 2)) GB" -ForegroundColor White
    Write-Host "   💾 Temporales liberados: $([math]::Round($tempSize/1GB, 2)) GB" -ForegroundColor White
}
elseif ($DryRun) {
    Write-Host "`n💡 MODO SIMULACIÓN - No se eliminó nada" -ForegroundColor Cyan
    Write-Host "   Para ejecutar realmente: .\cleanup-alejandro-complete.ps1 -Execute" -ForegroundColor Cyan
}

# Verificación final
Write-Host "`n📊 VERIFICACIÓN FINAL:" -ForegroundColor Blue

# Espacio en rutas protegidas
Write-Host "   🛡️ Rutas protegidas intactas:" -ForegroundColor Gray
foreach ($path in $excludePaths) {
    if (Test-Path $path) {
        $size = (Get-ChildItem -LiteralPath $path -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        Write-Host "      ✅ $(Split-Path $path -Leaf): $([math]::Round($size/1GB, 2)) GB" -ForegroundColor Green
    }
}

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES PARA PC DEDICADO AIGESTION.NET:" -ForegroundColor Yellow
Write-Host "   🎯 Estructura optimizada:" -ForegroundColor White
Write-Host "      • WORKSPACE\ - Proyectos AIGestion" -ForegroundColor Gray
Write-Host "      • DEVELOPMENT\ - Herramientas y scripts" -ForegroundColor Gray
Write-Host "      • AIGestion\ - Código principal (para Antigravity)" -ForegroundColor Gray
Write-Host "   🧹 Mantenimiento:" -ForegroundColor White
Write-Host "      • Ejecutar limpieza semanalmente" -ForegroundColor Gray
Write-Host "      • Archivar proyectos inactivos" -ForegroundColor Gray
Write-Host "      • Mantener solo lo esencial" -ForegroundColor Gray

# Generar reporte
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = "C:\Users\Alejandro\AIGestion\optimization-plan\cleanup-alejandro-report-$timestamp.txt"

"=== CLEANUP ALEJANDRO COMPLETE REPORT - $timestamp ===" | Out-File -FilePath $reportPath -Encoding UTF8
"PC dedicado a AIGestion.net - Limpieza completa del sistema" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Basura eliminada: $($systemTrash.Count) carpetas" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Archivos eliminados: $totalFiles" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Espacio liberado: $([math]::Round($totalSize/1GB, 2)) GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Temporales liberados: $([math]::Round($tempSize/1GB, 2)) GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append

Write-Host "`n📄 Reporte guardado: $reportPath" -ForegroundColor Cyan

Write-Host "`n🎉 SISTEMA ALEJANDRO OPTIMIZADO PARA AIGESTION.NET" -ForegroundColor Green
Write-Host "✅ PC listo para desarrollo dedicado" -ForegroundColor Green
Write-Host "🤖 AIGestion intacto para Antigravity" -ForegroundColor Green
