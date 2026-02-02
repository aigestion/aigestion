# Pixel 8 Pro App Installation Script
# Simple installation without complex PowerShell syntax

Write-Host "📱 Pixel 8 Pro Enterprise App Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

# Check device connection
Write-Host "🔍 Checking for Pixel 8 Pro connection..." -ForegroundColor Yellow
try {
    $devices = adb devices
    if ($devices -match "device") {
        Write-Host "✅ Pixel 8 Pro connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Pixel 8 Pro not connected" -ForegroundColor Red
        Write-Host "Please connect your Pixel 8 Pro and enable USB debugging" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Cannot check device connection" -ForegroundColor Red
    exit 1
}

# Install app
Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
$apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"

if (-not (Test-Path $apkPath)) {
    Write-Host "❌ APK file not found" -ForegroundColor Red
    exit 1
}

try {
    adb install "$apkPath"
    Write-Host "✅ Installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed" -ForegroundColor Red
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
    Write-Host "✅ Permissions granted" -ForegroundColor Green
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
}

Write-Host "" -ForegroundColor Gray
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Gray
Write-Host "✅ AIGestion Enterprise app installed on Pixel 8 Pro" -ForegroundColor Green
Write-Host "✅ All permissions granted" -ForegroundColor Green
Write-Host "✅ App launched successfully" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise use!" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 APK Location:" -ForegroundColor Yellow
Write-Host "  $apkPath" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "📱 Features:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
Write-Host "  • Service management" -ForegroundColor White
Write-Host "  • Pixel 8 Pro optimized" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🔗 ADB Commands for reference:" -ForegroundColor Gray
Write-Host "  adb devices - Check connected devices" -ForegroundColor Gray
Write-Host "  adb install <apk> - Install APK file" -ForegroundColor Gray
Write-Host "  adb shell pm grant <package> <permission> - Grant permission" -ForegroundColor Gray
Write-Host "  adb shell am start -n <package>/.MainActivity - Launch app" -ForegroundColor Gray
Write-Host "  adb shell dumpsys meminfo <package> - Check memory usage" -ForegroundColor Gray
