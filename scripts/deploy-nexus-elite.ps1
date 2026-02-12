# Nexus ELITE Deployment Script
# Deploys the 'Elite' optimized wallpaper

$ErrorActionPreference = "Continue"

function Write-Status {
    param($Msg, $Color = "Cyan")
    Write-Host "   $Msg" -ForegroundColor $Color
}

Write-Host "`nNEXUS RITUAL: ELITE OPTIMIZATION" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

# 1. Device Check
Write-Host "`n1. Checking Device..." -ForegroundColor Yellow
$adbCheck = adb devices 2>&1
if ($adbCheck -match "device$") {
    Write-Status "[PASS] Pixel 8 Pro Connected" "Green"
}
else {
    Write-Status "[WAIT] Waiting for device..." "Yellow"
    Start-Sleep -Seconds 5
}

# 2. Push Elite Wallpaper
Write-Host "`n>> Deploying AIGestion ELITE..." -ForegroundColor Yellow
$wpPath = "C:\Users\Alejandro\AIGestion\docs\assets\branding\wallpaper_aigestion_brain_net.png"

if (Test-Path $wpPath) {
    adb shell mkdir -p /sdcard/Pictures/Nexus 2>$null

    $fileName = Split-Path $wpPath -Leaf
    Write-Status "Pushing $fileName..." "Gray"
    adb push $wpPath /sdcard/Pictures/Nexus/ > $null

    # 3. FORCE OPEN IMAGE
    Write-Host "`n>> FORCING WALLPAPER DISPLAY..." -ForegroundColor Magenta
    Write-Status "This is the OPTIMIZED version." "Cyan"
    Write-Status "Tap 'Set as Wallpaper' NOW!" "Yellow"

    adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/Pictures/Nexus/$fileName" -t "image/*"

}
else {
    Write-Status "[ERROR] Wallpaper file not found at $wpPath" "Red"
}

Write-Host "`nOPTIMIZATION COMPLETE." -ForegroundColor Magenta
