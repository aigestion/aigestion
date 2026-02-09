param(
    [string]$SourceBase = 'C:\Users\Alejandro',
    [string]$TargetBase = 'C:\Users\Alejandro'
)

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$log = "C:\Users\Alejandro\AIGestion\optimization-plan\safe-copy-dev-$ts.log.txt"
$report = "C:\Users\Alejandro\AIGestion\optimization-plan\post-copy-dev-baseline-$ts.txt"

New-Item -ItemType Directory -Force -Path "$TargetBase\DEVELOPMENT\Dev" | Out-Null

"=== SAFE COPY DEV START $([DateTime]::Now) ===" | Out-File -Encoding utf8 $log

robocopy "$SourceBase\Dev" "$TargetBase\DEVELOPMENT\Dev" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NP /TEE /LOG+:$log

$m = Get-ChildItem -LiteralPath "$TargetBase\DEVELOPMENT\Dev" -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
[pscustomobject]@{
    Path   = "$TargetBase\DEVELOPMENT\Dev"
    Files  = $m.Count
    SizeGB = [math]::Round([double]$m.Sum / 1GB, 3)
} | Format-Table -AutoSize | Out-String -Width 240 | Out-File -Encoding utf8 $report

"=== SAFE COPY DEV END $([DateTime]::Now) ===" | Out-File -Encoding utf8 -Append $log

Write-Host "DONE"
Write-Host "LOG: $log"
Write-Host "REPORT: $report"
