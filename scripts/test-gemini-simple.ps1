#!/usr/bin/env pwsh

# Simplified test script to avoid encoding issues
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$ApiKey = $env:GOOGLE_AI_API_KEY
$Models = @("gemini-1.5-pro", "gemini-1.5-flash", "gemini-3.1-pro-preview")

foreach ($Model in $Models) {
    Write-Host "--- Testing Model: $Model ---" -ForegroundColor Cyan

    $body = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "Hello, reply with 'Active' if you work."
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent?key=$ApiKey" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 20 `
            -ErrorAction Stop

        $text = $response.candidates[0].content.parts[0].text
        Write-Host "SUCCESS: $text" -ForegroundColor Green
    }
    catch {
        Write-Host "FAILURE: $($_.Exception.Message)" -ForegroundColor Red
    }
}
