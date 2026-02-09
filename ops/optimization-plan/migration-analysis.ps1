# ANÁLISIS DE MIGRACIÓN - VERSIÓN SIMPLIFICADA
# Análisis de carpetas críticas para migración

Write-Host "🚀 ANÁLISIS DE MIGRACIÓN CRÍTICA" -ForegroundColor Green
Write-Host "📁 Analizando carpetas importantes de Alejandro" -ForegroundColor Yellow

# Rutas base
$SourcePath = "c:\Users\Alejandro"

# Carpetas críticas a analizar
$CriticalFolders = @(
    @{Name = "AIGestion"; Priority = "Máxima"; Description = "Proyecto principal" },
    @{Name = "Data"; Priority = "Máxima"; Description = "Datos de negocio" },
    @{Name = "Dev"; Priority = "Alta"; Description = "Entorno desarrollo" },
    @{Name = "scripts"; Priority = "Alta"; Description = "Scripts automatización" },
    @{Name = "Projects"; Priority = "Media"; Description = "Proyectos adicionales" },
    @{Name = "Tools"; Priority = "Media"; Description = "Herramientas profesionales" },
    @{Name = ".vscode"; Priority = "Alta"; Description = "Configuración VSCode" },
    @{Name = ".gemini"; Priority = "Alta"; Description = "Configuración Gemini" },
    @{Name = ".antigravity"; Priority = "Alta"; Description = "Configuración Antigravity" },
    @{Name = ".codeium"; Priority = "Media"; Description = "Configuración Codeium" },
    @{Name = ".copilot"; Priority = "Media"; Description = "Configuración Copilot" }
)

# Función para analizar carpeta
function Test-FolderAnalysis {
    param($FolderName, $Priority, $Description)

    $folderPath = Join-Path $SourcePath $FolderName

    Write-Host "`n📁 Analizando: $FolderName" -ForegroundColor White
    Write-Host "   🎯 Prioridad: $Priority" -ForegroundColor Gray
    Write-Host "   📋 Descripción: $Description" -ForegroundColor Gray

    if (Test-Path $folderPath) {
        try {
            # Contar archivos y carpetas
            $files = Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object
            $folders = Get-ChildItem -Path $folderPath -Recurse -Directory -ErrorAction SilentlyContinue | Measure-Object

            # Calcular tamaño
            $size = 0
            Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
                $size += $_.Length
            }
            $sizeGB = [math]::Round($size / 1GB, 2)
            $sizeMB = [math]::Round($size / 1MB, 2)

            # Mostrar resultados
            Write-Host "   ✅ Estado: ENCONTRADO" -ForegroundColor Green
            Write-Host "   📄 Archivos: $($files.Count)" -ForegroundColor Cyan
            Write-Host "   📁 Subcarpetas: $($folders.Count)" -ForegroundColor Cyan
            Write-Host "   💾 Tamaño: $sizeGB GB ($sizeMB MB)" -ForegroundColor Cyan

            # Analizar tipos de archivo
            $extensions = @{}
            Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
                $ext = $_.Extension.ToLower()
                if ($extensions.ContainsKey($ext)) {
                    $extensions[$ext]++
                }
                else {
                    $extensions[$ext] = 1
                }
            }

            if ($extensions.Count -gt 0) {
                Write-Host "   📋 Tipos principales:" -ForegroundColor Gray
                $extensions.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 5 | ForEach-Object {
                    Write-Host "      • $($_.Key): $($_.Value) archivos" -ForegroundColor Gray
                }
            }

            # Última modificación
            $lastModified = (Get-Item -Path $folderPath).LastWriteTime
            Write-Host "   📅 Última modificación: $lastModified" -ForegroundColor Gray

            return @{
                Name         = $FolderName
                Status       = "Found"
                Files        = $files.Count
                Folders      = $folders.Count
                Size         = $sizeGB
                SizeMB       = $sizeMB
                Priority     = $Priority
                Description  = $Description
                Path         = $folderPath
                LastModified = $lastModified
            }
        }
        catch {
            Write-Host "   ❌ Error al analizar: $($_.Exception.Message)" -ForegroundColor Red
            return @{
                Name        = $FolderName
                Status      = "Error"
                Priority    = $Priority
                Description = $Description
                Path        = $folderPath
                Error       = $_.Exception.Message
            }
        }
    }
    else {
        Write-Host "   ❌ Estado: NO ENCONTRADO" -ForegroundColor Red
        return @{
            Name        = $FolderName
            Status      = "NotFound"
            Priority    = $Priority
            Description = $Description
            Path        = $folderPath
        }
    }
}

# Ejecutar análisis
Write-Host "`n🔍 INICIANDO ANÁLISIS DE CARPETAS CRÍTICAS" -ForegroundColor Blue

$results = @()
$totalSize = 0
$totalFiles = 0

foreach ($folder in $CriticalFolders) {
    $result = Test-FolderAnalysis -FolderName $folder.Name -Priority $folder.Priority -Description $folder.Description
    $results += $result

    if ($result.Status -eq "Found") {
        $totalSize += $result.Size
        $totalFiles += $result.Files
    }
}

# Resumen final
Write-Host "`n📊 RESUMEN DEL ANÁLISIS" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

$foundCount = ($results | Where-Object { $_.Status -eq "Found" }).Count
$errorCount = ($results | Where-Object { $_.Status -eq "Error" }).Count
$notFoundCount = ($results | Where-Object { $_.Status -eq "NotFound" }).Count

Write-Host "📁 Carpetas analizadas: $($CriticalFolders.Count)" -ForegroundColor White
Write-Host "✅ Encontradas: $foundCount" -ForegroundColor Green
Write-Host "❌ Con errores: $errorCount" -ForegroundColor Red
Write-Host "⚠️ No encontradas: $notFoundCount" -ForegroundColor Yellow
Write-Host "📄 Total archivos: $totalFiles" -ForegroundColor Cyan
Write-Host "💾 Tamaño total: $totalSize GB" -ForegroundColor Blue

# Análisis por prioridad
Write-Host "`n🎯 ANÁLISIS POR PRIORIDAD" -ForegroundColor Blue

$maxPriority = $results | Where-Object { $_.Priority -eq "Máxima" -and $_.Status -eq "Found" }
if ($maxPriority.Count -gt 0) {
    Write-Host "`n🔴 PRIORIDAD MÁXIMA (Migración urgente):" -ForegroundColor Red
    foreach ($item in $maxPriority) {
        Write-Host "   📁 $($item.Name): $($item.Size) GB - $($item.Files) archivos" -ForegroundColor White
    }
}

$highPriority = $results | Where-Object { $_.Priority -eq "Alta" -and $_.Status -eq "Found" }
if ($highPriority.Count -gt 0) {
    Write-Host "`n🟡 PRIORIDAD ALTA (Migración importante):" -ForegroundColor Yellow
    foreach ($item in $highPriority) {
        Write-Host "   📁 $($item.Name): $($item.Size) GB - $($item.Files) archivos" -ForegroundColor White
    }
}

$mediumPriority = $results | Where-Object { $_.Priority -eq "Media" -and $_.Status -eq "Found" }
if ($mediumPriority.Count -gt 0) {
    Write-Host "`n🟢 PRIORIDAD MEDIA (Migración opcional):" -ForegroundColor Green
    foreach ($item in $mediumPriority) {
        Write-Host "   📁 $($item.Name): $($item.Size) GB - $($item.Files) archivos" -ForegroundColor White
    }
}

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES" -ForegroundColor Yellow

if ($totalSize -gt 10) {
    Write-Host "🧹 Considerar limpieza - Más de 10GB en carpetas críticas" -ForegroundColor Orange
}

if ($maxPriority.Count -gt 0) {
    Write-Host "🚀 Migrar PRIORIDAD MÁXIMA primero - Datos críticos del negocio" -ForegroundColor Green
}

if ($errorCount -gt 0) {
    Write-Host "⚠️ Revisar carpetas con errores antes de migrar" -ForegroundColor Orange
}

# Generar reporte
$reportPath = "c:\Users\Alejandro\AIGestion\optimization-plan\migration-analysis-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"

$report = @"
ANÁLISIS DE MIGRACIÓN CRÍTICA - ALEJANDRO
=====================================

Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

RESUMEN:
- Carpetas analizadas: $($CriticalFolders.Count)
- Encontradas: $foundCount
- Tamaño total: $totalSize GB
- Total archivos: $totalFiles

DETALLE POR CARPETA:
$($results | ForEach-Object {
    if ($_.Status -eq "Found") {
        "$($_.Name) | $($_.Priority) | $($_.Size) GB | $($_.Files) archivos | $($_.Description)"
    } elseif ($_.Status -eq "NotFound") {
        "$($_.Name) | NO ENCONTRADA | - | - | $($_.Description)"
    } else {
        "$($_.Name) | ERROR | - | - | $($_.Description) - $($_.Error)"
    }
})

RECOMENDACIONES:
1. Migrar carpetas de Prioridad Máxima primero
2. Backup de configuraciones importantes
3. Organizar por tipo de uso (profesional/personal)
4. Liberar espacio eliminando archivos temporales

"@

$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "`n📄 Reporte guardado: $reportPath" -ForegroundColor Green

Write-Host "`n✅ Análisis completado exitosamente" -ForegroundColor Green
Write-Host "🚀 Listo para planificar migración" -ForegroundColor Cyan
