output "pages_url" {
  description = "Cloudflare Pages URL"
  value       = module.cloudflare.pages_url
}

output "api_url" {
  description = "Cloud Run API URL"
  value       = module.gcp_cloud_run.service_url
}

output "r2_public_url" {
  description = "R2 public bucket URL"
  value       = module.cloudflare.r2_public_url
}

output "database_host" {
  description = "Neon database host"
  value       = module.neon_db.host
  sensitive   = true
}
