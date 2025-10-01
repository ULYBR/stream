variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "streamhub"
}

variable "localstack_endpoint" {
  description = "LocalStack endpoint for local development (empty for AWS)"
  type        = string
  default     = ""
}

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode"
  type        = string
  default     = "PAY_PER_REQUEST"
  
  validation {
    condition     = contains(["PAY_PER_REQUEST", "PROVISIONED"], var.dynamodb_billing_mode)
    error_message = "Billing mode must be PAY_PER_REQUEST or PROVISIONED."
  }
}

variable "dynamodb_read_capacity" {
  description = "DynamoDB read capacity units (for PROVISIONED billing)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "DynamoDB write capacity units (for PROVISIONED billing)"
  type        = number
  default     = 5
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs20.x"
}

variable "api_gateway_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "dev"
}

variable "enable_api_gateway_logging" {
  description = "Enable API Gateway CloudWatch logging"
  type        = bool
  default     = true
}

variable "sqs_visibility_timeout_seconds" {
  description = "SQS message visibility timeout"
  type        = number
  default     = 300
}

variable "sqs_message_retention_seconds" {
  description = "SQS message retention period"
  type        = number
  default     = 1209600
}

variable "sqs_max_receive_count" {
  description = "SQS max receive count for DLQ"
  type        = number
  default     = 3
}

variable "jwt_secret_length" {
  description = "Length of the JWT secret"
  type        = number
  default     = 32
}

variable "enable_lambda_function_urls" {
  description = "Enable Lambda Function URLs for direct HTTP access"
  type        = bool
  default     = false
}

variable "enable_websocket_api" {
  description = "Enable WebSocket API Gateway"
  type        = bool
  default     = true
}

# EKS Variables
variable "kubernetes_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 4
}

variable "node_min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "vpc_cni_version" {
  description = "Version of VPC CNI addon"
  type        = string
  default     = "v1.15.1-eksbuild.1"
}

variable "coredns_version" {
  description = "Version of CoreDNS addon"
  type        = string
  default     = "v1.10.1-eksbuild.4"
}

variable "kube_proxy_version" {
  description = "Version of kube-proxy addon"
  type        = string
  default     = "v1.28.2-eksbuild.2"
}

variable "ebs_csi_version" {
  description = "Version of EBS CSI driver addon"
  type        = string
  default     = "v1.24.0-eksbuild.1"
}

variable "app_namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  default     = "streamhub"
}

variable "app_name" {
  description = "Application name for Kubernetes resources"
  type        = string
  default     = "streamhub"
}

# Domain and SSL Variables
variable "domain_name" {
  description = "Domain name for the application (optional for LocalStack)"
  type        = string
  default     = "localhost.localstack.cloud"
}