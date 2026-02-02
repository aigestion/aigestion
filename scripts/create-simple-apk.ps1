# Simple APK Creator for Pixel 8 Pro
# Create basic Android APK file

Write-Host "🏗️ Creating APK for Pixel 8 Pro" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Gray

# Create APK directory
$apkDir = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\build"
if (-not (Test-Path $apkDir)) {
    New-Item -ItemType Directory -Path $apkDir -Force | Out-Null
}

# Create AndroidManifest.xml
$manifest = @"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.aigestion.enterprise"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.BATTERY_STATS" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="AIGestion Enterprise"
        android:theme="@android:style/Theme.Material.NoActionBar"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
"@

$manifest | Out-File -FilePath "$apkDir\AndroidManifest.xml" -Encoding UTF8

# Create resources directory
$resDir = "$apkDir\res\values"
if (-not (Test-Path $resDir)) {
    New-Item -ItemType Directory -Path $resDir -Force | Out-Null
}

# Create strings.xml
$strings = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">AIGestion Enterprise</string>
</resources>
"@

$strings | Out-File -FilePath "$resDir\strings.xml" -Encoding UTF8

# Create simple Java source
$srcDir = "$apkDir\src\com\aigestion\enterprise"
if (-not (Test-Path $srcDir)) {
    New-Item -ItemType Directory -Path $srcDir -Force | Out-Null
}

$mainActivity = @"
package com.aigestion.enterprise;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;
import android.graphics.Color;
import android.widget.LinearLayout;

public class MainActivity extends Activity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.parseColor("#0f0a27"));
        
        TextView title = new TextView(this);
        title.setText("AIGestion Enterprise");
        title.setTextSize(24);
        title.setTextColor(Color.WHITE);
        title.setPadding(20, 40, 20, 20);
        layout.addView(title);
        
        TextView subtitle = new TextView(this);
        subtitle.setText("Real-time System Monitoring");
        subtitle.setTextSize(16);
        subtitle.setTextColor(Color.parseColor("#a78bfa"));
        subtitle.setPadding(20, 0, 20, 30);
        layout.addView(subtitle);
        
        setContentView(layout);
    }
}
"@

$mainActivity | Out-File -FilePath "$srcDir\MainActivity.java" -Encoding UTF8

# Create APK build directory
$buildDir = "$apkDir\apk-build"
if (Test-Path $buildDir) {
    Remove-Item -Path $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
New-Item -ItemType Directory -Path "$buildDir\META-INF" -Force | Out-Null
New-Item -ItemType Directory -Path "$buildDir\res\values" -Force | Out-Null
New-Item -ItemType Directory -Path "$buildDir\src\com\aigestion\enterprise" -Force | Out-Null

# Copy files
Copy-Item "$apkDir\AndroidManifest.xml" "$buildDir\" -Force
Copy-Item "$apkDir\res\values\strings.xml" "$buildDir\res\values\" -Force
Copy-Item "$apkDir\src\com\aigestion\enterprise\MainActivity.java" "$buildDir\src\com\aigestion\enterprise\" -Force

# Create MANIFEST.MF
$manifestMf = "Manifest-Version: 1.0`nCreated-By: AIGestion"
$manifestMf | Out-File -FilePath "$buildDir\META-INF\MANIFEST.MF" -Encoding UTF8

# Create APK using zip
$apkPath = "c:\Users\Alejandro\AIGestion\mobile\apks\enterprise-app\AIGestionEnterprise.apk"
if (Test-Path $apkPath) {
    Remove-Item -Path $apkPath -Force
}

# Create zip file
Compress-Archive -Path "$buildDir\*" -DestinationPath "$apkPath.zip" -Force
Move-Item "$apkPath.zip" "$apkPath" -Force

Write-Host "✅ APK created at: $apkPath" -ForegroundColor Green

# Install APK
Write-Host "📱 Installing APK on Pixel 8 Pro..." -ForegroundColor Yellow
try {
    $result = adb install "$apkPath"
    Write-Host "✅ Installation: $result" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed" -ForegroundColor Red
}

Write-Host "🎉 APK creation complete!" -ForegroundColor Green
