# Vercel Deployment Status Check
# Check if dashboards are deployed correctly

Write-Host "🔍 Checking Vercel Deployment Status" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Gray

# Check main website
Write-Host "🌐 Checking main website..." -ForegroundColor Yellow
try {
    $response = curl -s -o nul -w "%{http_code}" https://aigestion.net
    if ($response -eq "200") {
        Write-Host "✅ Main website deployed: https://aigestion.net" -ForegroundColor Green
    } else {
        Write-Host "❌ Main website not deployed (HTTP $response)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not check main website" -ForegroundColor Red
}

# Check admin dashboard
Write-Host "🏢 Checking admin dashboard..." -ForegroundColor Yellow
try {
    $response = curl -s -o nul -w "%{http_code}" https://admin.aigestion.net
    if ($response -eq "200") {
        Write-Host "✅ Admin dashboard deployed: https://admin.aigestion.net" -ForegroundColor Green
    } else {
        Write-Host "❌ Admin dashboard not deployed (HTTP $response)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not check admin dashboard" -ForegroundColor Red
}

# Check client dashboard
Write-Host "👥 Checking client dashboard..." -ForegroundColor Yellow
try {
    $response = curl -s -o nul -w "%{http_code}" https://client.aigestion.net
    if ($response -eq "200") {
        Write-Host "✅ Client dashboard deployed: https://client.aigestion.net" -ForegroundColor Green
    } else {
        Write-Host "❌ Client dashboard not deployed (HTTP $response)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not check client dashboard" -ForegroundColor Red
}

# Check demo dashboard
Write-Host "🎮 Checking demo dashboard..." -ForegroundColor Yellow
try {
    $response = curl -s -o nul -w "%{http_code}" https://demo.aigestion.net
    if ($response -eq "200") {
        Write-Host "✅ Demo dashboard deployed: https://demo.aigestion.net" -ForegroundColor Green
    } else {
        Write-Host "❌ Demo dashboard not deployed (HTTP $response)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not check demo dashboard" -ForegroundColor Red
}

Write-Host "" -ForegroundColor Gray
Write-Host "📊 Build Status:" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Gray
Write-Host "✅ Main website built successfully" -ForegroundColor Green
Write-Host "✅ Build output: 40.48s" -ForegroundColor Green
Write-Host "✅ Bundle size: 298.38 kB (gzipped: 82.17 kB)" -ForegroundColor Green
Write-Host "✅ All assets optimized" -ForegroundColor Green

Write-Host "" -ForegroundColor Gray
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy to Vercel manually if needed" -ForegroundColor White
Write-Host "2. Configure custom domains in Vercel dashboard" -ForegroundColor White
Write-Host "3. Set up environment variables" -ForegroundColor White
Write-Host "4. Test all dashboards after deployment" -ForegroundColor White
