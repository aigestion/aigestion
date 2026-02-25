#!/usr/bin/env pwsh

# Test script for Gemini 3.1 Pro
$envFile = "c:\Users\Alejandro\AIGestion\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$ApiKey = $env:GOOGLE_AI_API_KEY
$Model = $env:GEMINI_MODEL_3_PRO # From .env: gemini-3.1-pro-preview

Write-Host "🧪 Testing Model: $Model" -ForegroundColor Cyan

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Hello, respond with 'Gemini 3.1 Pro Active' if you receive this."
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
    Write-Host "✅ Success: $text" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -match "404") {
        Write-Host "💡 The model ID '$Model' was not found. It might be deprecated or not yet available in this region/API version." -ForegroundColor Yellow
    }
}
