# 🌌 [GOD MODE] Cloud Run Variables Configuration
# Complete variable definitions for maximum optimization

# Basic service configuration
variable "service_name" {
  type        = string
  description = "Name of the Cloud Run service"
}

variable "region" {
  type        = string
  description = "GCP region for deployment"
  default     = "us-central1"
}

variable "environment" {
  type        = string
  description = "Environment (production, staging, development)"
  default     = "production"
}

variable "image_url" {
  type        = string
  description = "Full URL to container image in Artifact Registry or GCR"
}

# Resource limits - God Mode defaults
variable "cpu_limit" {
  type        = string
  description = "CPU limit (e.g., '4000m' for 4 vCPU)"
  default     = "4000m"
}

variable "memory_limit" {
  type        = string
  description = "Memory limit (e.g., '8Gi' for 8 GB)"
  default     = "8Gi"
}

variable "cpu_idle" {
  type        = bool
  description = "Whether to throttle CPU when idle"
  default     = false
}

variable "cpu_boost" {
  type        = bool
  description = "Enable CPU boost for faster cold starts"
  default     = true
}

variable "cpu_throttling" {
  type        = bool
  description = "Enable CPU throttling to save costs"
  default     = false
}

# Autoscaling configuration
variable "min_instances" {
  type        = number
  description = "Minimum number of instances (0 = scale to zero, 1+ = always warm)"
  default     = 1
}

variable "max_instances" {
  type        = number
  description = "Maximum number of instances"
  default     = 100
}

variable "concurrency" {
  type        = number
  description = "Maximum concurrent requests per instance"
  default     = 80
}

variable "timeout_seconds" {
  type        = number
  description = "Request timeout in seconds"
  default     = 300
}

# Networking
variable "container_port" {
  type        = number
  description = "Container port to expose"
  default     = 8080
}

variable "ingress" {
  type        = string
  description = "Ingress traffic settings"
  default     = "INGRESS_TRAFFIC_ALL"
  validation {
    condition     = contains(["INGRESS_TRAFFIC_ALL", "INGRESS_TRAFFIC_INTERNAL_ONLY", "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"], var.ingress)
    error_message = "Ingress must be one of: INGRESS_TRAFFIC_ALL, INGRESS_TRAFFIC_INTERNAL_ONLY, INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  }
}

variable "vpc_connector" {
  type        = string
  description = "VPC connector for private networking (e.g., 'projects/PROJECT/locations/REGION/connectors/CONNECTOR')"
  default     = ""
}

# IAM & Security
variable "allow_unauthenticated" {
  type        = bool
  description = "Allow unauthenticated requests"
  default     = true
}

variable "service_account_email" {
  type        = string
  description = "Service account email for the Cloud Run service"
  default     = ""
}

# Environment variables
variable "env_vars" {
  type        = map(string)
  description = "Environment variables as key-value pairs"
  default     = {}
}

# Secrets from Secret Manager
variable "secrets" {
  type = map(object({
    secret  = string
    version = string
  }))
  description = "Secrets from Secret Manager (format: { ENV_VAR_NAME = { secret = 'secret-name', version = 'latest' } })"
  default     = {}
}

# Health checks
variable "health_check_path" {
  type        = string
  description = "Path for health check endpoint"
  default     = "/api/v1/health"
}

# Labels & Annotations
variable "labels" {
  type        = map(string)
  description = "Labels to apply to the service"
  default     = {}
}

variable "annotations" {
  type        = map(string)
  description = "Annotations for advanced configuration"
  default     = {}
}
