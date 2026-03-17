variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare zone ID (optional, required for DNS record)"
  type        = string
  default     = ""
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the DNS A record (e.g. heeang.com or @)"
  type        = string
  default     = "@"
}

variable "vm_public_ip" {
  description = "Public IP of the Oracle VM to point DNS at"
  type        = string
  default     = ""
}

variable "r2_public_url" {
  description = "Optional override for the public R2 bucket URL"
  type        = string
  default     = ""
}
