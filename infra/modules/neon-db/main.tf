resource "neon_project" "main" {
  name      = var.app_name
  region_id = var.neon_region

  default_endpoint_settings {
    autoscaling_limit_min_cu = var.autoscaling_min_cu
    autoscaling_limit_max_cu = var.autoscaling_max_cu
  }
}

resource "neon_database" "main" {
  project_id = neon_project.main.id
  branch_id  = neon_project.main.default_branch_id
  name       = var.database_name
  owner_name = neon_project.main.database_user
}
