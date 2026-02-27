# Twilio Simple Setup - Daniela IA Voice System
param(
    [switch]$TestCall
)

# Cargar credenciales desde .env
$envFile = "C:\Users\Alejandro\AIGestion\.env"
$twilioAccountSid = $null
$twilioAuthToken = $null
$twilioPhoneNumber = "+16183581369"

Write-Host "Loading Twilio credentials..." -ForegroundColor Cyan
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $twilioAccountSid = ($envContent | Where-Object { $_ -match "TWILIO_ACCOUNT_SID=" }) -replace "TWILIO_ACCOUNT_SID=", ""
    $twilioAuthToken = ($envContent | Where-Object { $_ -match "TWILIO_AUTH_TOKEN=" }) -replace "TWILIO_AUTH_TOKEN=", ""
    $twilioPhoneNumber = ($envContent | Where-Object { $_ -match "TWILIO_PHONE_NUMBER=" }) -replace "TWILIO_PHONE_NUMBER=", ""
    Write-Host "Credentials loaded successfully" -ForegroundColor Green
} else {
    Write-Host "Error: .env file not found" -ForegroundColor Red
    exit 1
}

# Function to test Twilio connection
function Test-TwilioConnection {
    param($Sid, $Token)
    
    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
        }
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid.json" -Headers $headers
        return $response.status -eq "active"
    } catch {
        Write-Host "Connection error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to configure voice webhook
function Set-VoiceWebhook {
    param($Sid, $Token, $PhoneNumber, $WebhookUrl)
    
    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type' = 'application/x-www-form-urlencoded'
        }
        
        $body = @{
            'VoiceUrl' = $WebhookUrl
            'VoiceMethod' = 'POST'
            'VoiceFallbackUrl' = "$WebhookUrl/fallback"
            'VoiceFallbackMethod' = 'POST'
            'StatusCallback' = "$WebhookUrl/call-status"
            'StatusCallbackMethod' = 'POST'
        }
        
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/IncomingPhoneNumbers/$PhoneNumber.json" -Method Post -Headers $headers -Body $body
        Write-Host "Voice webhook configured: $WebhookUrl" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "Error configuring webhook: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to enable Caller Name Lookup
function Enable-CallerNameLookup {
    param($Sid, $Token, $PhoneNumber)
    
    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type' = 'application/x-www-form-urlencoded'
        }
        
        $body = @{
            'BetaFeaturesCallerNameLookup' = 'true'
        }
        
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/IncomingPhoneNumbers/$PhoneNumber.json" -Method Post -Headers $headers -Body $body
        Write-Host "Caller Name Lookup enabled (+\$0.01 per call)" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "Error enabling Caller Name Lookup: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to test call
function Test-PhoneCall {
    param($Sid, $Token, $From, $To, $WebhookUrl)
    
    try {
        $headers = @{
            'Authorization' = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$Sid`:$Token")))"
            'Content-Type' = 'application/x-www-form-urlencoded'
        }
        
        $body = @{
            'From' = $From
            'To' = $To
            'Url' = $WebhookUrl
            'Method' = 'POST'
        }
        
        Write-Host "Initiating test call to $To..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "https://api.twilio.com/2010-04-01/Accounts/$Sid/Calls.json" -Method Post -Headers $headers -Body $body
        Write-Host "Call initiated - SID: $($response.sid)" -ForegroundColor Green
        Write-Host "Status: $($response.status)" -ForegroundColor Cyan
        return $response
    } catch {
        Write-Host "Error initiating call: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Main execution
Write-Host "Verifying Twilio connection..." -ForegroundColor Yellow
if (-not (Test-TwilioConnection -Sid $twilioAccountSid -Token $twilioAuthToken)) {
    Write-Host "Cannot connect to Twilio. Check your credentials." -ForegroundColor Red
    exit 1
}
Write-Host "Twilio connection established" -ForegroundColor Green

# Configure webhook
Write-Host "Configuring voice webhook..." -ForegroundColor Yellow
$webhookUrl = "https://aigestion.net/api/twilio/voice"
Set-VoiceWebhook -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber -WebhookUrl $webhookUrl

# Enable Caller Name Lookup
Write-Host "Enabling Caller Name Lookup..." -ForegroundColor Yellow
Enable-CallerNameLookup -Sid $twilioAccountSid -Token $twilioAuthToken -PhoneNumber $twilioPhoneNumber

# Test call if requested
if ($TestCall) {
    Write-Host "Testing call..." -ForegroundColor Yellow
    Test-PhoneCall -Sid $twilioAccountSid -Token $twilioAuthToken -From $twilioPhoneNumber -To "+34618779308" -WebhookUrl $webhookUrl
}

Write-Host ""
Write-Host "TWILIO CONFIGURATION COMPLETED" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Gray
Write-Host "Twilio Number: $twilioPhoneNumber" -ForegroundColor White
Write-Host "Webhook URL: $webhookUrl" -ForegroundColor White
Write-Host "Daniela IA is ready to receive calls" -ForegroundColor Green
Write-Host ""
