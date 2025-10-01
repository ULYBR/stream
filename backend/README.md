# Stream Project Ba## 🚀 Quick Start

```bash
cp env.example .env
npm install
npm run dev:full
curl http://localhost:3000/health/status
```NestJS completo para plataforma de streaming ao vivo com chat em tempo real e arquitetura event-driven.

## 🏗️ Arquitetura

### Tecnologias Principais
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem tipada
- **DynamoDB** - Banco de dados NoSQL
- **SQS** - Filas de mensagens para eventos
- **WebSocket** - Chat em tempo real
- **Pino** - Logs estruturados

### Event-Driven Architecture
```
Controller → Service → EventPublisher → SQS → EventProcessor → Database
```

## � Quick Start

```bash
# 1. Configurar variáveis de ambiente
cp env.example .env

# 2. Instalar dependências
npm install

# 3. Iniciar infraestrutura + aplicação
npm run dev:full

# 4. Acessar aplicação
curl http://localhost:3000/health/status
```

## 📋 APIs Disponíveis

### 🏥 Health Check
- `GET /health/status` - Status da aplicação (publica evento de sistema)
- `GET /health/readiness` - Verificação de prontidão

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de usuário

### 👤 User Management (`/api/user`)
- `POST /api/user/avatar` - Upload de avatar
- `POST /api/user` - Criar usuário
- `PUT /api/user/:id` - Atualizar usuário
- `POST /api/user/me` - Get current user profile

#### 📺 Stream Management (`/api/streams`)
- `GET /api/streams` - List all active streams
- `GET /api/streams/:id` - Get stream by ID
- `POST /api/streams` - Create new stream

#### 💬 Real-time Chat (WebSocket)
WebSocket endpoint available at: `ws://localhost:3000`

**Events:**
- `sendMessage` - Send message to live chat
- `joinLive` - Join a live stream room
- `leaveLive` - Leave a live stream room

**Server Events:**
- `newMessage` - New chat message received
- `userJoined` - User joined the live
- `userLeft` - User left the live
- `joinedLive` - Confirmation of joining
- `error` - Error notifications

## 🏗️ Architecture

### Modules Structure
```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── user/           # User management
│   ├── streams/        # Stream management
│   ├── chat/           # Real-time chat (WebSocket)
│   └── health/         # Health checks
├── repository/         # Data access layer
├── providers/          # External service providers
├── types/              # TypeScript types
└── utils/              # Utility functions
```

### Key Features
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **WebSocket Chat** - Real-time messaging with Socket.IO
- ✅ **DynamoDB Integration** - NoSQL database with AWS DynamoDB
- ✅ **Swagger Documentation** - Auto-generated API docs
- ✅ **Logging** - Structured logging with Pino
- ✅ **Validation** - Request validation with class-validator
- ✅ **CORS Enabled** - Cross-origin resource sharing
- ✅ **Health Checks** - Application monitoring endpoints

## 🛠️ Development

### Environment Variables
Copy `env.example` to `.env` and configure:
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB
DYNAMODB_ENDPOINT=http://localhost:8000  
DYNAMODB_TABLE_PREFIX=dev-

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### Scripts
```bash
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Production mode
npm run lint         # ESLint
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
```

## 🐳 Docker

Build and run with Docker:
```bash
docker build -t stream-backend .
docker run --env-file .env -p 3000:3000 stream-backend
```

## 📝 Testing

### Manual Testing with curl

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Create Stream:**
```bash
curl -X POST http://localhost:3000/api/streams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Live Stream","description":"Stream description"}'
```

**Health Check:**
```bash
curl http://localhost:3000/health/status
```

### WebSocket Testing

Use a WebSocket client to connect to `ws://localhost:3000` and send:
```json
{
  "event": "joinLive",
  "data": {
    "liveId": "stream-123",
    "user": "username"
  }
}
```

## 🔧 Extending the Project

### Adding New Modules
1. Create module folder under `src/modules/`
2. Follow the established pattern: `controller/`, `service/`, `dto/`
3. Register module in `app.module.ts`
4. Add Swagger documentation with `@ApiTags()`, `@ApiOperation()`

### Database Schema
The project uses DynamoDB with the following key patterns:
- **Users:** `PK: USER#email, SK: PROFILE#email`
- **Streams:** `PK: STREAM#id, SK: METADATA#id`

## 🚀 Production Deployment

The project is configured for deployment with:
- **Terraform** - Infrastructure as Code
- **AWS Services** - DynamoDB, SQS, SNS
- **Docker** - Containerized deployment

See `/terraform` directory for infrastructure setup.

## 🤝 Contributing

1. Run linting: `npm run lint`
2. Run tests: `npm run test`
3. Follow established patterns for new modules
4. Update documentation for new endpoints


