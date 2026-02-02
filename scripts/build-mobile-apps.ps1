# Build Script for AIGestion Mobile Apps
param(
    [string] = "android",
    [switch],
    [switch]
)

Write-Host "ðŸ“± Building AIGestion Mobile Apps" -ForegroundColor Green
Write-Host "Platform: " -ForegroundColor Gray

# Build Enterprise App
Write-Host "ðŸ¢ Building Enterprise App..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\mobile\enterprise-app"
if () {
    npx react-native build-android --mode=release
} else {
    npx react-native build-android
}

# Build Client App
Write-Host "ðŸ‘¥ Building Client App..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\mobile\client-app"
if () {
    npx react-native build-android --mode=release
} else {
    npx react-native build-android
}

# Create APK directory if it doesn't exist
 = "c:\Users\Alejandro\AIGestion\mobile\apks"
if (-not (Test-Path )) {
    New-Item -ItemType Directory -Path  -Force | Out-Null
}

# Copy APKs to central directory
Write-Host "ðŸ“‹ Copying APKs..." -ForegroundColor Yellow
Copy-Item "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\android\app\build\outputs\apk\debug\*.apk"  -ErrorAction SilentlyContinue
Copy-Item "c:\Users\Alejandro\AIGestion\mobile\client-app\android\app\build\outputs\apk\debug\*.apk"  -ErrorAction SilentlyContinue

Write-Host "âœ… Mobile apps built successfully!" -ForegroundColor Green
Write-Host "ðŸ“ APKs available in: " -ForegroundColor Gray
