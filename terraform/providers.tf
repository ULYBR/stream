provider "random" {}

provider "tls" {}

provider "aws" {
  region = var.aws_region

  dynamic "endpoints" {
    for_each = var.localstack_endpoint != "" ? [1] : []
    content {
      acm                  = "${var.localstack_endpoint}/acm"
      apigateway           = "${var.localstack_endpoint}/apigateway"
      apigatewayv2         = "${var.localstack_endpoint}/apigatewayv2"
      cloudwatch           = "${var.localstack_endpoint}/cloudwatch"
      cloudwatchlogs       = "${var.localstack_endpoint}/cloudwatchlogs"
      dynamodb             = "${var.localstack_endpoint}/dynamodb"
      ec2                  = "${var.localstack_endpoint}/ec2"
      ecs                  = "${var.localstack_endpoint}/ecs"
      ecr                  = "${var.localstack_endpoint}/ecr"
      eks                  = "${var.localstack_endpoint}/eks"
      elasticloadbalancing = "${var.localstack_endpoint}/elasticloadbalancing"
      elbv2                = "${var.localstack_endpoint}/elbv2"
      iam                  = "${var.localstack_endpoint}/iam"
      lambda               = "${var.localstack_endpoint}/lambda"
      logs                 = "${var.localstack_endpoint}/logs"
      route53              = "${var.localstack_endpoint}/route53"
      s3                   = "${var.localstack_endpoint}/s3"
      secretsmanager       = "${var.localstack_endpoint}/secretsmanager"
      sns                  = "${var.localstack_endpoint}/sns"
      sqs                  = "${var.localstack_endpoint}/sqs"
      ssm                  = "${var.localstack_endpoint}/ssm"
      sts                  = "${var.localstack_endpoint}/sts"
    }
  }

  skip_credentials_validation = var.localstack_endpoint != ""
  skip_metadata_api_check     = var.localstack_endpoint != ""
  skip_requesting_account_id  = var.localstack_endpoint != ""

  access_key = var.localstack_endpoint != "" ? "test" : null
  secret_key = var.localstack_endpoint != "" ? "test" : null
}
