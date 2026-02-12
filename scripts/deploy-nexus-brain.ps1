# Nexus Brain Deployment Script
# Deploys the 'Artificial Brain' wallpaper to Pixel 8 Pro

$ErrorActionPreference = "Continue"

function Write-Status {
    param($Msg, $Color = "Cyan")
    Write-Host "   $Msg" -ForegroundColor $Color
}

Write-Host "`nNEXUS RITUAL: BRAIN DEPLOYMENT" -ForegroundColor Magenta
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

# 2. Push Wallpaper
Write-Host "`n>> Deploying AIGestion.net Brain..." -ForegroundColor Yellow
$wpPath = "C:\Users\Alejandro\AIGestion\docs\assets\branding\wallpaper_aigestion_brain_net.png"

if (Test-Path $wpPath) {
    adb shell mkdir -p /sdcard/Pictures/Nexus 2>$null

    $fileName = Split-Path $wpPath -Leaf
    Write-Status "Pushing $fileName..." "Gray"
    adb push $wpPath /sdcard/Pictures/Nexus/ > $null

    # 3. FORCE OPEN IMAGE
    Write-Host "`n>> FORCING WALLPAPER DISPLAY..." -ForegroundColor Magenta
    Write-Status "Please tap 'Set as Wallpaper' on your phone NOW!" "Yellow"

    # Try multiple intents to ensure it opens
    adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/Pictures/Nexus/$fileName" -t "image/*"

}
else {
    Write-Status "[ERROR] Wallpaper file not found at $wpPath" "Red"
}

Write-Host "`nDEPLOYMENT COMPLETE." -ForegroundColor Magenta
