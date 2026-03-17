output "r2_bucket_name" {
  description = "R2 bucket name"
  value       = cloudflare_r2_bucket.images.name
}

output "r2_public_url" {
  description = "R2 public URL (configure public access via Cloudflare dashboard)"
  value       = var.r2_public_url != "" ? var.r2_public_url : "https://pub-${var.account_id}.r2.dev"
}
