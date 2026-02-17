@echo off
TITLE [📱 PIXEL 8 PRO] Sovereign Deployment
SET APK_PATH=C:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk

echo ============================================================
echo 📱 PIXEL 8 PRO: ENTERPRISE APK DEPLOYMENT (CMD MODE)
echo ============================================================

echo Checking device connection...
adb wait-for-device

echo Installing AIGestionEnterprise.apk...
adb install "%APK_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ SUCCESS: App deployed to Pixel 8 Pro.
) else (
    echo ❌ ERROR: Deployment failed. Check USB Debugging status.
)

echo Granting Sovereign Permissions...
adb shell pm grant com.aigestion.enterprise android.permission.INTERNET
adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_NETWORK_STATE
adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_WIFI_STATE
adb shell pm grant com.aigestion.enterprise android.permission.BATTERY_STATS
adb shell pm grant com.aigestion.enterprise android.permission.SYSTEM_ALERT_WINDOW

echo Launching Nexus Core Mobile...
adb shell am start -n com.aigestion.enterprise/.MainActivity

echo ============================================================
echo 🌌 DEPLOYMENT COMPLETE
echo ============================================================
pause
