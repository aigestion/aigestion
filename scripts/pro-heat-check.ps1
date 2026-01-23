# scripts/pro-heat-check.ps1
param(
    [string]$BackendUrl = "https://api.aigestion.net",
    [string]$WebsiteUrl = "https://aigestion.net"
)

Write-Host "🔥 AIGESTION PRO PLATFORM HEAT-CHECK 🔥" -ForegroundColor Cyan
Write-Host "--------------------------------------"

$Components = @(
    @{ Name = "Marketing Website"; Url = "$WebsiteUrl" },
    @{ Name = "Admin Dashboard" ; Url = "https://admin.aigestion.net" },
    @{ Name = "Client Dashboard"; Url = "https://client.aigestion.net" },
    @{ Name = "Demo Dashboard"  ; Url = "https://demo.aigestion.net" },
    @{ Name = "API HealthCheck" ; Url = "$BackendUrl/health" }
)

foreach ($Comp in $Components) {
    Write-Host "Checking $($Comp.Name)..." -NoNewline
    try {
        $Response = Invoke-WebRequest -Uri $Comp.Url -Method Get -TimeoutSec 10 -ErrorAction Stop
        if ($Response.StatusCode -eq 200) {
            Write-Host " [OK]" -ForegroundColor Green
        } else {
            Write-Host " [ERR: $($Response.StatusCode)]" -ForegroundColor Red
        }
    } catch {
        Write-Host " [OFFLINE]" -ForegroundColor Red
    }
}

Write-Host "`n🚀 PLATFORM LATENCY BENCHMARK" -ForegroundColor Yellow
$Latencies = @()
for ($i=1; $i -le 5; $i++) {
    $StartTime = Get-Date
    $null = Invoke-WebRequest -Uri "$BackendUrl/api/v1/ping" -Method Get -ErrorAction SilentlyContinue
    $EndTime = Get-Date
    $Latencies += ($EndTime - $StartTime).TotalMilliseconds
}

$AvgLatency = ($Latencies | Measure-Object -Average).Average
Write-Host "Average API Latency: $($AvgLatency.ToString("F2"))ms"

if ($AvgLatency -lt 200) {
    Write-Host "Status: GOD MODE ACTIVE (Ultra Low Latency)" -ForegroundColor Green
} else {
    Write-Host "Status: OPTIMIZATION RECOMMENDED" -ForegroundColor Yellow
}
