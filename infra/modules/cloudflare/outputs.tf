output "pages_url" {
  description = "Pages project URL"
  value       = "https://${cloudflare_pages_project.frontend.subdomain}"
}

output "r2_bucket_name" {
  description = "R2 bucket name"
  value       = cloudflare_r2_bucket.images.name
}

output "r2_public_url" {
  description = "R2 public URL (configure public access via dashboard)"
  value       = "https://pub-${var.account_id}.r2.dev"
}

# Note: R2 API tokens for S3 compatibility need to be created via dashboard
# These are placeholder outputs
output "r2_access_key_id" {
  description = "R2 access key ID (create via CF dashboard)"
  value       = ""
}

output "r2_secret_access_key" {
  description = "R2 secret access key (create via CF dashboard)"
  value       = ""
  sensitive   = true
}
