resource "google_billing_budget" "budget" {
  billing_account = var.billing_account_id
  display_name    = "Presupuesto Mensual - AIGestion (${var.environment})"

  amount {
    specified_amount {
      currency_code = "EUR"
      units         = var.monthly_budget_amount
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }
  threshold_rules {
    threshold_percent = 0.9
  }
  threshold_rules {
    threshold_percent = 1.0
  }

  all_updates_rule {
    pubsub_topic   = "projects/${var.project_id}/topics/billing-alerts"
    schema_version = "1.0"
  }
}

variable "billing_account_id" {
  description = "ID de la cuenta de facturación"
  type        = string
}

variable "project_id" {
  description = "ID del proyecto GCP"
  type        = string
}

variable "environment" {
  description = "Entorno (dev, prod)"
  type        = string
}

variable "monthly_budget_amount" {
  description = "Límite mensual en Euros"
  type        = number
  default     = 50
}
