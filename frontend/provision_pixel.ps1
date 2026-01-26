$ErrorActionPreference = "SilentlyContinue"

Write-Host "📱 Starting 'God Mode' Provisioning for Pixel 8a..." -ForegroundColor Cyan

# 1. Check ADB
$adbPath = "C:\Users\Alejandro\platform-tools\adb.exe"
if (-not (Test-Path $adbPath)) {
    # Fallback to path if not found (assuming it might be in PATH)
    $adbPath = "adb"
}

# 2. Check Devices
Write-Host "🔍 Searching for devices..."
$devs = & $adbPath devices -l
if ($devs -match "device usb") {
    Write-Host "✅ Device connected!" -ForegroundColor Green
} else {
    Write-Host "❌ No device found via USB. Please connect your Pixel 8a." -ForegroundColor Red
    Write-Host "   Ensure 'USB Debugging' is ENABLED in Developer Options." -ForegroundColor Yellow
    exit
}

# 3. God Mode Settings
Write-Host "`n⚡ Injecting Performance Settings..." -ForegroundColor Magenta

# Animations 0.5x
& $adbPath shell settings put global window_animation_scale 0.5
& $adbPath shell settings put global transition_animation_scale 0.5
& $adbPath shell settings put global animator_duration_scale 0.5
Write-Host "   - Animations set to 0.5x (Snappy!)"

# Network
& $adbPath shell settings put global wifi_scan_throttle_enabled 0
Write-Host "   - Wi-Fi Scan Throttling Disabled (Better Latency)"
& $adbPath shell settings put global private_dns_mode hostname
& $adbPath shell settings put global private_dns_specifier dns.google
Write-Host "   - Private DNS set to dns.google"

# Display (Force High Refresh Rate if possible contextually, though usually System > Display)
& $adbPath shell settings put system min_refresh_rate 120.0
& $adbPath shell settings put system peak_refresh_rate 120.0
Write-Host "   - Refresh Rate target: 120Hz"

# Dark Mode
& $adbPath shell settings put secure ui_night_mode 2
Write-Host "   - Dark Mode Forced"

# 4. Debloating (Safety First - disabling usually better than removing)
Write-Host "`n🗑️ cleaning up bloatware..." -ForegroundColor Magenta
$packagesToDisable = @(
    "com.google.android.apps.tips",
    "com.google.android.apps.safetyhub",
    "com.google.android.videos", # Google TV often unused in enterprise
    "com.google.android.apps.youtube.music" # Enterprise focus
)

foreach ($pkg in $packagesToDisable) {
    & $adbPath shell pm disable-user --user 0 $pkg
    Write-Host "   - Disabled $pkg"
}

# 5. Summary
Write-Host "`n✅ Configuration Complete!" -ForegroundColor Green
Write-Host "   The device is now optimized. Ready for AIGestion App installation."
