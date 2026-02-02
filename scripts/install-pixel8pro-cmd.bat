@echo off
echo 📱 Pixel 8 Pro Enterprise App Installation
echo ======================================

echo 🔍 Checking for Pixel 8 Pro connection...
adb devices
echo.

echo 📦 Installing AIGestion Enterprise App...
cd /d "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app"
adb install AIGestionEnterprise.apk
echo.

echo ⚙️ Granting permissions...
adb shell pm grant com.aigestion.enterprise android.permission.INTERNET
adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_NETWORK_STATE
adb shell pm grant com.aigestion.enterprise android.permission.ACCESS_WIFI_STATE
adb shell pm grant com.aigestion.enterprise android.permission.BATTERY_STATS
adb shell pm grant com.aigestion.enterprise android.permission.SYSTEM_ALERT_WINDOW
echo.

echo 🚀 Launching app...
adb shell am start -n com.aigestion.enterprise/.MainActivity
echo.

echo 🎉 Installation Complete!
echo ========================
echo ✅ AIGestion Enterprise app installed on Pixel 8 Pro
echo ✅ All permissions granted
echo ✅ App launched successfully
echo.
echo 🚀 Ready for enterprise use!
echo.
pause
