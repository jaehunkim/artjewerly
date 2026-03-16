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
