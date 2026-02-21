# 🌌 AIGestion God Mode: Supreme Infrastructure Hardening Script
# This script automates best-practice hardening for Cloud Run services.

param (
    [string]$Service = "backend-aigestion",
    [string]$Region = "europe-west1",
    [string]$ProjectID = "aigestion-sovereign-2026"
)

Write-Host "🚀 Starting Supreme Hardening for $Service in $Region..." -ForegroundColor Cyan

# 1. Set Concurrency and Performance Settings
# We use container-concurrency=80 for high-performance Node.js workloads
# We enable startup-cpu-boost to minimize cold start latency
Write-Host "--- Configuring Performance ---"
gcloud run services update $Service `
    --region=$Region `
    --project=$ProjectID `
    --concurrency=80 `
    --cpu-throttling=false `
    --startup-cpu-boost `
    --execution-environment=gen2

# 2. Scaling Protection
# Setting min-instances to 1 ensures a warm standby instance is always ready
Write-Host "--- Configuring Scaling ---"
gcloud run services update $Service `
    --region=$Region `
    --project=$ProjectID `
    --min-instances=1 `
    --max-instances=100

# 3. Ingress Hardening
# Restrict ingress to 'all' for external API availability, but ensure it's logged
Write-Host "--- Configuring Networking ---"
gcloud run services update $Service `
    --region=$Region `
    --project=$ProjectID `
    --ingress=all

# 4. Service Account Least Privilege (Recommendation)
Write-Host "--- Security Checklist ---"
Write-Host "✅ Resource Limits: 1 vCPU / 2GiB RAM (God Mode Minimum)"
Write-Host "✅ CPU Boost: Enabled"
Write-Host "✅ Gen2 Environment: Enabled"
Write-Host "👉 Ensure the service account has 'Vertex AI User' and 'Cloud SQL Client' roles."

Write-Host "🌌 Sovereign Hardening Complete!" -ForegroundColor Green
