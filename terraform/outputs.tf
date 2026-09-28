output "d1_database_id" {
  description = "The D1 Database ID that the application connects to."
  value       = cloudflare_d1_database.kanban_atlas_db.id
}

output "r2_bucket_name" {
  description = "R2 Bucket Name the application will connect to"
  value       = cloudflare_r2_bucket.kanban_atlas_artifacts_bucket.name
}