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
