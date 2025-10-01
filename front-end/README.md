# 🎥 StreamHub - Frontend

Interface moderna para plataforma de streaming ao vivo com chat em tempo real, desenvolvida com **React**, **TypeScript** e **shadcn/ui**.

## � Tecnologias

### Core
- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática  
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Styling utilitário
- **shadcn/ui** - Componentes modernos

### Integração
- **Axios** - Cliente HTTP
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

## ⚡ Instalação Rápida

```bash
npm install
cp .env.example .env.local
# Configure: VITE_API_URL=http://localhost:3000
npm run dev
```

✅ Aplicativo rodando em: **http://localhost:5173**

## � Páginas Implementadas

### ✅ Funcionais
- **Auth** (`/auth`) - Login e registro de usuários
- **Dashboard** (`/`) - Visão geral das streams
- **StreamView** (`/:id`) - Visualização de streams individuais
- **NotFound** (`/404`) - Página de erro 404

### � Em Desenvolvimento  
- Chat em tempo real (WebSocket)
- Criação de streams
- Upload de mídia
- Perfil do usuário

## 🎨 Componentes UI (shadcn/ui)

### Implementados
- Button, Input, Label
- Card, Avatar, Badge
- Dialog, Alert, Tabs
- Form components
- Navigation components

### Design System
- Sistema de cores consistente
- Tipografia responsiva
- Dark/Light mode ready
- Componentes acessíveis
- **React Router** - Roteamento SPA

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Componentes reutilizáveis e acessíveis
- **Lucide React** - Ícones modernos
- **Sonner** - Toast notifications elegantes

### Estado e Dados
- **TanStack Query (React Query)** - Gerenciamento de estado assíncrono
- **WebSocket** - Comunicação em tempo real para chat

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

---

## 📁 Estrutura do Projeto

```
streamhub-frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── ui/            # Componentes shadcn/ui
│   ├── pages/             # Páginas/rotas da aplicação
│   │   ├── Auth.tsx       # ✅ Login e Registro
│   │   ├── Dashboard.tsx  # ✅ Lista de streams ao vivo
│   │   ├── StreamView.tsx # ✅ Player + Chat em tempo real
│   │   └── NotFound.tsx   # Página 404
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e configurações
│   ├── App.tsx            # Componente raiz
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais + Design System
├── public/                # Arquivos estáticos
├── .env.example           # Exemplo de variáveis de ambiente
├── INSTALLATION.md        # 📥 Guia de instalação
├── BACKEND_GUIDE.md       # 🚀 Guia do backend
├── API_DOCUMENTATION.md   # 📡 Documentação da API
└── package.json
```

---

## 🎨 Design System

O projeto utiliza um **design system customizado** baseado em tokens semânticos no Tailwind CSS.

### Paleta de Cores

```css
/* Primary - Roxo vibrante (streaming/tech) */
--primary: 262 83% 58%

/* Secondary - Azul elétrico (interatividade) */
--secondary: 217 91% 60%

/* Accent - Rosa (destaque/live) */
--accent: 328 86% 70%

/* Background - Escuro (conforto visual) */
--background: 222.2 47% 11%
```

### Componentes Customizados

```tsx
// Glass Effect
<div className="glass-effect">...</div>

// Gradient Text
<h1 className="gradient-text">StreamHub</h1>

// Live Badge (animado)
<span className="live-badge">AO VIVO</span>
```

---

## 🔐 Autenticação

### Fluxo de Login/Registro

1. Usuário acessa `/auth`
2. Preenche credenciais (email + senha)
3. Frontend envia `POST /api/auth/login` ou `POST /api/auth/register`
4. Backend retorna JWT token + dados do usuário
5. Token é armazenado no `localStorage`
6. Usuário é redirecionado para o dashboard

**Atualmente:** Funciona com dados mock para desenvolvimento sem backend

---

## 📡 Integração com Backend

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login de usuário |
| POST | `/api/auth/register` | Cadastro de usuário |
| GET | `/api/streams?status=live` | Lista de streams ao vivo |
| GET | `/api/streams/:id` | Detalhes de uma stream |
| WS | `/ws/streams/:id/chat` | Chat em tempo real |

📚 **Documentação completa:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Como Integrar

Os componentes já possuem comentários `TODO` indicando onde integrar:

```typescript
// TODO: Integrar com API de login
// POST /api/auth/login
// Body: { email, password }
// Response: { token, user: { id, name, email, avatar } }
```

**Exemplo de integração:**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Login
const response = await api.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// Armazenar token
localStorage.setItem('token', response.data.token);
```

---

## 💬 Chat em Tempo Real (WebSocket)

### Estrutura Pronta

O frontend já possui toda a estrutura para chat via WebSocket:

**Eventos que o frontend espera receber:**
- `message` - Nova mensagem no chat
- `viewer_joined` - Usuário entrou na stream
- `viewer_left` - Usuário saiu da stream
- `viewers_update` - Atualização de contador

**Eventos que o frontend envia:**
- `join_stream` - Entrar em uma stream
- `send_message` - Enviar mensagem

**Exemplo:**
```typescript
const ws = new WebSocket('ws://localhost:3000/ws/streams/stream-id/chat');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Processar mensagem
};
```

---

## 📋 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificar erros de código |

---

## 🧪 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Página de login e cadastro
- [x] Validação de formulários
- [x] Armazenamento de token JWT
- [x] Proteção de rotas
- [x] Logout

### ✅ Dashboard
- [x] Lista de streams ao vivo
- [x] Grid responsivo
- [x] Busca de streams
- [x] Filtros por categoria
- [x] Badges "AO VIVO" animadas
- [x] Contador de visualizadores

### ✅ Visualização de Stream
- [x] Interface de player (pronta para integração)
- [x] Chat em tempo real (estrutura completa)
- [x] Envio de mensagens
- [x] Scroll automático do chat
- [x] Informações da stream

### ✅ Design
- [x] Design system customizado
- [x] Totalmente responsivo (mobile/tablet/desktop)
- [x] Tema escuro moderno
- [x] Animações e transições suaves
- [x] Glass effects e gradientes

---

## 🛡️ Segurança

### Práticas Implementadas

- ✅ Validação de inputs
- ✅ Sanitização de dados
- ✅ XSS Protection (React escapa por padrão)
- ✅ Tokens JWT com expiração
- ✅ Headers de segurança
- ✅ HTTPS obrigatório em produção

---

## 📱 Responsividade

| Breakpoint | Tamanho |
|------------|---------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

Todos os componentes são **mobile-first** e completamente responsivos.

---

## 🚢 Deploy

### Build de Produção

```bash
npm run build
```

Arquivos otimizados em `dist/`

### Plataformas Recomendadas

- **Vercel** (Recomendado) - Deploy automático via Git
- **Netlify** - Suporte a SPA e redirects
- **AWS S3 + CloudFront** - Escalável

**Vercel (mais fácil):**
```bash
npm i -g vercel
vercel --prod
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

**Padrão de commits:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎯 Roadmap

### ✅ Implementado
- [x] Sistema de autenticação
- [x] Dashboard de streams
- [x] Visualização de stream
- [x] Chat em tempo real (estrutura)
- [x] Design system completo
- [x] Responsividade total

### 🔜 Próximos Passos
- [ ] Sistema de notificações
- [ ] Perfil de usuário editável
- [ ] Sistema de follows/seguidores
- [ ] Histórico de streams
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Modo claro/escuro toggle

---

## 📞 Suporte

### Documentação

- 📥 [INSTALLATION.md](./INSTALLATION.md) - Como instalar e executar
- 🚀 [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) - Guia completo do backend
- 📡 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints e WebSocket

### Links Úteis

- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👥 Stack Completo

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + NestJS (ver [BACKEND_GUIDE.md](./BACKEND_GUIDE.md))
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Mensageria:** Kafka/SQS
- **Infraestrutura:** AWS Lambda + ECS
- **Observabilidade:** OpenTelemetry + Jaeger

---

# Documentação do Frontend

## Visão Geral
Este projeto é uma plataforma de streaming ao vivo, construída em React, com autenticação JWT, listagem de streams, visualização de stream e chat em tempo real.

---

## Funcionalidades

### 1. Autenticação
- Login e cadastro de usuários.
- Endpoints esperados:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- Resposta esperada:
  - `{ token, user: { id, name, email, avatar } }`
- Armazena token JWT e dados do usuário no localStorage.

### 2. Dashboard
- Listagem de streams ao vivo.
- Busca por streams.
- Endpoints esperados:
  - `GET /api/streams?status=live`
- Resposta esperada:
  - `{ streams: Stream[] }`

### 3. Visualização de Stream
- Exibe detalhes da stream selecionada.
- Chat em tempo real via WebSocket.
- Endpoints esperados:
  - `GET /api/streams/:streamId`
  - WebSocket: `wss://api.example.com/ws/streams/:streamId/chat`
- Resposta esperada:
  - `{ stream: StreamData }`
  - Eventos WebSocket: mensagens, entrada de espectadores, etc.

---

## Principais Entidades

- **Usuário**: `{ id, name, email, avatar }`
- **Stream**: `{ id, title, streamerName, streamerAvatar, thumbnailUrl, viewersCount, category, isLive }`
- **StreamData**: `{ id, title, streamerName, streamerAvatar, streamUrl, viewersCount, category, description }`
- **ChatMessage**: `{ id, userId, userName, userAvatar, message, timestamp }`

---

## Requisitos Técnicos

- Autenticação JWT
- Comunicação RESTful e WebSocket
- Feedback via toast
- Suporte a dispositivos móveis

---

## Instalação

Consulte o arquivo INSTALLATION.md para instruções detalhadas de instalação e execução do projeto.

---

## Próximos Passos

- Detalhar endpoints e payloads para o backend.
- Mapear integrações e fluxos para infraestrutura.
- Garantir documentação e testes completos.

---

**Feito com ❤️ usando React + TypeScript + Tailwind CSS**

🚀 **Comece agora:** [INSTALLATION.md](./INSTALLATION.md)
