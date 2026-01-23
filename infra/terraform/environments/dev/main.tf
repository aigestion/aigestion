module "network" {
  source = "../../modules/network"

  project_id   = var.project_id
  region       = var.region
  network_name = "nexus-vpc-${var.environment}"
}

module "storage" {
  source = "../../modules/storage"

  project_id  = var.project_id
  region      = var.region
  bucket_name = "nexus-assets-${var.environment}-${var.project_id}"
}

module "secrets" {
  source = "../../modules/secrets"

  project_id  = var.project_id
  secret_id   = "nexus-api-key-${var.environment}"
  secret_data = "dummy-secret-value-for-provisioning"
}

resource "google_artifact_registry_repository" "nexus_repo" {
  location      = var.region
  repository_id = "nexus-v4-repo"
  description   = "Nexus V4 Professional Container Repository"
  format        = "DOCKER"
}

resource "google_cloudrun_service_iam_member" "public_access" {
  count    = var.environment == "prod" ? 0 : 1
  location = var.region
  project  = var.project_id
  service  = "nexus-dashboard" # Placeholder name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
