# R2 bucket for images
resource "cloudflare_r2_bucket" "images" {
  account_id = var.account_id
  name       = "${var.app_name}-images"
  location   = "APAC"
}

# DNS record pointing to Oracle VM (proxied for CDN)
resource "cloudflare_record" "app" {
  count   = var.zone_id != "" ? 1 : 0
  zone_id = var.zone_id
  name    = var.domain_name
  content = var.vm_public_ip
  type    = "A"
  proxied = true
}
