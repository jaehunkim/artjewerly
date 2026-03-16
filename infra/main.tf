module "cloudflare" {
  source = "./modules/cloudflare"

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  app_name   = var.app_name
}

module "neon_db" {
  source = "./modules/neon-db"

  app_name = var.app_name
}

module "gcp_cloud_run" {
  source = "./modules/gcp-cloud-run"

  project_id   = var.gcp_project_id
  region       = var.gcp_region
  app_name     = var.app_name
  database_url = module.neon_db.connection_uri

  r2_account_id  = var.cloudflare_account_id
  r2_access_key  = module.cloudflare.r2_access_key_id
  r2_secret_key  = module.cloudflare.r2_secret_access_key
  r2_bucket_name = module.cloudflare.r2_bucket_name
  r2_public_url  = module.cloudflare.r2_public_url

  admin_password    = var.admin_password
  allowed_origin    = module.cloudflare.pages_url
  stripe_secret_key = var.stripe_secret_key
  toss_secret_key   = var.toss_secret_key
}
