# Enable required APIs
resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_project_service" "artifactregistry" {
  service = "artifactregistry.googleapis.com"
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "api" {
  location      = var.region
  repository_id = "${var.app_name}-api"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}

# Cloud Run service
resource "google_cloud_run_v2_service" "api" {
  name     = "${var.app_name}-api"
  location = var.region

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.api.repository_id}/api:latest"

      ports {
        container_port = 8080
      }

      env {
        name  = "DATABASE_URL"
        value = var.database_url
      }
      env {
        name  = "ADMIN_PASSWORD"
        value = var.admin_password
      }
      env {
        name  = "ALLOWED_ORIGIN"
        value = var.allowed_origin
      }
      env {
        name  = "R2_ACCOUNT_ID"
        value = var.r2_account_id
      }
      env {
        name  = "R2_ACCESS_KEY_ID"
        value = var.r2_access_key
      }
      env {
        name  = "R2_SECRET_KEY"
        value = var.r2_secret_key
      }
      env {
        name  = "R2_BUCKET_NAME"
        value = var.r2_bucket_name
      }
      env {
        name  = "R2_PUBLIC_URL"
        value = var.r2_public_url
      }
      env {
        name  = "STRIPE_SECRET_KEY"
        value = var.stripe_secret_key
      }
      env {
        name  = "TOSS_SECRET_KEY"
        value = var.toss_secret_key
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
  }

  depends_on = [google_project_service.run]
}

# Allow unauthenticated access
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = google_cloud_run_v2_service.api.project
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
