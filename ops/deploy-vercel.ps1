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

# Create modern Vercel config structure
$vercelConfig = @{
    version         = 2
    buildCommand    = $null
    outputDirectory = "public"
    installCommand  = "echo 'Skipping install'"
    framework       = $null
    rewrites        = @(
        @{ source = "/api/(.*)"; destination = 'https://backend-aigestion-1046057023064.europe-southwest1.run.app/api/$1' },
        @{ source = "/(.*)"; destination = "/index.html" }
    )
    headers         = @(
        @{
            source  = "/(.*)"
            headers = @(
                @{ key = "X-Content-Type-Options"; value = "nosniff" },
                @{ key = "X-Frame-Options"; value = "DENY" },
                @{ key = "X-XSS-Protection"; value = "1; mode=block" }
            )
        },
        @{
            source  = "/api/(.*)"
            headers = @(
                @{ key = "Access-Control-Allow-Origin"; value = "*" },
                @{ key = "Access-Control-Allow-Methods"; value = "GET,POST,PUT,DELETE,OPTIONS" },
                @{ key = "Access-Control-Allow-Headers"; value = "Content-Type, Authorization" }
            )
        }
    )
    # env             = $jsonContent.env
}

$vercelConfig | ConvertTo-Json -Depth 10 | Set-Content $vercelJsonPath

try {
    vercel --prod
    Write-Host "Deployment successful!" -ForegroundColor Green
}
catch {
    Write-Host "Deployment failed" -ForegroundColor Red
}

Write-Host "Sovereign Deployment Complete!" -ForegroundColor Green
