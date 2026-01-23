# infra/terraform/modules/vercel-project/main.tf

terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15.0"
    }
  }
}

variable "project_name" { type = string }
variable "framework" { type = string }
variable "root_directory" { type = string }
variable "team_id" { type = string }

resource "vercel_project" "project" {
  name      = var.project_name
  framework = var.framework
  team_id   = var.team_id

  root_directory = var.root_directory

  git_repository = {
    type = "github"
    repo = "noepab/aigestion"
  }
}

output "project_id" {
  value = vercel_project.project.id
}
