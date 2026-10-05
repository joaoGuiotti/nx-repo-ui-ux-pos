# Tasks

## 1. Adequação Arquitetural e Testes Unitários da API

- [x] 1.1 Mover `apps/api/src/app/cfp/cfp.controller.spec.ts` para `apps/api/src/app/cfp/__tests__/presentation/cfp.controller.spec.ts` e verificar que a importação de caminhos e a execução via `npx nx test api` continuam passando.
- [x] 1.2 Implementar testes unitários para o serviço em `apps/api/src/app/cfp/__tests__/application/cfp.service.spec.ts` cobrindo criação com ID autogerado e listagem, verificando aprovação com `npx nx test api`.
- [x] 1.3 Assegurar remoção definitiva de arquivos `.spec.ts` soltos fora de `__tests__` na feature CFP da API para conformidade estrita com o Guardrail 1 da arquitetura.

## 2. Testes E2E da API (`apps/api-e2e`)

- [x] 2.1 Criar a suíte de testes E2E em `apps/api-e2e/src/api/cfp.spec.ts` utilizando Axios para validar requisições válidas `POST /api/cfp` (retornando HTTP 201 e dados persistidos) e `GET /api/cfp` (retornando HTTP 200).
- [x] 2.2 Adicionar cenários de teste E2E em `apps/api-e2e/src/api/cfp.spec.ts` para validação de erros de payload (HTTP 400 Bad Request ao omitir campos obrigatórios ou enviar e-mail inválido).
- [x] 2.3 Executar a suíte de testes do projeto `api-e2e` (`npx nx run api-e2e:e2e`) e validar que todos os cenários passam.

## 3. Roteamento e Suporte E2E no Frontend

- [x] 3.1 Configurar redirecionamento da rota raiz `{ path: '', redirectTo: 'cfp', pathMatch: 'full' }` em `apps/frontend/src/app/app.routes.ts` e verificar navegação para `/cfp`.
- [x] 3.2 Criar suíte de testes E2E com Playwright em `apps/frontend-e2e/src/cfp-submission.spec.ts` cobrindo o estado inicial da página, inputs vazios e botão desabilitado.
- [x] 3.3 Adicionar cenários E2E com Playwright em `apps/frontend-e2e/src/cfp-submission.spec.ts` testando validações de formulário inline, atributos WAI-ARIA (`aria-invalid="true"`, `role="alert"`) ao perder foco (blur) em campos com dados inválidos.
- [x] 3.4 Adicionar cenários E2E com Playwright em `apps/frontend-e2e/src/cfp-submission.spec.ts` cobrindo preenchimento completo, habilitação do botão, envio, feedback de submissão (`aria-busy`, notificação de sucesso) e persistência do fluxo.
- [x] 3.5 Executar a suíte de testes Playwright (`npx nx run frontend-e2e:e2e`) e verificar que todos os testes E2E de CFP são executados com sucesso.

## 4. Validação Geral e Integração Ponta a Ponta

- [x] 4.1 Executar a suíte completa de testes unitários da API e Frontend (`npx nx run-many -t test`) e validar 100% de sucesso.
- [x] 4.2 Executar a suíte completa de testes E2E (`npx nx run-many -t e2e`) assegurando a integridade ponta a ponta do monorepo.
