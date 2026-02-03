terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variable Definitions
variable "project_id" {
  type    = string
  default = "aigestion-pro-2026"
}

variable "region" {
  type    = string
  default = "europe-west1"
}

# Networking for Redis
resource "google_compute_network" "vpc_network" {
  name = "aigestion-vpc"
}

# Redis Cluster (MemoryStore) - [P1] #8 Roadmap
resource "google_redis_instance" "cache_l2" {
  name           = "aigestion-cache-l2"
  tier           = "STANDARD_HA"
  memory_size_gb = 5

  location_id      = var.region
  authorized_network = google_compute_network.vpc_network.id

  redis_version     = "REDIS_7_0"
  display_name      = "AIGestion L2 Cache Cluster"

  labels = {
    environment = "production"
    phase       = "9"
  }
}

# Cloud Run using the new module
module "backend_service" {
  source       = "./modules/cloud_run"
  service_name = "backend-nestjs"
  image_url    = "gcr.io/${var.project_id}/backend-nestjs:latest"
  cpu_limit            = "1000m"
  memory_limit         = "512Mi"
  container_port       = 8080
  ingress              = "INGRESS_TRAFFIC_ALL"
  allow_unauthenticated = true
  region               = var.region

  env_vars = {
    REDIS_HOST = google_redis_instance.cache_l2.host
    REDIS_PORT = google_redis_instance.cache_l2.port
  }
}

variable "secondary_region" {
  type    = string
  default = "us-central1"
}

# Secondary Redis for Disaster Recovery
resource "google_redis_instance" "cache_l2_failover" {
  name           = "aigestion-cache-l2-dr"
  tier           = "BASIC" # Cost-effective standby
  memory_size_gb = 1
  location_id    = var.secondary_region
  authorized_network = google_compute_network.vpc_network.id
  redis_version     = "REDIS_7_0"
  display_name      = "AIGestion DR Cache"
}

# Health Check for Failover Automation (Simulated/Scaffold)
resource "google_compute_health_check" "global_lb_check" {
  name = "aigestion-global-health-check"
  http_health_check {
    port = 8080
    request_path = "/diagnostic/status"
  }
}
