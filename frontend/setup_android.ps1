$ErrorActionPreference = "SilentlyContinue"

Write-Host "Checking Android Setup..." -ForegroundColor Cyan

# 1. Check ADB
$adbPath = "C:\Users\Alejandro\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "ADB found." -ForegroundColor Green
}
else {
    Write-Host "ADB not found." -ForegroundColor Red
    exit
}

# 2. Check Devices
Write-Host "Checking devices..."
$devs = & $adbPath devices -l
Write-Host $devs

if ($devs -match "device usb") {
    Write-Host "Device connected!" -ForegroundColor Green
}
else {
    Write-Host "No device found. Enable USB Debugging on your Xiaomi." -ForegroundColor Yellow
}

# 3. Check SDK
$possiblePaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "C:\Android\sdk"
)

$sdkPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\build-tools") {
        $sdkPath = $path
        break
    }
}

if ($sdkPath) {
    Write-Host "SDK found at $sdkPath" -ForegroundColor Green
    $localProp = "c:\Users\Alejandro\AIGestion\frontend\android\local.properties"
    "sdk.dir=$($sdkPath.Replace('\', '\\'))" | Out-File -Encoding utf8 $localProp
    Write-Host "Created local.properties" -ForegroundColor Green
}
else {
    Write-Host "SDK not found." -ForegroundColor Red
}
