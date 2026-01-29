Write-Host "🚀 Consolidating existing builds to ROOT..."

# 1. Main Website (Website Epic)
Write-Host "Copying website-epic to root..."
if (Test-Path "frontend/apps/website-epic/dist") {
    Copy-Item -Recurse -Force "frontend/apps/website-epic/dist/*" ./
}

# 2. Admin Dashboard
Write-Host "Copying admindashboard to /admin..."
if (Test-Path "frontend/apps/admindashboard/dist") {
    if (-not (Test-Path "admin")) { New-Item -ItemType Directory -Path "admin" }
    Copy-Item -Recurse -Force "frontend/apps/admindashboard/dist/*" "admin/"
}

# 3. Client Dashboard
Write-Host "Copying clientdashboard to /client..."
if (Test-Path "frontend/apps/clientdashboard/dist") {
    if (-not (Test-Path "client")) { New-Item -ItemType Directory -Path "client" }
    Copy-Item -Recurse -Force "frontend/apps/clientdashboard/dist/*" "client/"
}

# 4. Demo Dashboard
Write-Host "Copying demodashboard to /demo..."
if (Test-Path "frontend/apps/demodashboard/dist") {
    if (-not (Test-Path "demo")) { New-Item -ItemType Directory -Path "demo" }
    Copy-Item -Recurse -Force "frontend/apps/demodashboard/dist/*" "demo/"
}

# Configuration
Set-Content -Path "CNAME" -Value "www.aigestion.net"
New-Item -ItemType File -Path ".nojekyll" -Force

Write-Host "✅ All apps consolidated in root"
