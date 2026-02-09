# LIMPIEZA SIMPLE DE BASURA - VERSION FUNCIONAL

param(
    [switch]$Execute
)

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

Write-Host "🧹 LIMPIEZA DE BASURA EN ALEJANDRO" -ForegroundColor Green
Write-Host "🛡️ Protegiendo: AIGestion, WORKSPACE, DEVELOPMENT, configs" -ForegroundColor Yellow

$foundTrash = @()
$totalSize = 0

foreach ($folder in $trashFolders) {
    $items = Get-ChildItem -LiteralPath $basePath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $folder }

    foreach ($item in $items) {
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

    if ($Execute) {
        Write-Host "`n🚀 EJECUTANDO LIMPIEZA..." -ForegroundColor Red
        $deletedSize = 0

        foreach ($item in $foundTrash) {
            try {
                Write-Host "   🗑️ Eliminando: $($item.Name)" -ForegroundColor Yellow
                Remove-Item -LiteralPath $item.Path -Recurse -Force
                $deletedSize += $item.SizeGB
            }
            catch {
                Write-Host "   ❌ Error eliminando: $($item.Path)" -ForegroundColor Red
            }
        }

        Write-Host "`n✅ LIMPIEZA COMPLETADA: $([math]::Round($deletedSize, 2)) GB liberados" -ForegroundColor Green
    }
}
else {
    Write-Host "✅ NO SE ENCONTRÓ BASURA" -ForegroundColor Green
}

Write-Host "🎯 PC DEDICADO A AIGESTION.NET" -ForegroundColor Cyan
Write-Host "🤖 AIGestion intacto para Antigravity" -ForegroundColor Cyan
