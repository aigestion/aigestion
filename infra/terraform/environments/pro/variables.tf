# infra/terraform/environments/pro/variables.tf

variable "project_id" {
  description = "The GCP Project ID for the Pro environment"
  type        = string
  default     = "aigestion-pro"
}

variable "region" {
  description = "Primary region for resources"
  type        = string
  default     = "us-central1"
}

variable "vercel_team_id" {
  description = "The Vercel Team ID for the Pro organization"
  type        = string
  default     = "team_placeholder" # User will need to provide this
}

variable "notification_email" {
  description = "Email address for monitoring alerts"
  type        = string
  default     = "a.fernandez@nexusv1.net"
}
