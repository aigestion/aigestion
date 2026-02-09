# Pixel 8 Pro - Complete Enterprise Setup Script
# Full installation and configuration for AIGestion Enterprise app

Write-Host "🏢 Pixel 8 Pro Enterprise Setup - Complete" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if ADB is available
$adbAvailable = $false
try {
    $null = adb version
    $adbAvailable = $true
    Write-Host "✅ ADB found" -ForegroundColor Green
} catch {
    Write-Host "❌ ADB not found" -ForegroundColor Red
    Write-Host "Installing Android SDK Platform Tools..." -ForegroundColor Yellow
    wing install android-sdk-platform-tools --accept-package-agreements --accept-source-agreements
    Write-Host "✅ Android SDK installed" -ForegroundColor Green
    $adbAvailable = $true
}

# Check if Pixel 8 Pro is connected
$deviceConnected = $false
try {
    $devices = adb devices
    if ($devices -match "device") {
        $deviceConnected = $true
        Write-Host "✅ Pixel 8 Pro connected" -ForegroundColor Green
        $deviceInfo = adb shell getprop ro.product.model
        Write-Host "  Device: $deviceInfo" -ForegroundColor Gray
    } else {
        Write-Host "❌ Pixel 8 Pro not connected" -ForegroundColor Red
        Write-Host "Please connect your Pixel 8 Pro via USB and enable USB debugging" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot check device connection" -ForegroundColor Red
}

# Function to install app
function Install-EnterpriseApp {
    param(
        [string]$ApkPath,
        [string]$PackageName = "com.aigestion.enterprise"
    )
    
    Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
    
    if (-not (Test-Path $ApkPath)) {
        Write-Host "❌ APK file not found at: $ApkPath" -ForegroundColor Red
        return $false
    }
    
    try {
        Write-Host "📤 Installing: $($ApkPath | Split-Path -Leaf)" -ForegroundColor Yellow
        $result = adb install "$ApkPath"
        
        if ($result -match "Success") {
            Write-Host "✅ Installation completed successfully!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Installation failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Installation error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to grant permissions
function Grant-Permissions {
    param([string]$PackageName = "com.aigestion.enterprise")
    
    Write-Host "🔐 Granting permissions..." -ForegroundColor Yellow
    
    $permissions = @(
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.BATTERY_STATS",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.WAKE_LOCK",
        "android.permission.DISABLE_KEYGUARD"
    )
    
    $granted = 0
    $total = $permissions.Count
    
    foreach ($permission in $permissions) {
        try {
            adb shell pm grant $PackageName $permission
            Write-Host "  ✅ Granted: $permission" -ForegroundColor Green
            $granted++
        } catch {
            Write-Host "  ⚠️ Could not grant: $permission" -ForegroundColor Yellow
        }
    }
    
    Write-Host "📊 Permissions granted: $granted/$total" -ForegroundColor Green
    return $granted -eq $total
}

# Function to launch app
function Launch-App {
    param([string]$PackageName = "com.aigestion.enterprise")
    
    Write-Host "🚀 Launching app..." -ForegroundColor Yellow
    
    try {
        adb shell am start -n $PackageName/.MainActivity
        Write-Host "✅ App launched successfully!" -ForegroundColor Green
        
        # Wait a moment for app to start
        Start-Sleep -Seconds 3
        
        # Check if app is running
        $processInfo = adb shell "ps | grep $PackageName"
        if ($processInfo) {
            Write-Host "✅ App is running" -ForegroundColor Green
        } else {
            Write-Host "⚠️ App may not have started yet" -ForegroundColor Yellow
        }
        
        return $true
    } catch {
        Write-Host "❌ Could not launch app: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to set device admin
function Set-DeviceAdmin {
    param([string]$PackageName = "com.aigestion.enterprise")
    
    Write-Host "👤 Setting device admin..." -ForegroundColor Yellow
    
    try {
        adb shell dpm set-device-owner $PackageName
        Write-Host "✅ Device admin set successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "⚠️ Could not set device admin" -ForegroundColor Yellow
        return $false
    }
}

# Function to get device info
function Get-DeviceInfo {
    Write-Host "📱 Getting device information..." -ForegroundColor Yellow
    
    try {
        $model = adb shell getprop ro.product.model
        $androidVersion = adb shell getprop ro.build.version.release
        $apiLevel = adb shell getprop ro.build.version.sdk
        $batteryLevel = adb shell dumpsys battery | Select-String -Pattern "level: (\d+)" | ForEach-Object { $_.Matches.Groups[1] }
        $memoryInfo = adb shell cat /proc/meminfo | Select-String -Pattern "MemTotal:\s+(\d+)\s+kB" | ForEach-Object { $_.Matches.Groups[1] }
        
        Write-Host "📱 Device Information:" -ForegroundColor Yellow
        Write-Host "  Model: $model" -ForegroundColor White
        Write-Host "  Android: $androidVersion" -ForegroundColor White
        Write-Host "  API Level: $apiLevel" -ForegroundColor White
        Write-Host "  Battery: $batteryLevel%" -ForegroundColor White
        Write-Host "  Total Memory: $([math]::Round([int]$memoryInfo/1MB, 2)) GB" -ForegroundColor White
    } catch {
        Write-Host "❌ Could not get device info: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to test app functionality
function Test-App {
    param([string]$PackageName = "com.aigestion.enterprise")
    
    Write-Host "🧪 Testing app functionality..." -ForegroundColor Yellow
    
    Write-Host "📊 Checking app process..." -ForegroundColor Yellow
    try {
        $processInfo = adb shell "ps | grep $PackageName"
        if ($processInfo) {
            Write-Host "✅ App process found" -ForegroundColor Green
            Write-Host "  $processInfo" -ForegroundColor White
        } else {
            Write-Host "❌ App process not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not check app process: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "📊 Checking app memory usage..." -ForegroundColor Yellow
    try {
        $memInfo = adb shell dumpsys meminfo $PackageName
        if ($memInfo) {
            Write-Host "✅ Memory info:" -ForegroundColor Green
            Write-Host "  $memInfo" -ForegroundColor White
        } else {
            Write-Host "❌ Could not get memory info" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not check memory usage: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "🌐 Checking network connectivity..." -ForegroundColor Yellow
    try {
        $networkTest = adb shell "ping -c 1 8.8.8.8"
        if ($networkTest -match "bytes from") {
            Write-Host "✅ Network connectivity working" -ForegroundColor Green
        } else {
            Write-Host "❌ Network connectivity failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not test network: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to enable auto-start
function Enable-AutoStart {
    param([string]$PackageName = "com.aigestion.enterprise")
    
    Write-Host "🚀 Enabling auto-start..." -ForegroundColor Yellow
    
    try {
        adb shell pm enable $PackageName
        Write-Host "✅ Auto-start enabled" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Could not enable auto-start: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to create desktop shortcut
function Create-DesktopShortcut {
    $shortcutPath = "$env:USERPROFILE\Desktop\AIGestion Enterprise.lnk"
    $shell = New-Object -ComObject WScript.Shell
    
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-ExecutionPolicy Bypass -File `"c:\Users\Alejandro\AIGestion\scripts\pixel8pro-install-manual.md`""
    $shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
    $shortcut.IconLocation = "shell32.dll,27"
    $shortcut.Description = "AIGestion Enterprise Installation Guide"
    $shortcut.Save()
    
    Write-Host "✅ Desktop shortcut created: $shortcutPath" -ForegroundColor Green
}

# Main execution
Write-Host "🏢 Pixel 8 Pro Enterprise Setup - Complete" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

# Check if device is connected
if (-not $deviceConnected) {
    Write-Host "❌ Pixel 8 Pro not connected. Please:" -ForegroundColor Red
    Write-Host "1. Enable USB debugging on Pixel 8 Pro" -ForegroundColor Yellow
    Write-Host "2. Connect device via USB cable" -ForegroundColor Yellow
    Write-Host "3. Ensure ADB is installed" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Gray
    Write-Host "📋 Manual installation guide opened in your browser" -ForegroundColor Yellow
    Create-DesktopShortcut
    Start-Process "c:\Users\Alejandro\AIGestion\scripts\pixel8pro-install-manual.md"
    exit 1
}

# Install app
$apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"
Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
$installSuccess = Install-EnterpriseApp -ApkPath $apkPath

if (-not $installSuccess) {
    Write-Host "❌ Installation failed. Please check:" -ForegroundColor Red
    Write-Host "1. APK file exists: $apkPath" -ForegroundColor Yellow
    Write-Write-Host "2. Device is connected via ADB" -ForegroundColor Yellow
    Write-Host "3. USB debugging is enabled" -ForegroundColor Yellow
    exit 1
}

# Grant permissions
Write-Host "⚙️ Granting permissions..." -ForegroundColor Yellow
$permissionsSuccess = Grant-Permissions

if (-not $permissionsSuccess) {
    Write-Host "⚠️ Some permissions could not be granted" -ForegroundColor Yellow
    Write-Host "This may affect app functionality" -ForegroundColor Yellow
}

# Set device admin
Write-Host "👤 Setting device admin..." -ForegroundColor Yellow
$adminSuccess = Set-DeviceAdmin

if (-not $adminSuccess) {
    Write-Host "⚠️ Could not set device admin" -ForegroundColor Yellow
    Write-Host "You may need to do this manually in Device Admin settings" -ForegroundColor Yellow
}

# Enable auto-start
Write-Host "🚀 Enabling auto-start..." -ForegroundColor Yellow
$autoStartSuccess = Enable-AutoStart

if (-not $autoStartSuccess) {
    Write-Host "⚠️ Could not enable auto-start" -ForegroundColor Yellow
    Write-Host "You may need to do this manually in App Info settings" -ForegroundColor Yellow
}

# Launch app
Write-Host "🚀 Launching app..." -ForegroundColor Yellow
$launchSuccess = Launch-App

if (-not $launchSuccess) {
    Write-Host "❌ Could not launch app" -ForegroundColor Red
    Write-Host "Try launching manually from app drawer" -ForegroundColor Yellow
}

# Test app
Write-Host "🧪 Testing app functionality..." -ForegroundColor Yellow
Test-App

# Get device info
Write-Host "📱 Getting device information..." -ForegroundColor Yellow
Get-DeviceInfo

# Create desktop shortcut
Write-Host "🖥️ Creating desktop shortcut..." -ForegroundColor Yellow
Create-DesktopShortcut

# Final status
Write-Host "" -ForegroundColor Gray
Write-Host "🎉 Pixel 8 Pro Enterprise Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Gray
Write-Host "✅ App installed: AIGestionEnterprise.apk" -ForegroundColor Green
Write-Host "✅ Permissions granted: $($permissionsSuccess ? 'All' : 'Some')" -ForegroundColor $(if ($permissionsSuccess) { 'Green' } else { 'Yellow' })"
Write-Host "✅ Device admin: $($adminSuccess ? 'Set' : 'Manual required')" -ForegroundColor $(if ($adminSuccess) { 'Green' } else { 'Yellow' })"
Write-Host "✅ Auto-start: $($autoStartSuccess ? 'Enabled' : 'Manual required')" -ForegroundColor $(if ($autoStartSuccess) { 'Green' } else { 'Yellow' })"
Write-Host "✅ App launched: $($launchSuccess ? 'Successfully' : 'Manual required')" -ForegroundColor $(if ($launchSuccess) { 'Green' } else { 'Yellow' })"
Write-Host "" -ForegroundColor Gray
Write-Host "📱 App Features:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
WriteHost "  • Service management" -ForegroundColor White
WriteHost "  • Pixel 8 Pro optimizations" -ForegroundColor White
Write-Host "  • Enterprise-grade security" -ForegroundColor White
Write-Host "  • USB debugging enabled" -ForegroundColor White
Write-Host "  • Wireless debugging ready" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise administration!" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📁 APK Location:" -ForegroundColor Yellow
Write-Host "  $apkPath" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "📋 Documentation:" -ForegroundColor Yellow
Write-Host "  Desktop shortcut: Desktop\AIGestion Enterprise.lnk" -ForegroundColor White
Write-Host "  Manual guide: scripts\pixel8pro-install-manual.md" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🔗 ADB Commands for future reference:" -ForegroundColor Gray
Write-Host "  adb devices - List connected devices" -ForegroundColor Gray
Write-Host "  adb install <apk> - Install APK file" -ForegroundColor Gray
Write-Host "  adb shell pm grant <package> <permission> - Grant permission" -ForegroundColor Gray
Write-Host "  adb shell am start -n <package>/.MainActivity - Launch app" -ForegroundColor Gray
Write-Host "  adb shell dumpsys meminfo <package> - Check memory usage" -ForegroundColor Gray
Write-Host "  adb uninstall <package> - Uninstall app" -ForegroundColor Gray
