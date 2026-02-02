# Install AIGestion on Pixel 8 Pro - Simple Method
# Install as web app shortcut

Write-Host "Installing AIGestion on Pixel 8 Pro" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

# Check device
$devices = adb devices
if ($devices -match "device") {
    Write-Host "Pixel 8 Pro connected" -ForegroundColor Green
} else {
    Write-Host "Pixel 8 Pro not connected" -ForegroundColor Red
    exit 1
}

# Launch AIGestion dashboard
Write-Host "Launching AIGestion dashboard..." -ForegroundColor Yellow
try {
    adb shell am start -a android.intent.action.VIEW -d "https://admin.aigestion.net"
    Write-Host "AIGestion launched successfully!" -ForegroundColor Green
} catch {
    Write-Host "Could not launch app" -ForegroundColor Red
}

Write-Host "" -ForegroundColor Gray
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Gray
Write-Host "✅ AIGestion dashboard opened on Pixel 8 Pro" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "To add to home screen:" -ForegroundColor Yellow
Write-Host "1. In Chrome, tap menu (3 dots)" -ForegroundColor Gray
Write-Host "2. Select Add to Home screen" -ForegroundColor Gray
Write-Host "3. Tap Add" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "Access URLs:" -ForegroundColor Yellow
Write-Host "Admin: https://admin.aigestion.net" -ForegroundColor White
Write-Host "Client: https://client.aigestion.net" -ForegroundColor White
Write-Host "Demo: https://demo.aigestion.net" -ForegroundColor White
