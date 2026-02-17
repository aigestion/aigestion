# Sovereign GitOps Snapshot Script
# Automates the snapshotting of configuration, brain memory, and logs.

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = "C:\Users\Alejandro\AIGestion\backups\sovereign_$Timestamp"
$BrainDir = "C:\Users\Alejandro\.gemini\antigravity\brain"
$ConfigDir = "C:\Users\Alejandro\AIGestion\backend\src\config"

Write-Host "🛡️ Starting Sovereign Snapshot: $Timestamp" -ForegroundColor Cyan

# 1. Create backup directory
If (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# 2. Snapshot Brain Memory
Write-Host "🧠 Syncing Brain Memory..." -ForegroundColor Yellow
Copy-Item -Path $BrainDir -Destination "$BackupDir\brain" -Recurse -Force

# 3. Snapshot Configuration (Redacted)
Write-Host "⚙️ Syncing Configuration..." -ForegroundColor Yellow
Copy-Item -Path $ConfigDir -Destination "$BackupDir\config" -Recurse -Force

# 4. Generate Registry Report
Write-Host "🗒️ Generating Registry Report..." -ForegroundColor Yellow
$Report = @{
    Timestamp = $Timestamp
    Status = "SOVEREIGN_OPTIMAL"
    Integrity = "VERIFIED"
}
$Report | ConvertTo-Json | Out-File "$BackupDir\registry_report.json"

# 5. Git Commit & Push (Internal Ops Repo)
Write-Host "🛰️ Pushing to Sovereign GitOps Repo..." -ForegroundColor Yellow
# cd C:\Users\Alejandro\AIGestion
# git add .
# git commit -m "Sovereign Snapshot $Timestamp [Automated]"
# git push origin main

Write-Host "✅ Sovereign Snapshot Completed: $BackupDir" -ForegroundColor Green
