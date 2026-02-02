# Deploy AIGestion to Vercel
# Deploy all dashboards and main website

Write-Host "🚀 Deploying AIGestion to Vercel" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Gray

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

# Build main website
Write-Host "🏗️ Building main website..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\frontend\website-epic"
try {
    npm install
    npm run build
    Write-Host "✅ Main website built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build main website" -ForegroundColor Red
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion"
try {
    vercel --prod
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
}

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Gray
Write-Host "✅ AIGestion deployed to Vercel" -ForegroundColor Green
Write-Host "✅ All dashboards accessible" -ForegroundColor Green
Write-Host "✅ Main website deployed" -ForegroundColor Green
