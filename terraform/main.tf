resource "cloudflare_d1_database" "kanban_atlas_db" {
  account_id = var.cloudflare_account_id
  name       = "kanban-atlas-db-${var.environment}"
  jurisdiction = "eu"
  primary_location_hint = "weur"
}

resource "cloudflare_r2_bucket" "kanban_atlas_artifacts_bucket" {
  account_id = var.cloudflare_account_id
  name       = "kanban-atlas-bucket-${var.environment}"
  location   = "WEUR"
}

resource "cloudflare_r2_bucket_cors" "artifacts_cors" {
  account_id = var.cloudflare_account_id
  bucket_name = cloudflare_r2_bucket.kanban_atlas_artifacts_bucket.name

  rules = [{
    allowed = {
      methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
      origins = ["*"]
      headers = ["*"]
    }
    expose_headers  = ["Content-Type", "Content-Length"]
    max_age_seconds = 3600
  }]
}
