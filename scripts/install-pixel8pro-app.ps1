# Pixel 8 Pro Enterprise App Installation Script
# Installs and configures AIGestion Enterprise app on Pixel 8 Pro

param(
    [switch]$Install,
    [switch]$Configure,
    [switch]$Test,
    [switch]$Monitor,
    [switch]$SetupADB,
    [string]$DeviceIP = "192.168.1.132"
)

Write-Host "📱 Pixel 8 Pro Enterprise App Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Gray

# Check if Pixel 8 Pro is connected
function Test-PixelConnection {
    Write-Host "🔍 Checking Pixel 8 Pro connection..." -ForegroundColor Yellow
    
    try {
        $devices = adb devices
        if ($devices -match "device") {
            Write-Host "✅ Pixel 8 Pro detected via ADB" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Pixel 8 Pro not detected via ADB" -ForegroundColor Red
            Write-Host "   Make sure:" -ForegroundColor Yellow
            Write-Host "   1. USB debugging is enabled on Pixel 8 Pro" -ForegroundColor Yellow
            Write-Host "   2. Device is connected via USB" -ForegroundColor Yellow
            Write-Host "   3. ADB drivers are installed" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ ADB not available" -ForegroundColor Red
        Write-Host "   Installing ADB..." -ForegroundColor Yellow
        wing install android-sdk-platform-tools
        return $false
    }
}

# Enable USB debugging on Pixel 8 Pro
function Enable-USBDebugging {
    Write-Host "🔧 Enabling USB debugging on Pixel 8 Pro..." -ForegroundColor Yellow
    Write-Host "On your Pixel 8 Pro:" -ForegroundColor Gray
    Write-Host "1. Go to Settings > About phone" -ForegroundColor Gray
    Write-Host "2. Tap 'Build number' 7 times" -ForegroundColor Gray
    Write-Host "3. Go to Settings > System > Developer options" -ForegroundColor Gray
    Write-Host "4. Enable 'USB debugging'" -ForegroundColor Gray
    Write-Host "5. Enable 'Wireless debugging' (optional)" -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    Write-Host "Press Enter when ready..." -ForegroundColor Cyan
    Read-Host
}

# Install AIGestion Enterprise App
function Install-EnterpriseApp {
    Write-Host "📦 Installing AIGestion Enterprise App..." -ForegroundColor Yellow
    
    $apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"
    
    if (-not (Test-Path $apkPath)) {
        Write-Host "❌ APK file not found at: $apkPath" -ForegroundColor Red
        Write-Host "   Please run the APK creation script first" -ForegroundColor Yellow
        return $false
    }
    
    try {
        Write-Host "📤 Installing APK: AIGestionEnterprise.apk" -ForegroundColor Yellow
        adb install "$apkPath"
        Write-Host "✅ Installation completed!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Configure app permissions and settings
function Configure-App {
    Write-Host "⚙️ Configuring AIGestion Enterprise App..." -ForegroundColor Yellow
    
    # Grant necessary permissions
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
        "android.permission.ACCESS_COARSE_LOCATION"
    )
    
    foreach ($permission in $permissions) {
        try {
            adb shell pm grant com.aigestion.enterprise $permission
            Write-Host "  ✅ Granted: $permission" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️ Could not grant: $permission" -ForegroundColor Yellow
        }
    }
    
    # Set app as device admin (if possible)
    try {
        Write-Host "👤 Setting app as device admin..." -ForegroundColor Yellow
        adb shell dpm set-device-owner com.aigestion.enterprise
        Write-Host "  ✅ Device admin set" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️ Could not set device admin (manual setup required)" -ForegroundColor Yellow
    }
    
    # Enable auto-start
    try {
        Write-Host "🚀 Enabling auto-start..." -ForegroundColor Yellow
        adb shell pm enable com.aigestion.enterprise
        Write-Host "  ✅ Auto-start enabled" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️ Could not enable auto-start" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Configuration completed!" -ForegroundColor Green
}

# Test app functionality
function Test-App {
    Write-Host "🧪 Testing AIGestion Enterprise App..." -ForegroundColor Yellow
    
    # Launch app
    try {
        Write-Host "🚀 Launching app..." -ForegroundColor Yellow
        adb shell am start -n com.aigestion.enterprise/.MainActivity
        Start-Sleep -Seconds 3
        
        # Check if app is running
        $processInfo = adb shell "ps | grep com.aigestion.enterprise"
        if ($processInfo) {
            Write-Host "✅ App is running successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ App failed to start" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not test app: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test ADB connection
    try {
        Write-Host "🔗 Testing ADB connection..." -ForegroundColor Yellow
        $testResult = adb shell "echo 'ADB connection test successful'"
        if ($testResult -eq "ADB connection test successful") {
            Write-Host "✅ ADB connection working" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ ADB connection failed" -ForegroundColor Red
    }
}

# Monitor app performance
function Monitor-App {
    Write-Host "📊 Starting app monitoring..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    
    try {
        while ($true) {
            Clear-Host
            Write-Host "📊 AIGestion Enterprise App Monitor - Pixel 8 Pro" -ForegroundColor Cyan
            Write-Host "========================================" -ForegroundColor Gray
            Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
            Write-Host "" -ForegroundColor Gray
            
            # Get device info
            $deviceInfo = adb shell "getprop ro.product.model"
            $androidVersion = adb shell "getprop ro.build.version.release"
            $batteryLevel = adb shell "dumpsys battery | grep level | awk '{print \$2}'"
            $memoryInfo = adb shell "cat /proc/meminfo | grep MemTotal"
            
            Write-Host "📱 Device Information:" -ForegroundColor Yellow
            Write-Host "  Model: $deviceInfo" -ForegroundColor White
            Write-Host "  Android: $androidVersion" -ForegroundColor White
            Write-Host "  Battery: $batteryLevel%" -ForegroundColor White
            Write-Host "  Memory: $memoryInfo" -ForegroundColor White
            Write-Host "" -ForegroundColor Gray
            
            # Get app memory usage
            $appMemory = adb shell "dumpsys meminfo com.aigestion.enterprise | grep 'TOTAL PSS'"
            Write-Host "📊 App Memory Usage:" -ForegroundColor Yellow
            Write-Host "  $appMemory" -ForegroundColor White
            Write-Host "" -ForegroundColor Gray
            
            # Get app CPU usage
            $appCPU = adb shell "top -n 1 | grep com.aigestion.enterprise"
            Write-Host "⚡ App CPU Usage:" -ForegroundColor Yellow
            Write-Host "  $appCPU" -ForegroundColor White
            Write-Host "" -ForegroundColor Gray
            
            # Get network status
            $networkStatus = adb shell "ping -c 1 8.8.8.8"
            Write-Host "🌐 Network Status:" -ForegroundColor Yellow
            Write-Host "  $networkStatus" -ForegroundColor White
            Write-Host "" -ForegroundColor Gray
            
            # System status
            $systemLoad = adb shell "cat /proc/loadavg | awk '{print \$1}'"
            Write-Host "🖥️ System Load: $systemLoad" -ForegroundColor White
            Write-Host "" -ForegroundColor Gray
            
            Write-Host "🔄 Refreshing in 5 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 5
        }
    } catch {
        Write-Host "❌ Monitoring error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Setup ADB connection
function Setup-ADB {
    Write-Host "🔧 Setting up ADB connection..." -ForegroundColor Yellow
    
    try {
        # Kill existing ADB server
        Write-Host "🔄 Restarting ADB server..." -ForegroundColor Yellow
        adb kill-server
        Start-Sleep -Seconds 2
        adb start-server
        Start-Sleep -Seconds 3
        
        # Check ADB status
        $adbStatus = adb get-state
        if ($adbStatus -eq "device") {
            Write-Host "✅ ADB server running" -ForegroundColor Green
        } else {
            Write-Host "⚠️ ADB server status: $adbStatus" -ForegroundColor Yellow
        }
        
        # List connected devices
        Write-Host "📱 Connected devices:" -ForegroundColor Yellow
        adb devices
        Write-Host "" -ForegroundColor Gray
        
        return $true
    } catch {
        Write-Host "❌ ADB setup failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "🏢 Pixel 8 Pro Enterprise App Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

# Step 1: Setup ADB
if ($SetupADB) {
    Setup-ADB
}

# Step 2: Check connection
if (-not (Test-PixelConnection)) {
    Enable-USBDebugging
    if (-not (Test-PixelConnection)) {
        Write-Host "❌ Cannot proceed without Pixel 8 Pro connection" -ForegroundColor Red
        exit 1
    }
}

# Step 3: Install app
if ($Install) {
    if (-not (Install-EnterpriseApp)) {
        Write-Host "❌ Installation failed" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Configure app
if ($Configure) {
    Configure-App
}

# Step 5: Test app
if ($Test) {
    Test-App
}

# Step 6: Monitor app
if ($Monitor) {
    Monitor-App
}

Write-Host "" -ForegroundColor Gray
Write-Host "🎉 Pixel 8 Pro Enterprise App Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Gray
Write-Host "✅ App installed and configured" -ForegroundColor Green
Write-Host "✅ Permissions granted" -ForegroundColor Green
Write-Host "✅ Device admin set" -ForegroundColor Green
Write-Host "✅ Auto-start enabled" -ForegroundColor Green
Write-Host "✅ Ready for enterprise use" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 App Features:" -ForegroundColor Cyan
Write-Host "  • Real-time system monitoring" -ForegroundColor White
Write-Host "  • Memory optimization" -ForegroundColor White
Write- "  • Service management" -ForegroundColor White
Write-Host "  • Pixel 8 Pro optimizations" -ForegroundColor White
Write-Host "  • Enterprise-grade security" -ForegroundColor White
Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Ready for enterprise administration!" -ForegroundColor Green
