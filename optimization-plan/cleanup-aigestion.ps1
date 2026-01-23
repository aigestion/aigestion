# LIMPIEZA DE BASURA EN AIGESTION
# Elimina carpetas basura regenerables para liberar espacio

param(
    [string]$AIGestionRoot = 'C:\Users\Alejandro\AIGestion',
    [switch]$DryRun,
    [switch]$Execute
)

Write-Host "🧹 LIMPIEZA DE BASURA EN AIGESTION" -ForegroundColor Green
Write-Host "📁 Ruta: $AIGestionRoot" -ForegroundColor Yellow

# Carpetas basura regenerables
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
    'temp'
)

Write-Host "`n🔍 BUSCANDO CARPETAS BASURA..." -ForegroundColor Blue

$foundTrash = @()
$totalSize = 0
$totalFiles = 0

# Buscar carpetas basura
foreach ($folder in $trashFolders) {
    $folders = Get-ChildItem -LiteralPath $AIGestionRoot -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $folder }

    foreach ($f in $folders) {
        $size = 0
        $files = 0

        try {
            $files = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object).Count
            $size = (Get-ChildItem -LiteralPath $f.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        }
        catch {
            $size = 0
            $files = 0
        }

        $sizeGB = [math]::Round($size / 1GB, 3)

        $foundTrash += [PSCustomObject]@{
            Path   = $f.FullName
            Name   = $f.Name
            Parent = Split-Path $f.FullName -Parent
            SizeGB = $sizeGB
            Files  = $files
        }

        $totalSize += $size
        $totalFiles += $files
    }
}

# Mostrar resultados
if ($foundTrash.Count -gt 0) {
    Write-Host "`n📊 BASURA DETECTADA:" -ForegroundColor Yellow
    Write-Host "   🗑️ Carpetas: $($foundTrash.Count)" -ForegroundColor White
    Write-Host "   📄 Archivos: $totalFiles" -ForegroundColor White
    Write-Host "   💾 Tamaño total: $([math]::Round($totalSize/1GB, 2)) GB" -ForegroundColor White

    Write-Host "`n📋 DETALLE POR CARPETA:" -ForegroundColor Blue
    $foundTrash | Sort-Object -Property SizeGB -Descending | ForEach-Object {
        $relativePath = $_.Path.Replace($AIGestionRoot, '')
        Write-Host "   🗑️ $($_.Name): $($_.SizeGB) GB ($($_.Files) archivos)" -ForegroundColor Gray
        Write-Host "      📍 $relativePath" -ForegroundColor DarkGray
    }

    # Agrupar por tipo
    Write-Host "`n📈 RESUMEN POR TIPO:" -ForegroundColor Blue
    $grouped = $foundTrash | Group-Object Name | Sort-Object -Property { ($_.Group | Measure-Object -Property SizeGB -Sum).Sum } -Descending
    foreach ($group in $grouped) {
        $groupSize = [math]::Round(($group.Group | Measure-Object -Property SizeGB -Sum).Sum, 2)
        $groupFiles = ($group.Group | Measure-Object -Property Files -Sum).Sum
        Write-Host "   🗑️ $($group.Name): $groupSize GB ($groupFiles archivos) en $($group.Count) ubicaciones" -ForegroundColor White
    }

    # Ejecutar limpieza si se solicita
    if ($Execute) {
        Write-Host "`n🚀 EJECUTANDO LIMPIEZA..." -ForegroundColor Red
        $deletedSize = 0
        $deletedFiles = 0

        foreach ($item in $foundTrash) {
            try {
                Write-Host "   🗑️ Eliminando: $($item.Name) ($($item.SizeGB) GB)" -ForegroundColor Yellow
                Remove-Item -LiteralPath $item.Path -Recurse -Force
                $deletedSize += $item.SizeGB
                $deletedFiles += $item.Files
                Write-Host "   ✅ Eliminado: $($item.Name)" -ForegroundColor Green
            }
            catch {
                Write-Host "   ❌ Error al eliminar: $($item.Path)" -ForegroundColor Red
                Write-Host "      $($_.Exception.Message)" -ForegroundColor DarkRed
            }
        }

        Write-Host "`n✅ LIMPIEZA COMPLETADA:" -ForegroundColor Green
        Write-Host "   🗑️ Carpetas eliminadas: $($foundTrash.Count)" -ForegroundColor White
        Write-Host "   📄 Archivos eliminados: $deletedFiles" -ForegroundColor White
        Write-Host "   💾 Espacio liberado: $([math]::Round($deletedSize, 2)) GB" -ForegroundColor White
    }
    elseif ($DryRun) {
        Write-Host "`n💡 MODO SIMULACIÓN - No se eliminó nada" -ForegroundColor Cyan
        Write-Host "   Para ejecutar realmente: .\cleanup-aigestion.ps1 -Execute" -ForegroundColor Cyan
    }
}
else {
    Write-Host "`n✅ NO SE ENCONTRÓ BASURA" -ForegroundColor Green
    Write-Host "   AIGestion está limpio" -ForegroundColor Gray
}

# Generar reporte
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportPath = "C:\Users\Alejandro\AIGestion\optimization-plan\cleanup-report-$timestamp.txt"

"=== AIGESTION CLEANUP REPORT - $timestamp ===" | Out-File -FilePath $reportPath -Encoding UTF8
"Total basura detectada: $($foundTrash.Count) carpetas" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Total archivos: $totalFiles" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Espacio total: $([math]::Round($totalSize/1GB, 2)) GB" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
"Detalle:" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
$foundTrash | ForEach-Object {
    "$($_.Path) | $($_.SizeGB) GB | $($_.Files) archivos" | Out-File -FilePath $reportPath -Encoding UTF8 -Append
}

Write-Host "`n📄 Reporte guardado: $reportPath" -ForegroundColor Cyan
