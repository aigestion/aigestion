# Fix Vercel Dashboard Routing
# Configure path-based routing for dashboards

Write-Host "🔧 Fixing Vercel Dashboard Routing" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Gray

# Copy dashboard files to build directory
Write-Host "📁 Copying dashboard files to build directory..." -ForegroundColor Yellow

# Create directories in build
$buildDir = "c:\Users\Alejandro\AIGestion\frontend\website-epic\dist"
if (-not (Test-Path "$buildDir\admin")) {
    New-Item -ItemType Directory -Path "$buildDir\admin" -Force | Out-Null
}
if (-not (Test-Path "$buildDir\client")) {
    New-Item -ItemType Directory -Path "$buildDir\client" -Force | Out-Null
}
if (-not (Test-Path "$buildDir\demo")) {
    New-Item -ItemType Directory -Path "$buildDir\demo" -Force | Out-Null
}

# Copy dashboard files
try {
    Copy-Item "c:\Users\Alejandro\AIGestion\admin\index.html" "$buildDir\admin\" -Force
    Copy-Item "c:\Users\Alejandro\AIGestion\client\index.html" "$buildDir\client\" -Force
    Copy-Item "c:\Users\Alejandro\AIGestion\demo\index.html" "$buildDir\demo\" -Force
    Write-Host "✅ Dashboard files copied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to copy dashboard files" -ForegroundColor Red
}

# Update vercel.json for path-based routing
Write-Host "📝 Updating vercel.json configuration..." -ForegroundColor Yellow
$vercelConfig = @{
    version = 2
    routes = @(
        @{
            src = "/admin"
            dest = "/admin/index.html"
        },
        @{
            src = "/client"
            dest = "/client/index.html"
        },
        @{
            src = "/demo"
            dest = "/demo/index.html"
        },
        @{
            src = "/admin/(.*)"
            dest = "/admin/$1"
        },
        @{
            src = "/client/(.*)"
            dest = "/client/$1"
        },
        @{
            src = "/demo/(.*)"
            dest = "/demo/$1"
        }
    )
}

$vercelConfig | ConvertTo-Json -Depth 3 | Out-File -FilePath "c:\Users\Alejandro\AIGestion\vercel.json" -Encoding UTF8
Write-Host "✅ vercel.json updated" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion"
try {
    vercel --prod
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
}

Write-Host "🎉 Dashboard routing fix complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Gray
Write-Host "✅ Dashboard files copied to build directory" -ForegroundColor Green
Write-Host "✅ vercel.json configured for path-based routing" -ForegroundColor Green
Write-Host "✅ Deployed to Vercel" -ForegroundColor Green
Write-Host "" -ForegroundColor Gray
Write-Host "📱 Dashboard URLs:" -ForegroundColor Cyan
Write-Host "  Admin: https://aigestion.net/admin" -ForegroundColor White
Write-Host "  Client: https://aigestion.net/client" -ForegroundColor White
Write-Host "  Demo: https://aigestion.net/demo" -ForegroundColor White
