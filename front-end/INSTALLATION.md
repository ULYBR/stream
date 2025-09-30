# 📥 Guia de Instalação - StreamHub Frontend

Este documento explica como baixar, instalar e executar o frontend do StreamHub.

---

## 🎯 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 ou superior ([Download](https://nodejs.org/))
- **npm** (vem com Node.js) ou **yarn**
- **Git** ([Download](https://git-scm.com/))

### Verificar instalação

```bash
node --version  # Deve mostrar v18 ou superior
npm --version   # Deve mostrar 9 ou superior
git --version   # Qualquer versão recente
```

---

## 📦 PASSO 1: Clonar o Repositório

### Via GitHub (se você já criou um repositório)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/streamhub-frontend.git

# Entre na pasta do projeto
cd streamhub-frontend
```

### Baixar como ZIP (alternativa)

1. Acesse o repositório no GitHub
2. Clique em **"Code"** → **"Download ZIP"**
3. Extraia o arquivo ZIP
4. Abra o terminal na pasta extraída

---

## ⚙️ PASSO 2: Instalar Dependências

```bash
# Usando npm (recomendado)
npm install

# OU usando yarn
yarn install
```

Isso vai instalar todas as bibliotecas necessárias:
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- E outras dependências...

⏱️ **Tempo estimado:** 2-5 minutos (dependendo da internet)

---

## 🔧 PASSO 3: Configurar Variáveis de Ambiente

### 3.1 Criar arquivo de configuração

```bash
# Copiar o arquivo de exemplo
cp .env.example .env.local

# OU criar manualmente
touch .env.local
```

### 3.2 Editar `.env.local`

Abra o arquivo `.env.local` com seu editor favorito e configure:

```env
# URL da API do Backend
VITE_API_URL=http://localhost:3000

# URL do WebSocket (Chat)
VITE_WS_URL=ws://localhost:3000

# Ambiente
VITE_ENV=development
```

⚠️ **IMPORTANTE:**
- Essas URLs devem apontar para o seu backend quando ele estiver rodando
- Para desenvolvimento local, use `http://localhost:3000`
- Para produção, altere para a URL real da sua API

---

## 🚀 PASSO 4: Executar o Projeto

### 4.1 Modo Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:8080**

Você verá algo assim no terminal:

```
  VITE v5.x.x  ready in 450 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4.2 Acessar o Aplicativo

Abra seu navegador em:
```
http://localhost:8080
```

Você será direcionado para a página de login/cadastro (`/auth`)

---

## 🧪 PASSO 5: Testar Funcionalidades

### 5.1 Login/Cadastro (Mock)

Como o backend ainda não está pronto, a autenticação funciona com dados **mock** (simulados):

1. Acesse `/auth`
2. Preencha qualquer email e senha
3. Clique em "Entrar" ou "Criar conta"
4. Você será redirecionado para o Dashboard

### 5.2 Dashboard

- Visualize streams mockadas
- Use a barra de busca
- Clique em uma stream para visualizar

### 5.3 Stream View

- Visualize o player (mockado)
- Veja o chat ao vivo (estrutura pronta)
- Envie mensagens de teste

---

## 🔗 PASSO 6: Integrar com Backend

### Quando o backend estiver pronto:

#### 6.1 Atualizar `.env.local`

```env
VITE_API_URL=http://localhost:3000        # URL do seu backend
VITE_WS_URL=ws://localhost:3000           # WebSocket do backend
```

#### 6.2 Remover código mock (opcional)

Os arquivos já estão preparados com **comentários TODO** indicando onde integrar:

**`src/pages/Auth.tsx`** (linha ~20)
```typescript
// TODO: Integrar com API de login
// POST /api/auth/login
// Body: { email, password }
// Response: { token, user }
```

**`src/pages/Dashboard.tsx`** (linha ~35)
```typescript
// TODO: Integrar com API de streams
// GET /api/streams?status=live
// Headers: { Authorization: Bearer ${token} }
```

**`src/pages/StreamView.tsx`** (linha ~50)
```typescript
// TODO: Conectar ao WebSocket para chat
// WebSocket: wss://api.example.com/ws/streams/:streamId/chat
```

#### 6.3 Criar serviço de API

Crie `src/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default api;
```

Use no componente:
```typescript
import api from '@/services/api';

const response = await api.get('/api/streams?status=live');
```

---

## 📋 Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verifica erros de código |
| `npm run type-check` | Verifica erros TypeScript |

---

## 🐛 Solução de Problemas

### Erro: "Port 8080 already in use"

```bash
# Matar processo na porta 8080
# macOS/Linux:
lsof -ti:8080 | xargs kill -9

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "Permission denied"

```bash
# macOS/Linux - usar sudo
sudo npm install -g npm@latest

# Ou mudar permissões
sudo chown -R $(whoami) ~/.npm
```

### Build muito lento

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Estrutura de Pastas

```
streamhub-frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   └── ui/         # Componentes shadcn/ui
│   ├── pages/          # Páginas da aplicação
│   │   ├── Auth.tsx         # ✅ Login/Cadastro
│   │   ├── Dashboard.tsx    # ✅ Lista de streams
│   │   ├── StreamView.tsx   # ✅ Player + Chat
│   │   └── NotFound.tsx     # ✅ Página 404
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilitários
│   ├── App.tsx         # Componente raiz
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── .env.local          # ⚙️ Configuração (VOCÊ CRIA)
├── package.json        # Dependências
└── vite.config.ts      # Configuração Vite
```

---

## 🎨 Customização

### Alterar cores do tema

Edite `src/index.css`:

```css
:root {
  --primary: 262 83% 58%;      /* Roxo principal */
  --secondary: 217 91% 60%;    /* Azul */
  --accent: 328 86% 70%;       /* Rosa */
}
```

### Alterar porta do servidor

Edite `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001, // Sua porta customizada
  },
});
```

---

## 🚢 Deploy em Produção

### Build de Produção

```bash
npm run build
```

Arquivos otimizados estarão em `dist/`

### Deploy Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy Manual (Nginx)

1. Faça o build: `npm run build`
2. Copie a pasta `dist/` para o servidor
3. Configure Nginx:

```nginx
server {
  listen 80;
  server_name seu-dominio.com;
  root /var/www/streamhub/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 📞 Precisa de Ajuda?

### Documentação Completa

- 📚 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints do backend
- 🚀 [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) - Guia do backend
- 📖 [README.md](./README.md) - Visão geral do projeto

### Links Úteis

- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## ✅ Checklist Rápido

- [ ] Node.js 18+ instalado
- [ ] Repositório clonado
- [ ] `npm install` executado com sucesso
- [ ] `.env.local` criado e configurado
- [ ] `npm run dev` rodando sem erros
- [ ] Aplicativo acessível em http://localhost:8080
- [ ] Página de login carregando corretamente
- [ ] Dashboard com streams mockadas funcionando

---

**🎉 Pronto! Seu frontend está rodando!**

Agora você pode começar a desenvolver o backend seguindo o guia em [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
