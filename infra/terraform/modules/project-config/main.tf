# infra/terraform/modules/project-config/main.tf

variable "project_id" { type = string }
variable "apis" {
  type    = list(string)
  default = [
    "compute.googleapis.com",
    "secretmanager.googleapis.com",
    "run.googleapis.com",
    "aiplatform.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudtasks.googleapis.com",
    "iam.googleapis.com"
  ]
}

resource "google_project_service" "services" {
  for_each = toset(var.apis)
  project  = var.project_id
  service  = each.value

  disable_on_destroy = false
}

output "project_id" {
  value = var.project_id
}
