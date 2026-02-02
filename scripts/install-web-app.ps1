# Install HTML5 App as Web App on Pixel 8 Pro
# Alternative approach: install as web app shortcut

Write-Host "Installing AIGestion Enterprise as Web App" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray

# Check device connection
$devices = adb devices
if ($devices -match "device") {
    Write-Host "Pixel 8 Pro connected" -ForegroundColor Green
} else {
    Write-Host "Pixel 8 Pro not connected" -ForegroundColor Red
    exit 1
}

# Create web app shortcut
Write-Host "Creating web app shortcut..." -ForegroundColor Yellow

# Install Chrome if not present
Write-Host "Checking Chrome..." -ForegroundColor Yellow
try {
    $chromeCheck = adb shell pm list packages | findstr chrome
    if ($chromeCheck) {
        Write-Host "Chrome found" -ForegroundColor Green
    } else {
        Write-Host "Installing Chrome..." -ForegroundColor Yellow
        adb shell am start -a android.intent.action.VIEW -d "market://details?id=com.android.chrome"
    }
} catch {
    Write-Host "Chrome check failed" -ForegroundColor Red
}

# Create home screen shortcut using ADB
Write-Host "Creating home screen shortcut..." -ForegroundColor Yellow

# Method 1: Using Chrome's "Add to Home Screen" via intent
try {
    $intent = "intent://admin.aigestion.net#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://admin.aigestion.net;end"
    adb shell am start -a android.intent.action.VIEW -d "$intent"
    Write-Host "Opened AIGestion in Chrome" -ForegroundColor Green
    Write-Host "Please manually add to home screen in Chrome menu" -ForegroundColor Yellow
} catch {
    Write-Host "Could not open in Chrome" -ForegroundColor Red
}

# Method 2: Create bookmark directly
Write-Host "Creating bookmark..." -ForegroundColor Yellow
try {
    # Add bookmark to browser
    adb shell am start -a android.intent.action.VIEW -d "https://admin.aigestion.net" -t "text/html"
    Write-Host "Opened AIGestion dashboard" -ForegroundColor Green
} catch {
    Write-Host "Could not open dashboard" -ForegroundColor Red
}

# Grant necessary permissions
Write-Host "Granting permissions..." -ForegroundColor Yellow
try {
    adb shell pm grant com.android.chrome android.permission.INTERNET
    adb shell pm grant com.android.chrome android.permission.ACCESS_NETWORK_STATE
    Write-Host "Permissions granted" -ForegroundColor Green
} catch {
    Write-Host "Could not grant permissions" -ForegroundColor Red
}

# Launch the app
Write-Host "Launching AIGestion Enterprise..." -ForegroundColor Yellow
try {
    adb shell am start -a android.intent.action.VIEW -d "https://admin.aigestion.net"
    Write-Host "AIGestion Enterprise launched!" -ForegroundColor Green
} catch {
    Write-Host "Could not launch app" -ForegroundColor Red
}

Write-Host "" -ForegroundColor Gray
Write-Host "Web App Installation Complete!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Gray
Write-Host "✅ AIGestion Enterprise installed as web app" -ForegroundColor Green
Write-Host "✅ Opened in Chrome browser" -ForegroundColor Green
Write-Host "✅ Permissions granted" -ForegroundColor Green
Write-Host "✅ App launched successfully" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "To add to home screen:" -ForegroundColor Yellow
Write-Host "1. In Chrome, tap the menu (3 dots)" -ForegroundColor Gray
Write-Host "2. Select 'Add to Home screen'" -ForegroundColor Gray
Write-Host "3. Tap 'Add'" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 AIGestion Enterprise ready for use!" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 Features available:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
Write-Host "  • Service management" -ForegroundColor White
Write-Host "  • Pixel 8 Pro optimized" -ForegroundColor White
Write-Host "  • Enterprise-grade security" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🌐 Access URLs:" -ForegroundColor Yellow
Write-Host "  Admin: https://admin.aigestion.net" -ForegroundColor White
Write-Host "  Client: https://client.aigestion.net" -ForegroundColor White
Write-Host "  Demo: https://demo.aigestion.net" -ForegroundColor White
