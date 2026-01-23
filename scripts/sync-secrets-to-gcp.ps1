# scripts/sync-secrets-to-gcp.ps1
param(
    [string]$EnvFile = ".env.production",
    [string]$ProjectId = "aigestion-pro",
    [switch]$Overwrite = $false
)

if (-not (Test-Path $EnvFile)) {
    Write-Error "Environment file not found: $EnvFile"
    return
}

Write-Host "🚀 Starting Secret Sync to Project: $ProjectId" -ForegroundColor Cyan

$secrets = Get-Content $EnvFile | Where-Object { $_ -match "^[^#\s]+=" }

foreach ($line in $secrets) {
    if ($line -match "^([^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()

        # Strip quotes if present
        $value = $value -replace "^['""]|['""]$", ""

        if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($value)) { continue }

        Write-Host "Syncing secret: $name..." -NoNewline

        # Check if secret exists
        $exists = gcloud secrets describe $name --project=$ProjectId 2>$null

        if (-not $exists) {
            Write-Output $value | gcloud secrets create $name --data-file=- --project=$ProjectId --quiet
            Write-Host " [CREATED]" -ForegroundColor Green
        }
        elseif ($Overwrite) {
            Write-Output $value | gcloud secrets versions add $name --data-file=- --project=$ProjectId --quiet
            Write-Host " [UPDATED]" -ForegroundColor Yellow
        }
        else {
            Write-Host " [SKIPPED (already exists)]" -ForegroundColor Gray
        }
    }
}

Write-Host "`n✅ Secret synchronization complete!" -ForegroundColor Green
