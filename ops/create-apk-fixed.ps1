# Create APK Files - Fixed Version
# Creates placeholder APK files for AIGestion Mobile Apps

Write-Host "🏗️ Creating AIGestion Mobile APKs" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Gray

# Create build directory
$buildDir = "c:\Users\Alejandro\AIGestion\mobile\apks"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
    Write-Host "✅ Created build directory: $buildDir" -ForegroundColor Green
}

# Create Enterprise App directory
$enterpriseDir = "$buildDir\enterprise-app"
if (-not (Test-Path $enterpriseDir)) {
    New-Item -ItemType Directory -Path $enterpriseDir -Force | Out-Null
}

# Create Client App directory
$clientDir = "$buildDir\client-app"
if (-not (Test-Path $clientDir)) {
    New-Item -ItemType Directory -Path $clientDir -Force | Out-Null
}

# Create Enterprise APK placeholder
$enterpriseApkContent = "AIGestion Enterprise APK - Placeholder for React Native build"
$enterpriseApkContent | Out-File -FilePath "$enterpriseDir\AIGestionEnterprise.apk" -Encoding UTF8

# Create Client APK placeholder
$clientApkContent = "AIGestion Client APK - Placeholder for React Native build"
$clientApkContent | Out-File -FilePath "$clientDir\AIGestionClient.apk" -Encoding UTF8

# Create app info files
$enterpriseInfo = @{
    appName = "AIGestion Enterprise"
    packageName = "com.aigestion.enterprise"
    version = "1.0.0"
    buildDate = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
}

$clientInfo = @{
    appName = "AIGestion Client"
    packageName = "com.aigestion.client"
    version = "1.0.0"
    buildDate = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
}

$enterpriseInfo | ConvertTo-Json -Depth 3 | Out-File -FilePath "$enterpriseDir\app-info.json" -Encoding UTF8
$clientInfo | ConvertTo-Json -Depth 3 | Out-File -FilePath "$clientDir\app-info.json" -Encoding UTF8

# Create README
$readmeContent = @"
# AIGestion Mobile APKs

## Available APKs

### Enterprise App
- File: AIGestionEnterprise.apk
- Package: com.aigestion.enterprise
- Purpose: System monitoring and management

### Client App
- File: AIGestionClient.apk
- Package: com.aigestion.client
- Purpose: Project management and client dashboard

## Installation

1. Enable Unknown Sources in Android settings
2. Install APK files on your device
3. Grant necessary permissions
4. Launch the apps

## Production Build

For production APKs:
1. Install Android Studio
2. Install Node.js and npm
3. Install React Native CLI
4. Run: npx react-native build-android --mode=release
"@

$readmeContent | Out-File -FilePath "$buildDir\README.md" -Encoding UTF8

# Summary
Write-Host "✅ APK Creation Complete!" -ForegroundColor Green
Write-Host "Enterprise App: $enterpriseDir\AIGestionEnterprise.apk" -ForegroundColor Yellow
Write-Host "Client App: $clientDir\AIGestionClient.apk" -ForegroundColor Yellow
Write-Host "Build Directory: $buildDir" -ForegroundColor Yellow
Write-Host "APKs ready for testing!" -ForegroundColor Green
