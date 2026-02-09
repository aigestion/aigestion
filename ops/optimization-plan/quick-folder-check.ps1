# ANÁLISIS RÁPIDO DE CARPETAS CRÍTICAS
# Versión ultra simplificada para análisis inmediato

Write-Host "🚀 ANÁLISIS RÁPIDO DE CARPETAS" -ForegroundColor Green
Write-Host "📁 Verificando carpetas importantes para migración" -ForegroundColor Yellow

$basePath = "c:\Users\Alejandro"

# Carpetas críticas a verificar
$criticalFolders = @(
    "AIGestion",
    "Data",
    "Dev",
    "scripts",
    "Projects",
    "Tools",
    ".vscode",
    ".gemini",
    ".antigravity",
    ".codeium",
    ".copilot"
)

Write-Host "`n📊 ANÁLISIS DE CARPETAS CRÍTICAS:" -ForegroundColor Blue

$totalSize = 0
$foundCount = 0

foreach ($folder in $criticalFolders) {
    $folderPath = Join-Path $basePath $folder

    if (Test-Path $folderPath) {
        try {
            # Obtener información básica
            $item = Get-Item $folderPath
            $files = (Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
            $size = (Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            $sizeGB = [math]::Round($size / 1GB, 2)

            # Determinar prioridad
            $priority = switch ($folder) {
                "AIGestion" { "🔴 Máxima" }
                "Data" { "🔴 Máxima" }
                "Dev" { "🟡 Alta" }
                "scripts" { "🟡 Alta" }
                ".vscode" { "🟡 Alta" }
                ".gemini" { "🟡 Alta" }
                ".antigravity" { "🟡 Alta" }
                default { "🟢 Media" }
            }

            Write-Host "   ✅ $folder" -ForegroundColor Green
            Write-Host "      🎯 Prioridad: $priority" -ForegroundColor Gray
            Write-Host "      📄 Archivos: $files" -ForegroundColor Cyan
            Write-Host "      💾 Tamaño: $sizeGB GB" -ForegroundColor Cyan
            Write-Host "      📅 Modificado: $($item.LastWriteTime)" -ForegroundColor Gray

            $totalSize += $size
            $foundCount++
        }
        catch {
            Write-Host "   ❌ $folder - Error al analizar" -ForegroundColor Red
        }
    }
    else {
        Write-Host "   ❌ $folder - No existe" -ForegroundColor Red
    }

    Write-Host ""  # Línea en blanco para separación
}

# Resumen final
Write-Host "📊 RESUMEN DEL ANÁLISIS" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host "📁 Carpetas encontradas: $foundCount/$($criticalFolders.Count)" -ForegroundColor White
Write-Host "💾 Tamaño total: $([math]::Round($totalSize/1GB, 2)) GB" -ForegroundColor Blue
Write-Host "📄 Promedio por carpeta: $([math]::Round($totalSize/$foundCount/1GB, 2)) GB" -ForegroundColor Cyan

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Yellow

if ($totalSize -gt 5) {
    Write-Host "🧹 Considerar limpieza - Más de 5GB en carpetas críticas" -ForegroundColor Orange
}

if ($foundCount -ge 7) {
    Write-Host "🚀 Buenas candidatas para migración - $foundCount carpetas encontradas" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Pocas carpetas críticas - Revisar estructura actual" -ForegroundColor Orange
}

Write-Host "📋 Siguiente paso: Crear estructura optimizada" -ForegroundColor Cyan
Write-Host "🔄 Ejecutar: .\create-structure.ps1" -ForegroundColor Cyan

Write-Host "`n✅ Análisis completado exitosamente" -ForegroundColor Green
