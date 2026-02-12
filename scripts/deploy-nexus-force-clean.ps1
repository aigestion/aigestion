# Nexus FORCE CLEAN Deployment Script
# Uninstalls old versions and clean installs Nexus Integral & Daniela

$ErrorActionPreference = "Continue"

function Write-Status {
    param($Msg, $Color = "Cyan")
    Write-Host "   $Msg" -ForegroundColor $Color
}

Write-Host "`nNEXUS RITUAL: FORCE CLEAN DEPLOYMENT" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

# 1. Device Check
Write-Host "`n1. Checking Device..." -ForegroundColor Yellow
$adbCheck = adb devices 2>&1
if ($adbCheck -match "device$") {
    Write-Status "[PASS] Pixel 8 Pro Connected" "Green"
} else {
    Write-Status "[WAIT] Waiting for device..." "Yellow"
    Start-Sleep -Seconds 5
}

# 2. Define APKs
$root = "C:\Users\Alejandro\AIGestion"
$apps = @(
    @{
        Name    = "Nexus Integral (Enterprise)"
        Path    = "$root\mobile\apks\AIGestion-Frontend-Production-Verified.apk"
        Package = "com.aigestion.frontend"
    },
    @{
        Name    = "Nexus Client (Daniela)"
        Path    = "$root\frontend\apps\mobile-gateway\android\app\build\outputs\apk\debug\app-debug.apk"
        Package = "com.aigestion.gateway"
    }
)

# 3. Clean & Install
foreach ($app in $apps) {
    Write-Host "`n>> Processing $($app.Name)..." -ForegroundColor Yellow

    # Uninstall
    Write-Status "Uninstalling old version..." "Gray"
    adb uninstall $app.Package

    # Install
    if (Test-Path $app.Path) {
        Write-Status "Installing FRESH version..." "Gray"
        adb install -r $app.Path

        if ($LASTEXITCODE -eq 0) {
            Write-Status "[SUCCESS] Installation Complete." "Green"

            # Permissions
            Write-Status "Granting Permissions..." "Gray"
            adb shell pm grant $app.Package android.permission.INTERNET 2>$null
            adb shell pm grant $app.Package android.permission.ACCESS_NETWORK_STATE 2>$null
            adb shell pm grant $app.Package android.permission.ACCESS_WIFI_STATE 2>$null
            adb shell pm grant $app.Package android.permission.BATTERY_STATS 2>$null
            adb shell pm grant $app.Package android.permission.SYSTEM_ALERT_WINDOW 2>$null
        } else {
            Write-Status "[FAIL] Installation Failed." "Red"
        }
    } else {
        Write-Status "[ERROR] APK not found!" "Red"
    }
}

# 4. Push Wallpapers
Write-Host "`n>> Deploying Nexus Branding..." -ForegroundColor Yellow
$wallpapers = @(
    "$root\docs\assets\branding\wallpaper_aigestion_pro.png",
    "$root\assets\images\nexus\nexus_guardian_godmode.png"
)

adb shell mkdir -p /sdcard/Pictures/Nexus 2>$null

foreach ($wp in $wallpapers) {
    if (Test-Path $wp) {
        $fileName = Split-Path $wp -Leaf
        adb push $wp /sdcard/Pictures/Nexus/ > $null
    }
}

# 5. FORCE OPEN IMAGE
Write-Host "`n>> FORCING WALLPAPER DISPLAY..." -ForegroundColor Magenta
Write-Status "Please tap 'Set as Wallpaper' on your phone!" "Yellow"
adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/Pictures/Nexus/wallpaper_aigestion_pro.png" -t "image/*"

Start-Sleep -Seconds 3

# 6. Launch App
Write-Host "`n>> Launching Nexus Integral..." -ForegroundColor Yellow
adb shell am start -n com.aigestion.frontend/.MainActivity

Write-Host "`nCLEAN DEPLOYMENT COMPLETE." -ForegroundColor Magenta
