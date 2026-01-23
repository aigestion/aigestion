# infra/terraform/modules/storage/outputs.tf

output "bucket_url" {
  value = google_storage_bucket.assets.url
}

output "bucket_name" {
  value = google_storage_bucket.assets.name
}
