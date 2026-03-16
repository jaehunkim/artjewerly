# GCP
variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP region for Cloud Run"
  type        = string
  default     = "asia-northeast3"
}

# Cloudflare
variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID (optional, for custom domain)"
  type        = string
  default     = ""
}

# Neon
variable "neon_api_key" {
  description = "Neon API key"
  type        = string
  sensitive   = true
}

# App
variable "app_name" {
  description = "Application name"
  type        = string
  default     = "heeang-jewelry"
}

variable "admin_password" {
  description = "Admin password for API"
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
