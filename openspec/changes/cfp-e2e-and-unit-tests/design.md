# Design

## Context

A feature de Call for Papers (CFP) está implementada tanto no frontend Angular quanto na API NestJS, utilizando o contrato `@cfp-plataform/shared-types`. No entanto:
- Os testes unitários da API residem lado a lado com o controller (`apps/api/src/app/cfp/cfp.controller.spec.ts`), violando o Guardrail 1 de Clean Architecture (`Centralização Estrita de Testes (__tests__)`).
- Não existem testes unitários dedicados para a camada de aplicação da API (`CfpService`).
- Não existem testes de ponta a ponta (E2E) para a API em `apps/api-e2e`.
- Não existem testes de ponta a ponta (E2E) com Playwright para o formulário e fluxo de submissão em `apps/frontend-e2e`.
- A rota raiz `/` no frontend não direciona o usuário para `/cfp`, dificultando testes e usabilidade direta.

## Goals / Non-Goals

**Goals:**
- Centralizar todos os testes unitários do backend na estrutura `apps/api/src/app/cfp/__tests__/` (dividido em `presentation/` e `application/`), removendo qualquer `.spec.ts` solto.
- Implementar suíte de testes unitários abrangente para `CfpService` cobrindo adição com ID autogerado e listagem.
- Implementar suíte de testes E2E para a API em `apps/api-e2e/src/api/cfp.spec.ts` validando cenários HTTP 201 (sucesso), HTTP 400 (rejeição de payloads inválidos) e HTTP 200 (listagem).
- Implementar testes E2E com Playwright em `apps/frontend-e2e/src/cfp-submission.spec.ts` cobrindo o ciclo completo do formulário: validações, semântica WAI-ARIA (`role="alert"`, `aria-invalid`), preenchimento, submissão, estado de loading (`aria-busy`) e notificação de sucesso.
- Configurar redirecionamento padrão `{ path: '', redirectTo: 'cfp', pathMatch: 'full' }` no roteador do frontend.

**Non-Goals:**
- Implementar banco de dados externo ou persistência relacional (o armazenamento em memória atual do serviço é mantido).
- Alterar o contrato existente `@cfp-plataform/shared-types`.
- Adicionar fluxos de autenticação ou perfis de usuário externos nesta fase.

## Decisions

### Decisão 1: Conformidade com o Guardrail 1 de Testes Unitários na API
- **Escolha**: Mover `apps/api/src/app/cfp/cfp.controller.spec.ts` para `apps/api/src/app/cfp/__tests__/presentation/cfp.controller.spec.ts` e criar `apps/api/src/app/cfp/__tests__/application/cfp.service.spec.ts`.
- **Racional**: As diretrizes arquiteturais do projeto exigem categoricamente que nenhum arquivo `.spec.ts` conviva lado a lado com a implementação e que testes fiquem centralizados em `__tests__/`.
- **Alternativas consideradas**: Manter o arquivo de teste no mesmo diretório do controller. Rejeitado por violação direta das regras anti-alucinação e arquitetura do monorepo.

### Decisão 2: Testes E2E do Frontend com Playwright baseados em Semântica A11y
- **Escolha**: Utilizar os seletores semânticos e de acessibilidade do Playwright (`getByRole`, `getByLabel`, `getByText`) no arquivo `apps/frontend-e2e/src/cfp-submission.spec.ts`.
- **Racional**: Testa a aplicação da mesma forma que os usuários e tecnologias assistivas a consomem, validando em tempo real se os atributos WAI-ARIA (`aria-invalid`, `aria-describedby`, `role="alert"`) refletem o estado dos Signals.
- **Alternativas consideradas**: Seletores baseados em classes CSS arbitrárias ou IDs. Rejeitado por fragilidade e menor garantia de conformidade com acessibilidade.

### Decisão 3: Testes E2E da API em `apps/api-e2e` com Axios
- **Escolha**: Criar `apps/api-e2e/src/api/cfp.spec.ts` utilizando a instância configurada do Axios para efetuar chamadas HTTP reais aos endpoints `POST /api/cfp` e `GET /api/cfp`.
- **Racional**: `apps/api-e2e` já possui a infraestrutura base configurada com Axios e Jest; a implementação segue o padrão nativo do monorepo para testes de integração/E2E de endpoints.
- **Alternativas consideradas**: Supertest interno em memória. Rejeitado para preservar o padrão já existente no projeto `api-e2e`.

### Decisão 4: Redirecionamento da Rota Raiz no Frontend
- **Escolha**: Adicionar `{ path: '', redirectTo: 'cfp', pathMatch: 'full' }` em `apps/frontend/src/app/app.routes.ts`.
- **Racional**: Evita que o usuário ou runner E2E encontre uma página em branco ao acessar `/`, direcionando diretamente para a experiência da feature.

## Risks / Trade-offs

- **[Risco] Dependência de servidores ativos para execução E2E**:
  - *Mitigação*: O `playwright.config.mts` já possui configuração para iniciar automaticamente o servidor web (`nx serve frontend`). Para a API E2E, assegurar comandos padronizados no `nx.json` / scripts de teste integrados.
- **[Risco] Desalinhamento de porta padrão da API entre dev e E2E**:
  - *Mitigação*: Utilizar a variável `process.env['PORT'] || 3000` e baseURL consistente no Axios.
