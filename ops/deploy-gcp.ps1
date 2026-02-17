param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [string]$Region = "europe-southwest1"
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host -ForegroundColor Cyan "`n[STEP] $Message"
}

function Write-Success {
    param([string]$Message)
    Write-Host -ForegroundColor Green "[SUCCESS] $Message"
}

Write-Step "Configuring Project: $ProjectId in $Region"
gcloud config set project $ProjectId
gcloud config set run/region $Region

Write-Step "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# --- Backend ---
Write-Step "Deploying Backend (aigestion-backend)..."
# Using Cloud Build to build and deploy in one step is often easier, but we'll use 'gcloud run deploy --source' for simplicity if source deployment is supported,
# OR 'gcloud builds submit' + 'gcloud run deploy' for more control.
# We will use 'gcloud run deploy' from source which handles building via Buildpacks or Dockerfile automatically.

# Note: We point to the root context but specify the Dockerfile relative to it.
# gcloud run deploy aigestion-backend `
#     --source . `
#     --platform managed `
#     --allow-unauthenticated `
#     --port 8080 `
#     --region $Region `
#     --set-env-vars NODE_ENV=production `
#     --service-account "default"

# Set Dockerfile via flag if using builds submit, but 'run deploy --source' tries to detect it.
# Since we have multiple Dockerfiles, it's safer to use 'gcloud builds submit' with specific config or just specify image.

# Let's use a cloudbuild.yaml to avoid gcloud argument quirks
$BackendBuildYaml = @"
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', '$BackendImage', '-f', 'backend/Dockerfile', '.' ]
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '$BackendImage']
images:
- '$BackendImage'
"@
Set-Content -Path "cloudbuild_backend.yaml" -Value $BackendBuildYaml

Write-Step "Submitting Backend Build to Cloud Build..."
gcloud builds submit --config cloudbuild_backend.yaml .
Remove-Item "cloudbuild_backend.yaml"

Write-Step "Deploying Backend Service..."
gcloud run deploy aigestion-backend `
  --image $BackendImage `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --region $Region

# Get Backend URL
$BackendUrl = gcloud run services describe aigestion-backend --platform managed --region $Region --format 'value(status.url)'
Write-Success "Backend deployed at: $BackendUrl"

# --- Frontend ---
Write-Step "Deploying Frontend (aigestion-frontend)..."

Write-Step "Building Frontend Image..."
$FrontendImage = "gcr.io/$ProjectId/aigestion-frontend"
# We need to pass the VITE_API_URL as a build arg if it's baked in, OR as runtime env var if using a runtime config solution.
# Vite apps bake env vars at build time. So we must rebuild for the specific environment or use a runtime config trick.
# For now, we will assume build-time baking. We need to pass --build-arg.

# gcloud builds submit --tag $FrontendImage --file docker/Dockerfile.frontend --substitutions=_API_URL=$BackendUrl . # Removed redundant failing line

# Note: Cloud Build substitutions don't automatically map to docker build args unless specified in yaml.
# If using 'gcloud builds submit ...', we can't easily pass build-args without a config file.
# ALTERNATIVE: Use a simple docker build if local docker is available, or use a cloudbuild.yaml.
# Let's create a temporary cloudbuild.yaml for frontend to inject the variable.

$CloudBuildYaml = @"
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', '$FrontendImage', '-f', 'infra/docker/Dockerfile.frontend', '--build-arg', 'VITE_API_URL=$BackendUrl', '.' ]
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', '$FrontendImage']
images:
- '$FrontendImage'
"@
Set-Content -Path "cloudbuild_frontend.yaml" -Value $CloudBuildYaml

Write-Step "Submitting Frontend Build to Cloud Build..."
gcloud builds submit --config backend/cloudbuild_frontend.yaml .
Remove-Item "cloudbuild_frontend.yaml"

Write-Step "Deploying Frontend Service..."
gcloud run deploy aigestion-frontend `
    --image $FrontendImage `
    --platform managed `
    --allow-unauthenticated `
    --port 80 `
    --region $Region

$FrontendUrl = gcloud run services describe aigestion-frontend --platform managed --region $Region --format 'value(status.url)'
Write-Success "Frontend deployed at: $FrontendUrl"

Write-Success "Deployment Complete!"
Write-Host "--------------------------------------------------"
Write-Host "Backend:  $BackendUrl"
Write-Host "Frontend: $FrontendUrl"
Write-Host "--------------------------------------------------"
