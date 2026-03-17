output "vm_public_ip" {
  description = "Public IP address of the Oracle VM"
  value       = module.oracle_vm.public_ip
}

output "vm_instance_id" {
  description = "OCID of the Oracle VM instance"
  value       = module.oracle_vm.instance_id
}

# Uncomment when Cloudflare module is enabled
# output "r2_bucket_name" {
#   description = "Cloudflare R2 bucket name for image storage"
#   value       = module.cloudflare.r2_bucket_name
# }
#
# output "r2_public_url" {
#   description = "Cloudflare R2 public URL for image access"
#   value       = module.cloudflare.r2_public_url
# }
