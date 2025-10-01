resource "aws_sqs_queue" "stream_events" {
  name                       = "${local.name_prefix}-stream-events"
  visibility_timeout_seconds = var.sqs_visibility_timeout_seconds
  message_retention_seconds  = var.sqs_message_retention_seconds
  max_message_size          = 262144 
  delay_seconds             = 0
  receive_wait_time_seconds = 0

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.sqs_max_receive_count
  })

  tags = merge(local.common_tags, {
    Purpose = "Stream events processing"
  })
}

resource "aws_sqs_queue" "chat_messages" {
  name                       = "${local.name_prefix}-chat-messages"
  visibility_timeout_seconds = var.sqs_visibility_timeout_seconds
  message_retention_seconds  = var.sqs_message_retention_seconds
  max_message_size          = 262144 
  delay_seconds             = 0
  receive_wait_time_seconds = 0

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.sqs_max_receive_count
  })

  tags = merge(local.common_tags, {
    Purpose = "Chat messages processing"
  })
}

resource "aws_sqs_queue" "notifications" {
  name                       = "${local.name_prefix}-notifications"
  visibility_timeout_seconds = var.sqs_visibility_timeout_seconds
  message_retention_seconds  = var.sqs_message_retention_seconds
  max_message_size          = 262144 
  delay_seconds             = 0
  receive_wait_time_seconds = 0

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.sqs_max_receive_count
  })

  tags = merge(local.common_tags, {
    Purpose = "User notifications processing"
  })
}

resource "aws_sqs_queue" "dlq" {
  name                      = "${local.name_prefix}-dead-letter-queue"
  message_retention_seconds = 1209600  # 14 days
  max_message_size         = 262144   

  tags = merge(local.common_tags, {
    Purpose = "Dead letter queue for failed messages"
  })
}

resource "aws_sqs_queue_policy" "stream_events_policy" {
  queue_url = aws_sqs_queue.stream_events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eks_node_group.arn
        }
        Action   = "sqs:*"
        Resource = aws_sqs_queue.stream_events.arn
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "chat_messages_policy" {
  queue_url = aws_sqs_queue.chat_messages.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eks_node_group.arn
        }
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.chat_messages.arn
      }
    ]
  })
}

# Note: Lambda event source mappings removed as we're using EKS instead of Lambda