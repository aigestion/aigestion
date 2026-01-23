# scripts/rotate-secrets.ps1
param(
    [string]$SecretName = "JWT_SECRET",
    [string]$ProjectId = "aigestion-pro"
)

Write-Host "🛡️ AIGESTION AUTOMATED SECRET ROTATION 🛡️" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 1. Generate new cryptographically secure secret
$NewSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 255) }))
Write-Host "[1/2] Generated new secure value for $SecretName."

# 2. Update GCP Secret Manager
Write-Host "[2/2] Updating GCP Secret Manager..."
Write-Output $NewSecret | gcloud secrets versions add $SecretName --data-file=- --project=$ProjectId --quiet

Write-Host "`n✅ Rotation complete. The new version is now 'latest'." -ForegroundColor Green
Write-Host "Note: Services using this secret will reflect the change on their next restart or poll."
