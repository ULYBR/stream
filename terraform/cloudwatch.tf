# CloudWatch Log Groups para todos os serviços
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${local.name_prefix}-backend"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "Backend API"
  })
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/cloudfront/${local.name_prefix}-frontend"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "Frontend App"
  })
}

resource "aws_cloudwatch_log_group" "chat_service" {
  name              = "/aws/lambda/${local.name_prefix}-chat-service"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "Chat WebSocket Handler"
  })
}

resource "aws_cloudwatch_log_group" "stream_service" {
  name              = "/aws/lambda/${local.name_prefix}-stream-service"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "Stream Event Handler"
  })
}

resource "aws_cloudwatch_log_group" "notification_service" {
  name              = "/aws/lambda/${local.name_prefix}-notification-service"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "Notification Handler"
  })
}

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${local.name_prefix}-api"
  retention_in_days = 7
  tags = merge(local.common_tags, {
    Service = "API Gateway"
  })
}

# CloudWatch Alarms para monitoramento
resource "aws_cloudwatch_metric_alarm" "backend_high_error_rate" {
  alarm_name          = "${local.name_prefix}-backend-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4XXError"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors backend 4XX errors"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.system_alerts.arn]
  tags          = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high" {
  alarm_name          = "${local.name_prefix}-ecs-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS CPU utilization"

  dimensions = {
    ServiceName = aws_ecs_service.backend.name
    ClusterName = aws_ecs_cluster.main.name
  }

  alarm_actions = [aws_sns_topic.system_alerts.arn]
  tags          = local.common_tags
}
