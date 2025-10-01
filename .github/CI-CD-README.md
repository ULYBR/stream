# StreamHub CI/CD Pipeline Documentation

## Overview
Este projeto utiliza um sistema de CI/CD completo para monorepo, com pipelines separadas para backend, frontend e infraestrutura.

## Estrutura dos Workflows

### 1. Backend Pipelines
- **`backend-ci.yml`**: Lint, testes, build e security scan
- **`backend-deploy.yml`**: Deploy para desenvolvimento (LocalStack) e produção

### 2. Frontend Pipelines
- **`frontend-ci.yml`**: Lint, testes, build e Lighthouse audit
- **`frontend-deploy.yml`**: Deploy para desenvolvimento (LocalStack S3) e produção

### 3. Infrastructure Pipeline
- **`terraform-ci.yml`**: Validação, plan e apply do Terraform no LocalStack

### 4. Orchestration
- **`full-stack-ci.yml`**: Orquestra todos os pipelines baseado em mudanças detectadas
- **`local-development.yml`**: Setup completo para desenvolvimento local

## Triggers dos Workflows

### Push para branches
- `main`: Executa CI e deploy para desenvolvimento
- `develop`: Executa apenas CI
- `feature/*`: Executa apenas CI

### Tags
- `backend-v*`: Deploy de produção do backend
- `frontend-v*`: Deploy de produção do frontend

### Pull Requests
- Executa CI para validação

## Path-based Triggers

Os workflows são acionados apenas quando arquivos relevantes são modificados:

- **Backend**: `backend/**`
- **Frontend**: `front-end/**`
- **Infrastructure**: `terraform/**`

## Ambientes

### Development (LocalStack)
- Backend: Lambda + API Gateway
- Frontend: S3 Static Website
- Database: DynamoDB
- Messaging: SQS + SNS

### Production (AWS Real)
- Configurado via secrets do GitHub
- Deploy manual via tags

## Secrets Necessários

Configure os seguintes secrets no GitHub:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

## Como Usar

### 1. Desenvolvimento Local
```bash
# Executar workflow manual
gh workflow run local-development.yml
```

### 2. Deploy para Desenvolvimento
```bash
# Push para main
git push origin main
```

### 3. Deploy para Produção
```bash
# Backend
git tag backend-v1.0.0
git push origin backend-v1.0.0

# Frontend
git tag frontend-v1.0.0
git push origin frontend-v1.0.0
```

## Monitoramento

- ✅ Health checks automáticos
- 🔍 Security scanning
- 📊 Lighthouse performance audit
- 🧪 Integration tests
- 📈 Test coverage reports

## Troubleshooting

### LocalStack não inicia
- Verifique se as portas 4566-4569 estão livres
- Aguarde o health check antes de prosseguir

### Testes falhando
- Verifique se todas as dependências estão instaladas
- Confirme se os serviços estão rodando

### Deploy falha
- Verifique se os secrets estão configurados
- Confirme se as permissões AWS estão corretas