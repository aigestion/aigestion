# Emergency Manual Depoyment Script (CORRECTED)
# Purpose: Build and Deploy Website Epic to GitHub Pages IMMEDIATELY

$ErrorActionPreference = "Stop"

Write-Host "🚀 STARTING EMERGENCY MANUAL DEPLOYMENT (RETRY)..." -ForegroundColor Green

# 1. Build the app (Skip if already built recently to save time, or force build?)
# Let's rebuild to be safe
Write-Host "📦 Building website-epic..." -ForegroundColor Cyan
Set-Location "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic"
# npm install # Skip install if already done
npm run build -- --base=/

if (-not (Test-Path "dist\index.html")) {
  Write-Error "Build failed! dist\index.html not found."
}

# 2. Prepare deployment directory
Write-Host "📂 Preparing deployment artifacts..." -ForegroundColor Cyan
$deployDir = "c:\Users\Alejandro\AIGestion\deploy_dist_manual"
# Clean and recreate
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy build files
Copy-Item "dist\*" -Destination $deployDir -Recurse

# Add CNAME and .nojekyll
"aigestion.net" | Set-Content (Join-Path $deployDir "CNAME")
New-Item -ItemType File -Path (Join-Path $deployDir ".nojekyll") | Out-Null
Copy-Item "dist\index.html" -Destination (Join-Path $deployDir "404.html")

# 3. Deploy to gh-pages using AUTHENTICATED REMOTE
Write-Host "☁️  Deploying to GitHub Pages (Force Push)..." -ForegroundColor Cyan
Set-Location $deployDir

git init
git add .
git commit -m "Emergency Manual Deployment: Fix 404 (Corrected Repo)"

# Using the TOKEN found in previous scripts for reliability, or fall back to system auth
# The token in push_to_gh_pages_final.ps1 might be valid.
# $token = "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"
# $repo = "github.com/aigestion/aigestion.git"
# $remoteUrl = "https://$token@$repo"
# Use the system credential helper instead to avoid hardcoding/leaking if possible,
# BUT the user might not have creds for the NEW git repo initialized in tmp folder.
# So we SHOULD use the remote URL that includes the token if we want guaranteed access,
# OR we can try to rely on global credential helper.
# Let's try the URL derived from the main repo's origin first.

$repoUrl = "https://github.com/aigestion/aigestion.git"

# Try pushing
Write-Host "Pushing to $repoUrl..."
# If this fails with auth, we might need the token.
# Note: We are pushing to 'gh-pages' branch
git push --force $repoUrl master:gh-pages

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
  Write-Host "🌐 Verification URL: https://aigestion.net" -ForegroundColor Green
}
else {
  Write-Error "❌ Deployment failed. Check git credentials."
}
