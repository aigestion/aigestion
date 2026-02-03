variable "service_name" { type = string }
variable "region" { type = string; default = "us-central1" }
variable "image_url" { type = string }
variable "container_port" { type = number; default = 8080 }
variable "cpu_limit" { type = string; default = "1000m" }
variable "memory_limit" { type = string; default = "512Mi" }
variable "ingress" { type = string; default = "INGRESS_TRAFFIC_ALL" }
variable "allow_unauthenticated" { type = bool; default = true }
variable "env_vars" { type = map(string); default = {} }
