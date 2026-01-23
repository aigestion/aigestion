# scripts/god-mode-deploy.ps1
param(
    [string]$ProjectId = "aigestion-pro",
    [string]$Region = "us-central1"
)

Write-Host "🌌 AIGESTION GOD-MODE DEPLOYMENT OVERDRIVE 🌌" -ForegroundColor Magenta
Write-Host "-------------------------------------------"

# 1. Infrastructure Sync
Write-Host "`n[1/4] Syncing Infrastructure with Terraform..." -ForegroundColor Cyan
Set-Location infra/PowerShell/environments/pro
terraform init
terraform apply -auto-approve -var="project_id=$ProjectId" -var="region=$Region"
Set-Location ../../../..

# 2. Secret Manager Injection
Write-Host "`n[2/4] Injecting Secrets into GCP Secret Manager..." -ForegroundColor Cyan
./scripts/sync-secrets-to-gcp.ps1 -EnvFile ".env.production" -ProjectId $ProjectId

# 3. Vercel Environment Sync (Pro Optimization)
Write-Host "`n[2.5/4] Syncing Environment Variables to Vercel Pro..." -ForegroundColor Cyan
$VercelProjects = @("aigestion-website", "aigestion-admin", "aigestion-client", "aigestion-demo")
foreach ($Project in $VercelProjects) {
    Write-Host "  Syncing $Project..."
    vercel env push production --project $Project --token $env:VERCEL_TOKEN --yes
}

# 4. High-Performance Build
Write-Host "`n[3/4] Running Turbo Build with Remote Caching..." -ForegroundColor Cyan
pnpm install
pnpm build

# 5. Service Deployment
Write-Host "`n[4/4] Deploying Services to Google Cloud Run..." -ForegroundColor Cyan
./deploy-gcp.ps1 -ProjectId $ProjectId -Region $Region

Write-Host "`n🏆 DEPLOYMENT COMPLETE 🏆" -ForegroundColor Green
Write-Host "AIGestion is now running at God-Level Optimization."
Set-Location ../../../..
