# migrate-to-gsm.ps1
# Script to upload secrets from .env to Google Secret Manager

$projectId = "aigestion-v2"
$envFile = ".env"

if (-not (Test-Path $envFile)) {
    Write-Error "File $envFile not found!"
    exit 1
}

Write-Host "🚀 Starting migration to Google Secret Manager (Project: $projectId)..." -ForegroundColor Cyan

$envContent = Get-Content $envFile
foreach ($line in $envContent) {
    if ($line -match "^[^#\s]+=" ) {
        $parts = $line -split '=', 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        if (-not $value) { continue }

        Write-Host "Processing $key..." -NoNewline

        # Check if secret exists
        $exists = gcloud secrets list --filter="name:$key" --project=$projectId --format="value(name)"
        if (-not $exists) {
            Write-Host " creating..." -ForegroundColor Yellow
            gcloud secrets create $key --replication-policy="automatic" --project=$projectId
        } else {
            Write-Host " updating..." -ForegroundColor Green
        }

        # Add new version
        $value | gcloud secrets versions add $key --data-file=- --project=$projectId
    }
}

Write-Host "✅ Migration complete!" -ForegroundColor Green
