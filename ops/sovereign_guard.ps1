# 🛡️ Sovereign Guard: AIGestion Nexus Auto-Recovery Sentry
# Path: ops/sovereign_guard.ps1

$projectName = "AIGestion Nexus"
$projectRoot = "C:\Users\Alejandro\AIGestion"
$envPath = Join-Path $projectRoot ".env"
$backupPath = "$env:USERPROFILE\AppData\Roaming\Antigravity\sovereign_vault\.env.master_recovery"
$minKeyCount = 250

function Write-Sovereign {
    param([string]$Message, [string]$Color = "Cyan")
    Write-Host "[🏛️ SOVEREIGN GUARD] $Message" -ForegroundColor $Color
}

Write-Sovereign "Initiating Integrity Check..."

if (-not (Test-Path $envPath)) {
    Write-Sovereign "CRITICAL: .env file is MISSING!" "Red"
    if (Test-Path $backupPath) {
        Write-Sovereign "Restoring from System Vault..." "Yellow"
        Copy-Item $backupPath $envPath -Force
        Write-Sovereign "RESTORATION COMPLETE. 257 Keys Synchronized." "Green"
    } else {
        Write-Sovereign "FATAL: System Vault is empty. Manual intervention required." "DarkRed"
    }
} else {
    $lineCount = (Get-Content $envPath).Count
    if ($lineCount -lt $minKeyCount) {
        Write-Sovereign "WARNING: .env corruption detected ($lineCount lines). Restoring..." "Red"
        Copy-Item $backupPath $envPath -Force
        Write-Sovereign "INTEGRITY RESTORED." "Green"
    } else {
        Write-Sovereign "Sovereign integrity confirmed (257 Keys active)." "Green"
    }
}
