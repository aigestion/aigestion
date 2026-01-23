# TEST DE LIMPIEZA - VERSION BASICA SIN ERRORES

$basePath = "C:\Users\Alejandro"
$exclude = @("AIGestion", "WORKSPACE", "DEVELOPMENT")
$trash = @("node_modules", "dist", "build")

Write-Host "🧹 TEST DE LIMPIEZA" -ForegroundColor Green

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
    Write-Host "`n📋 DETALLE:" -ForegroundColor Blue
    foreach ($item in $found) {
        $rel = $item.Path.Replace($basePath, "")
        Write-Host "   🗑️ $($item.Name): $($item.SizeGB) GB" -ForegroundColor Gray
        Write-Host "      $rel" -ForegroundColor DarkGray
    }
}
else {
    Write-Host "✅ SIN BASURA" -ForegroundColor Green
}

Write-Host "🎯 PC DEDICADO A AIGESTION.NET" -ForegroundColor Cyan
