# CFP Platform — Nx Monorepo Portfolio

[![CI](https://github.com/joaoGuiotti/nx-repo-ui-ux-pos/actions/workflows/ci.yml/badge.svg)](https://github.com/joaoGuiotti/nx-repo-ui-ux-pos/actions/workflows/ci.yml)
[![Demo Online](https://img.shields.io/badge/Demo-GitHub%20Pages-indigo)](https://joaoGuiotti.github.io/nx-repo-ui-ux-pos/)

Monorepo Nx contendo a plataforma **Call for Papers (CFP)**, composta por um frontend em Angular 21+ com Arquitetura Hexagonal e uma API em NestJS.

---

## 📦 Estrutura do Workspace

```text
nx-repo-ui-ux-pos/
├── apps/
│   ├── frontend/         # Aplicação Frontend em Angular 21+ (Signals, Tailwind, Vitest)
│   └── api/              # API Backend em NestJS (Clean/Hexagonal Architecture)
└── libs/
    └── shared-types/     # Contratos DTO compartilhados entre frontend e api
```

### 🔗 Documentação das Aplicações

- 🎨 **[Frontend Documentation (Angular)](file:///c:/DEV/github/nx-repo-ui-ux-pos/apps/frontend/README.md)**: Detalhes da arquitetura hexagonal, estado reativo com Signals, suíte de testes com Vitest e acessibilidade.
- ⚙️ **[API (NestJS)](apps/api)**: Endpoints REST (`POST /api/cfp`, `GET /api/cfp`, `GET /api/health`) e validação via `class-validator`.

---

## 🔄 CI/CD & Pipeline Automático

O repositório utiliza **GitHub Actions** com workflows modulares e filtragem de alteração por aplicação:

```mermaid
flowchart TD
    A["Trigger: PR ou Push na main"] --> B["ci.yml: Lint, Test & Build (Frontend & API)"]
    B --> C{"Push na main & CI Verde?"}
    C -->|Não (PR)| D["Fim (CI Concluído)"]
    C -->|Sim| E{"Quais apps mudaram?"}
    E -->|apps/frontend alterado| F["deploy-frontend.yml: Deploy para GitHub Pages"]
    E -->|apps/api alterado| G["deploy-api.yml: Trigger Deploy Hook no Render"]
```

- **CI (`ci.yml`)**: Executa lint, teste unitário e build das duas aplicações.
- **Deploy Frontend (`deploy-frontend.yml`)**: Compila a versão de produção com base-href para GitHub Pages quando `apps/frontend` sofrer alteração.
- **Deploy API (`deploy-api.yml`)**: Dispara o Deploy Hook no Render quando `apps/api` sofrer alteração.

---

## 🚀 Como Executar o Monorepo

### Pré-requisitos

- **Node.js**: v20+
- **npm**: v10+

### Scripts do `package.json`

```bash
# Instalar dependências do workspace
npm ci

# Executar ambos Frontend e API simultaneamente
npm start

# Executar apenas o Frontend (http://localhost:4200 com proxy para a API)
npm run ui

# Executar apenas a API NestJS (http://localhost:3000)
npm run api

# Executar testes unitários do frontend
npm run test:ui

# Executar build de produção do frontend
npm run build:ui
```

### Comandos com Nx CLI

```bash
# Executar lint em todos os projetos
npx nx run-many -t lint

# Executar testes em todos os projetos
npx nx run-many -t test

# Executar build em todos os projetos
npx nx run-many -t build

# Visualizar o gráfico de dependências do monorepo
npx nx graph
```

---

## 🛠️ Tecnologias Principais

- **Monorepo**: Nx 23+
- **Frontend**: Angular 21+, Signals, Tailwind CSS v3, Lucide Icons, Vitest
- **Backend**: NestJS 11+, TypeScript Strict
- **CI/CD**: GitHub Actions + GitHub Pages + Render
