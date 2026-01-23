# PowerShell script to enable additional free Google APIs
# Prerequisites: gcloud SDK installed and authenticated

$projectId = "aigestion-v2" # Default project ID from previous scripts

$apis = @(
    "searchconsole.googleapis.com",      # Google Search Console
    "pagespeedonline.googleapis.com",    # PageSpeed Insights
    "analyticsadmin.googleapis.com",     # Google Analytics Admin
    "youtube.googleapis.com",            # YouTube Data API
    "customsearch.googleapis.com",       # Google Custom Search
    "tasks.googleapis.com",              # Google Tasks
    "calendar-json.googleapis.com"       # Google Calendar
)

Write-Host "--- Enabling Additional Google APIs for $projectId ---" -ForegroundColor Cyan

foreach ($api in $apis) {
    Write-Host "Enabling API: $api ..." -NoNewline
    $result = gcloud services enable $api --project=$projectId 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " [OK]" -ForegroundColor Green
    } else {
        Write-Host " [FAILED]" -ForegroundColor Red
        Write-Host $result -ForegroundColor Gray
    }
}

Write-Host "`nSetup complete! You can now configure the keys in your .env file." -ForegroundColor Cyan
Write-Host "Note: Some APIs (like Search Console) may require additional site verification in the Google Search Console portal." -ForegroundColor Yellow
