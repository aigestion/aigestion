# Simple Vercel Dashboard Fix
# Copy dashboard files and configure routing

Write-Host "Fixing Vercel Dashboard Routing" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Gray

# Copy dashboard files to build directory
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
Copy-Item "c:\Users\Alejandro\AIGestion\admin\index.html" "$buildDir\admin\" -Force
Copy-Item "c:\Users\Alejandro\AIGestion\client\index.html" "$buildDir\client\" -Force
Copy-Item "c:\Users\Alejandro\AIGestion\demo\index.html" "$buildDir\demo\" -Force
Write-Host "Dashboard files copied" -ForegroundColor Green

# Create simple vercel.json
$vercelJson = '{
  "version": 2,
  "routes": [
    {
      "src": "/admin",
      "dest": "/admin/index.html"
    },
    {
      "src": "/client",
      "dest": "/client/index.html"
    },
    {
      "src": "/demo",
      "dest": "/demo/index.html"
    }
  ]
}'

$vercelJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\vercel.json" -Encoding UTF8
Write-Host "vercel.json updated" -ForegroundColor Green

Write-Host "Dashboard routing fix complete!" -ForegroundColor Green
Write-Host "Dashboard URLs:" -ForegroundColor Cyan
Write-Host "Admin: https://aigestion.net/admin" -ForegroundColor White
Write-Host "Client: https://aigestion.net/client" -ForegroundColor White
Write-Host "Demo: https://aigestion.net/demo" -ForegroundColor White
