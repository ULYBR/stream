# Arquitetura baseada em eventos usando SQS como message broker
# Esta configuração implementa Event-Driven Architecture

# Event Bridge personalizado para eventos de aplicação
resource "aws_cloudwatch_event_bus" "streamhub_events" {
  count = var.localstack_endpoint == "" ? 1 : 0
  name  = "${local.name_prefix}-events"
  tags  = local.common_tags
}

# Regras de eventos para diferentes tipos de eventos
resource "aws_cloudwatch_event_rule" "stream_events" {
  count = var.localstack_endpoint == "" ? 1 : 0
  name  = "${local.name_prefix}-stream-events"

  event_pattern = jsonencode({
    source = ["streamhub.streams"]
    detail-type = [
      "Stream Started",
      "Stream Ended",
      "Stream Updated",
      "Viewer Joined",
      "Viewer Left"
    ]
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_rule" "chat_events" {
  count = var.localstack_endpoint == "" ? 1 : 0
  name  = "${local.name_prefix}-chat-events"

  event_pattern = jsonencode({
    source = ["streamhub.chat"]
    detail-type = [
      "Message Sent",
      "User Joined Chat",
      "User Left Chat",
      "Moderator Action"
    ]
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_rule" "user_events" {
  count = var.localstack_endpoint == "" ? 1 : 0
  name  = "${local.name_prefix}-user-events"

  event_pattern = jsonencode({
    source = ["streamhub.users"]
    detail-type = [
      "User Registered",
      "User Login",
      "Profile Updated",
      "Subscription Changed"
    ]
  })

  tags = local.common_tags
}

# Targets para rotear eventos para SQS (funciona no LocalStack)
resource "aws_cloudwatch_event_target" "stream_events_to_sqs" {
  count     = var.localstack_endpoint == "" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.stream_events[0].name
  target_id = "StreamEventsToSQS"
  arn       = aws_sqs_queue.stream_events.arn
}

resource "aws_cloudwatch_event_target" "chat_events_to_sqs" {
  count     = var.localstack_endpoint == "" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.chat_events[0].name
  target_id = "ChatEventsToSQS"
  arn       = aws_sqs_queue.chat_messages.arn
}

resource "aws_cloudwatch_event_target" "user_events_to_notifications" {
  count     = var.localstack_endpoint == "" ? 1 : 0
  rule      = aws_cloudwatch_event_rule.user_events[0].name
  target_id = "UserEventsToNotifications"
  arn       = aws_sqs_queue.notifications.arn
}

# Lambda functions para processar eventos (substitui SNS no LocalStack)
resource "aws_lambda_function" "event_dispatcher" {
  count         = var.localstack_endpoint != "" ? 1 : 0
  filename      = "event_dispatcher.zip"
  function_name = "${local.name_prefix}-event-dispatcher"
  role          = aws_iam_role.ecs_task.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 30

  environment {
    variables = {
      STREAM_QUEUE_URL       = aws_sqs_queue.stream_events.url
      CHAT_QUEUE_URL         = aws_sqs_queue.chat_messages.url
      NOTIFICATION_QUEUE_URL = aws_sqs_queue.notifications.url
    }
  }

  tags = local.common_tags
}

# Configuração de Dead Letter Queue para eventos falhados
resource "aws_sqs_queue_redrive_policy" "stream_events_redrive" {
  queue_url = aws_sqs_queue.stream_events.url
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue_redrive_policy" "chat_messages_redrive" {
  queue_url = aws_sqs_queue.chat_messages.url
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue_redrive_policy" "notifications_redrive" {
  queue_url = aws_sqs_queue.notifications.url
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}
