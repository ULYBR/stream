output "eks_cluster" {
  description = "EKS cluster information"
  value = {
    name                          = aws_eks_cluster.main.name
    arn                          = aws_eks_cluster.main.arn
    endpoint                     = aws_eks_cluster.main.endpoint
    version                      = aws_eks_cluster.main.version
    platform_version             = aws_eks_cluster.main.platform_version
    cluster_security_group_id    = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
    oidc_issuer_url             = aws_eks_cluster.main.identity[0].oidc[0].issuer
  }
}

output "ecr_repositories" {
  description = "ECR repository URLs"
  value = {
    backend = {
      name = aws_ecr_repository.backend.name
      url  = aws_ecr_repository.backend.repository_url
      arn  = aws_ecr_repository.backend.arn
    }
    frontend = {
      name = aws_ecr_repository.frontend.name
      url  = aws_ecr_repository.frontend.repository_url
      arn  = aws_ecr_repository.frontend.arn
    }
  }
}

output "load_balancer" {
  description = "Application Load Balancer information"
  value = {
    dns_name    = aws_lb.main.dns_name
    zone_id     = aws_lb.main.zone_id
    arn         = aws_lb.main.arn
    hosted_zone = aws_lb.main.zone_id
    backend_target_group_arn  = aws_lb_target_group.backend.arn
    frontend_target_group_arn = aws_lb_target_group.frontend.arn
  }
}

output "dynamodb_tables" {
  description = "DynamoDB table names and ARNs"
  value = {
    users = {
      name = aws_dynamodb_table.users.name
      arn  = aws_dynamodb_table.users.arn
    }
    streams = {
      name = aws_dynamodb_table.streams.name
      arn  = aws_dynamodb_table.streams.arn
    }
    chat_messages = {
      name = aws_dynamodb_table.chat_messages.name
      arn  = aws_dynamodb_table.chat_messages.arn
    }
    user_sessions = {
      name = aws_dynamodb_table.user_sessions.name
      arn  = aws_dynamodb_table.user_sessions.arn
    }
  }
}

output "s3_buckets" {
  description = "S3 bucket names and domains"
  value = {
    frontend = {
      name   = aws_s3_bucket.frontend.bucket
      domain = aws_s3_bucket.frontend.bucket_domain_name
      arn    = aws_s3_bucket.frontend.arn
    }
    uploads = {
      name   = aws_s3_bucket.uploads.bucket
      domain = aws_s3_bucket.uploads.bucket_domain_name
      arn    = aws_s3_bucket.uploads.arn
    }
    backups = {
      name   = aws_s3_bucket.backups.bucket
      domain = aws_s3_bucket.backups.bucket_domain_name
      arn    = aws_s3_bucket.backups.arn
    }
  }
}

# SQS Queue outputs
output "sqs_queues" {
  description = "SQS queue URLs and ARNs"
  value = {
    stream_events = {
      url = aws_sqs_queue.stream_events.url
      arn = aws_sqs_queue.stream_events.arn
    }
    chat_messages = {
      url = aws_sqs_queue.chat_messages.url
      arn = aws_sqs_queue.chat_messages.arn
    }
    notifications = {
      url = aws_sqs_queue.notifications.url
      arn = aws_sqs_queue.notifications.arn
    }
    dlq = {
      url = aws_sqs_queue.dlq.url
      arn = aws_sqs_queue.dlq.arn
    }
  }
}

output "sns_topics" {
  description = "SNS topic ARNs"
  value = {
    stream_notifications = aws_sns_topic.stream_notifications.arn
    user_notifications   = aws_sns_topic.user_notifications.arn
    system_alerts       = aws_sns_topic.system_alerts.arn
  }
}

output "secrets" {
  description = "Secrets Manager secret ARNs"
  value = {
    jwt_secret = aws_secretsmanager_secret.jwt_secret.arn
  }
  sensitive = true
}

output "iam_roles" {
  description = "IAM role ARNs"
  value = {
    eks_cluster_role      = aws_iam_role.eks_cluster.arn
    eks_node_group_role   = aws_iam_role.eks_node_group.arn
    eks_service_account_role = aws_iam_role.eks_service_account.arn
  }
}

output "environment_info" {
  description = "Environment configuration information"
  value = {
    project_name      = var.project_name
    environment       = var.environment
    aws_region        = var.aws_region
    is_localstack     = local.is_localstack
    name_prefix       = local.name_prefix
    domain_name       = var.domain_name
    load_balancer_dns = aws_lb.main.dns_name
    eks_cluster_name  = aws_eks_cluster.main.name
    eks_endpoint      = aws_eks_cluster.main.endpoint
  }
}