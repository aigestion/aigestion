# infra/terraform/environments/pro/main.tf

provider "google" {
  project = var.project_id
  region  = var.region
}

# 0. API & Project Setup
module "project_pro" {
  source     = "../../modules/project-config"
  project_id = var.project_id
}

# 1. Network Setup
module "network" {
  source       = "../../modules/network"
  project_id   = module.project_pro.project_id
  region       = var.region
  network_name = "aigestion-pro-vpc"
}

# 2. Storage Setup (Assets)
module "storage" {
  source      = "../../modules/storage"
  project_id  = module.project_pro.project_id
  region      = var.region
  bucket_name = "aigestion-pro-assets"
}

# 3. GitHub OIDC - Zero Secret Architecture
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-actions-pool"
  project                   = module.project_pro.project_id
  description               = "Identity pool for GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  project                            = module.project_pro.project_id

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# Service Account for Deployment
resource "google_iam_service_account" "deployer" {
  account_id   = "aigestion-pro-deployer"
  display_name = "Pro Deployment Service Account"
  project      = module.project_pro.project_id
}

# Allow GitHub Actions to use the SA
resource "google_iam_service_account_iam_member" "oidc_binding" {
  service_account_id = google_iam_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/noepab/aigestion"
}

# 4. Vercel Projects Setup
module "vercel_website" {
  source         = "../../modules/vercel-project"
  project_name   = "aigestion-website"
  framework      = "vite"
  root_directory = "frontend/apps/website-epic"
  team_id        = var.vercel_team_id
}

module "vercel_admin" {
  source         = "../../modules/vercel-project"
  project_name   = "aigestion-admin"
  framework      = "vite"
  root_directory = "frontend/apps/admindashboard"
  team_id        = var.vercel_team_id
}

module "vercel_client" {
  source         = "../../modules/vercel-project"
  project_name   = "aigestion-client"
  framework      = "vite"
  root_directory = "frontend/apps/clientdashboard"
  team_id        = var.vercel_team_id
}

module "vercel_demo" {
  source         = "../../modules/vercel-project"
  project_name   = "aigestion-demo"
  framework      = "vite"
  root_directory = "frontend/apps/demodashboard"
  team_id        = var.vercel_team_id
}

# 5. Monitoring & Alerting
module "monitoring" {
  source             = "../../modules/monitoring"
  project_id         = module.project_pro.project_id
  notification_email = var.notification_email
}
