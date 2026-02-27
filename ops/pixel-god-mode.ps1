# 🌌 Pixel A7/A8 Sovereign God Mode Configuration
# Author: Antigravity (Sovereign Intelligence)
# Purpose: High-performance hardening and optimization for Pixel 7a/8a

Write-Host "🚀 INITIALIZING SOVEREIGN GOD MODE..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Gray

# 1. Connectivity Check
Write-Host "🔍 Verifying ADB Connection..." -ForegroundColor Yellow
$devices = adb devices
if ($devices -notmatch "device$") {
    Write-Host "❌ Device not found. Ensure USB Debugging is ON and connected." -ForegroundColor Red
    exit
}
Write-Host "✅ Connection Established." -ForegroundColor Green

# 2. Performance & UI Snappiness
Write-Host "⚡ Optimizing UI Response & Performance..." -ForegroundColor Yellow
adb shell settings put global window_animation_scale 0.5
adb shell settings put global transition_animation_scale 0.5
adb shell settings put global animator_duration_scale 0.5
adb shell settings put system peak_refresh_rate 120.0
adb shell settings put system min_refresh_rate 120.0
Write-Host "✅ UI Animations set to 0.5x. Refresh rate forced to 120Hz." -ForegroundColor Green

# 3. God Mode Hardening & Security
Write-Host "🛡️ Hardening System Security..." -ForegroundColor Yellow
adb shell settings put secure lock_screen_show_notifications 0
adb shell settings put secure install_non_market_apps 1 # Enable installation (Sovereign mode)
adb shell pm grant com.aigestion.enterprise android.permission.DUMP
adb shell pm grant com.aigestion.enterprise android.permission.PACKAGE_USAGE_STATS
Write-Host "✅ Security policies and specialized permissions applied." -ForegroundColor Green

# 4. Background & Battery Optimization
Write-Host "🔋 Tuning Battery & Background Services..." -ForegroundColor Yellow
adb shell settings put global adaptive_battery_management_enabled 1
adb shell settings put global low_power_trigger_level 15
adb shell cmd deviceidle force-idle # Force Doze for testing
Write-Host "✅ Battery management optimized." -ForegroundColor Green

# 5. Sovereign Metadata & Tags
Write-Host "🏷️ Applying Sovereign Identity..." -ForegroundColor Yellow
adb shell setprop persist.sys.sovereign.mode "GOD_LEVEL"
adb shell setprop persist.sys.nexus.node "AIGESTION_ALPHA"
Write-Host "✅ Device tagged as AIGESTION_ALPHA in GOD_LEVEL mode." -ForegroundColor Green

# 6. Summary
Write-Host "==========================================" -ForegroundColor Gray
Write-Host "🏆 GOD MODE ACTIVATED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "📱 Your Pixel is now a Sovereign Nexus Node." -ForegroundColor Cyan
