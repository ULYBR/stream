resource "aws_sns_topic" "stream_notifications" {
  name         = "${local.name_prefix}-stream-notifications"
  display_name = "StreamHub Stream Notifications"

  tags = merge(local.common_tags, {
    Purpose = "Stream events and notifications"
  })
}

resource "aws_sns_topic" "user_notifications" {
  name         = "${local.name_prefix}-user-notifications"
  display_name = "StreamHub User Notifications"

  tags = merge(local.common_tags, {
    Purpose = "User-specific notifications"
  })
}

resource "aws_sns_topic" "system_alerts" {
  name         = "${local.name_prefix}-system-alerts"
  display_name = "StreamHub System Alerts"

  tags = merge(local.common_tags, {
    Purpose = "System monitoring and alerts"
  })
}

resource "aws_sns_topic_subscription" "stream_notifications_to_sqs" {
  topic_arn = aws_sns_topic.stream_notifications.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.notifications.arn

  filter_policy = jsonencode({
    event_type = ["stream_started", "stream_ended", "stream_updated"]
  })
}

resource "aws_sns_topic_subscription" "user_notifications_to_sqs" {
  topic_arn = aws_sns_topic.user_notifications.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.notifications.arn

  filter_policy = jsonencode({
    event_type = ["user_mentioned", "follow_notification", "message_received"]
  })
}

# SNS Topic policies
resource "aws_sns_topic_policy" "stream_notifications_policy" {
  arn = aws_sns_topic.stream_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eks_node_group.arn
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.stream_notifications.arn
      }
    ]
  })
}

resource "aws_sns_topic_policy" "user_notifications_policy" {
  arn = aws_sns_topic.user_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eks_node_group.arn
        }
        Action = [
          "sns:Publish",
          "sns:GetTopicAttributes",
          "sns:Subscribe",
          "sns:Unsubscribe"
        ]
        Resource = aws_sns_topic.user_notifications.arn
      }
    ]
  })
}

resource "aws_sns_topic_policy" "system_alerts_policy" {
  arn = aws_sns_topic.system_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eks_node_group.arn
        }
        Action = [
          "sns:Publish",
          "sns:GetTopicAttributes"
        ]
        Resource = aws_sns_topic.system_alerts.arn
      }
    ]
  })
}
