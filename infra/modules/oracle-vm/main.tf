data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_id
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# VCN
resource "oci_core_vcn" "main" {
  compartment_id = var.compartment_id
  cidr_block     = "10.0.0.0/16"
  display_name   = "${var.app_name}-vcn"
  dns_label      = replace(var.app_name, "-", "")
}

# Internet Gateway
resource "oci_core_internet_gateway" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.app_name}-igw"
  enabled        = true
}

# Route Table
resource "oci_core_route_table" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.app_name}-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.main.id
  }
}

# Security List
resource "oci_core_security_list" "main" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "${var.app_name}-sl"

  # Allow all egress
  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }

  # SSH
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"
    tcp_options {
      min = 22
      max = 22
    }
  }

  # HTTP
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 80
      max = 80
    }
  }

  # HTTPS
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Next.js
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 3000
      max = 3000
    }
  }

  # Go API
  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"
    tcp_options {
      min = 8080
      max = 8080
    }
  }
}

# Public Subnet
resource "oci_core_subnet" "public" {
  compartment_id    = var.compartment_id
  vcn_id            = oci_core_vcn.main.id
  cidr_block        = "10.0.1.0/24"
  display_name      = "${var.app_name}-subnet-public"
  dns_label         = "public"
  route_table_id    = oci_core_route_table.main.id
  security_list_ids = [oci_core_security_list.main.id]
}

locals {
  cloud_init = <<-CLOUDINIT
    #!/bin/bash
    set -e

    # Update system
    apt-get update -y
    apt-get upgrade -y

    # Install Docker
    apt-get install -y ca-certificates curl gnupg lsb-release git
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Enable Docker
    systemctl enable docker
    systemctl start docker

    # Clone repo
    git clone https://github.com/jaehunkim/heeang_web.git /opt/heeang
    cd /opt/heeang

    # Write backend .env
    cat > /opt/heeang/backend/.env <<EOF
    PORT=8080
    DATABASE_URL=postgres://postgres:${var.admin_password}@db:5432/heeang?sslmode=disable
    ADMIN_PASSWORD=${var.admin_password}
    ALLOWED_ORIGINS=https://${var.domain_name},http://localhost:3000
    R2_ACCOUNT_ID=${var.r2_account_id}
    R2_ACCESS_KEY=${var.r2_access_key}
    R2_SECRET_KEY=${var.r2_secret_key}
    R2_BUCKET_NAME=${var.r2_bucket_name}
    R2_PUBLIC_URL=${var.r2_public_url}
    STRIPE_SECRET_KEY=${var.stripe_secret_key}
    TOSS_SECRET_KEY=${var.toss_secret_key}
    EOF

    # Write frontend .env
    cat > /opt/heeang/frontend/.env.local <<EOF
    NEXT_PUBLIC_API_URL=https://${var.domain_name}/api
    NEXT_PUBLIC_R2_PUBLIC_URL=${var.r2_public_url}
    EOF

    # Write production docker-compose override
    cat > /opt/heeang/docker-compose.prod.yml <<EOF
    services:
      db:
        image: postgres:16-alpine
        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: ${var.admin_password}
          POSTGRES_DB: heeang
        volumes:
          - pgdata:/var/lib/postgresql/data
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U postgres"]
          interval: 5s
          timeout: 3s
          retries: 5
        restart: always

      api:
        build: ./backend
        ports:
          - "8080:8080"
        env_file:
          - ./backend/.env
        depends_on:
          db:
            condition: service_healthy
        restart: always

      frontend:
        build:
          context: ./frontend
          args:
            NEXT_PUBLIC_API_URL: https://${var.domain_name}/api
        ports:
          - "3000:3000"
        env_file:
          - ./frontend/.env.local
        depends_on:
          - api
        restart: always

    volumes:
      pgdata:
    EOF

    # Start services
    cd /opt/heeang
    docker compose -f docker-compose.prod.yml up -d --build

    echo "Heeang deployment complete"
  CLOUDINIT
}

# ARM VM instance
resource "oci_core_instance" "app" {
  compartment_id      = var.compartment_id
  availability_domain = var.availability_domain
  display_name        = "${var.app_name}-vm"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = var.ocpus
    memory_in_gbs = var.memory_in_gbs
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    assign_public_ip = true
    display_name     = "${var.app_name}-vnic"
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = base64encode(local.cloud_init)
  }

  preserve_boot_volume = false
}
