# Call for Papers (CFP) Platform — Frontend

[![CI & CD (GitHub Pages)](https://github.com/joaoGuiotti/nx-repo-ui-ux-pos/actions/workflows/ci.yml/badge.svg)](https://github.com/joaoGuiotti/nx-repo-ui-ux-pos/actions/workflows/ci.yml)
[![Demo Online](https://img.shields.io/badge/Demo-GitHub%20Pages-indigo)](https://joaoGuiotti.github.io/nx-repo-ui-ux-pos/)

Aplicação frontend moderna em Angular 21+ utilizando Arquitetura Hexagonal, Signals, Tailwind CSS e suíte de testes com Vitest dentro de um monorepo Nx.

> **Demo Online**: [Acesse a demonstração da aplicação](https://joaoGuiotti.github.io/nx-repo-ui-ux-pos/) (Executa sem backend usando o adapter In-Memory).

---

## 📸 Demonstração

<!-- PLACEHOLDER: Adicione aqui uma imagem ou GIF da aplicação em execução -->

![Demonstração da Aplicação](https://via.placeholder.com/800x450.png?text=CFP+Platform+Angular+UI)

---

## 🛠️ Tech Stack

- **Framework**: Angular 21+ (Standalone Components, Signals, Built-in Control Flow `@if`)
- **Monorepo & Tooling**: Nx Monorepo 23+, TypeScript (Strict Mode), ESLint (`no-restricted-imports`)
- **Estilização**: Tailwind CSS v3, Lucide Icons (`@lucide/angular`)
- **Testes**: Vitest (via `@angular/build:unit-test` nativo) com relatórios de cobertura v8 (~88% de cobertura)
- **CI/CD**: GitHub Actions + GitHub Pages Deployment

---

## 🏛️ Arquitetura Hexagonal & Fluxo de Dados

A feature `cfp` foi estruturada em 4 camadas bem delimitadas, garantindo isolamento de regras de negócio e acoplamento fraco:

```mermaid
graph TD
    subgraph Presentation [Camada de Apresentação]
        Container["Smart Container (CfpFormPageComponent)"]
        Presenter["Dumb Presenter (CfpFormComponent)"]
    end

    subgraph Application [Camada de Aplicação]
        Facade["CfpFacade"]
        Store["CfpSignalStore (Angular Signals)"]
    end

    subgraph Domain [Camada de Domínio (Pura)]
        Port["CfpRepository (Abstract Class Port)"]
        Entity["Speaker Entity & Value Types"]
    end

    subgraph Infrastructure [Camada de Infraestrutura]
        HttpAdapter["CfpHttpAdapter (HttpClient)"]
        InMemoryAdapter["CfpInMemoryAdapter (Demo Offline)"]
        Mapper["CfpMapper (DTO ↔ Domain)"]
    end

    Presenter -->|Events / Inputs| Container
    Container -->|Injects ONLY| Facade
    Facade -->|Reads / Updates| Store
    Facade -->|Calls Port| Port
    Port <|-- HttpAdapter
    Port <|-- InMemoryAdapter
    HttpAdapter -->|Uses| Mapper
```

### 📁 Estrutura de Pastas

| Camada             | Pasta                    | Responsabilidade                                                                                    |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------------------------- |
| **Domain**         | `app/cfp/domain`         | Entidades puras (`Speaker`), Value Objects e Ports (`CfpRepository`). Zero dependências do Angular. |
| **Application**    | `app/cfp/application`    | Orquestração de estado (`CfpSignalStore` com Signals) e ponto de entrada da UI (`CfpFacade`).       |
| **Infrastructure** | `app/cfp/infrastructure` | Adapters concretos (`CfpHttpAdapter`, `CfpInMemoryAdapter`) e Mappers DTO ↔ Domínio.                |
| **Presentation**   | `app/cfp/presentation`   | Containers inteligentes e Presenters burros (100% visuais, A11y WCAG 2.2 AA).                       |

---

## 💡 Decisões de Design

- **Por que Arquitetura Hexagonal?** Garante testabilidade isolada e substituição transparente de tecnologias (ex.: trocar HTTP por In-Memory sem alterar a UI ou o Domínio).
- **Por que Facade & Signals?** A Facade é a única interface exposta aos componentes. O estado é reativo e previsível usando Angular Signals (`signal`, `computed`), eliminando vazamentos de observables na UI.
- **Por que Adapter In-Memory no Demo de Produção?** Permite que a demonstração no GitHub Pages rode de forma 100% autônoma e interativa sem dependência de um servidor backend ativo.

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm ci

# Executar a aplicação frontend (desenvolvimento local com proxy API)
npx nx serve frontend

# Executar a suíte de testes com cobertura (Vitest)
npx nx test frontend

# Executar verificação de linting e regras de fronteira de camadas
npx nx lint frontend

# Build de produção (com adapter In-Memory configurado)
npx nx build frontend --configuration=production
```
