# PowerShell script for GOD-LEVEL Google Cloud Optimization
# Orchestrates Secret Manager, IAM, Cloud Run, and Cloud Tasks

# Configuration
$projectId = "dynamic-reef-485215-v4"
$region = "europe-west1"
$serviceName = "aigestion-app"
$repoName = "aigestion" # Artifact Registry Repo
$imageName = "aigestion-app"

Write-Host "🚀 STARTING GOD-LEVEL GCP OPTIMIZATION FOR $projectId" -ForegroundColor Green

# 1. Enable Advanced APIs
Write-Host "Step 1: Enabling Advanced APIs..."
$apis = @(
    "secretmanager.googleapis.com",
    "run.googleapis.com",
    "cloudtasks.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "artifactregistry.googleapis.com"
)
foreach ($api in $apis) {
    Write-Host "Enabling $api..."
    gcloud services enable $api --project=$projectId
}

# 2. IAM Hardening (Service Accounts)
Write-Host "Step 2: Creating Hardened Service Accounts..."

# Runtime SA (Cloud Run identity)
$runtimeSA = "aigestion-runtime"
if (-not (gcloud iam service-accounts describe "$runtimeSA@$projectId.iam.gserviceaccount.com" --project=$projectId 2>$null)) {
    gcloud iam service-accounts create $runtimeSA --display-name "AIGestion Runtime SA" --project=$projectId
}
$runtimeEmail = "$runtimeSA@$projectId.iam.gserviceaccount.com"

# Worker SA (Cloud Tasks processor)
$workerSA = "aigestion-worker"
if (-not (gcloud iam service-accounts describe "$workerSA@$projectId.iam.gserviceaccount.com" --project=$projectId 2>$null)) {
    gcloud iam service-accounts create $workerSA --display-name "AIGestion Worker SA" --project=$projectId
}
$workerEmail = "$workerSA@$projectId.iam.gserviceaccount.com"

# Grant Permissions
# Runtime needs: Logging, Secret Access, Trace
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:$runtimeEmail" --role="roles/logging.logWriter"
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:$runtimeEmail" --role="roles/cloudtrace.agent"
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:$runtimeEmail" --role="roles/secretmanager.secretAccessor"
# Allow Runtime to enqueue tasks
gcloud projects add-iam-policy-binding $projectId --member="serviceAccount:$runtimeEmail" --role="roles/cloudtasks.enqueuer"

# Worker needs: Invoke Cloud Run (if tasks call Run via OIDC)
gcloud run services add-iam-policy-binding $serviceName --region=$region --member="serviceAccount:$workerEmail" --role="roles/run.invoker" --project=$projectId

# 3. Secret Manager Migration strategy
Write-Host "Step 3: Secret Manager Strategy..."
Write-Host "ℹ️  Run 'npm run secrets:migrate' (to be implemented) or manually upload secrets via Console."
Write-Host "    Ensuring 'google-maps-api-key' exists..."
if (-not (gcloud secrets list --filter="name:google-maps-api-key" --project=$projectId --format="value(name)")) {
    Write-Host "⚠️  Secret 'google-maps-api-key' missing! Please create it." -ForegroundColor Yellow
}

# 4. Cloud Tasks Queue
Write-Host "Step 4: Configuring Cloud Tasks..."
$queueName = "aigestion-tasks"
if (-not (gcloud tasks queues describe $queueName --location=$region --project=$projectId 2>$null)) {
    gcloud tasks queues create $queueName --location=$region --project=$projectId
    # Tune rate limits
    gcloud tasks queues update $queueName --location=$region --project=$projectId `
        --max-dispatches-per-second=10 `
        --max-concurrent-dispatches=50
}

# 5. Cloud Run Optimization (Gen 2)
Write-Host "Step 5: preparing Cloud Run Update command (Gen 2)..."
# Note: Actual update requires an image. We construct the command for the user to safeguard.
$updateCmd = "gcloud run deploy $serviceName --image=YOUR_IMAGE_URL --region=$region --project=$projectId " +
             "--execution-environment=gen2 " +
             "--service-account=$runtimeEmail " +
             "--min-instances=1 --max-instances=10 " +
             "--concurrency=80 " +
             "--cpu=1 --memory=512Mi " +
             "--set-secrets=GOOGLE_MAPS_API_KEY=google-maps-api-key:latest " +
             "--allow-unauthenticated"

Write-Host "✅ CONFIGURATION COMPLETE!" -ForegroundColor Green
Write-Host "To apply the Cloud Run update, build your image and run:"
Write-Host $updateCmd -ForegroundColor Cyan
