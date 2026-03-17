output "public_ip" {
  description = "Public IP address of the Oracle VM"
  value       = oci_core_instance.app.public_ip
}

output "instance_id" {
  description = "OCID of the Oracle VM instance"
  value       = oci_core_instance.app.id
}
