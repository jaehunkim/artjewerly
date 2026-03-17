variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare zone ID"
  type        = string
  default     = ""
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "production_branch" {
  description = "Production branch for the Cloudflare Pages project"
  type        = string
  default     = "main"
}

variable "build_command" {
  description = "Build command used by Cloudflare Pages"
  type        = string
  default     = "npm run build"
}

variable "destination_dir" {
  description = "Build output directory for Cloudflare Pages"
  type        = string
  default     = ".vercel/output/static"
}

variable "root_dir" {
  description = "Root directory for the frontend project in Cloudflare Pages"
  type        = string
  default     = "frontend"
}

variable "r2_bucket_location" {
  description = "Location hint for the R2 bucket"
  type        = string
  default     = "APAC"
}

variable "r2_public_url" {
  description = "Optional override for the public R2 bucket URL"
  type        = string
  default     = ""
}
