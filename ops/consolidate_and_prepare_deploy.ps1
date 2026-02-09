$rootDist = "deploy_dist"
if (Test-Path $rootDist) { Remove-Item -Recurse -Force $rootDist }
New-Item -ItemType Directory -Path $rootDist

Write-Host "🚀 Consolidating existing builds..."

# 1. Website Epic
Write-Host "Copying website-epic..."
if (Test-Path "frontend/apps/website-epic/dist") {
  Copy-Item -Recurse "frontend/apps/website-epic/dist/*" $rootDist/
}

# 2. Admin Dashboard
Write-Host "Copying admindashboard..."
if (Test-Path "frontend/apps/admindashboard/dist") {
  New-Item -ItemType Directory -Path "$rootDist/admin" -Force
  Copy-Item -Recurse "frontend/apps/admindashboard/dist/*" "$rootDist/admin/"
}

# 3. Client Dashboard
Write-Host "Copying clientdashboard..."
if (Test-Path "frontend/apps/clientdashboard/dist") {
  New-Item -ItemType Directory -Path "$rootDist/client" -Force
  Copy-Item -Recurse "frontend/apps/clientdashboard/dist/*" "$rootDist/client/"
}

# 4. Demo Dashboard
Write-Host "Copying demodashboard..."
if (Test-Path "frontend/apps/demodashboard/dist") {
  New-Item -ItemType Directory -Path "$rootDist/demo" -Force
  Copy-Item -Recurse "frontend/apps/demodashboard/dist/*" "$rootDist/demo/"
}

# Configuration
Set-Content -Path "$rootDist/CNAME" -Value "aigestion.net"
New-Item -ItemType File -Path "$rootDist/.nojekyll" -Force

# Critical UI Adjustment: Ensure paths in consolidated index files are relative if necessary
# (Vite builds usually use absolute paths /assets/... which work fine on a custom domain root)

Write-Host "✅ All apps consolidated in $rootDist"
