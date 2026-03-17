module "oracle_vm" {
  source = "./modules/oracle-vm"

  compartment_id      = var.oci_compartment_id
  availability_domain = var.oci_availability_domain
  ssh_public_key      = var.ssh_public_key
  ocpus               = var.ocpus
  memory_in_gbs       = var.memory_in_gbs
  app_name            = var.app_name
  domain_name         = var.domain_name

  admin_password    = var.admin_password
  r2_account_id     = var.r2_account_id
  r2_access_key     = var.r2_access_key
  r2_secret_key     = var.r2_secret_key
  r2_bucket_name    = var.r2_bucket_name
  r2_public_url     = var.r2_public_url
  stripe_secret_key = var.stripe_secret_key
  toss_secret_key   = var.toss_secret_key
}

# Cloudflare module — uncomment when ready for production
# module "cloudflare" {
#   source = "./modules/cloudflare"
#
#   account_id    = var.cloudflare_account_id
#   zone_id       = var.cloudflare_zone_id
#   app_name      = var.app_name
#   domain_name   = var.domain_name
#   vm_public_ip  = module.oracle_vm.public_ip
#   r2_public_url = var.cloudflare_r2_public_url
# }
