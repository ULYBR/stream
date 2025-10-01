data "aws_iam_policy_document" "sqs_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl",
      "sqs:ChangeMessageVisibility",
      "sqs:PurgeQueue"
    ]
    resources = [
      aws_sqs_queue.stream_events.arn,
      aws_sqs_queue.chat_messages.arn,
      aws_sqs_queue.notifications.arn,
      aws_sqs_queue.dlq.arn
    ]
  }
}

resource "aws_iam_policy" "sqs_policy" {
  name        = "${local.name_prefix}-sqs-policy"
  description = "IAM policy for SQS queue access"
  policy      = data.aws_iam_policy_document.sqs_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "sqs_readonly_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl",
      "sqs:ListQueues"
    ]
    resources = [
      aws_sqs_queue.stream_events.arn,
      aws_sqs_queue.chat_messages.arn,
      aws_sqs_queue.notifications.arn,
      aws_sqs_queue.dlq.arn
    ]
  }
}

resource "aws_iam_policy" "sqs_readonly_policy" {
  name        = "${local.name_prefix}-sqs-readonly-policy"
  description = "Read-only IAM policy for SQS monitoring"
  policy      = data.aws_iam_policy_document.sqs_readonly_policy.json

  tags = local.common_tags
}
