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

variable "container_port" {
  description = "Port the Cloud Run container listens on"
  type        = number
  default     = 8080
}

variable "min_instance_count" {
  description = "Minimum number of Cloud Run instances"
  type        = number
  default     = 0
}

variable "max_instance_count" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 2
}

variable "cpu_limit" {
  description = "CPU limit for each Cloud Run instance (e.g. '1', '2')"
  type        = string
  default     = "1"
}

variable "memory_limit" {
  description = "Memory limit for each Cloud Run instance (e.g. '512Mi', '1Gi')"
  type        = string
  default     = "512Mi"
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

variable "cloudflare_pages_production_branch" {
  description = "Production branch for the Cloudflare Pages project"
  type        = string
  default     = "main"
}

variable "cloudflare_pages_build_command" {
  description = "Build command used by Cloudflare Pages"
  type        = string
  default     = "npm run build"
}

variable "cloudflare_pages_destination_dir" {
  description = "Build output directory for Cloudflare Pages"
  type        = string
  default     = ".vercel/output/static"
}

variable "cloudflare_pages_root_dir" {
  description = "Root directory for the frontend project in Cloudflare Pages"
  type        = string
  default     = "frontend"
}

variable "cloudflare_r2_bucket_location" {
  description = "Location hint for the Cloudflare R2 bucket"
  type        = string
  default     = "APAC"
}

variable "cloudflare_r2_public_url" {
  description = "Optional override for the public R2 bucket URL"
  type        = string
  default     = ""
}

# Neon
variable "neon_api_key" {
  description = "Neon API key"
  type        = string
  sensitive   = true
}

variable "neon_region" {
  description = "Neon region ID (e.g. aws-ap-northeast-2 for Seoul)"
  type        = string
  default     = "aws-ap-northeast-2"
}

variable "database_name" {
  description = "Name of the application database"
  type        = string
  default     = "heeang"
}

variable "autoscaling_min_cu" {
  description = "Minimum compute units for Neon autoscaling"
  type        = number
  default     = 0.25
}

variable "autoscaling_max_cu" {
  description = "Maximum compute units for Neon autoscaling"
  type        = number
  default     = 0.25
}

# App
variable "app_name" {
  description = "Application name used for resource naming across all modules"
  type        = string
  default     = "heeang-jewelry"
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "common_labels" {
  description = "Additional labels applied to label-supporting resources"
  type        = map(string)
  default     = {}
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
