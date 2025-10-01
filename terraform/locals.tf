locals {
  environment = var.environment
  region      = var.aws_region
  project_name = var.project_name
  name_prefix  = "${var.project_name}-${var.environment}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Repository  = "streamhub"
      Team        = "Platform"
      CreatedAt   = formatdate("YYYY-MM-DD", timestamp())
    },
    var.additional_tags
  )

  is_localstack = var.localstack_endpoint != ""

  environment_config = {
    dev = {
      lambda_memory_size = 256
      lambda_timeout     = 30
      log_retention_days = 7
      enable_encryption  = false
      enable_backup      = false
      cors_origins       = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
    }
    staging = {
      lambda_memory_size = 512
      lambda_timeout     = 60
      log_retention_days = 30
      enable_encryption  = true
      enable_backup      = true
      cors_origins       = ["https://staging.streamhub.com"]
    }
    prod = {
      lambda_memory_size = 1024
      lambda_timeout     = 300
      log_retention_days = 90
      enable_encryption  = true
      enable_backup      = true
      cors_origins       = ["https://streamhub.com", "https://app.streamhub.com"]
    }
  }

  current_config = local.environment_config[var.environment]
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}