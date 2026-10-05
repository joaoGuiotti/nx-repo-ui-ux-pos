# Proposal

## Why

A feature de CFP (Call for Papers) necessita de validação completa de ponta a ponta (E2E) e conformidade rigorosa com os guardrails de Clean Architecture do monorepo. Embora o fluxo de submissão e os testes unitários do frontend tenham sido implementados, não há suítes E2E cobrindo a jornada real do usuário no frontend (Angular + Playwright) nem testes E2E para os endpoints de API (NestJS + api-e2e). Além disso, os testes unitários do backend precisam atender estritamente ao guardrail de centralização em pasta `__tests__`.

## What Changes

- **API Unit Tests & Guardrail Compliance**:
  - Mover e reestruturar os testes unitários da API para a pasta centralizada `apps/api/src/app/cfp/__tests__/`, separando `cfp.controller.spec.ts` e adicionando testes dedicados para `cfp.service.spec.ts`, garantindo que nenhum `.spec.ts` fique lado a lado com arquivos de implementação.
- **API E2E Tests (`apps/api-e2e`)**:
  - Criar suíte de testes E2E em `apps/api-e2e/src/api/cfp.spec.ts` testando o ciclo de vida completo dos endpoints `POST /api/cfp` e `GET /api/cfp`:
    - Validação de payload correto gerando HTTP 201 e persistência dos dados.
    - Validação de payloads inválidos (e-mail malformado, nome vazio, campos ausentes) retornando HTTP 400 Bad Request detalhado.
- **Frontend E2E Tests (`apps/frontend-e2e`)**:
  - Criar testes E2E com Playwright em `apps/frontend-e2e/src/cfp-submission.spec.ts` cobrindo a jornada completa do palestrante:
    - Estado inicial do formulário (botão de submissão desabilitado).
    - Feedback imediato de acessibilidade e validação WAI-ARIA em tempo real (inputs inválidos, mensagens com `role="alert"`).
    - Habilitação dinâmica do botão ao preencher todos os campos válidos e flag GDE.
    - Submissão com sucesso, exibição de indicador de carregamento e notificação de feedback positivo.
- **Frontend Routing & Integration**:
  - Configurar redirecionamento automático de `/` para `/cfp` em `apps/frontend/src/app/app.routes.ts` para navegação fluida e simplificação dos testes ponta a ponta.

## Capabilities

### New Capabilities
- `cfp-submission`: Cobertura ponta a ponta da submissão de Call for Papers com testes unitários em conformidade estrita com Clean Architecture e testes E2E abrangentes no frontend e na API.

### Modified Capabilities
<!-- Nenhuma capacidade existente teve seus requisitos alterados -->

## Impact

- **Código e Arquitetura**:
  - Centralização de testes em `apps/api/src/app/cfp/__tests__/`.
  - Configuração de rotas em `apps/frontend/src/app/app.routes.ts`.
- **E2E**:
  - Nova especificação E2E em `apps/frontend-e2e/src/cfp-submission.spec.ts`.
  - Nova especificação E2E em `apps/api-e2e/src/api/cfp.spec.ts`.
- **APIs e Contratos**:
  - Nenhuma quebra de contrato de API; o contrato `@cfp-plataform/shared-types` continua sendo a fonte da verdade.
