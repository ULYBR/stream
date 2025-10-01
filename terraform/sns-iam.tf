data "aws_iam_policy_document" "sns_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sns:Publish",
      "sns:Subscribe",
      "sns:Unsubscribe",
      "sns:GetTopicAttributes",
      "sns:SetTopicAttributes",
      "sns:ListSubscriptions",
      "sns:ListSubscriptionsByTopic"
    ]
    resources = [
      aws_sns_topic.stream_notifications.arn,
      aws_sns_topic.user_notifications.arn,
      aws_sns_topic.system_alerts.arn
    ]
  }
}

resource "aws_iam_policy" "sns_policy" {
  name        = "${local.name_prefix}-sns-policy"
  description = "IAM policy for SNS topic access"
  policy      = data.aws_iam_policy_document.sns_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "sns_publish_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sns:Publish",
      "sns:GetTopicAttributes"
    ]
    resources = [
      aws_sns_topic.stream_notifications.arn,
      aws_sns_topic.user_notifications.arn,
      aws_sns_topic.system_alerts.arn
    ]
  }
}

resource "aws_iam_policy" "sns_publish_policy" {
  name        = "${local.name_prefix}-sns-publish-policy"
  description = "Publish-only IAM policy for SNS topics"
  policy      = data.aws_iam_policy_document.sns_publish_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "sns_readonly_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sns:GetTopicAttributes",
      "sns:ListTopics",
      "sns:ListSubscriptions",
      "sns:ListSubscriptionsByTopic"
    ]
    resources = [
      aws_sns_topic.stream_notifications.arn,
      aws_sns_topic.user_notifications.arn,
      aws_sns_topic.system_alerts.arn
    ]
  }
}

resource "aws_iam_policy" "sns_readonly_policy" {
  name        = "${local.name_prefix}-sns-readonly-policy"
  description = "Read-only IAM policy for SNS monitoring"
  policy      = data.aws_iam_policy_document.sns_readonly_policy.json

  tags = local.common_tags
}