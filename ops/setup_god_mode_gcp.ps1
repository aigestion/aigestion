# setup_god_mode_gcp.ps1
# 🌌 AIGestion.net - God-Level Infrastructure Orchestrator
# © 2026 AIGestion.net. Proprietary & Restricted.

$projectId = "dynamic-reef-485215-v4"
$region = "europe-west1"
$serviceAccountName = "nexus-god-service-account"

Write-Host "🚀 INITIALIZING GOD-LEVEL INFRASTRUCTURE SETUP..." -ForegroundColor Cyan

# 1. Enable Critical APIs
$apis = @(
    "compute.googleapis.com",
    "container.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudfunctions.googleapis.com",
    "artifactregistry.googleapis.com",
    "aiplatform.googleapis.com",
    "cloudtasks.googleapis.com",
    "cloudbuild.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "iam.googleapis.com",
    "storage.googleapis.com",
    "vpcaccess.googleapis.com",
    "redis.googleapis.com",
    "cloudresourcemanager.googleapis.com"
)

Write-Host "🔧 Enabling 20+ Critical APIs..." -ForegroundColor Yellow
foreach ($api in $apis) {
    Write-Host "  - Enabling $api"
    gcloud services enable $api --project $projectId
}

# 2. Setup God-Mode Service Account
Write-Host "👤 Configuring God-Mode Service Account..." -ForegroundColor Cyan
$saExists = gcloud iam service-accounts list --filter="email:$serviceAccountName@$projectId.iam.gserviceaccount.com" --project $projectId --format="value(email)"
if (-not $saExists) {
    gcloud iam service-accounts create $serviceAccountName --display-name "Nexus God Mode Service Account" --project $projectId
}

$roles = @(
    "roles/owner",
    "roles/secretmanager.admin",
    "roles/storage.admin",
    "roles/aiplatform.admin",
    "roles/artifactregistry.admin"
)

foreach ($role in $roles) {
    gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:$serviceAccountName@$projectId.iam.gserviceaccount.com" --role=$role
}

# 3. Migrate Secrets
Write-Host "🔐 Migrating Local Secrets to Secret Manager..." -ForegroundColor Yellow
./migrate-to-gsm.ps1

# 4. Initialize Terraform
Write-Host "🏗️ Initializing Terraform..." -ForegroundColor Green
Set-Location "infra/terraform/environments/dev"
terraform init

Write-Host "🎉 GOD-LEVEL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "Next step: Run 'terraform apply' to provision remaining infrastructure."
