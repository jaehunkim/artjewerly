# Cloudflare Pages project
resource "cloudflare_pages_project" "frontend" {
  account_id        = var.account_id
  name              = var.app_name
  production_branch = var.production_branch

  build_config {
    build_command   = var.build_command
    destination_dir = var.destination_dir
    root_dir        = var.root_dir
  }
}

# R2 bucket for images
resource "cloudflare_r2_bucket" "images" {
  account_id = var.account_id
  name       = "${var.app_name}-images"
  location   = var.r2_bucket_location
}

# Note: R2 public access and CORS are configured via the Cloudflare dashboard
# or API since Terraform support for R2 public access is limited.
# The r2_public_url output assumes public access is enabled manually or via API.
