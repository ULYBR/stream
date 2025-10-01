#!/bin/bash

# Script para configurar infraestrutura completa no LocalStack Pro
# Inclui EKS e todos os recursos - demora mais mas é completo

echo "🚀 Configurando infraestrutura COMPLETA no LocalStack Pro..."

# Verificar se LocalStack está rodando
echo "📡 Verificando LocalStack..."
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
    echo "❌ LocalStack não está rodando!"
    echo "💡 Inicie o LocalStack com: localstack start -d"
    exit 1
fi

echo "✅ LocalStack está rodando!"

# Verificar edição do LocalStack
EDITION=$(curl -s http://localhost:4566/_localstack/health | grep -o '"edition":"[^"]*"' | cut -d'"' -f4)
echo "📋 LocalStack Edition: $EDITION"

if [ "$EDITION" = "community" ]; then
    echo "⚠️  ATENÇÃO: LocalStack Community detected"
    echo "   EKS pode não funcionar adequadamente"
    echo "   Continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar se terraform está instalado
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform não está instalado!"
    exit 1
fi

# Navegar para terraform
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../../terraform"
cd "$TERRAFORM_DIR"

echo "🏗️ Inicializando Terraform..."
terraform init

echo "📦 Aplicando infraestrutura completa..."
echo "⏱️  ATENÇÃO: EKS demora ~3-5 minutos mesmo no LocalStack Pro"
echo "   Isso é normal - aguarde..."

terraform apply \
  -var='environment=dev' \
  -var='localstack_endpoint=http://localhost:4566' \
  -auto-approve

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Infraestrutura COMPLETA configurada com sucesso!"
    echo ""
    echo "📋 Recursos criados no LocalStack Pro:"
    echo "  🗄️  Tabelas DynamoDB"
    echo "  🪣  Buckets S3"
    echo "  📨  Filas SQS"
    echo "  📢  Tópicos SNS"
    echo "  🏗️  Cluster EKS"
    echo "  📦  Repositórios ECR"
    echo "  ⚖️  Load Balancer"
    echo ""
    echo "🎉 Backend está pronto para desenvolvimento completo!"
    echo "   Execute: npm run start:dev"
else
    echo "❌ Erro ao configurar infraestrutura"
    echo "💡 Tente: terraform destroy && terraform apply"
    exit 1
fi