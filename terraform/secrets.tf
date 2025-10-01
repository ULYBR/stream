resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${local.name_prefix}-jwt-secret"
  description = "JWT secret key for StreamHub authentication"

  tags = merge(local.common_tags, {
    Purpose = "JWT authentication secret"
  })
}

resource "random_password" "jwt_secret" {
  length  = var.jwt_secret_length
  special = true
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = jsonencode({
    secret = random_password.jwt_secret.result
  })
}