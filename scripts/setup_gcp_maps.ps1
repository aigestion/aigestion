# PowerShell script to enable Google Maps APIs and configure Secret Manager
# Prerequisites: gcloud SDK installed and authenticated, project set via `gcloud config set project YOUR_PROJECT_ID`

# Variables
$projectId = "aigestion-v2"
$secretName = "google-maps-api-key"

Write-Host "Enter your Google Maps API Key:"
$apiKeyValue = Read-Host

# 1. Enable required APIs
$apis = @(
  "maps.googleapis.com",
  "geocoding.googleapis.com",
  "places.googleapis.com",
  "run.googleapis.com",
  "cloudtasks.googleapis.com",
  "secretmanager.googleapis.com",
  "monitoring.googleapis.com",
  "logging.googleapis.com"
)
foreach ($api in $apis) {
  Write-Host "Enabling API: $api"
  gcloud services enable $api --project=$projectId
}

# 2. Create Secret Manager secret (if not exists)
if (-not (gcloud secrets list --filter="name:$secretName" --project=$projectId --format="value(name)")) {
  Write-Host "Creating secret $secretName"
  echo $apiKeyValue | gcloud secrets create $secretName --data-file=- --replication-policy="automatic" --project=$projectId
}
else {
  Write-Host "Secret $secretName already exists. Updating its value."
  echo $apiKeyValue | gcloud secrets versions add $secretName --data-file=- --project=$projectId
}

# 3. Grant Cloud Run service account access to the secret
$serviceAccount = "$(gcloud run services describe aigestion-app --project=$projectId --format='value(spec.template.spec.serviceAccountName)')"
if (-not $serviceAccount) { $serviceAccount = "$(gcloud config get-value account)" }
Write-Host "Granting Secret Manager access to $serviceAccount"
# Add IAM policy binding for secret accessor
gcloud secrets add-iam-policy-binding $secretName `
  --member="serviceAccount:$serviceAccount" `
  --role="roles/secretmanager.secretAccessor" `
  --project=$projectId

Write-Host "Setup complete. Remember to reference the secret at runtime, e.g.:"
Write-Host "export GOOGLE_MAPS_API_KEY=$(gcloud secrets versions access latest --secret=$secretName --project=$projectId)"
