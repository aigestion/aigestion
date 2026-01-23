param(
    [string]$SourceBase = 'C:\Users\Alejandro',
    [string]$TargetBase = 'C:\Users\Alejandro'
)

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$log = "C:\Users\Alejandro\AIGestion\optimization-plan\safe-copy-$ts.log.txt"
$report = "C:\Users\Alejandro\AIGestion\optimization-plan\post-copy-baseline-$ts.txt"

New-Item -ItemType Directory -Force -Path "$TargetBase\WORKSPACE\Data", "$TargetBase\DEVELOPMENT\Scripts", "$TargetBase\DEVELOPMENT\Tools" | Out-Null

"=== SAFE COPY START $([DateTime]::Now) ===" | Out-File -Encoding utf8 $log

# Copy Data
robocopy "$SourceBase\Data" "$TargetBase\WORKSPACE\Data" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NP /TEE /LOG+:$log

# Copy scripts
robocopy "$SourceBase\scripts" "$TargetBase\DEVELOPMENT\Scripts" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NP /TEE /LOG+:$log

# Copy Tools
robocopy "$SourceBase\Tools" "$TargetBase\DEVELOPMENT\Tools" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NP /TEE /LOG+:$log

$targets = @(
    "$TargetBase\WORKSPACE\Data",
    "$TargetBase\DEVELOPMENT\Scripts",
    "$TargetBase\DEVELOPMENT\Tools"
)

$results = foreach ($p in $targets) {
    $m = Get-ChildItem -LiteralPath $p -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
    [pscustomobject]@{
        Path   = $p
        Files  = $m.Count
        SizeGB = [math]::Round([double]$m.Sum / 1GB, 3)
    }
}

$results | Format-Table -AutoSize | Out-String -Width 240 | Out-File -Encoding utf8 $report

"=== SAFE COPY END $([DateTime]::Now) ===" | Out-File -Encoding utf8 -Append $log

Write-Host "DONE"
Write-Host "LOG: $log"
Write-Host "REPORT: $report"
