variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "labels" {
  description = "Additional labels applied to GCP resources"
  type        = map(string)
  default     = {}
}

variable "container_port" {
  description = "Port the container listens on"
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

variable "database_url" {
  description = "PostgreSQL connection URL"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Admin password for the API"
  type        = string
  sensitive   = true
}

variable "allowed_origin" {
  description = "Allowed CORS origin URL"
  type        = string
}

variable "r2_account_id" {
  description = "Cloudflare R2 account ID"
  type        = string
}

variable "r2_access_key" {
  description = "R2 S3-compatible access key ID"
  type        = string
  sensitive   = true
}

variable "r2_secret_key" {
  description = "R2 S3-compatible secret access key"
  type        = string
  sensitive   = true
}

variable "r2_bucket_name" {
  description = "R2 bucket name for image storage"
  type        = string
}

variable "r2_public_url" {
  description = "R2 public URL for serving images"
  type        = string
}

variable "stripe_secret_key" {
  description = "Stripe secret key for payment processing"
  type        = string
  sensitive   = true
}

variable "toss_secret_key" {
  description = "Tosspayments secret key for payment processing"
  type        = string
  sensitive   = true
}
