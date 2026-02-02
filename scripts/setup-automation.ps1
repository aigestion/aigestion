# Memory Management Automation - One-Click Setup
# Complete automated setup for AIGestion memory management

Write-Host "🚀 AIGestion Memory Management - Automated Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Gray

# Check if running as Administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "⚠️  Warning: Some features require Administrator privileges" -ForegroundColor Yellow
    Write-Host "   Consider running as Administrator for full functionality" -ForegroundColor Gray
}

# Create necessary directories
Write-Host "📁 Creating directories..." -ForegroundColor Green
$directories = @(
    "c:\Users\Alejandro\AIGestion\logs",
    "c:\Users\Alejandro\AIGestion\backups",
    "c:\Users\Alejandro\AIGestion\config",
    "c:\Users\Alejandro\AIGestion\scripts",
    "c:\Users\Alejandro\AIGestion\dashboard"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Created: $dir" -ForegroundColor Green
    }
}

# Test memory monitoring
Write-Host "🔍 Testing memory monitoring..." -ForegroundColor Green
try {
    & powershell -ExecutionPolicy Bypass -File "c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1"
    Write-Host "  ✅ Memory monitoring working" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Memory monitoring failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Create desktop shortcut
Write-Host "🖥️  Creating desktop shortcuts..." -ForegroundColor Green
$desktop = [Environment]::GetFolderPath("Desktop")

# Memory Monitor shortcut
$shortcutPath = "$desktop\AIGestion Memory Monitor.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-ExecutionPolicy Bypass -Command `"& { . 'c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1'; mem }`""
$shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
$shortcut.IconLocation = "shell32.dll,26"
$shortcut.Description = "AIGestion Memory Monitor"
$shortcut.Save()
Write-Host "  ✅ Created: Memory Monitor shortcut" -ForegroundColor Green

# Memory Optimization shortcut
$shortcutPath = "$desktop\AIGestion Memory Optimize.lnk"
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-ExecutionPolicy Bypass -Command `"& { . 'c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1'; memopt }`""
$shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
$shortcut.IconLocation = "shell32.dll,31"
$shortcut.Description = "AIGestion Memory Optimization"
$shortcut.Save()
Write-Host "  ✅ Created: Memory Optimization shortcut" -ForegroundColor Green

# Dashboard shortcut
$shortcutPath = "$desktop\AIGestion Dashboard.lnk"
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"
$shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
$shortcut.IconLocation = "shell32.dll,14"
$shortcut.Description = "AIGestion Memory Dashboard"
$shortcut.Save()
Write-Host "  ✅ Created: Dashboard shortcut" -ForegroundColor Green

# Create startup script
$startupScript = @"
@echo off
echo Starting AIGestion Memory Management...
powershell -ExecutionPolicy Bypass -Command "& { . 'c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1'; mem }"
pause
"@

$startupScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\start-memory-manager.bat" -Encoding ASCII
Write-Host "  ✅ Created: Startup script" -ForegroundColor Green

# Open dashboard
Write-Host "🌐 Opening memory dashboard..." -ForegroundColor Green
Start-Process "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"

# Current memory status
Write-Host "📊 Current memory status:" -ForegroundColor Cyan
& powershell -ExecutionPolicy Bypass -Command "& { . 'c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1'; mem }"

Write-Host ""
Write-Host "🎉 AUTOMATION SETUP COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 What's been created:" -ForegroundColor White
Write-Host "  ✅ Memory monitoring system" -ForegroundColor Gray
Write-Host "  ✅ Automated optimization tools" -ForegroundColor Gray
Write-Host "  ✅ Web dashboard for monitoring" -ForegroundColor Gray
Write-Host "  ✅ Desktop shortcuts for easy access" -ForegroundColor Gray
Write-Host "  ✅ Startup scripts for automation" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Quick Start Commands:" -ForegroundColor White
Write-Host "  mem        - Check memory status" -ForegroundColor Gray
Write-Host "  memkill    - Kill high memory processes" -ForegroundColor Gray
Write-Host "  memopt     - Optimize memory" -ForegroundColor Gray
Write-Host ""
Write-Host "🖥️  Desktop Shortcuts:" -ForegroundColor White
Write-Host "  📊 Memory Monitor  - Quick memory check" -ForegroundColor Gray
Write-Host "  🧹 Memory Optimize - Clean up memory" -ForegroundColor Gray
Write-Host "  🌐 Dashboard       - Web monitoring interface" -ForegroundColor Gray
Write-Host ""
Write-Host "⚙️  Configuration:" -ForegroundColor White
Write-Host "  Edit: c:\Users\Alejandro\AIGestion\config\memory-config.psd1" -ForegroundColor Gray
Write-Host ""
Write-Host "📈 Current Status:" -ForegroundColor White
& powershell -ExecutionPolicy Bypass -Command "& { . 'c:\Users\Alejandro\AIGestion\scripts\memory-quick.ps1'; mem }"
Write-Host ""
Write-Host "✨ Your automated memory management system is now ready!" -ForegroundColor Green
Write-Host "   The system will monitor and optimize your Node.js memory 24/7" -ForegroundColor Cyan
