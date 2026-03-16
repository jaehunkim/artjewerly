output "connection_uri" {
  description = "PostgreSQL connection URI"
  value       = neon_project.main.connection_uri
  sensitive   = true
}

output "host" {
  description = "Database host"
  value       = neon_project.main.database_host
  sensitive   = true
}

output "database_name" {
  description = "Database name"
  value       = neon_database.main.name
}
