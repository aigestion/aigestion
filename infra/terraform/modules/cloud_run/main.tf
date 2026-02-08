# 🌌 [GOD MODE] Cloud Run Service Configuration
# Optimized for: Performance, Autoscaling, Security, Observability

resource "google_cloud_run_v2_service" "service" {
  name     = var.service_name
  location = var.region
  ingress  = var.ingress

  # Observability labels
  labels = merge(
    var.labels,
    {
      environment = var.environment
      managed-by  = "terraform"
      tier        = "god-mode"
    }
  )

  template {
    # Autoscaling configuration
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    # Maximum concurrent requests per instance
    max_instance_request_concurrency = var.concurrency

    # Request timeout (5 minutes for long operations)
    timeout = "${var.timeout_seconds}s"

    # VPC connector for private networking
    dynamic "vpc_access" {
      for_each = var.vpc_connector != "" ? [1] : []
      content {
        connector = var.vpc_connector
        egress    = "PRIVATE_RANGES_ONLY"
      }
    }

    # Service account for IAM
    service_account = var.service_account_email

    # Execution environment (gen2 for better performance)
    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"

    # Container configuration
    containers {
      image = var.image_url

      # Resource limits - God Mode
      resources {
        limits = {
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
        cpu_idle = var.cpu_idle
        startup_cpu_boost = var.cpu_boost
      }

      # Environment variables from map
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      # Secrets from Secret Manager
      dynamic "env" {
        for_each = var.secrets
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value.secret
              version = env.value.version
            }
          }
        }
      }

      # Container port
      ports {
        name           = "http1"
        container_port = var.container_port
      }

      # Startup probe - allow more time for initial startup
      startup_probe {
        initial_delay_seconds = 5
        timeout_seconds       = 30
        period_seconds        = 10
        failure_threshold     = 10
        http_get {
          path = var.health_check_path
          port = var.container_port
        }
      }

      # Liveness probe - check container is alive
      liveness_probe {
        initial_delay_seconds = 10
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 3
        http_get {
          path = var.health_check_path
          port = var.container_port
        }
      }
    }

    # Annotations for advanced features
    annotations = merge(
      var.annotations,
      {
        "autoscaling.knative.dev/minScale"         = tostring(var.min_instances)
        "autoscaling.knative.dev/maxScale"         = tostring(var.max_instances)
        "run.googleapis.com/cpu-throttling"        = var.cpu_throttling ? "true" : "false"
        "run.googleapis.com/startup-cpu-boost"     = var.cpu_boost ? "true" : "false"
        "run.googleapis.com/execution-environment" = "gen2"
      }
    )
  }

  # Traffic configuration - 100% to latest
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  # Lifecycle policy
  lifecycle {
    ignore_changes = [
      # Ignore changes to these fields to prevent unnecessary redeployments
      template[0].annotations["client.knative.dev/user-image"],
      template[0].annotations["run.googleapis.com/client-name"],
      template[0].annotations["run.googleapis.com/client-version"],
    ]
  }
}

# IAM - Public access (if enabled)
resource "google_cloud_run_v2_service_iam_member" "noauth" {
  count    = var.allow_unauthenticated ? 1 : 0
  location = google_cloud_run_v2_service.service.location
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Output the service URL
output "service_url" {
  description = "URL of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_name" {
  description = "Name of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.service.name
}
