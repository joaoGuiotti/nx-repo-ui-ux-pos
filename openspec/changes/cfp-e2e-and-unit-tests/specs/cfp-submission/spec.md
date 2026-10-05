# Spec Delta

## Purpose

Permitir a submissão e o gerenciamento de propostas de palestras (Call for Papers) com validação ponta a ponta, garantindo integridade de dados e conformidade estrita com padrões de acessibilidade WAI-ARIA.

## ADDED Requirements

### Requirement: Validação e Processamento de Submissão de CFP na API
O sistema backend MUST validar todos os campos do payload de submissão do palestrante recebidos no endpoint `POST /api/cfp` de acordo com o contrato `SpeakerDTO` e disponibilizar as propostas registradas via `GET /api/cfp`.

#### Scenario: Submissão de palestra com payload válido
- **WHEN** uma requisição POST é enviada para `/api/cfp` contendo todos os campos válidos (`nome`, `email`, `talkTitle`, `isGDE`)
- **THEN** o sistema responde com status HTTP 201 Created confirmando a gravação e retornando o objeto persistido com seu identificador.

#### Scenario: Rejeição de payload com dados inválidos ou ausentes
- **WHEN** uma requisição POST é enviada para `/api/cfp` sem campos obrigatórios ou com e-mail inválido
- **THEN** o sistema SHALL responder com status HTTP 400 Bad Request detalhando as restrições violadas.

#### Scenario: Listagem de propostas submetidas
- **WHEN** uma requisição GET é enviada para `/api/cfp`
- **THEN** o sistema SHALL retornar a lista de propostas submetidas com status HTTP 200 OK.

### Requirement: Fluxo E2E de Preenchimento e Submissão no Frontend
A interface de usuário SHALL gerenciar o ciclo de vida da submissão através de formulário reativo com validação em tempo real, suporte completo a leitores de tela (WAI-ARIA) e confirmação visual da operação.

#### Scenario: Estado inicial desabilitado e validações inline
- **WHEN** o usuário acessa a página de Call for Papers
- **THEN** os campos do formulário devem estar vazios, o botão de submissão MUST estar desabilitado e interações com campos vazios devem disparar mensagens com `role="alert"` e `aria-invalid="true"`.

#### Scenario: Preenchimento completo e submissão com sucesso
- **WHEN** o usuário preenche nome, e-mail válido, título da palestra e seleciona a opção de palestrante
- **THEN** o botão de envio SHALL se tornar ativo, e ao ser acionado, exibe estado de carregamento seguido de notificação de sucesso e atualização de estado.

#### Scenario: Redirecionamento da rota raiz para o fluxo de CFP
- **WHEN** o usuário navega para a URL raiz `/`
- **THEN** o sistema SHALL redirecionar automaticamente para a rota `/cfp`, apresentando o formulário de submissão.
