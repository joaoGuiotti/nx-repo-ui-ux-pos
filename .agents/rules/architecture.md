---
trigger: always_on
---

***

# 🏛️ Diretrizes Arquiteturais (Clean Architecture & Patterns)

1. **Domain & Application (Núcleo desacoplado):**
   - Regras de negócio puras, entidades e Value Objects (ex: CPF, Valor Pix).
   - **Zero acoplamento com o framework:** Sem `HttpClient`, sem `Injectable`, sem bibliotecas externas no domínio.
2. **Ports & Adapters (Inversão de Dependência):**
   - **Ports:** Contratos definidos por `abstract classes` (para facilitar a injeção de dependência no Angular).
   - **Adapters:** Implementações reais das portas (ex: Chamadas de API HTTP ou Mocks em Memória para testes/desenvolvimento offline).
3. **Container / Presenter Pattern & Estilização (Tailwind + DS):**
   - **Containers (Smart):** Orquestram o estado, injetam Facades e manipulam rotas. Template enxuto.
   - **Presenters (Dumb):** 100% visuais. Recebem estado via `input()` (Signals) e notificam ações via `output()`. As Skills de A11y e Lucide Icons são mandatórias.
   - **Tailwind CSS:** Estilização feita majoritariamente no HTML. Arquivos `.scss` são residuais e desencorajados para regras básicas.
4. **Facades:**
   - Único ponto de contato entre a UI e a infraestrutura/domínio. Orquestram Stores, chamadas HTTP e mapeamentos.
5. **State Management:**
   - Use Angular SignalStore, NgRx ou Services reativos utilizando exclusivamente Signals (`signal()`, `computed()`).

---

## 📂 Mapa de Pastas Completo (Exemplo de Feature)

Toda feature deve respeitar estritamente esta taxonomia. Este exemplo ilustra a feature `transactions`, centralizando testes na pasta `__tests__`.

```text
📦 feature/transactions
┣ 📂 __tests__                  # 📍 Centralização de TODOS os testes unitários da feature
┃ ┣ 📂 domain                   # (Espelha a estrutura original para manter organização)
┃ ┃ ┗ 📜 pix-key.vo.spec.ts
┃ ┣ 📂 infrastructure
┃ ┃ ┣ 📜 transaction-http.adapter.spec.ts
┃ ┃ ┗ 📜 transaction.mapper.spec.ts
┃ ┣ 📂 application
┃ ┃ ┗ 📜 transaction.facade.spec.ts
┃ ┗ 📂 presentation
┃   ┗ 📜 transaction-list.component.spec.ts
┃
┣ 📂 domain                     # 📍 [REGRA ESTRITA]: Proibido importar dependências do Angular aqui
┃ ┣ 📂 entities
┃ ┃ ┣ 📜 transaction.entity.ts  # Classes ou interfaces puras que modelam o negócio
┃ ┃ ┗ 📜 pix-key.vo.ts          # Value Objects (regras de validação encapsuladas)
┃ ┗ 📂 ports
┃   ┗ 📜 transaction.repository.ts # abstract class TransactionRepository { ... }
┃
┣ 📂 infrastructure             # 📍 Implementação tecnológica e estado
┃ ┣ 📂 adapters                 # Implementam os "Ports" do domínio
┃ ┃ ┣ 📜 transaction-http.adapter.ts      
┃ ┃ ┗ 📜 transaction-in-memory.adapter.ts # Mock com array local, útil para dev/testes
┃ ┣ 📂 http
┃ ┃ ┣ 📜 transaction.dtos.ts    
┃ ┃ ┗ 📜 transaction.mapper.ts  
┃ ┗ 📂 state
┃   ┗ 📜 transaction.signal-store.ts 
┃
┣ 📂 application                # 📍 Orquestração
┃ ┗ 📂 facades
┃   ┗ 📜 transaction.facade.ts  # Injeta TransactionRepository e Store
┃
┣ 📂 presentation               # 📍 Padrão Container/Presenter estrito
┃ ┣ 📂 containers
┃ ┃ ┗ 📂 transaction-page
┃ ┃   ┣ 📜 transaction-page.component.ts # Smart: Injeta apenas a Facade.
┃ ┃   ┣ 📜 transaction-page.component.html # Classes Tailwind gerenciam layout do grid/espaçamentos
┃ ┃   ┗ 📜 transaction-page.component.scss # (Geralmente Vazio)
┃ ┗ 📂 presenters
┃   ┗ 📂 transaction-list
┃     ┣ 📜 transaction-list.component.ts # Dumb: Apenas input() e output(). Zero injeção.
┃     ┣ 📜 transaction-list.component.html # 🎨 Tailwind Utilities consumindo tokens do DS
┃     ┗ 📜 transaction-list.component.scss # (Geralmente Vazio)
┃
┣ 📜 transactions.routes.ts     # Configuração de rotas da feature (Standalone)
┗ 📜 transactions.providers.ts  # DI Config: { provide: TransactionRepository, useClass: ... }
```

---

## 🚫 Guardrails (Regras Anti-Alucinação e Restrições Estruturais)

Para evitar desvios da arquitetura proposta, as seguintes restrições **devem** ser aplicadas automaticamente em qualquer geração ou revisão de código:

1. **Centralização Estrita de Testes (`__tests__`):**
   - **É terminantemente proibido** manter arquivos `.spec.ts` espalhados lado a lado com os arquivos de implementação.
   - Todos os testes unitários devem viver dentro de `feature/xpto/__tests__/`, recriando a sub-árvore de pastas para manter organização.

2. **A Regra da Inversão de Dependência (Providers):**
   - O `Container`, `Facade` ou `SignalStore` **NUNCA** devem injetar o `TransactionHttpAdapter` diretamente.
   - Eles devem **SEMPRE** injetar a porta (a interface abstrata): `constructor(private repo: TransactionRepository)`.
   - A amarração acontece exclusivamente no arquivo `.providers.ts`: 
     `{ provide: TransactionRepository, useClass: environment.production ? TransactionHttpAdapter : TransactionInMemoryAdapter }`

3. **Isolamento Absoluto do Domínio:**
   - A pasta `domain/` só pode importar arquivos de dentro da própria pasta `domain/`.
   - É proibido: `import { HttpClient }` ou `import { Injectable }` dentro de `domain/entities` ou `domain/ports`.

4. **Restrição dos Presenters (Dumb Components):**
   - Um arquivo dentro de `presentation/presenters/` **não pode ter o método `constructor` com injeções de serviços** (ex: `HttpClient`, `Router`, `Facades`, `Stores`).
   - A comunicação só pode ser feita via Angular Signals: `data = input.required<Transaction[]>()` e `onSelect = output<string>()`.

5. **Tailwind CSS e Consumo do Design System:**
   - **Proibido valores arbitrários no HTML:** É vedado o uso de classes mágicas como `w-[245px]`, `text-[#ff0000]` ou `bg-[rgba(0,0,0,0.5)]`. A interface deve ser construída **exclusivamente com os Tokens do Design System** mapeados no `tailwind.config.js` (ex: `w-64`, `text-feedback-error`, `bg-overlay`).
   - **Proibido `@apply` abusivo:** A diretiva `@apply` não deve ser usada nos arquivos `.scss` dos componentes para "limpar o HTML". As classes utilitárias devem viver no `.html`.
   - **Classes e Estados Dinâmicos:** Para manipular variações visuais (ex: botões *disabled* ou *active*), utilize a sintaxe de binding de classe do Angular (ex: `[class.bg-primary-dark]="isActive"`) evitando a criação de lógicas pesadas de estilo dentro dos arquivos TypeScript.

6. **Nomenclatura Obrigatória (Sufixos):**
   - Arquivos devem refletir seu papel exato: `.entity.ts`, `.vo.ts`, `.repository.ts`, `.adapter.ts`, `.facade.ts`, `.signal-store.ts`, `.dtos.ts`.

7. **Mapeamento DTO vs Domínio:**
   - Os Adapters não devem devolver o JSON cru (DTO) da API para a Facade. A conversão de "Contrato de API" para "Entidade de Negócio" deve ocorrer dentro da camada `infrastructure` utilizando arquivos `.mapper.ts`.