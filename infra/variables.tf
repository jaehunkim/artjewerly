# OCI Authentication
variable "oci_tenancy_ocid" {
  description = "OCI tenancy OCID"
  type        = string
}

variable "oci_user_ocid" {
  description = "OCI user OCID"
  type        = string
}

variable "oci_fingerprint" {
  description = "OCI API key fingerprint"
  type        = string
}

variable "oci_private_key_path" {
  description = "Path to OCI API private key PEM file"
  type        = string
}

variable "oci_region" {
  description = "OCI region (e.g. ap-chuncheon-1)"
  type        = string
  default     = "ap-chuncheon-1"
}

# OCI Instance
variable "oci_compartment_id" {
  description = "OCI compartment OCID where resources will be created"
  type        = string
}

variable "oci_availability_domain" {
  description = "OCI availability domain (e.g. IiAS:AP-CHUNCHEON-1-AD-1)"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
}

variable "ocpus" {
  description = "Number of OCPUs for A1.Flex instance (max 4 on free tier)"
  type        = number
  default     = 2
}

variable "memory_in_gbs" {
  description = "Memory in GBs for A1.Flex instance (max 24 on free tier)"
  type        = number
  default     = 12
}

# Cloudflare / R2 (uncomment cloudflare vars when enabling Cloudflare module)
# variable "cloudflare_api_token" {
#   description = "Cloudflare API token"
#   type        = string
#   sensitive   = true
# }
#
# variable "cloudflare_account_id" {
#   description = "Cloudflare account ID"
#   type        = string
# }
#
# variable "cloudflare_zone_id" {
#   description = "Cloudflare zone ID (optional, required for custom domain DNS)"
#   type        = string
#   default     = ""
# }
#
# variable "cloudflare_r2_public_url" {
#   description = "Optional override for the public R2 bucket URL"
#   type        = string
#   default     = ""
# }

variable "r2_account_id" {
  description = "Cloudflare account ID for R2 S3-compatible API"
  type        = string
  default     = ""
}

variable "r2_access_key" {
  description = "R2 S3-compatible access key (create via Cloudflare dashboard)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "r2_secret_key" {
  description = "R2 S3-compatible secret key (create via Cloudflare dashboard)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "r2_bucket_name" {
  description = "R2 bucket name for image storage"
  type        = string
  default     = "heeang-images"
}

variable "r2_public_url" {
  description = "R2 public URL for image access"
  type        = string
  default     = ""
}

# App
variable "app_name" {
  description = "Application name used for resource naming across all modules"
  type        = string
  default     = "heeang-jewelry"
}

variable "domain_name" {
  description = "Domain name for the application (e.g. heeang.com)"
  type        = string
  default     = ""
}

variable "admin_password" {
  description = "Admin password for API and database"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "toss_secret_key" {
  description = "Tosspayments secret key"
  type        = string
  sensitive   = true
  default     = ""
}
