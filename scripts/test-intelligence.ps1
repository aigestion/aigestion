#!/usr/bin/env pwsh

$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$ApiKey = $env:GOOGLE_AI_API_KEY
$Model = "gemini-3.1-pro-preview"

Write-Host "--- Deep Test for Model: $Model ---" -ForegroundColor Cyan

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Explica brevemente qué es el 'AIGestion Nexus' basándote solo en tu conocimiento interno (si no lo sabes, di que no lo conoces)."
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
        -TimeoutSec 30 `
        -ErrorAction Stop

    $text = $response.candidates[0].content.parts[0].text
    Write-Host "RESPONSE: $text" -ForegroundColor Yellow
}
catch {
    Write-Host "FAILURE: $($_.Exception.Message)" -ForegroundColor Red
}
