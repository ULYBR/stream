# StreamHub - DynamoDB IAM Policies

# IAM policy for DynamoDB access
data "aws_iam_policy_document" "dynamodb_policy" {
  # Users table permissions
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [
      aws_dynamodb_table.users.arn,
      "${aws_dynamodb_table.users.arn}/index/*"
    ]
  }

  # Streams table permissions
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [
      aws_dynamodb_table.streams.arn,
      "${aws_dynamodb_table.streams.arn}/index/*"
    ]
  }

  # Chat messages table permissions
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [
      aws_dynamodb_table.chat_messages.arn,
      "${aws_dynamodb_table.chat_messages.arn}/index/*"
    ]
  }

  # User sessions table permissions
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ]
    resources = [
      aws_dynamodb_table.user_sessions.arn,
      "${aws_dynamodb_table.user_sessions.arn}/index/*"
    ]
  }
}

# IAM policy resource
resource "aws_iam_policy" "dynamodb_policy" {
  name        = "${local.name_prefix}-dynamodb-policy"
  description = "IAM policy for DynamoDB access in StreamHub application"
  policy      = data.aws_iam_policy_document.dynamodb_policy.json

  tags = local.common_tags
}

# Read-only DynamoDB policy for monitoring/debugging
data "aws_iam_policy_document" "dynamodb_readonly_policy" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:DescribeTable",
      "dynamodb:ListTables"
    ]
    resources = [
      aws_dynamodb_table.users.arn,
      aws_dynamodb_table.streams.arn,
      aws_dynamodb_table.chat_messages.arn,
      aws_dynamodb_table.user_sessions.arn,
      "${aws_dynamodb_table.users.arn}/index/*",
      "${aws_dynamodb_table.streams.arn}/index/*",
      "${aws_dynamodb_table.chat_messages.arn}/index/*",
      "${aws_dynamodb_table.user_sessions.arn}/index/*"
    ]
  }
}

resource "aws_iam_policy" "dynamodb_readonly_policy" {
  name        = "${local.name_prefix}-dynamodb-readonly-policy"
  description = "Read-only IAM policy for DynamoDB access in StreamHub application"
  policy      = data.aws_iam_policy_document.dynamodb_readonly_policy.json

  tags = local.common_tags
}
