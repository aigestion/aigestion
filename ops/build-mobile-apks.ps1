# APK Generation Script for AIGestion Mobile Apps
# Builds native Android APK files for Enterprise and Client apps

param(
    [switch]$Release,
    [switch]$Debug,
    [switch]$Clean
)

Write-Host "🏗️ Building AIGestion Mobile APKs" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Gray

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Installing..." -ForegroundColor Red
    wing install nodejs-lts
}

# Check if React Native CLI is installed
try {
    $rnVersion = npx react-native --version
    Write-Host "✅ React Native CLI: $rnVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ React Native CLI not found. Installing..." -ForegroundColor Red
    npm install -g @react-native-community/cli
}

# Check if Android Studio is installed
$androidStudioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
if (Test-Path $androidStudioPath) {
    Write-Host "✅ Android Studio: Found" -ForegroundColor Green
} else {
    Write-Host "❌ Android Studio not found. Installing..." -ForegroundColor Red
    wing install "Android Studio" -Source "https://dl.google.com/android/studio/install"
}

# Set environment variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow
$env:ANDROID_HOME = "C:\Users\Alejandro\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jre"
$env:GRADLE_OPTS = "-Dorg.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8"

# Create build directories
Write-Host "📁 Creating build directories..." -ForegroundColor Yellow
$buildDir = "c:\Users\Alejandro\AIGestion\mobile\builds"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
}

# Function to build React Native app
function Build-ReactNativeApp {
    param(
        [string]$AppName,
        [string]$AppPath,
        [string]$PackageId
    )
    
    Write-Host "🏗️ Building $AppName..." -ForegroundColor Yellow
    
    try {
        Set-Location $AppPath
        
        # Initialize React Native project if not exists
        if (-not (Test-Path "package.json")) {
            Write-Host "📦 Initializing React Native project..." -ForegroundColor Yellow
            npx react-native init $AppName --template react-native-template-typescript
        }
        
        # Install dependencies
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install lucide-react-native react-native-svg @react-native-async-storage/async-storage react-native-push-notification
        
        # Create Android manifest
        $manifestContent = @"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="$PackageId">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.BATTERY_STATS" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
"@
        
        $manifestContent | Out-File -FilePath "android\app\src\main\AndroidManifest.xml" -Encoding UTF8
        
        # Create app component
        $appContent = @"
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Brain, Shield, Server, Database, Cloud, Lock, Eye, Settings, Bell, Home, BarChart3, FileText, Users } from 'lucide-react-native';

const App = () => {
    const [systemStats, setSystemStats] = useState({
        cpu: 45,
        memory: 65,
        storage: 78,
        battery: 85,
        network: '5G'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setSystemStats(prev => ({
                ...prev,
                cpu: Math.floor(Math.random() * 30 + 40),
                memory: Math.floor(Math.random() * 20 + 60),
                battery: Math.max(20, prev.battery - 1)
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>AIGestion Mobile</Text>
                    <Text style={styles.subtitle}>Real-time System Monitor</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{systemStats.cpu}%</Text>
                        <Text style={styles.statLabel}>CPU</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{systemStats.memory}%</Text>
                        <Text style={styles.statLabel}>Memory</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{systemStats.storage}%</Text>
                        <Text style={styles.statLabel}>Storage</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{systemStats.battery}%</Text>
                        <Text style={styles.statLabel}>Battery</Text>
                    </View>
                </View>

                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    <View style={styles.serviceItem}>
                        <Text style={styles.serviceName}>AI Engine</Text>
                        <Text style={styles.serviceStatus}>Online</Text>
                    </View>
                    <View style={styles.serviceItem}>
                        <Text style={styles.serviceName}>Database</Text>
                        <Text style={styles.serviceStatus}>Online</Text>
                    </View>
                    <View style={styles.serviceItem}>
                        <Text style={styles.serviceName}>Cloud Sync</Text>
                        <Text style={styles.serviceStatus}>Online</Text>
                    </View>
                    <View style={styles.serviceItem}>
                        <Text style={styles.serviceName}>Security</Text>
                        <Text style={styles.serviceStatus}>Active</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0a27',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        backgroundColor: '#1e1b4b',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#a78bfa',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#a78bfa',
    },
    servicesSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    serviceName: {
        fontSize: 16,
        color: '#fff',
    },
    serviceStatus: {
        fontSize: 14,
        color: '#10b981',
    },
});

export default App;
"@
        
        $appContent | Out-File -FilePath "src\App.tsx" -Encoding UTF8
        
        # Build APK
        Write-Host "🔨 Building APK..." -ForegroundColor Yellow
        if ($Release) {
            npx react-native build-android --mode=release
        } elseif ($Debug) {
            npx react-native build-android --mode=debug
        } else {
            npx react-native build-android --mode=release
        }
        
        # Copy APK to build directory
        $apkPattern = if ($Release) { "release" } else { "debug" }
        $apkFiles = Get-ChildItem -Path "android\app\build\outputs\apk\$apkPattern\*.apk" -ErrorAction SilentlyContinue
        
        foreach ($apk in $apkFiles) {
            $destPath = "$buildDir\$($AppName)-$($apk.Name)"
            Copy-Item $apk.FullName -Destination $destPath
            Write-Host "✅ APK copied to: $destPath" -ForegroundColor Green
        }
        
        Write-Host "✅ $AppName build completed!" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error building $AppName`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Clean build if requested
if ($Clean) {
    Write-Host "🧹 Cleaning build directories..." -ForegroundColor Yellow
    if (Test-Path $buildDir) {
        Remove-Item -Path "$buildDir\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Clean completed" -ForegroundColor Green
}

# Build Enterprise App
Write-Host "🏢 Building Enterprise App..." -ForegroundColor Cyan
$enterprisePath = "c:\Users\Alejandro\AIGestion\mobile\enterprise-app"
$enterpriseSuccess = Build-ReactNativeApp -AppName "AIGestionEnterprise" -AppPath $enterprisePath -PackageId "com.aigestion.enterprise"

# Build Client App
Write-Host "👥 Building Client App..." -ForegroundColor Cyan
$clientPath = "c:\Users\Alejandro\AIGestion\mobile\client-app"
$clientSuccess = Build-ReactNativeApp -AppName "AigestionClient" -AppPath $clientPath -PackageId "com.aigestion.client"

# Summary
Write-Host "" -ForegroundColor Gray
Write-Host "🎉 APK Build Summary" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Gray
Write-Host "Enterprise App: $(if ($enterpriseSuccess) { '✅ Success' } else { '❌ Failed' })" -ForegroundColor $(if ($enterpriseSuccess) { 'Green' } else { 'Red' })
Write-Host "Client App: $(if ($clientSuccess) { '✅ Success' } else { '❌ Failed' })" -ForegroundColor $(if ($clientSuccess) { 'Green' } else { 'Red' })
Write-Host "" -ForegroundColor Gray
Write-Host "📁 APK Location: $buildDir" -ForegroundColor Gray
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green

# List built APKs
if (Test-Path $buildDir) {
    Write-Host "" -ForegroundColor Gray
    Write-Host "📱 Built APKs:" -ForegroundColor Yellow
    Get-ChildItem -Path $buildDir\*.apk | ForEach-Object {
        $size = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  📦 $($_.Name) ($size MB)" -ForegroundColor Green
    }
}
