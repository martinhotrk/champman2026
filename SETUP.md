# 🏆 CHAMP MAN 2026 - Setup Guide

Bem-vindo ao **Champ Man 2026**! Um jogo de gerenciamento de futebol estilo Championship Manager com o Brasileirão Série A 2026.

## 📋 Requisitos

- **Node.js** 18+ (baixe em https://nodejs.org)
- **pnpm** (instale com `npm install -g pnpm`)
- **MySQL** 8.0+ (ou use Railway - recomendado)
- **Git** (opcional, para versionamento)

## 🚀 Instalação Local (Desenvolvimento)

### 1. Instalar Dependências

```bash
cd champman2026
pnpm install
```

### 2. Configurar Banco de Dados

**Opção A: Usar Railway (Recomendado - Mais Fácil)**

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Provision MySQL"
4. Railway vai gerar uma `DATABASE_URL`
5. Copie a URL

**Opção B: MySQL Local**

Se tiver MySQL instalado localmente:

```bash
mysql -u root -p
CREATE DATABASE champman2026;
```

Sua `DATABASE_URL` será:
```
mysql://root:senha@localhost:3306/champman2026
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://usuario:senha@host:3306/champman2026

# JWT Secret (gere um aleatório)
JWT_SECRET=seu_secret_super_seguro_aqui

# OAuth (deixe como está para desenvolvimento local)
VITE_APP_ID=local-dev
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im

# Outros
NODE_ENV=development
```

### 4. Criar as Tabelas do Banco

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 5. Popular o Banco com Dados

```bash
node server/seed.mjs
```

Isso vai inserir:
- ✅ 20 clubes do Brasileirão 2026
- ✅ 200+ jogadores reais
- ✅ 50 jogadores internacionais (wonderkids)

### 6. Rodar o Servidor

```bash
pnpm dev
```

Acesse: http://localhost:5173

## 🎮 Como Jogar

1. **Selecione um Clube** - Clique em qualquer um dos 20 clubes
2. **Comece a Temporada** - Você terá um orçamento inicial de €10 milhões
3. **Gerencie seu Elenco** - Veja os jogadores, atributos e posições
4. **Simule Partidas** - Jogue as rodadas do Brasileirão
5. **Mercado de Transferências** - Compre/venda jogadores internacionais

## 📊 Estrutura do Projeto

```
champman2026/
├── client/                 # Frontend (React + Tailwind)
│   ├── src/
│   │   ├── pages/         # Páginas do jogo
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/           # Utilitários
│   └── index.html
├── server/                # Backend (Express + tRPC)
│   ├── routers/           # tRPC procedures
│   ├── db.ts              # Database helpers
│   ├── matchSimulator.ts  # Lógica de simulação
│   └── seed.mjs           # Script de seed
├── drizzle/               # Schema do banco de dados
└── package.json
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Compila para produção
pnpm start            # Roda a versão compilada

# Banco de dados
pnpm drizzle-kit generate   # Gera migrations
pnpm drizzle-kit migrate    # Aplica migrations

# Testes
pnpm test             # Roda testes unitários
pnpm check            # Verifica tipos TypeScript

# Linting
pnpm format           # Formata código
```

## 🌐 Deploy no Railway

### 1. Conectar Repositório GitHub

1. Faça push do código para GitHub
2. Acesse https://railway.app
3. Clique em "New Project"
4. Selecione "Deploy from GitHub"
5. Conecte sua conta e selecione o repositório

### 2. Configurar Variáveis de Ambiente

No painel do Railway, adicione:

```
DATABASE_URL=mysql://...  (Railway fornece)
JWT_SECRET=seu_secret_aleatorio
NODE_ENV=production
VITE_APP_ID=champman-2026
```

### 3. Deploy Automático

Railway faz deploy automático a cada push no GitHub!

## 🐛 Troubleshooting

### "Database connection failed"
- Verifique se a `DATABASE_URL` está correta
- Teste a conexão: `mysql -u usuario -p -h host -D database`

### "Port already in use"
- Mude a porta em `server/_core/index.ts`
- Ou mate o processo: `lsof -i :3000`

### "Module not found"
- Rode `pnpm install` novamente
- Delete `node_modules` e `pnpm-lock.yaml`, depois instale

## 📚 Documentação Adicional

- **tRPC**: https://trpc.io
- **Drizzle ORM**: https://orm.drizzle.team
- **Tailwind CSS**: https://tailwindcss.com
- **React**: https://react.dev

## 🎯 Funcionalidades Implementadas

- ✅ Seleção de clube
- ✅ Simulador de partidas com narrativa
- ✅ Sistema de temporada (38 rodadas)
- ✅ Tabela de classificação
- ✅ Mercado de transferências
- ✅ Gerenciamento de elenco
- ✅ Atributos de jogadores (pace, shooting, passing, dribbling, defense, physical)

## 🚧 Em Desenvolvimento

- Dashboard do clube (visão geral)
- Tela de elenco (escalação, dispensa)
- Tela de táticas e formação
- Avatares IA de jogadores
- Sistema de treinamento

## 💬 Suporte

Se tiver dúvidas, abra uma issue no GitHub ou me contacte!

---

**Bom jogo! ⚽**
