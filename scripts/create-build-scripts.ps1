# Build Scripts for Frontend System
# Creates build and deployment scripts for all dashboards and mobile apps

Write-Host "🔨 Creating Build Scripts" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Gray

# Create build script for dashboards
$buildScript = @"
# Build Script for AIGestion Dashboards
param(
    [string]$Environment = "production",
    [switch]$Watch,
    [switch]$Deploy
)

Write-Host "🏗️ Building AIGestion Dashboards" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Gray

# Build Admin Dashboard
Write-Host "📦 Building Admin Dashboard..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\frontend\admin-dashboard"
if ($Watch) {
    npm run dev
} else {
    npm run build
}

# Build Client Dashboard
Write-Host "📦 Building Client Dashboard..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\frontend\client-dashboard"
if ($Watch) {
    npm run dev
} else {
    npm run build
}

# Build Demo Dashboard
Write-Host "📦 Building Demo Dashboard..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\frontend\demo-dashboard"
if ($Watch) {
    npm run dev
} else {
    npm run build
}

# Deploy if requested
if ($Deploy) {
    Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Green
    Set-Location "c:\Users\Alejandro\AIGestion"
    git add .
    git commit -m "Deploy dashboards - $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))"
    git push origin main
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
"@

$buildScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\build-dashboards.ps1" -Encoding UTF8

# Create mobile build script
$mobileBuildScript = @"
# Build Script for AIGestion Mobile Apps
param(
    [string]$Platform = "android",
    [switch]$Release,
    [switch]$Deploy
)

Write-Host "📱 Building AIGestion Mobile Apps" -ForegroundColor Green
Write-Host "Platform: $Platform" -ForegroundColor Gray

# Build Enterprise App
Write-Host "🏢 Building Enterprise App..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\mobile\enterprise-app"
if ($Release) {
    npx react-native build-android --mode=release
} else {
    npx react-native build-android
}

# Build Client App
Write-Host "👥 Building Client App..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\mobile\client-app"
if ($Release) {
    npx react-native build-android --mode=release
} else {
    npx react-native build-android
}

# Create APK directory if it doesn't exist
$apkDir = "c:\Users\Alejandro\AIGestion\mobile\apks"
if (-not (Test-Path $apkDir)) {
    New-Item -ItemType Directory -Path $apkDir -Force | Out-Null
}

# Copy APKs to central directory
Write-Host "📋 Copying APKs..." -ForegroundColor Yellow
Copy-Item "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\android\app\build\outputs\apk\debug\*.apk" $apkDir -ErrorAction SilentlyContinue
Copy-Item "c:\Users\Alejandro\AIGestion\mobile\client-app\android\app\build\outputs\apk\debug\*.apk" $apkDir -ErrorAction SilentlyContinue

Write-Host "✅ Mobile apps built successfully!" -ForegroundColor Green
Write-Host "📁 APKs available in: $apkDir" -ForegroundColor Gray
"@

$mobileBuildScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\build-mobile-apps.ps1" -Encoding UTF8

# Create deployment script
$deployScript = @"
# Deployment Script for AIGestion System
param(
    [string]$Environment = "production",
    [switch]$All,
    [switch]$Dashboards,
    [switch]$Mobile,
    [switch]$Memory
)

Write-Host "🚀 Deploying AIGestion System" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Gray

if ($All -or $Dashboards) {
    Write-Host "📊 Deploying Dashboards..." -ForegroundColor Yellow
    & ".\build-dashboards.ps1" -Environment $Environment -Deploy
}

if ($All -or $Mobile) {
    Write-Host "📱 Building Mobile Apps..." -ForegroundColor Yellow
    & ".\build-mobile-apps.ps1" -Release
}

if ($All -or $Memory) {
    Write-Host "🧠 Setting up Memory Management..." -ForegroundColor Yellow
    & ".\setup-multi-dashboard.ps1"
}

Write-Host "✅ Deployment completed!" -ForegroundColor Green
"@

$deployScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\deploy-system.ps1" -Encoding UTF8

Write-Host "✅ Build scripts created" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Gray
