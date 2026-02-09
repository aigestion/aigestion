# God Mode Pages Configuration Script
# Purpose: Force-configure GitHub Pages to serve from 'gh-pages' branch via API

$ErrorActionPreference = "Stop"

# Token from previous context
$Token = "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"
$Owner = "aigestion"
$Repo = "aigestion"

$ApiUrl = "https://api.github.com/repos/$Owner/$Repo/pages"

Write-Host "STARTING GOD MODE CONFIGURATION..." -ForegroundColor Green
Write-Host "Target: $Owner/$Repo" -ForegroundColor Cyan

# 1. Update Configuration
Write-Host "Updating Pages source to gh-pages..." -ForegroundColor Cyan

$Body = @{
  source = @{
    branch = "gh-pages"
    path   = "/"
  }
} | ConvertTo-Json -Depth 10

try {
  $response = Invoke-RestMethod -Uri $ApiUrl -Headers @{
    Authorization          = "Bearer $Token"
    Accept                 = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "Content-Type"         = "application/json"
  } -Method Put -Body $Body

  Write-Host "CONFIGURATION UPDATED SUCCESSFULLY!" -ForegroundColor Green
  Write-Host "Source: $($response.source.branch)" -ForegroundColor Green
  Write-Host "URL: $($response.html_url)" -ForegroundColor Green
}
catch {
  Write-Error "Failed to update configuration: $($_.Exception.Message)"
}
