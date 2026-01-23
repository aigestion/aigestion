# LIMPIEZA RÁPIDA DE BASURA EN ALEJANDRO
# Versión simple y sin errores de sintaxis

$basePath = "C:\Users\Alejandro"
$excludePaths = @(
    "$basePath\AIGestion",
    "$basePath\WORKSPACE",
    "$basePath\DEVELOPMENT",
    "$basePath\.gemini",
    "$basePath\.antigravity",
    "$basePath\.vscode",
    "$basePath\.windsurf"
)

$trashFolders = @("node_modules", "dist", "build", ".next", ".cache", "coverage", ".venv", "out")

Write-Host "🧹 ANALIZANDO BASURA EN ALEJANDRO..." -ForegroundColor Green
Write-Host "🛡️ Rutas protegidas: $($excludePaths.Count)" -ForegroundColor Yellow

$foundTrash = @()
$totalSize = 0

foreach ($folder in $trashFolders) {
    $items = Get-ChildItem -LiteralPath $basePath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -eq $folder
    }

    foreach ($item in $items) {
        # Verificar que no esté en rutas protegidas
        $isProtected = $false
        foreach ($exclude in $excludePaths) {
            if ($item.FullName.StartsWith($exclude)) {
                $isProtected = $true
                break
            }
        }

        if (-not $isProtected) {
            try {
                $size = (Get-ChildItem -LiteralPath $item.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                $sizeGB = [math]::Round($size / 1GB, 3)

                $foundTrash += [PSCustomObject]@{
                    Path   = $item.FullName
                    Name   = $item.Name
                    SizeGB = $sizeGB
                }

                $totalSize += $size
            }
            catch {
                # Ignorar errores
            }
        }
    }
}

Write-Host "📊 BASURA DETECTADA: $($foundTrash.Count) carpetas" -ForegroundColor Yellow
Write-Host "💾 ESPACIO LIBERABLE: $([math]::Round($totalSize/1GB, 2)) GB" -ForegroundColor Yellow

if ($foundTrash.Count -gt 0) {
    Write-Host "`n📋 CARPETAS MÁS GRANDES:" -ForegroundColor Blue
    $foundTrash | Sort-Object -Property SizeGB -Descending | Select-Object -First 10 | ForEach-Object {
        $relativePath = $_.Path.Replace($basePath, "")
        Write-Host "   🗑️ $($_.Name): $($_.SizeGB) GB" -ForegroundColor Gray
        Write-Host "      📍 $relativePath" -ForegroundColor DarkGray
    }
}
else {
    Write-Host "✅ NO SE ENCONTRÓ BASURA" -ForegroundColor Green
}

Write-Host "`n🎯 PARA EJECUTAR LIMPIEZA REAL:" -ForegroundColor Cyan
Write-Host "   .\quick-cleanup.ps1 -Execute" -ForegroundColor Cyan
