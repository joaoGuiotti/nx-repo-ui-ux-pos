# ⚡ CFP Platform API (NestJS Hexagonal Architecture)

API REST desenvolvida em **NestJS** seguindo os princípios de **Clean / Hexagonal Architecture**, SOLID e Clean Code.

---

## 🏗️ Arquitetura

O projeto utiliza injeção de dependências estrita, isolamento de domínio e desacoplamento de infraestrutura.

```mermaid
flowchart LR
    Client["Client / Frontend"] --> Controller["CfpController (Presentation)"]
    Controller --> UseCase["CreateSpeakerUseCase / FindAllUseCase (Application)"]
    UseCase --> Port["CfpRepository (Domain Port)"]
    Port <|-- Adapter["CfpInMemoryAdapter (Infrastructure)"]
```

---

## 📂 Estrutura de Pastas (`apps/api/src/app`)

| Camada                | Descrição & Componentes                                                                      |
| :-------------------- | :------------------------------------------------------------------------------------------- |
| **`domain/`**         | Regras de negócio puras (`SpeakerEntity`), VOs e erros de domínio. Sem dependência do Nest.  |
| **`domain/ports/`**   | Interfaces abstratas (`CfpRepository`) que definem o contrato de persistência.               |
| **`application/`**    | Casos de uso (`CreateSpeakerUseCase`, `FindAllSpeakersUseCase`) contendo a orquestração.     |
| **`infrastructure/`** | Adapters concretos (`CfpInMemoryAdapter`) implementando os ports de domínio.                 |
| **`presentation/`**   | Controllers HTTP (`CfpController`), DTOs com validação e Mappers puros.                      |
| **`shared/`**         | Filtros de exceção globais (`DomainErrorFilter`) e erros base reutilizáveis (`DomainError`). |

---

## 🚀 Como Rodar

```bash
# Executar a API localmente (porta 3000 por padrão)
npx nx serve api

# Executar linter
npx nx lint api

# Executar testes unitários e de integração
npx nx test api

# Compilar para produção
npx nx build api
```

---

## 📚 Documentação da API (Swagger)

Com a API em execução, a documentação OpenAPI / Swagger interativa está disponível em:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## 🔄 Substituição da Persistência (In-Memory para Banco Real)

Para alterar a persistência de em memória para um banco de dados real (ex: Prisma, TypeORM, MongoDB), basta criar um novo adapter em `infrastructure/adapters/` estendendo `CfpRepository` e trocar a classe registrada em `cfp.module.ts`: `{ provide: CfpRepository, useClass: CfpDatabaseAdapter }`.
