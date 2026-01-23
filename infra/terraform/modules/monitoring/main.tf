# infra/terraform/modules/monitoring/main.tf

variable "project_id" { type = string }
variable "notification_email" { type = string }

resource "google_monitoring_dashboard" "aigestion_dashboard" {
  project        = var.project_id
  dashboard_json = <<EOF
{
  "displayName": "🚀 AIGestion God-Mode Dashboard",
  "gridLayout": {
    "widgets": [
      {
        "title": "Cloud Run Request Count",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" metric.type=\"run.googleapis.com/request_count\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              }
            }
          ]
        }
      },
      {
        "title": "Vertex AI Model Latency",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"aiplatform.googleapis.com/Endpoint\" metric.type=\"aiplatform.googleapis.com/prediction/online/latency\"",
                  "aggregation": {
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }
}
EOF
}

resource "google_monitoring_notification_channel" "email" {
  project      = var.project_id
  display_name = "Email Notification Channel"
  type         = "email"
  labels = {
    email_address = var.notification_email
  }
}

resource "google_monitoring_alert_policy" "high_latency" {
  project      = var.project_id
  display_name = "High Latency Alert - AIGestion"
  combiner     = "OR"
  conditions {
    display_name = "Latency above 2s"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" metric.type=\"run.googleapis.com/request_latencies\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 2000
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]
}
