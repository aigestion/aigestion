# Deploy AIGestion to Vercel (Sovereign Edition)

Write-Host "Deploying AIGestion to Vercel [Sovereign Edition]" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Gray

# 1. Build Main Website
Write-Host "Building website-epic..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion"
try {
    pnpm install --filter aigestion-website-epic
    pnpm --filter aigestion-website-epic build
    Write-Host "Website built successfully" -ForegroundColor Green
}
catch {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

# 2. Prepare Deployment Artifact
Write-Host "Preparing deployment artifact in aigestion-deploy..." -ForegroundColor Yellow
$deployDir = "c:\Users\Alejandro\AIGestion\aigestion-deploy"
$distDir = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\dist"

if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Path $deployDir | Out-Null
}

Write-Host "Triggering Vercel Deployment..." -ForegroundColor Yellow
Set-Location "c:\Users\Alejandro\AIGestion\aigestion-deploy"

Copy-Item -Path "$distDir\*" -Destination "$deployDir\public" -Recurse -Force
if (-not (Test-Path "$deployDir\public")) { New-Item -ItemType Directory -Path "$deployDir\public" }

$vercelJsonPath = "$deployDir\vercel.json"
$jsonContent = Get-Content $vercelJsonPath | ConvertFrom-Json
$jsonContent.outputDirectory = "public"
$jsonContent | ConvertTo-Json -Depth 10 | Set-Content $vercelJsonPath

try {
    vercel --prod
    Write-Host "Deployment successful!" -ForegroundColor Green
}
catch {
    Write-Host "Deployment failed" -ForegroundColor Red
}

Write-Host "Sovereign Deployment Complete!" -ForegroundColor Green
