variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "database_url" {
  description = "PostgreSQL connection URL"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Admin password"
  type        = string
  sensitive   = true
}

variable "allowed_origin" {
  description = "Allowed CORS origin"
  type        = string
}

variable "r2_account_id" {
  description = "Cloudflare R2 account ID"
  type        = string
}

variable "r2_access_key" {
  description = "R2 access key"
  type        = string
  sensitive   = true
}

variable "r2_secret_key" {
  description = "R2 secret key"
  type        = string
  sensitive   = true
}

variable "r2_bucket_name" {
  description = "R2 bucket name"
  type        = string
}

variable "r2_public_url" {
  description = "R2 public URL"
  type        = string
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "toss_secret_key" {
  description = "Tosspayments secret key"
  type        = string
  sensitive   = true
}
