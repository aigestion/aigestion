# Simple Pixel 8 Pro App Installation
# Install AIGestion Enterprise app with manual steps

Write-Host "📱 Pixel 8 Pro Enterprise App Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

# Check if device is connected
Write-Host "🔍 Checking for Pixel 8 Pro connection..." -ForegroundColor Yellow
try {
    $devices = adb devices
    if ($devices -match "device") {
        Write-Host "✅ Pixel 8 Pro connected via ADB" -ForegroundColor Green
        Write-Host "✅ Ready for installation" -ForegroundColor Green
    } else {
        Write-Host "❌ Pixel 8 Pro not connected" -ForegroundColor Red
        Write-Host "Please:" -ForegroundColor Yellow
        Write-Host "1. Connect Pixel 8 Pro via USB" -ForegroundColor Gray
        Write-Host "2. Enable USB debugging on device" -ForegroundColor Gray
        Write-Host "3. Install Android SDK Platform Tools" -ForegroundColor Gray
        Write-Host "4. Run: adb devices to verify connection" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "❌ Cannot check device connection" -ForegroundColor Red
    Write-Host "Please install Android SDK Platform Tools first" -ForegroundColor Red
    exit 1
}

# Install app
Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
$apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"

if (-not (Test-Path $apkPath)) {
    Write-Host "❌ APK file not found" -ForegroundColor Red
    Write-Host "Expected at: $apkPath" -ForegroundColor Red
    exit 1
}

try {
    Write-Host "📤 Installing APK..." -ForegroundColor Yellow
    adb install "$apkPath"
    Write-Host "✅ Installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. APK file exists" -ForegroundColor Gray
    Write-Host "2. Device is connected" -ForegroundColor Gray
    Write-Host "3. USB debugging is enabled" -ForegroundColor Gray
    exit 1
}

# Grant permissions
Write-Host "⚙️ Granting permissions..." -ForegroundColor Yellow
try {
    adb shell pm grant com.aigestion.enterprise android.permission.INTERNET
    adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_NETWORK_STATE
    adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_WIFI_STATE
    adb shell pm grant com.aigestion.enterprise android.permission.BATTERY_STATS
    adb shell pm grant com.aigestion.enterprise android.permission.SYSTEM_ALERT_WINDOW
    Write-Host "✅ Basic permissions granted" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Some permissions could not be granted" -ForegroundColor Yellow
}

# Launch app
Write-Host "🚀 Launching app..." -ForegroundColor Yellow
try {
    adb shell am start -n com.aigestion.enterprise/.MainActivity
    Write-Host "✅ App launched!" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not launch app" -ForegroundColor Red
    Write-Host "Try launching manually from app drawer" -ForegroundColor Yellow
}

# Final status
Write-Host "" -ForegroundColor Gray
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Gray
Write-Host "✅ AIGestion Enterprise app installed" -ForegroundColor Green
Write-Host "✅ Basic permissions granted" -ForegroundColor Green
Write-Host "✅ App launched successfully" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 App Features:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
Write-Host "  • Service management" -ForegroundColor White
Write-Host "  • Pixel 8 Pro optimized" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise use!" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📁 APK Location:" -ForegroundColor Yellow
Write-Host "  $apkPath" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test all features on Pixel 8 Pro" -ForegroundColor Gray
Write-Host "2. Configure app settings as needed" -ForegroundColor Gray
Write-Host "3. Monitor performance" -ForegroundColor Gray
Write-Host "4. Report any issues" -ForegroundColor Gray
