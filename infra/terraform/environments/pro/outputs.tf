# infra/terraform/environments/pro/outputs.tf

output "project_id" {
  value = var.project_id
}

output "wif_provider_name" {
  value = google_iam_workload_identity_pool_provider.github_provider.name
}

output "deployer_service_account" {
  value = google_iam_service_account.deployer.email
}

output "vpc_id" {
  value = module.network.vpc_id
}

output "assets_bucket_url" {
  value = module.storage.bucket_url
}
