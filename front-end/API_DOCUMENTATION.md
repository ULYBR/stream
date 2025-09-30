# 📚 Documentação de APIs - StreamHub Frontend

## 🔐 Autenticação

Todas as requisições autenticadas devem incluir o header:
```
Authorization: Bearer {token}
```

---

## 1. Autenticação

### 1.1 Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "user@example.com",
    "avatar": "https://cdn.example.com/avatars/user.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "message": "Email ou senha incorretos"
}
```

---

### 1.2 Registro
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "user@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "User already exists",
  "message": "Este email já está cadastrado"
}
```

---

### 1.3 Verificar Token
**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "user@example.com"
  }
}
```

---

## 2. Streams

### 2.1 Listar Streams ao Vivo
**Endpoint:** `GET /api/streams?status=live&category={category}&limit={limit}&offset={offset}`

**Query Parameters:**
- `status` (optional): "live" | "offline" | "all" (default: "live")
- `category` (optional): string - Filtrar por categoria
- `limit` (optional): number - Número de resultados (default: 20)
- `offset` (optional): number - Paginação (default: 0)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "streams": [
    {
      "id": "uuid-v4",
      "title": "Desenvolvimento Full Stack - Node.js + React",
      "streamerName": "DevMaster",
      "streamerAvatar": "https://cdn.example.com/avatars/devmaster.jpg",
      "thumbnailUrl": "https://cdn.example.com/thumbnails/stream1.jpg",
      "streamUrl": "https://stream.example.com/live/stream1/playlist.m3u8",
      "viewersCount": 1234,
      "category": "Technology",
      "description": "Live de programação focada em arquitetura full stack",
      "isLive": true,
      "startedAt": "2024-01-01T10:00:00Z",
      "tags": ["nodejs", "react", "typescript"]
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### 2.2 Obter Detalhes de uma Stream
**Endpoint:** `GET /api/streams/:streamId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "stream": {
    "id": "uuid-v4",
    "title": "Desenvolvimento Full Stack - Node.js + React",
    "streamerName": "DevMaster",
    "streamerId": "uuid-streamer",
    "streamerAvatar": "https://cdn.example.com/avatars/devmaster.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumbnails/stream1.jpg",
    "streamUrl": "https://stream.example.com/live/stream1/playlist.m3u8",
    "viewersCount": 1234,
    "category": "Technology",
    "description": "Live de programação focada em arquitetura full stack",
    "isLive": true,
    "startedAt": "2024-01-01T10:00:00Z",
    "tags": ["nodejs", "react", "typescript"],
    "chatEnabled": true
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Stream not found",
  "message": "Stream não encontrada"
}
```

---

### 2.3 Buscar Streams
**Endpoint:** `GET /api/streams/search?q={query}&category={category}`

**Query Parameters:**
- `q` (required): string - Termo de busca
- `category` (optional): string - Filtrar por categoria

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "streams": [
    {
      "id": "uuid-v4",
      "title": "Node.js Tutorial",
      "streamerName": "DevMaster",
      "thumbnailUrl": "...",
      "viewersCount": 1234,
      "isLive": true
    }
  ],
  "total": 5
}
```

---

## 3. Chat (WebSocket)

### 3.1 Conectar ao Chat
**WebSocket URL:** `wss://api.example.com/ws/streams/:streamId/chat`

**Connection Headers:**
```
Authorization: Bearer {token}
```

---

### 3.2 Eventos Recebidos (Server → Client)

#### Mensagem de Chat
```json
{
  "type": "message",
  "data": {
    "id": "msg-uuid",
    "userId": "user-uuid",
    "userName": "João Silva",
    "userAvatar": "https://cdn.example.com/avatars/user.jpg",
    "message": "Olá pessoal!",
    "timestamp": "2024-01-01T10:30:00Z"
  }
}
```

#### Visualizador Entrou
```json
{
  "type": "viewer_joined",
  "data": {
    "userName": "Maria Santos",
    "count": 1235
  }
}
```

#### Visualizador Saiu
```json
{
  "type": "viewer_left",
  "data": {
    "userName": "Pedro Costa",
    "count": 1234
  }
}
```

#### Atualização de Visualizadores
```json
{
  "type": "viewers_update",
  "data": {
    "count": 1240
  }
}
```

#### Stream Finalizada
```json
{
  "type": "stream_ended",
  "data": {
    "message": "A stream foi finalizada pelo streamer"
  }
}
```

---

### 3.3 Eventos Enviados (Client → Server)

#### Enviar Mensagem
```json
{
  "type": "send_message",
  "message": "Mensagem do usuário"
}
```

#### Heartbeat (Keep-Alive)
```json
{
  "type": "ping"
}
```

**Response:**
```json
{
  "type": "pong"
}
```

---

## 4. Usuários

### 4.1 Obter Perfil do Usuário
**Endpoint:** `GET /api/users/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "user@example.com",
    "avatar": "https://cdn.example.com/avatars/user.jpg",
    "bio": "Desenvolvedor Full Stack",
    "createdAt": "2024-01-01T00:00:00Z",
    "followersCount": 150,
    "followingCount": 75
  }
}
```

---

### 4.2 Atualizar Perfil
**Endpoint:** `PATCH /api/users/me`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "João Silva Jr.",
  "bio": "Senior Full Stack Developer",
  "avatar": "https://cdn.example.com/avatars/new-avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-v4",
    "name": "João Silva Jr.",
    "email": "user@example.com",
    "avatar": "https://cdn.example.com/avatars/new-avatar.jpg",
    "bio": "Senior Full Stack Developer",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

## 5. Categorias

### 5.1 Listar Categorias
**Endpoint:** `GET /api/categories`

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "uuid-v4",
      "name": "Technology",
      "slug": "technology",
      "icon": "💻",
      "streamsCount": 145
    },
    {
      "id": "uuid-v5",
      "name": "Backend",
      "slug": "backend",
      "icon": "⚙️",
      "streamsCount": 89
    }
  ]
}
```

---

## 6. Estatísticas

### 6.1 Estatísticas da Stream
**Endpoint:** `GET /api/streams/:streamId/stats`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "stats": {
    "currentViewers": 1234,
    "peakViewers": 2150,
    "averageViewers": 980,
    "totalMessages": 5432,
    "duration": 7200,
    "likes": 543
  }
}
```

---

## 📊 Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: usuário já existe)
- `500 Internal Server Error` - Erro no servidor

---

## 🔧 Observabilidade / Telemetria

### Headers Recomendados

Incluir em todas as requisições para rastreamento:

```
X-Request-ID: uuid-v4
X-Client-Version: 1.0.0
X-Platform: web
```

### Logs Estruturados

O backend deve retornar `X-Request-ID` no response para correlação de logs.

---

## 🚀 Exemplos de Integração

### Axios (React)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de uso
const getStreams = async () => {
  const response = await api.get('/api/streams?status=live');
  return response.data;
};
```

### WebSocket (Chat)

```typescript
const connectToChat = (streamId: string, token: string) => {
  const ws = new WebSocket(
    `wss://api.example.com/ws/streams/${streamId}/chat`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  ws.onopen = () => {
    console.log('Connected to chat');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'message':
        handleNewMessage(data.data);
        break;
      case 'viewer_joined':
        updateViewerCount(data.data.count);
        break;
      // ... outros casos
    }
  };

  return ws;
};
```

---

## 📝 Notas Importantes

1. **Rate Limiting:** API limita a 100 requisições por minuto por usuário
2. **Token Expiration:** Tokens JWT expiram em 24 horas
3. **WebSocket Timeout:** Conexões WebSocket sem atividade são fechadas após 5 minutos
4. **CORS:** Frontend deve estar na whitelist do backend
5. **Compression:** Habilitar gzip para otimizar transferência de dados

---

## 🔄 Versionamento

API Version: `v1`

Para versões futuras, usar header:
```
Accept: application/vnd.streamhub.v2+json
```
