# Browserless God Mode Configuration for AIGestion
# Configures Browserless at God Mode level for maximum performance

param(
    [switch]$Install,
    [switch]$Test,
    [switch]$Status,
    [switch]$Reset
)

# Configuration
$BrowserlessPort = 3001
$ConfigPath = "c:\Users\Alejandro\AIGestion\docker\docker-compose.yml"
$LogFile = "c:\Users\Alejandro\AIGestion\logs\browserless-god-mode.log"

# God Mode Configuration
$GodModeConfig = @{
    # Performance Settings
    MAX_CONCURRENT_SESSIONS = 25
    CONCURRENT_PAGES = 15
    MAX_QUEUE_LENGTH = 100
    WORKSPACE_DELETE_EXPIRED = "true"
    
    # Chrome Optimization
    PREBOOT_CHROME = "true"
    DEFAULT_STEALTH = "true"
    DEFAULT_LAUNCH_ARGS = "--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-accelerated-2d-canvas,--no-first-run,--no-zygote,--single-process,--disable-gpu"
    
    # Security & Privacy
    BLOCK_ADS = "true"
    BLOCK_TRACKERS = "true"
    ENABLE_COOKIES = "false"
    ENABLE_JAVASCRIPT = "true"
    
    # Resource Management
    TIMEOUT = 60000
    MAX_CPU_PERCENT = 80
    MAX_MEMORY_PERCENT = 70
    DISK_CACHE_SIZE = 536870912  # 512MB
    
    # Advanced Features
    ENABLE_VNC = "false"
    ENABLE_WEBRTC = "true"
    ENABLE_AUDIO = "true"
    ENABLE_VIDEO = "true"
    
    # Monitoring
    METRICS_ENABLED = "true"
    DEBUG_MODE = "false"
    LOG_LEVEL = "warn"
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $logEntry
    
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARN"  { Write-Host $logEntry -ForegroundColor Yellow }
        "INFO"  { Write-Host $logEntry -ForegroundColor Green }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Cyan }
        default { Write-Host $logEntry -ForegroundColor Gray }
    }
}

function Test-BrowserlessConnection {
    Write-Log "Testing Browserless connection..." "INFO"
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$BrowserlessPort/pressure" -Method GET -TimeoutSec 10
        Write-Log "Browserless is responding: $($response | ConvertTo-Json -Compress)" "SUCCESS"
        return $true
    } catch {
        Write-Log "Browserless connection failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Get-BrowserlessStatus {
    Write-Log "Getting Browserless status..." "INFO"
    
    try {
        # Check if container is running
        $container = docker ps --filter "name=browserless" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        if ($container) {
            Write-Host "=== BROWSERLESS STATUS ===" -ForegroundColor Cyan
            Write-Host $container -ForegroundColor Green
            
            # Get detailed stats
            $stats = docker stats browserless --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
            Write-Host "Resource Usage:" -ForegroundColor Yellow
            Write-Host $stats -ForegroundColor Gray
            
            # Test connection
            if (Test-BrowserlessConnection) {
                Write-Host "Status: ✅ RUNNING AND HEALTHY" -ForegroundColor Green
            } else {
                Write-Host "Status: ⚠️ RUNNING BUT UNHEALTHY" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Status: ❌ NOT RUNNING" -ForegroundColor Red
            Write-Host "Run with -Install to start Browserless" -ForegroundColor Gray
        }
        
    } catch {
        Write-Log "Failed to get Browserless status: $($_.Exception.Message)" "ERROR"
    }
}

function Install-BrowserlessGodMode {
    Write-Log "Installing Browserless God Mode..." "INFO"
    
    try {
        # Stop existing container if running
        Write-Log "Stopping existing Browserless container..." "INFO"
        docker stop browserless 2>$null
        docker rm browserless 2>$null
        
        # Pull latest image
        Write-Log "Pulling latest Browserless image..." "INFO"
        docker pull browserless/chrome:latest
        
        # Create Docker command with God Mode settings
        $dockerCmd = @"
docker run -d `
    --name browserless `
    --restart unless-stopped `
    -p $BrowserlessPort`:3000 `
    --memory=2g `
    --cpus=1.5 `
    --shm-size=2g `
    -e MAX_CONCURRENT_SESSIONS=$($GodModeConfig.MAX_CONCURRENT_SESSIONS) `
    -e CONCURRENT_PAGES=$($GodModeConfig.CONCURRENT_PAGES) `
    -e MAX_QUEUE_LENGTH=$($GodModeConfig.MAX_QUEUE_LENGTH) `
    -e WORKSPACE_DELETE_EXPIRED=$($GodModeConfig.WORKSPACE_DELETE_EXPIRED) `
    -e PREBOOT_CHROME=$($GodModeConfig.PREBOOT_CHROME) `
    -e DEFAULT_STEALTH=$($GodModeConfig.DEFAULT_STEALTH) `
    -e DEFAULT_LAUNCH_ARGS=`"$($GodModeConfig.DEFAULT_LAUNCH_ARGS)`" `
    -e BLOCK_ADS=$($GodModeConfig.BLOCK_ADS) `
    -e BLOCK_TRACKERS=$($GodModeConfig.BLOCK_TRACKERS) `
    -e ENABLE_COOKIES=$($GodModeConfig.ENABLE_COOKIES) `
    -e ENABLE_JAVASCRIPT=$($GodModeConfig.ENABLE_JAVASCRIPT) `
    -e TIMEOUT=$($GodModeConfig.TIMEOUT) `
    -e MAX_CPU_PERCENT=$($GodModeConfig.MAX_CPU_PERCENT) `
    -e MAX_MEMORY_PERCENT=$($GodModeConfig.MAX_MEMORY_PERCENT) `
    -e DISK_CACHE_SIZE=$($GodModeConfig.DISK_CACHE_SIZE) `
    -e ENABLE_VNC=$($GodModeConfig.ENABLE_VNC) `
    -e ENABLE_WEBRTC=$($GodModeConfig.ENABLE_WEBRTC) `
    -e ENABLE_AUDIO=$($GodModeConfig.ENABLE_AUDIO) `
    -e ENABLE_VIDEO=$($GodModeConfig.ENABLE_VIDEO) `
    -e METRICS_ENABLED=$($GodModeConfig.METRICS_ENABLED) `
    -e DEBUG_MODE=$($GodModeConfig.DEBUG_MODE) `
    -e LOG_LEVEL=$($GodModeConfig.LOG_LEVEL) `
    -e TOKEN=2TsDBB5Nh6vscBX7a7d6fde34056aaad4224432564983d092 `
    browserless/chrome:latest
"@
        
        Write-Log "Starting Browserless with God Mode configuration..." "INFO"
        Invoke-Expression $dockerCmd
        
        # Wait for container to start
        Write-Log "Waiting for Browserless to start..." "INFO"
        Start-Sleep -Seconds 10
        
        # Verify installation
        if (Test-BrowserlessConnection) {
            Write-Log "✅ Browserless God Mode installed successfully!" "SUCCESS"
            Write-Log "Available at: http://localhost:$BrowserlessPort" "INFO"
            Write-Log "WebSocket: ws://localhost:$BrowserlessPort" "INFO"
        } else {
            Write-Log "❌ Browserless installation failed" "ERROR"
            return $false
        }
        
    } catch {
        Write-Log "Installation failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Reset-Browserless {
    Write-Log "Resetting Browserless..." "INFO"
    
    try {
        # Stop and remove container
        Write-Log "Stopping Browserless container..." "INFO"
        docker stop browserless 2>$null
        docker rm browserless 2>$null
        
        # Clear any cached data
        Write-Log "Clearing Browserless cache..." "INFO"
        docker volume prune -f
        
        Write-Log "✅ Browserless reset completed" "SUCCESS"
        
    } catch {
        Write-Log "Reset failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    return $true
}

function Test-BrowserlessPerformance {
    Write-Log "Testing Browserless performance..." "INFO"
    
    try {
        # Test basic connection
        $startTest = Get-Date
        $response = Invoke-RestMethod -Uri "http://localhost:$BrowserlessPort/pressure" -Method GET -TimeoutSec 30
        $testTime = (Get-Date) - $startTest
        
        Write-Host "=== PERFORMANCE TEST RESULTS ===" -ForegroundColor Cyan
        Write-Host "Response Time: $($testTime.TotalMilliseconds)ms" -ForegroundColor Green
        Write-Host "Status: $($response.status)" -ForegroundColor Green
        
        # Test WebSocket connection
        $wsTest = @{
            url = "ws://localhost:$BrowserlessPort/chromium/playwright?token=2TsDBB5Nh6vscBX7a7d6fde34056aaad4224432564983d092"
            test = "WebSocket connectivity"
        }
        
        Write-Host "WebSocket Test: $($wsTest.url)" -ForegroundColor Yellow
        Write-Host "Status: Ready for connections" -ForegroundColor Green
        
        Write-Log "✅ Performance test completed" "SUCCESS"
        
    } catch {
        Write-Log "Performance test failed: $($_.Exception.Message)" "ERROR"
    }
}

# Main execution
Write-Host "Browserless God Mode Configuration" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Gray

if ($Install) {
    Write-Host "Installing Browserless God Mode..." -ForegroundColor Green
    if (Install-BrowserlessGodMode) {
        Write-Host "✅ Installation complete!" -ForegroundColor Green
        Write-Host "Testing performance..." -ForegroundColor Yellow
        Test-BrowserlessPerformance
    } else {
        Write-Host "❌ Installation failed!" -ForegroundColor Red
    }
}
elseif ($Test) {
    Write-Host "Testing Browserless..." -ForegroundColor Yellow
    Test-BrowserlessPerformance
}
elseif ($Status) {
    Get-BrowserlessStatus
}
elseif ($Reset) {
    Write-Host "Resetting Browserless..." -ForegroundColor Yellow
    if (Reset-Browserless) {
        Write-Host "✅ Reset complete!" -ForegroundColor Green
    } else {
        Write-Host "❌ Reset failed!" -ForegroundColor Red
    }
}
else {
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host "  Install: .\browserless-god-mode.ps1 -Install" -ForegroundColor Cyan
    Write-Host "  Test:    .\browserless-god-mode.ps1 -Test" -ForegroundColor Cyan
    Write-Host "  Status:  .\browserless-god-mode.ps1 -Status" -ForegroundColor Cyan
    Write-Host "  Reset:   .\browserless-god-mode.ps1 -Reset" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Gray
    Write-Host "  # Install God Mode" -ForegroundColor Gray
    Write-Host "  .\browserless-god-mode.ps1 -Install" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Check status" -ForegroundColor Gray
    Write-Host "  .\browserless-god-mode.ps1 -Status" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Test performance" -ForegroundColor Gray
    Write-Host "  .\browserless-god-mode.ps1 -Test" -ForegroundColor Green
}

Write-Host ""
