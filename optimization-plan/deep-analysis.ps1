param(
    [string]$ProjectsRoot = 'C:\Users\Alejandro\Projects',
    [string]$AIGestionRoot = 'C:\Users\Alejandro\AIGestion'
)

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$out = "C:\Users\Alejandro\AIGestion\optimization-plan\deep-analysis-$ts.txt"

"=== DEEP ANALYSIS START $([DateTime]::Now) ===" | Out-File -Encoding utf8 $out

function Test-ProjectInfo {
    param($Path)
    $git = Test-Path (Join-Path $Path '.git')
    $pkg = Test-Path (Join-Path $Path 'package.json')
    $py = (Test-Path (Join-Path $Path 'requirements.txt')) -or (Test-Path (Join-Path $Path 'pyproject.toml'))
    $files = (Get-ChildItem -LiteralPath $Path -File -Force -ErrorAction SilentlyContinue | Measure-Object).Count
    $size = (Get-ChildItem -LiteralPath $Path -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    [pscustomobject]@{
        Path    = $Path
        Git     = $git
        Package = $pkg
        Python  = $py
        Files   = $files
        SizeGB  = [math]::Round([double]$size / 1GB, 3)
    }
}

"" | Out-File -Append -Encoding utf8 $out
"PROJECTS ROOT ANALYSIS" | Out-File -Append -Encoding utf8 $out

if (Test-Path -LiteralPath $ProjectsRoot) {
    $top = Get-ChildItem -LiteralPath $ProjectsRoot -Directory -Force -ErrorAction SilentlyContinue
    foreach ($d in $top) {
        $info = Test-ProjectInfo $d.FullName
        "$($info.Path.Split('\')[-1]) | Git:$($info.Git) | Package:$($info.Package) | Python:$($info.Python) | Files:$($info.Files) | SizeGB:$($info.SizeGB)" | Out-File -Append -Encoding utf8 $out
    }
}

"" | Out-File -Append -Encoding utf8 $out
"AIGESTION ROOT ANALYSIS" | Out-File -Append -Encoding utf8 $out

if (Test-Path -LiteralPath $AIGestionRoot) {
    $top = Get-ChildItem -LiteralPath $AIGestionRoot -Directory -Force -ErrorAction SilentlyContinue
    foreach ($d in $top) {
        $info = Test-ProjectInfo $d.FullName
        "$($info.Path.Split('\')[-1]) | Git:$($info.Git) | Package:$($info.Package) | Python:$($info.Python) | Files:$($info.Files) | SizeGB:$($info.SizeGB)" | Out-File -Append -Encoding utf8 $out
    }
}

"" | Out-File -Append -Encoding utf8 $out
"=== DEEP ANALYSIS END $([DateTime]::Now) ===" | Out-File -Append -Encoding utf8 $out

Write-Host "OK: $out"
