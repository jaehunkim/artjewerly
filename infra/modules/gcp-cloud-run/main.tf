locals {
  service_name = "${var.app_name}-api"
  base_labels = {
    app         = var.app_name
    managed_by  = "terraform"
    environment = var.environment
  }
  labels = merge(var.labels, local.base_labels)
}

# Enable required APIs
resource "google_project_service" "run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "api" {
  location      = var.region
  repository_id = local.service_name
  format        = "DOCKER"
  labels        = local.labels

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [google_project_service.artifactregistry]
}

# Cloud Run service
resource "google_cloud_run_v2_service" "api" {
  name     = local.service_name
  location = var.region
  labels   = local.labels

  template {
    labels = local.labels

    scaling {
      min_instance_count = var.min_instance_count
      max_instance_count = var.max_instance_count
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.api.repository_id}/api:latest"

      ports {
        container_port = var.container_port
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
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
      }
    }
  }

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [template[0].containers[0].image]
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
