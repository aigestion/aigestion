# God Mode Dashboard Creation Script

$dashboardFile = "dashboard.json"

if (!(Test-Path $dashboardFile)) {
    Write-Error "Dashboard definition file not found: $dashboardFile"
    exit 1
}

Write-Host "Creating 'God Mode' Dashboard from $dashboardFile..."

# Create the dashboard
# Note: We use `Get-Content -Raw` to pass the JSON content correctly
$jsonContent = Get-Content -Raw $dashboardFile
gcloud monitoring dashboards create --config-from-file=$dashboardFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dashboard created successfully!"
    Write-Host "Visit https://console.cloud.google.com/monitoring/dashboards to view it."
} else {
    Write-Error "❌ Failed to create dashboard."
}
