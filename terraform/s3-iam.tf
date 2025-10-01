data "aws_iam_policy_document" "s3_frontend_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = [
      aws_s3_bucket.frontend.arn,
      "${aws_s3_bucket.frontend.arn}/*"
    ]
  }
}

resource "aws_iam_policy" "s3_frontend_policy" {
  name        = "${local.name_prefix}-s3-frontend-policy"
  description = "IAM policy for S3 frontend bucket access"
  policy      = data.aws_iam_policy_document.s3_frontend_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "s3_uploads_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetObjectVersion",
      "s3:DeleteObjectVersion"
    ]
    resources = [
      aws_s3_bucket.uploads.arn,
      "${aws_s3_bucket.uploads.arn}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:GetBucketVersioning",
      "s3:ListBucketVersions"
    ]
    resources = [aws_s3_bucket.uploads.arn]
  }
}

resource "aws_iam_policy" "s3_uploads_policy" {
  name        = "${local.name_prefix}-s3-uploads-policy"
  description = "IAM policy for S3 uploads bucket access"
  policy      = data.aws_iam_policy_document.s3_uploads_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "s3_backups_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetObjectVersion",
      "s3:RestoreObject"
    ]
    resources = [
      aws_s3_bucket.backups.arn,
      "${aws_s3_bucket.backups.arn}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:GetBucketVersioning",
      "s3:ListBucketVersions"
    ]
    resources = [aws_s3_bucket.backups.arn]
  }
}

resource "aws_iam_policy" "s3_backups_policy" {
  name        = "${local.name_prefix}-s3-backups-policy"
  description = "IAM policy for S3 backups bucket access"
  policy      = data.aws_iam_policy_document.s3_backups_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "s3_full_access_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetObjectVersion",
      "s3:DeleteObjectVersion",
      "s3:RestoreObject"
    ]
    resources = [
      aws_s3_bucket.frontend.arn,
      "${aws_s3_bucket.frontend.arn}/*",
      aws_s3_bucket.uploads.arn,
      "${aws_s3_bucket.uploads.arn}/*",
      aws_s3_bucket.backups.arn,
      "${aws_s3_bucket.backups.arn}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:GetBucketLocation",
      "s3:GetBucketVersioning",
      "s3:ListBucketVersions"
    ]
    resources = [
      aws_s3_bucket.frontend.arn,
      aws_s3_bucket.uploads.arn,
      aws_s3_bucket.backups.arn
    ]
  }
}

resource "aws_iam_policy" "s3_full_access_policy" {
  name        = "${local.name_prefix}-s3-full-access-policy"
  description = "IAM policy for full S3 access across all StreamHub buckets"
  policy      = data.aws_iam_policy_document.s3_full_access_policy.json

  tags = local.common_tags
}
