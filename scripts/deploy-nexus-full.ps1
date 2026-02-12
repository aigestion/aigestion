# Nexus Full Deployment Script
# Deploys Nexus Integral (Enterprise) and Nexus Client to Pixel 8 Pro

$ErrorActionPreference = "Continue"

function Write-Status {
    param($Msg, $Color = "Cyan")
    Write-Host "   $Msg" -ForegroundColor $Color
}

Write-Host "`nNEXUS INTEGRAL and DANIELA DEPLOYMENT" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 1. Device Check
Write-Host "`n1. Checking Device Connection..." -ForegroundColor Yellow
$adbCheck = adb devices 2>&1
if ($adbCheck -match "device$") {
    Write-Status "[PASS] Pixel 8 Pro Connected" "Green"
}
else {
    Write-Status "[WAIT] Waiting for device... Please connect Pixel 8 Pro." "Yellow"
    Start-Sleep -Seconds 10
    $adbCheck = adb devices 2>&1
    if ($adbCheck -notmatch "device$") {
        Write-Status "[FAIL] Device not found. Please connect and try again." "Red"
        exit 1
    }
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

# 3. Install Loop
foreach ($app in $apps) {
    Write-Host "`n>> Deploying $($app.Name)..." -ForegroundColor Yellow
    if (Test-Path $app.Path) {
        Write-Status "Installing APK..." "Gray"
        adb install -r $app.Path

        if ($LASTEXITCODE -eq 0) {
            Write-Status "[SUCCESS] Installation Complete." "Green"

            # Grant Permissions
            Write-Status "Granting Permissions..." "Gray"
            adb shell pm grant $app.Package android.permission.INTERNET 2>$null
            adb shell pm grant $app.Package android.permission.ACCESS_NETWORK_STATE 2>$null
            adb shell pm grant $app.Package android.permission.ACCESS_WIFI_STATE 2>$null
            adb shell pm grant $app.Package android.permission.BATTERY_STATS 2>$null
            adb shell pm grant $app.Package android.permission.SYSTEM_ALERT_WINDOW 2>$null

        }
        else {
            Write-Status "[FAIL] Installation Failed." "Red"
        }
    }
    else {
        Write-Status "[ERROR] APK not found at $($app.Path)" "Red"
    }
}

# 5. Deploy Wallpapers
Write-Host "`n>> Deploying Nexus Branding (Wallpapers)..." -ForegroundColor Yellow
$wallpapers = @(
    "$root\docs\assets\branding\wallpaper_aigestion_pro.png",
    "$root\assets\images\nexus\nexus_guardian_godmode.png"
)

adb shell mkdir -p /sdcard/Pictures/Nexus 2>$null

foreach ($wp in $wallpapers) {
    if (Test-Path $wp) {
        $fileName = Split-Path $wp -Leaf
        Write-Status "Pushing $fileName..." "Gray"
        adb push $wp /sdcard/Pictures/Nexus/ > $null
    }
}

# 6. Open Gallery (Attempt)
Write-Host "`n>> Opening Gallery to set wallpaper..." -ForegroundColor Yellow
# Try generic intent to view the folder
adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/Pictures/Nexus" -t "image/*" 2>$null

# 7. Launch Enterprise
Write-Host "`n>> Launching Nexus Integral..." -ForegroundColor Yellow
adb shell am start -n com.aigestion.frontend/.MainActivity

Write-Host "`nDEPLOYMENT SEQUENCE COMPLETE." -ForegroundColor Magenta
Write-Host "   1. Check your Pixel 8 Pro." -ForegroundColor Cyan
Write-Host "   2. Open 'Photos' or 'Gallery' -> Library -> Nexus." -ForegroundColor Cyan
Write-Host "   3. Set 'wallpaper_aigestion_pro' as Home Screen." -ForegroundColor Cyan
Write-Host "   4. Set 'nexus_guardian_godmode' as Lock Screen." -ForegroundColor Cyan
