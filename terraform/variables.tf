variable "cloudflare_api_token" {
  description = "Cloudflare API Token (authorized for D1 and R2)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "environment" {
  description = "Which environment (dev or prod)?"
  type        = string
  default     = "dev"
}