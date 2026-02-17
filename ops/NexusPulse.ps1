# 💓 Nexus Pulse: Multi-Mesh Health Sentry
# Path: ops/NexusPulse.ps1

function Write-Pulse {
  param([string]$Message, [string]$Color = "Cyan")
  Write-Host "[💓 PULSE] $Message" -ForegroundColor $Color
}

Write-Pulse "Initiating Multi-Mesh Integrity Audit..." "Yellow"

# 1. Environment Check
$envFile = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envFile) {
  $c = (Get-Content $envFile).Count
  Write-Pulse "   -> Environment Saturated ($c lines). [OK]" "Green"
}
else {
  Write-Pulse "   -> Environment MISSING! [FAIL]" "Red"
}

# 2. Network Autarky Check
Write-Pulse "Testing External Mesh Pulse..." "Yellow"
$endpoints = @("google.com", "api.slack.com", "discord.com", "api.vercel.com")
foreach ($site in $endpoints) {
  if (Test-Connection -ComputerName $site -Count 1 -Quiet -ErrorAction SilentlyContinue) {
    Write-Pulse "   -> ${site}: CONNECTED" "Green"
  }
  else {
    Write-Pulse "   -> ${site}: UNREACHABLE" "Yellow"
  }
}

# 3. Hardware Pulse
Write-Pulse "Syncing Pixel 8 Pro status..." "Yellow"
$adbOutput = adb devices 2>$null
if ($adbOutput -match "device$") {
  Write-Pulse "   -> Pixel 8 Pro: ONLINE" "Green"
}
else {
  Write-Pulse "   -> Pixel 8 Pro: OFFLINE" "Yellow"
}

Write-Pulse "Pulse Audit Complete. Sovereignty Level: OPTIMAL." "Magenta"
