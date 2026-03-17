module "cloudflare" {
  source = "./modules/cloudflare"

  account_id = var.cloudflare_account_id
  zone_id    = var.cloudflare_zone_id
  app_name   = var.app_name

  production_branch = var.cloudflare_pages_production_branch
  build_command     = var.cloudflare_pages_build_command
  destination_dir   = var.cloudflare_pages_destination_dir
  root_dir          = var.cloudflare_pages_root_dir

  r2_bucket_location = var.cloudflare_r2_bucket_location
  r2_public_url      = var.cloudflare_r2_public_url
}

module "neon_db" {
  source = "./modules/neon-db"

  app_name           = var.app_name
  neon_region        = var.neon_region
  database_name      = var.database_name
  autoscaling_min_cu = var.autoscaling_min_cu
  autoscaling_max_cu = var.autoscaling_max_cu
}

module "gcp_cloud_run" {
  source = "./modules/gcp-cloud-run"

  project_id         = var.gcp_project_id
  region             = var.gcp_region
  app_name           = var.app_name
  environment        = var.environment
  container_port     = var.container_port
  min_instance_count = var.min_instance_count
  max_instance_count = var.max_instance_count
  cpu_limit          = var.cpu_limit
  memory_limit       = var.memory_limit
  labels             = var.common_labels

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
