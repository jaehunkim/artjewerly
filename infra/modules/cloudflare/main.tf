# Cloudflare Pages project
resource "cloudflare_pages_project" "frontend" {
  account_id        = var.account_id
  name              = var.app_name
  production_branch = "main"

  build_config {
    build_command   = "npm run build"
    destination_dir = ".vercel/output/static"
    root_dir        = "frontend"
  }
}

# R2 bucket for images
resource "cloudflare_r2_bucket" "images" {
  account_id = var.account_id
  name       = "${var.app_name}-images"
  location   = "APAC"
}

# Note: R2 public access and CORS are configured via the Cloudflare dashboard
# or API since Terraform support for R2 public access is limited.
# The r2_public_url output assumes public access is enabled manually or via API.
