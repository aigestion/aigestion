# Memory Dashboard Integration - Complete Setup
# Integrates memory monitoring with all AIGestion dashboards

Write-Host "🚀 AIGestion Multi-Dashboard Integration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

# Check if enhanced dashboard exists
$dashboardPath = "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"
if (Test-Path $dashboardPath) {
    Write-Host "✅ Enhanced dashboard found" -ForegroundColor Green
}
else {
    Write-Host "❌ Enhanced dashboard not found" -ForegroundColor Red
    Write-Host "Creating enhanced dashboard..." -ForegroundColor Yellow
    & powershell -ExecutionPolicy Bypass -File "c:\Users\Alejandro\AIGestion\scripts\create-enhanced-dashboard.ps1"
}

# Create dashboard shortcuts
Write-Host "🖥️  Creating dashboard shortcuts..." -ForegroundColor Green
$desktop = [Environment]::GetFolderPath("Desktop")

# Multi-Dashboard shortcut
$shortcutPath = "$desktop\AIGestion Control Center.lnk"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"
$shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
$shortcut.IconLocation = "shell32.dll,14"
$shortcut.Description = "AIGestion Multi-Dashboard Control Center"
$shortcut.Save()
Write-Host "  ✅ Created: Control Center shortcut" -ForegroundColor Green

# Individual dashboard shortcuts
$dashboards = @(
    @{Name = "Admin Dashboard"; URL = "https://admin.aigestion.net"; Icon = "shell32.dll,48" },
    @{Name = "Client Dashboard"; URL = "https://client.aigestion.net"; Icon = "shell32.dll,49" },
    @{Name = "Demo Dashboard"; URL = "https://demo.aigestion.net"; Icon = "shell32.dll,50" },
    @{Name = "Main Website"; URL = "https://aigestion.net"; Icon = "shell32.dll,14" }
)

foreach ($dashboard in $dashboards) {
    $shortcutPath = "$desktop\AIGestion $($dashboard.Name).lnk"
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $dashboard.URL
    $shortcut.IconLocation = $dashboard.Icon
    $shortcut.Description = $dashboard.Name
    $shortcut.Save()
    Write-Host "  ✅ Created: $($dashboard.Name) shortcut" -ForegroundColor Green
}

# Create dashboard launcher script
$launcherScript = @"
@echo off
title AIGestion Control Center
echo.
echo ========================================
echo   AIGestion Control Center Launcher
echo ========================================
echo.
echo 1. Memory Dashboard (Local)
echo 2. Admin Dashboard
echo 3. Client Dashboard
echo 4. Demo Dashboard
echo 5. Main Website
echo 6. Open All Dashboards
echo 7. Exit
echo.
set /p choice="Select option (1-7): "

if "%choice%"=="1" (
    start "" "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"
)
if "%choice%"=="2" (
    start "" "https://admin.aigestion.net"
)
if "%choice%"=="3" (
    start "" "https://client.aigestion.net"
)
if "%choice%"=="4" (
    start "" "https://demo.aigestion.net"
)
if "%choice%"=="5" (
    start "" "https://aigestion.net"
)
if "%choice%"=="6" (
    start "" "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"
    start "" "https://admin.aigestion.net"
    start "" "https://client.aigestion.net"
    start "" "https://demo.aigestion.net"
    start "" "https://aigestion.net"
)
if "%choice%"=="7" (
    exit
)

echo.
echo Dashboard(s) launched successfully!
timeout /t 3 >nul
"@

$launcherScript | Out-File -FilePath "c:\Users\Alejandro\AIGestion\scripts\dashboard-launcher.bat" -Encoding ASCII
Write-Host "  ✅ Created: Dashboard launcher script" -ForegroundColor Green

# Create dashboard launcher shortcut
$shortcutPath = "$desktop\AIGestion Dashboard Launcher.lnk"
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "c:\Users\Alejandro\AIGestion\scripts\dashboard-launcher.bat"
$shortcut.WorkingDirectory = "c:\Users\Alejandro\AIGestion"
$shortcut.IconLocation = "shell32.dll,21"
$shortcut.Description = "AIGestion Dashboard Launcher"
$shortcut.Save()
Write-Host "  ✅ Created: Dashboard launcher shortcut" -ForegroundColor Green

# Open the enhanced dashboard
Write-Host "🌐 Opening enhanced dashboard..." -ForegroundColor Green
Start-Process "c:\Users\Alejandro\AIGestion\dashboard\memory-dashboard.html"

# Current memory status
Write-Host "📊 Current memory status:" -ForegroundColor Cyan
Write-Host "Run 'mem' command to check memory usage" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 MULTI-DASHBOARD INTEGRATION COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 What's been created:" -ForegroundColor White
Write-Host "  ✅ Enhanced memory dashboard with tab navigation" -ForegroundColor Gray
Write-Host "  ✅ Integration with Admin, Client, and Demo dashboards" -ForegroundColor Gray
Write-Host "  ✅ Desktop shortcuts for all dashboards" -ForegroundColor Gray
Write-Host "  ✅ Dashboard launcher script" -ForegroundColor Gray
Write-Host "  ✅ Unified control center interface" -ForegroundColor Gray
Write-Host ""
Write-Host "🖥️  Desktop Shortcuts:" -ForegroundColor White
Write-Host "  🎛️  Control Center    - Main multi-dashboard interface" -ForegroundColor Gray
Write-Host "  👤 Admin Dashboard   - Administrative panel" -ForegroundColor Gray
Write-Host "  👥 Client Dashboard  - Client portal" -ForegroundColor Gray
Write-Host "  🎮 Demo Dashboard   - Interactive demo" -ForegroundColor Gray
Write-Host "  🌐 Main Website     - Public website" -ForegroundColor Gray
Write-Host "  🚀 Dashboard Launcher - Quick access menu" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Dashboard URLs:" -ForegroundColor White
Write-Host "  Memory:  file:///c:/Users/Alejandro/AIGestion/dashboard/memory-dashboard.html" -ForegroundColor Gray
Write-Host "  Admin:   https://admin.aigestion.net" -ForegroundColor Gray
Write-Host "  Client:  https://client.aigestion.net" -ForegroundColor Gray
Write-Host "  Demo:    https://demo.aigestion.net" -ForegroundColor Gray
Write-Host "  Main:    https://aigestion.net" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Features:" -ForegroundColor White
Write-Host "  🧠 Real-time memory monitoring" -ForegroundColor Gray
Write-Host "  🔄 Auto-refresh capabilities" -ForegroundColor Gray
Write-Host "  📊 Interactive charts and graphs" -ForegroundColor Gray
Write-Host "  ⚡ Quick action buttons" -ForegroundColor Gray
Write-Host "  📋 Process management" -ForegroundColor Gray
Write-Host "  📝 Activity logging" -ForegroundColor Gray
Write-Host "  🎛️  Tab-based navigation" -ForegroundColor Gray
Write-Host "  🔗 External dashboard links" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Your unified AIGestion control center is now ready!" -ForegroundColor Green
Write-Host "   Access all dashboards from one central location" -ForegroundColor Cyan
