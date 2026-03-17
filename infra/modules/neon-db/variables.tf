variable "app_name" {
  description = "Application name used as the Neon project name"
  type        = string
}

variable "neon_region" {
  description = "Neon region ID (e.g. aws-ap-northeast-2 for Seoul)"
  type        = string
  default     = "aws-ap-northeast-2"
}

variable "database_name" {
  description = "Name of the database to create"
  type        = string
  default     = "heeang"
}

variable "autoscaling_min_cu" {
  description = "Minimum compute units for autoscaling"
  type        = number
  default     = 0.25
}

variable "autoscaling_max_cu" {
  description = "Maximum compute units for autoscaling"
  type        = number
  default     = 0.25
}
