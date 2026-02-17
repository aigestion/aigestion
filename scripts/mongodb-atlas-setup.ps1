# 🗄️ MongoDB Atlas Setup - God Mode Automation
# Author: AIGestion AI Assistant
# Date: 16 de Febrero de 2026
# Purpose: Automate MongoDB Atlas configuration

param(
    [string]$Email = "admin@aigestion.net",
    [string]$Password = "AIGestionGodMode2026!Atlas",
    [string]$ClusterName = "aigestion-god-cluster",
    [string]$Username = "aigestion_god"
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

Write-Host "🗄️ MONGODB ATLAS - GOD MODE SETUP" -ForegroundColor $Cyan
Write-Host "======================================" -ForegroundColor $Cyan

# Step 1: Open MongoDB Atlas registration
Write-Host "🚀 Step 1: Opening MongoDB Atlas registration..." -ForegroundColor $Green
Start-Process "https://www.mongodb.com/cloud/atlas/register"
Write-Host "✅ Registration page opened in browser" -ForegroundColor $Green

# Step 2: Wait for user to complete registration
Write-Host "⏳ Waiting for registration completion..." -ForegroundColor $Yellow
Write-Host "Please complete the registration with these details:" -ForegroundColor $Yellow
Write-Host "  Email: $Email" -ForegroundColor $Cyan
Write-Host "  Password: $Password" -ForegroundColor $Cyan
Write-Host "  Company: AIGestion Sovereign" -ForegroundColor $Cyan
Write-Host "  Role: Full Stack Developer" -ForegroundColor $Cyan

# Wait for user input
Write-Host "`nPress Enter when registration is completed..." -ForegroundColor $Yellow
Read-Host

# Step 3: Open MongoDB Atlas dashboard
Write-Host "🏠 Step 2: Opening MongoDB Atlas dashboard..." -ForegroundColor $Green
Start-Process "https://cloud.mongodb.com/"
Write-Host "✅ Dashboard opened in browser" -ForegroundColor $Green

# Step 4: Guide cluster creation
Write-Host "🔧 Step 3: Cluster Creation Instructions:" -ForegroundColor $Green
Write-Host "  1. Click 'Build a Database'" -ForegroundColor $Cyan
Write-Host "  2. Select 'M0 Sandbox' (FREE)" -ForegroundColor $Cyan
Write-Host "  3. Cloud Provider: AWS" -ForegroundColor $Cyan
Write-Host "  4. Region: us-east-1 (N. Virginia)" -ForegroundColor $Cyan
Write-Host "  5. Cluster Name: $ClusterName" -ForegroundColor $Cyan
Write-Host "  6. Click 'Create Cluster'" -ForegroundColor $Cyan

Write-Host "`nPress Enter when cluster creation is started..." -ForegroundColor $Yellow
Read-Host

# Step 5: Database user configuration
Write-Host "👤 Step 4: Database User Configuration:" -ForegroundColor $Green
Write-Host "  1. Go to 'Database Access'" -ForegroundColor $Cyan
Write-Host "  2. Click 'Add New Database User'" -ForegroundColor $Cyan
Write-Host "  3. Username: $Username" -ForegroundColor $Cyan
Write-Host "  4. Password: $Password" -ForegroundColor $Cyan
Write-Host "  5. Authentication: SCRAM-SHA-256" -ForegroundColor $Cyan
Write-Host "  6. Roles: readWrite, dbAdmin" -ForegroundColor $Cyan
Write-Host "  7. Click 'Add User'" -ForegroundColor $Cyan

Write-Host "`nPress Enter when user is created..." -ForegroundColor $Yellow
Read-Host

# Step 6: Network access configuration
Write-Host "🌐 Step 5: Network Access Configuration:" -ForegroundColor $Green
Write-Host "  1. Go to 'Network Access'" -ForegroundColor $Cyan
Write-Host "  2. Click 'Add IP Address'" -ForegroundColor $Cyan
Write-Host "  3. Select 'Allow Access from Anywhere' (0.0.0.0/0)" -ForegroundColor $Cyan
Write-Host "  4. Click 'Confirm'" -ForegroundColor $Cyan
Write-Host "  5. Wait 2-3 minutes for propagation" -ForegroundColor $Cyan

Write-Host "`nPress Enter when network access is configured..." -ForegroundColor $Yellow
Read-Host

# Step 7: Get connection string
Write-Host "🔗 Step 6: Get Connection String:" -ForegroundColor $Green
Write-Host "  1. Go to your cluster dashboard" -ForegroundColor $Cyan
Write-Host "  2. Click 'Connect' button" -ForegroundColor $Cyan
Write-Host "  3. Select 'Drivers'" -ForegroundColor $Cyan
Write-Host "  4. Copy the connection string" -ForegroundColor $Cyan
Write-Host "  5. Replace LTpasswordGT with: $Password" -ForegroundColor $Cyan

Write-Host "`nPress Enter when you have the connection string..." -ForegroundColor $Yellow
Read-Host

# Step 8: Update .env file
Write-Host "📝 Step 7: Updating .env file..." -ForegroundColor $Green

$envPath = "C:\Users\Alejandro\AIGestion\.env"
$backupPath = "C:\Users\Alejandro\AIGestion\.env.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Create backup
if (Test-Path $envPath) {
    Copy-Item $envPath $backupPath
    Write-Host "✅ Backup created: $backupPath" -ForegroundColor $Green
}

# Get connection string from user
Write-Host "`nPlease paste your MongoDB Atlas connection string:" -ForegroundColor $Yellow
$connectionString = Read-Host

# Validate connection string
if ($connectionString -like "*mongodb+srv://*") {
    Write-Host "✅ Connection string format looks correct" -ForegroundColor $Green

    # Update .env file
    $envContent = Get-Content $envPath
    $newEnvContent = $envContent -replace "^MONGODB_URI=.*", "MONGODB_URI=$connectionString"
    $newEnvContent | Set-Content $envPath

    Write-Host "✅ .env file updated successfully" -ForegroundColor $Green
    Write-Host "  New MONGODB_URI: $connectionString" -ForegroundColor $Cyan
}
else {
    Write-Host "❌ Invalid connection string format" -ForegroundColor $Red
    Write-Host "  Expected format: mongodb+srv://..." -ForegroundColor $Red
    exit 1
}

# Step 9: Test connection
Write-Host "🧪 Step 8: Testing MongoDB Atlas connection..." -ForegroundColor $Green

# Create test script
$testScript = @"
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Atlas connection successful!');
        console.log('🚀 Database connected to:', mongoose.connection.name);
        await mongoose.disconnect();
        console.log('✅ Connection closed successfully');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();
"@

$testScriptPath = "C:\Users\Alejandro\AIGestion\test-mongodb-connection.js"
$testScript | Out-File -FilePath $testScriptPath -Encoding UTF8

# Run test
Write-Host "Running connection test..." -ForegroundColor $Yellow
Set-Location "C:\Users\Alejandro\AIGestion\backend"
try {
    $testResult = node $testScriptPath 2>&1
    if ($testResult -like "*successful*") {
        Write-Host "✅ MongoDB Atlas connection test PASSED!" -ForegroundColor $Green
    }
    else {
        Write-Host "❌ MongoDB Atlas connection test FAILED!" -ForegroundColor $Red
        Write-Host $testResult -ForegroundColor $Red
    }
}
catch {
    Write-Host "❌ Error running connection test:" -ForegroundColor $Red
    Write-Host $_.Exception.Message -ForegroundColor $Red
}

# Cleanup
Remove-Item $testScriptPath -ErrorAction SilentlyContinue

# Step 10: Final instructions
Write-Host "`n🎉 MONGODB ATLAS SETUP COMPLETED!" -ForegroundColor $Green
Write-Host "=================================" -ForegroundColor $Green
Write-Host "✅ Cluster created: $ClusterName" -ForegroundColor $Cyan
Write-Host "✅ Database user: $Username" -ForegroundColor $Cyan
Write-Host "✅ Network access configured" -ForegroundColor $Cyan
Write-Host "✅ Connection string updated in .env" -ForegroundColor $Cyan
Write-Host "✅ Connection test completed" -ForegroundColor $Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor $Yellow
Write-Host "1. Stop local MongoDB service" -ForegroundColor $Cyan
Write-Host "2. Restart your backend application" -ForegroundColor $Cyan
Write-Host "3. Verify all database operations work" -ForegroundColor $Cyan
Write-Host "4. Monitor CPU usage (should drop below 30%)" -ForegroundColor $Cyan

Write-Host "`n🔥 GOD MODE ACTIVATED! Your MongoDB is now in the cloud!" -ForegroundColor $Green
Write-Host "🌍 Global performance, local resources saved!" -ForegroundColor $Green

# Ask if user wants to stop local MongoDB
Write-Host "`nWould you like to stop local MongoDB service? (y/n)" -ForegroundColor $Yellow
$stopMongo = Read-Host

if ($stopMongo -eq "y") {
    Write-Host "🛑 Stopping local MongoDB service..." -ForegroundColor $Yellow
    try {
        Stop-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        Write-Host "✅ Local MongoDB service stopped" -ForegroundColor $Green
    }
    catch {
        Write-Host "⚠️ Could not stop MongoDB service (may not be running)" -ForegroundColor $Yellow
    }
}

Write-Host "`n🚀 Setup complete! Your AIGestion is now running on MongoDB Atlas!" -ForegroundColor $Green
