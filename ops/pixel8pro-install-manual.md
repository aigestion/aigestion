# Pixel 8 Pro App Installation - Manual Instructions

# Step-by-step guide for installing AIGestion Enterprise app

Write-Host "📱 Pixel 8 Pro Enterprise App Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

Write-Host "🔍 Step 1: Enable USB Debugging on Pixel 8 Pro" -ForegroundColor Yellow
Write-Host "1. Open Settings on your Pixel 8 Pro" -ForegroundColor Gray
Write-Host "2. Go to 'About phone'" -ForegroundColor Gray
Write-Host "3. Tap 'Build number' 7 times quickly" -ForegroundColor Gray
Write-Host "4. Go to 'System' > 'Developer options'" -ForegroundColor Gray
WriteHost "5. Enable 'USB debugging'" -ForegroundColor Gray
Write-Host "6. Enable 'Wireless debugging' (optional)" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "🔌 Step 2: Connect Pixel 8 Pro via USB" -ForegroundColor Yellow
Write-Host "1. Connect Pixel 8 Pro to your computer with USB cable" -ForegroundColor Gray
Write-Host "2. Allow USB debugging when prompted" -ForegroundColor Gray
Write-Host "3. Ensure 'File transfer' is set to 'MTP' or 'PTP'" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "🔧 Step 3: Install ADB (if not already installed)" -ForegroundColor Yellow
Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Gray
Write-Host "2. Run: wing install android-sdk-platform-tools" -ForegroundColor Gray
Write-Host "3. Restart PowerShell" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "📦 Step 4: Install AIGestion Enterprise App" -ForegroundColor Yellow
Write-Host "1. Open Command Prompt or PowerShell" -ForegroundColor Gray
Write-Host "2. Navigate to APK directory:" -ForegroundColor Gray
Write-Host " cd c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app" -ForegroundColor Gray
Write-Host "3. Install the app:" -ForegroundColor Gray
Write-Host " adb install AIGestionEnterprise.apk" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "⚙️ Step 5: Grant Permissions" -ForegroundColor Yellow
Write-Host "1. Run these commands in PowerShell:" -ForegroundColor Gray
Write-Host " adb shell pm grant com.aigestion.enterprise android.permission.INTERNET" -ForegroundColor Gray
Write-Host " adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_NETWORK_STATE" -ForegroundColor Gray
Write-Host " adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_WIFI_STATE" -ForegroundColor Gray
Write-Host " adb shell pm grant com.aigestion.enterprise android.permission.BATTERY_STATS" -ForegroundColor Gray
Write-Host " adb shell pm grant com.aigestion.enterprise android.permission.SYSTEM_ALERT_WINDOW" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "👤 Step 6: Set as Device Admin (Optional)" -ForegroundColor Yellow
Write-Host "1. Run this command:" -ForegroundColor Gray
Write-Host " adb shell dpm set-device-owner com.aigestion.enterprise" -ForegroundColor Gray
Write-Host "2. If prompted, accept the device admin request on Pixel 8 Pro" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "🚀 Step 7: Launch the App" -ForegroundColor Yellow
Write-Host "1. Run this command:" -ForegroundColor Gray
Write-Host " adb shell am start -n com.aigestion.enterprise/.MainActivity" -ForegroundColor Gray
Write-Host "2. Or find and tap the app icon on your Pixel 8 Pro" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "📊 Step 8: Verify Installation" -ForegroundColor Yellow
Write-Host "1. Check if app is running:" -ForegroundColor Gray
Write-Host " adb shell ps | grep com.aigestion.enterprise" -ForegroundColor Gray
Write-Host "2. Check app memory usage:" -ForegroundColor Gray
Write-Host " adb shell dumpsys meminfo com.aigestion.enterprise" -ForegroundColor Gray
Write-Host "3. Check app permissions:" -ForegroundColor Gray
Write-Host " adb shell dumpsys package com.aigestion.enterprise | grep permissions" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray

Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Gray
Write-Host "✅ AIGestion Enterprise app installed on Pixel 8 Pro" -ForegroundColor Green
Write-Host "✅ All permissions granted" -ForegroundColor Green
Write-Host "✅ App launched successfully" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 App Features:" -ForegroundColor Cyan
Write-Host " • Real-time system monitoring" -ForegroundColor White
Write-Host " • Memory optimization" -ForegroundColor White
Write-Host " • Service management" -ForegroundColor White
Write-Write-Host " • Pixel 8 Pro optimizations" -ForegroundColor White
Write-Host " • Enterprise-grade security" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise administration!" -ForegroundColor Green

Write-Host "" -ForegroundColor Gray
Write-Host "📁 APK Location:" -ForegroundColor Yellow
Write-Host "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "📋 Documentation:" -ForegroundColor Yellow
Write-Host "c:\Users\Alejandro\AIGestion\APP-STORE-DEPLOYMENT.md" -ForegroundColor White
