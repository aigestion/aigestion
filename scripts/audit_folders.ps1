# Audit script: sizes, references, duplicate detection for specified folders
$dirs = @('aigestion-deploy','AIGestion-Final','aigestion-static')
Write-Output '--- SIZE SUMMARY (MB) ---'
foreach ($d in $dirs) {
    if (Test-Path $d) {
        $size = (Get-ChildItem -Path $d -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Output ("{0,-25} {1,10}MB" -f $d, [math]::Round($size,2))
    } else {
        Write-Output ("{0,-25} {1}" -f $d, '(missing)')
    }
}

Write-Output ""
Write-Output '--- REFERENCE SEARCH (git grep) ---'
# Use git grep if available, otherwise fallback to Select-String over tracked files
try {
    git grep -n --heading -e 'aigestion-deploy' -e 'AIGestion-Final' -e 'aigestion-static' | Write-Output
} catch {
    Write-Output '(git grep failed or no matches)'
}

Write-Output ""
Write-Output '--- DUPLICATE FILES (SHA256) ---'
$files = @()
foreach ($d in $dirs) {
    if (Test-Path $d) {
        $files += Get-ChildItem -Path $d -Recurse -File -ErrorAction SilentlyContinue
    }
}
if ($files.Count -eq 0) {
    Write-Output '(no files found in specified dirs)'
    exit 0
}
$hashes = @()
foreach ($f in $files) {
    $h = Get-FileHash $f.FullName -Algorithm SHA256
    $hashes += [PSCustomObject]@{ Path = $f.FullName; Hash = $h.Hash }
}
$groups = $hashes | Group-Object -Property Hash | Where-Object { $_.Count -gt 1 }
if ($groups.Count -eq 0) {
    Write-Output '(no duplicate files found)'
} else {
    foreach ($g in $groups) {
        Write-Output '--- DUP GROUP ---'
        $g.Group | ForEach-Object { Write-Output $_.Path }
    }
}
