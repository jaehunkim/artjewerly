resource "neon_project" "main" {
  name      = var.app_name
  region_id = "aws-ap-northeast-2"

  default_endpoint_settings {
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 0.25
  }
}

resource "neon_database" "main" {
  project_id = neon_project.main.id
  branch_id  = neon_project.main.default_branch_id
  name       = "heeang"
  owner_name = neon_project.main.database_user
}
