# Análisis Rápido del Directorio de Alejandro
# Versión simplificada para análisis inmediato

$BasePath = "c:\Users\Alejandro"
Write-Host "🚀 ANÁLISIS RÁPIDO - DIRECTORIO ALEJANDRO" -ForegroundColor Green
Write-Host "📁 Analizando: $BasePath" -ForegroundColor Yellow

# Análisis de carpetas principales
Write-Host "`n📊 CARPETAS PRINCIPALES:" -ForegroundColor Blue

$folders = @(
    "AIGestion",
    "Data",
    "Dev",
    "Projects",
    "scripts",
    "Tools",
    "Desktop",
    "Documents",
    "Downloads"
)

foreach ($folder in $folders) {
    $folderPath = Join-Path $BasePath $folder
    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object
        $size = (Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $sizeGB = [math]::Round($size / 1GB, 2)

        Write-Host "   📁 $folder" -ForegroundColor White
        Write-Host "      📄 Archivos: $($files.Count)" -ForegroundColor Gray
        Write-Host "      💾 Tamaño: $sizeGB GB" -ForegroundColor Gray
    }
    else {
        Write-Host "   ❌ $folder - No existe" -ForegroundColor Red
    }
}

# Análisis de configuraciones IA
Write-Host "`n🤖 CONFIGURACIONES IA:" -ForegroundColor Blue

$iaFolders = @(
    ".gemini",
    ".antigravity",
    ".codeium",
    ".copilot",
    ".fitten",
    ".ai-memory"
)

foreach ($folder in $iaFolders) {
    $folderPath = Join-Path $BasePath $folder
    if (Test-Path $folderPath) {
        $files = Get-ChildItem -Path $folderPath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object
        Write-Host "   ✅ $folder - $($files.Count) archivos" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ $folder - No configurado" -ForegroundColor Red
    }
}

# Análisis de espacio
Write-Host "`n💾 ANÁLISIS DE ESPACIO:" -ForegroundColor Blue

$totalSize = (Get-ChildItem -Path $BasePath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$totalSizeGB = [math]::Round($totalSize / 1GB, 2)
$freeSpace = [math]::Round((Get-PSDrive -Name C).Free / 1GB, 2)

Write-Host "   📊 Espacio usado: $totalSizeGB GB" -ForegroundColor White
Write-Host "   🆓 Espacio libre: $freeSpace GB" -ForegroundColor White
Write-Host "   📈 Porcentaje usado: $([math]::Round(($totalSizeGB / ($totalSizeGB + $freeSpace)) * 100, 1))%" -ForegroundColor White

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES INMEDIATAS:" -ForegroundColor Yellow

if ($totalSizeGB -gt 100) {
    Write-Host "   🧹 Considerar limpieza - Más de 100GB usados" -ForegroundColor Orange
}

if ((Get-ChildItem -Path "$BasePath\Downloads" -File -ErrorAction SilentlyContinue | Measure-Object).Count -gt 50) {
    Write-Host "   📁 Limpiar carpeta Downloads - Demasiados archivos" -ForegroundColor Orange
}

$missingIA = $iaFolders.Where({ !(Test-Path (Join-Path $BasePath $_)) })
if ($missingIA.Count -gt 0) {
    Write-Host "   🤖 Configurar herramientas IA faltantes: $($missingIA -join ', ')" -ForegroundColor Orange
}

Write-Host "`n✅ Análisis completado" -ForegroundColor Green
