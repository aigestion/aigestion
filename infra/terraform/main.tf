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

# Cloud Run Service (Placeholder/Reference)
# resource "google_cloud_run_service" "backend" {
#   name     = "aigestion-backend"
#   location = var.region
#   template {
#     spec {
#       containers {
#         image = "gcr.io/${var.project_id}/backend:latest"
#       }
#     }
#   }
# }
