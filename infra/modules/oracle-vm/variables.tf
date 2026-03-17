variable "compartment_id" {
  description = "OCI compartment OCID"
  type        = string
}

variable "availability_domain" {
  description = "OCI availability domain (e.g. IiAS:AP-CHUNCHEON-1-AD-1)"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
}

variable "ocpus" {
  description = "Number of OCPUs for A1.Flex instance"
  type        = number
  default     = 2
}

variable "memory_in_gbs" {
  description = "Memory in GBs for A1.Flex instance"
  type        = number
  default     = 12
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the application (used in CORS and frontend API URL)"
  type        = string
  default     = ""
}

variable "admin_password" {
  description = "Admin password for API and database"
  type        = string
  sensitive   = true
}

variable "r2_account_id" {
  description = "Cloudflare account ID for R2"
  type        = string
  default     = ""
}

variable "r2_access_key" {
  description = "R2 S3-compatible access key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "r2_secret_key" {
  description = "R2 S3-compatible secret key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "r2_bucket_name" {
  description = "R2 bucket name for image storage"
  type        = string
  default     = ""
}

variable "r2_public_url" {
  description = "R2 public URL for image access"
  type        = string
  default     = ""
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
