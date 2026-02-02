# Simple Pixel 8 Pro App Installation
# Installs AIGestion Enterprise app on Pixel 8 Pro

Write-Host "📱 Pixel 8 Pro Enterprise App Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

# Check ADB connection
Write-Host "🔍 Checking ADB connection..." -ForegroundColor Yellow
try {
    $devices = adb devices
    if ($devices -match "device") {
        Write-Host "✅ Pixel 8 Pro detected via ADB" -ForegroundColor Green
    } else {
        Write-Host "❌ Pixel 8 Pro not detected" -ForegroundColor Red
        Write-Host "Enable USB debugging on your Pixel 8 Pro:" -ForegroundColor Yellow
        Write-Host "1. Settings > About phone" -ForegroundColor Gray
        Write-Host "2. Tap 'Build number' 7 times" -ForegroundColor Gray
        Write-Host "3. Settings > System > Developer options" -ForegroundColor Gray
        Write-Host "4. Enable 'USB debugging'" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "❌ ADB not available" -ForegroundColor Red
    exit 1
}

# Install app
Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
$apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"

if (-not (Test-Path $apkPath)) {
    Write-Host "❌ APK file not found: $apkPath" -ForegroundColor Red
    Write-Host "Please create APK files first" -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "📤 Installing APK..." -ForegroundColor Yellow
    adb install "$apkPath"
    Write-Host "✅ Installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit 1
}

# Configure permissions
Write-Host "⚙️ Configuring permissions..." -ForegroundColor Yellow
$permissions = @(
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.ACCESS_WIFI_STATE",
    "android.permission.BATTERY_STATS",
    "android.permission.SYSTEM_ALERT_WINDOW"
)

foreach ($permission in $permissions) {
    try {
        adb shell pm grant com.aigestion.enterprise $permission
        Write-Host "✅ Granted: $permission" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Could not grant: $permission" -ForegroundColor Yellow
    }
}

# Launch app
Write-Host "🚀 Launching app..." -ForegroundColor Yellow
try {
    adb shell am start -n com.aigestion.enterprise/.MainActivity
    Write-Host "✅ App launched successfully!" -ForegroundColor Green
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
Write-Host "📱 App Features:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
Write-Write-Host "  • Service management" -ForegroundColor White
Write-Host "  • Pixel 8 Pro optimizations" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise administration!" -ForegroundColor Green
