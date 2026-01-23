# LIMPIEZA DE BASURA EN ALEJANDRO - VERSION MINIMA FUNCIONAL

param([switch]$Execute)

$basePath = "C:\Users\Alejandro"
$exclude = @("AIGestion", "WORKSPACE", "DEVELOPMENT", ".gemini", ".antigravity", ".vscode", ".windsurf")
$trash = @("node_modules", "dist", "build", ".next", ".cache", "coverage", ".venv", "out")

Write-Host "🧹 LIMPIEZA DE BASURA EN ALEJANDRO" -ForegroundColor Green
Write-Host "🛡️ Protegiendo rutas importantes" -ForegroundColor Yellow

$found = @()
$total = 0

foreach ($folder in $trash) {
    $items = Get-ChildItem -LiteralPath $basePath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq $folder }

    foreach ($item in $items) {
        $protected = $false
        foreach ($ex in $exclude) {
            if ($item.FullName.StartsWith("$basePath\$ex")) {
                $protected = $true
                break
            }
        }

        if (-not $protected) {
            try {
                $size = (Get-ChildItem -LiteralPath $item.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                $gb = [math]::Round($size / 1GB, 3)

                $found += [PSCustomObject]@{
                    Path   = $item.FullName
                    Name   = $item.Name
                    SizeGB = $gb
                }

                $total += $size
            }
            catch { }
        }
    }
}

Write-Host "📊 BASURA: $($found.Count) carpetas, $([math]::Round($total/1GB, 2)) GB" -ForegroundColor Yellow

if ($found.Count -gt 0) {
    Write-Host "`n📋 CARPETAS GRANDES:" -ForegroundColor Blue
    $found | Sort-Object -Property SizeGB -Descending | Select-Object -First 10 | ForEach-Object {
        $rel = $_.Path.Replace($basePath, "")
        Write-Host "   🗑️ $($_.Name): $($_.SizeGB) GB" -ForegroundColor Gray
        Write-Host "      📍 $rel" -ForegroundColor DarkGray
    }

    if ($Execute) {
        Write-Host "`n🚀 ELIMINANDO BASURA..." -ForegroundColor Red
        $del = 0

        foreach ($item in $found) {
            try {
                Write-Host "   🗑️ $($item.Name)" -ForegroundColor Yellow
                Remove-Item -LiteralPath $item.Path -Recurse -Force
                $del += $item.SizeGB
            }
            catch {
                Write-Host "   ❌ Error" -ForegroundColor Red
            }
        }

        Write-Host "`n✅ LISTO: $([math]::Round($del, 2)) GB liberados" -ForegroundColor Green
    }
}
else {
    Write-Host "✅ SIN BASURA" -ForegroundColor Green
}

Write-Host "🎯 PC DEDICADO A AIGESTION.NET" -ForegroundColor Cyan
Write-Host "🤖 AIGestion intacto para Antigravity" -ForegroundColor Cyan
