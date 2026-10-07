# Task Analysis — Finalização do Portfólio Convencional

Documento técnico de planejamento e decomposição para as pendências mapeadas da interface tradicional do `vichsort-portifolio`.

---

## 1. Estrutura de Pastas e Diretórios Envolvidos

```text
src/
├── App.vue                                  # Integração global do TheFooter e condicional de rota
├── modules/
│   ├── home/
│   │   └── components/
│   │       ├── HeroSection.vue              # Logo light mode e easter egg no pixel-grid
│   │       └── AboutSection.vue             # Animação orgânica de flutuação da esfera decorativa
│   │
│   ├── about/
│   │   └── components/
│   │       ├── CoreStackSection.vue         # Correção da reatividade do tema e inversão de ícones
│   │       └── TimelineScrollSection.vue    # Interação de clique e scroll suave nos nós de anos
│   │
│   ├── certifications/
│   │   ├── components/
│   │   │   └── CertificationModal.vue       # [NOVO] Modal acessível de visualização da credencial
│   │   └── views/
│   │       └── CertificationsView.vue       # Acionamento do modal ao clicar nos cards
│   │
│   └── shared/
│       └── components/
│           ├── layout/
│           │   └── TheFooter.vue            # [NOVO] Rodapé global com identidade similar ao Sobre
│           └── ui/
│               ├── BaseSearchInput.vue      # Padronização de altura, foco e bordas
│               └── BaseSelect.vue           # Padronização de altura, chevron e alinhamento
```

---

## 2. Mapeamento de Arquivos

### Arquivos de Efeito Colateral e Infraestrutura
* `src/App.vue`: Registro e renderização condicional do rodapé (`route.path !== '/terminal'`).
* `src/modules/projects/views/ProjectsListView.vue`: Consumo dos inputs de busca e seleção padronizados.
* `src/modules/researches/views/ResearchesView.vue`: Consumo dos inputs de busca e seleção padronizados.
* `src/modules/certifications/views/CertificationsView.vue`: Consumo dos inputs e integração de abertura do modal.
* `public/images/neat-logo-light.png`: Tratamento de transparência ou aplicação de CSS `mix-blend-mode`.

### Arquivos de Desenvolvimento Direto
* `src/modules/home/components/HeroSection.vue`: Renderização com recorte no tema claro e listener `@click` nos `.pixel`.
* `src/modules/home/components/AboutSection.vue`: Keyframes CSS de flutuação e oscilação contínua da `.decorative-circle`.
* `src/modules/about/components/CoreStackSection.vue`: Correção do consumo de `useTheme` para aplicar `.inverted-icon` no dark mode.
* `src/modules/about/components/TimelineScrollSection.vue`: Cálculo de posicionamento e rolagem programática para anos clicados.
* `src/modules/certifications/components/CertificationModal.vue` [NOVO]: Modal com backdrop, foco acessível, `Teleport` e links externos.
* `src/shared/components/layout/TheFooter.vue` [NOVO]: Rodapé estilizado contendo links, bio condensada e copyright.
* `src/shared/components/ui/BaseSearchInput.vue`: Harmonização de altura (42px), bordas e foco.
* `src/shared/components/ui/BaseSelect.vue`: Harmonização de altura (42px), alinhamento do texto e chevron.

---

## 3. Discussão de Arquitetura & Aderência ao SOLID

* **Single Responsibility (SRP)**:
  * O modal de detalhes de certificação fica isolado em `CertificationModal.vue`, evitando inflar `CertificationsView.vue` com controle de DOM, backdrop e foco.
  * O rodapé fica desacoplado em `TheFooter.vue`, mantendo o `App.vue` apenas como casca de layout.
  * O tratamento do tema em `CoreStackSection.vue` deve apenas computar o estado booleano a partir da referência real de `useTheme.js`.
* **Open/Closed (OCP)**:
  * `BaseSearchInput.vue` e `BaseSelect.vue` mantêm sua interface reativa `v-model` intacta, recebendo apenas ajustes de estilo compatíveis com qualquer view.
* **Liskov Substitution (LSP)**:
  * Todos os inputs preservam compatibilidade de contrato de formulário reativo padrão do Vue 3.
* **Interface Segregation (ISP)**:
  * `CertificationModal.vue` recebe apenas o objeto de dados da credencial ativa selecionada via prop (`cert`).
* **Dependency Inversion (DIP)**:
  * Uso consistente dos composables compartilhados (`useTheme`, `useScrollProgress`, `useI18n`) sem acoplamento a estados globais arbitrários.
* **Identificação de Riscos e Fricções**:
  * *Rolagem da Timeline*: O container possui altura virtual de `320vh` com viewport `sticky`. O cálculo de clique em um ano deve correlacionar `containerRef.offsetTop + (idx / totalSteps) * (containerHeight - viewportHeight)` para acionar o `window.scrollTo({ behavior: 'smooth' })`.
  * *Logo Claro*: `neat-logo-light.png` é um bitmap RGB 1374x1374 sem canal alfa. Caso não seja fornecido novo asset com fundo transparente, deve-se aplicar `mix-blend-mode: multiply` ou isolamento por canvas.

---

## 4. Estratégia de Entregas

* **`e1` — Interações e Visual da Home (`HeroSection.vue` & `AboutSection.vue`)**:
  * Ajuste do logo NEAT no light mode.
  * Easter egg interativo clicável no grid de pixels da Hero.
  * Animação contínua flutuante na esfera da seção Sobre.
* **`e2` — Correções na Página Sobre (`CoreStackSection.vue` & `TimelineScrollSection.vue`)**:
  * Correção do tema e inversão dos ícones no tema escuro em `CoreStackSection.vue`.
  * Clique nos nós de anos com rolagem suave na linha do tempo.
* **`ps1` — Pit Stop 1**: Code review rigoroso de `e1` e `e2`.
* **`e3` — Harmonização de Inputs de Filtro (`BaseSearchInput.vue` & `BaseSelect.vue`)**:
  * Padronização de altura (42px), bordas, estados de foco e alinhamento vertical em Projetos, Pesquisas e Certificações.
* **`e4` — Modal de Certificação (`CertificationModal.vue` & `CertificationsView.vue`)**:
  * Criação do modal com `Teleport`, backdrop, escape key e visualização da credencial.
  * Integração do clique nos cards de certificação.
* **`e5` — Rodapé Global (`TheFooter.vue` & `App.vue`)**:
  * Criação do componente `TheFooter.vue` com estilo derivado do Sobre.
  * Integração global em `App.vue` omitindo a rota `/terminal`.
* **`ps2` — Pit Stop 2**: Code review rigoroso de `e3`, `e4` e `e5`.
* **`o1` — Avaliação**: Checagem de integridade, acessibilidade, responsividade mobile e build de produção.
* **`pe1` — Pós-entrega**: Documentação e refinamento de microinterações.

---

## 5. Estimativa de Tempo por Subtarefa (Min – Max)

| Etapa | Escopo Técnico | Faixa de Tempo |
| :--- | :--- | :--- |
| **`e1`** | Home: Logo NEAT Light + Easter egg pixels + Esfera flutuante | 25 – 40 min |
| **`e2`** | Sobre: Ícones dark mode + Rolagem por clique nos anos da Timeline | 20 – 35 min |
| **`ps1`** | Pit Stop 1 (Code Review de `e1` e `e2`) | 10 – 15 min |
| **`e3`** | Filtros: Harmonização de `BaseSearchInput` e `BaseSelect` | 20 – 35 min |
| **`e4`** | Certificados: `CertificationModal.vue` com `Teleport` e acessibilidade | 25 – 40 min |
| **`e5`** | Layout: Rodapé `TheFooter.vue` e integração no `App.vue` | 30 – 50 min |
| **`ps2`** | Pit Stop 2 (Code Review de `e3`, `e4`, `e5`) | 10 – 15 min |
| **`o1` / `pe1`** | Avaliação final e pós-entrega | 15 – 25 min |

---

## 6. Média Conservadora Consolidada (+15 min de Margem)

* **Faixa Total Prevista**: 155 – 255 min
* **Média Conservadora**: 215 min
* **Margem Técnica Obrigatória**: +15 min
* **Total Consolidado**: **230 min (~3h 50m / ~5 Story Points)**


---

## 7. Novas Pendências (Rodada 2)

| # | Pendência | Arquivos envolvidos | Em aberto |
| :--- | :--- | :--- | :--- |
| **`n1`** | Alternância de exibição **grade vs lista** nas listagens | `ProjectsListView.vue`, `ResearchesView.vue`, `CertificationsView.vue`, `ProjectCard.vue`, `ResearchCard.vue` | Preferência salva por página ou global; variante "lista" dos cards |
| **`n2`** | Novo padrão de **busca e filtros** das listagens | `BaseSearchInput.vue`, `BaseSelect.vue` e as três views de listagem | Substitui a harmonização de altura do `e3` (hoje: busca com 41px, selects com 39px) |
| **`n3`** | **README falso funcional**: fechar e tela cheia pelos botões da janela | `MacWindow.vue`, `DescriptionSection.vue` | Os botões (`.window-controls`) hoje são só decorativos (`aria-hidden`); definir o que "fechar" faz (recolher com botão de reabrir?) e tela cheia com saída por `Esc` |
| **`n4`** | Clicar numa **tech** mostra "definição" e "usos" | `TechStackSection.vue` (home), `CoreStackSection.vue` (sobre) | Os "usos" podem vir do campo `techs` dos projetos em `projects/content/*.md`; formato: popover ou modal |
| **`n5`** | Clicar nos **cargos do hero** (ex.: "Desenvolvimento Web") mostra "exemplos" | `HeroSection.vue`, `home/locales/*.json` (`hero.roles`) | Exemplos ligados aos projetos por categoria? Manter `data-ascii-safe` nos elementos clicáveis |
| **`n6`** | Listar **projetos mais antigos** | `projects/content/*.{pt,en}.md` | Hoje são só 3 (`cemiterio`, `plante`, `tera`); depende do conteúdo e das imagens de cada projeto |
| **`n7`** | **Redesenhar a tela de contato** | `ContactView.vue`, `core/config/profile.js` | Alinhar à identidade do hero e do footer; os dados de contato ainda são placeholders (`TODO` no `profile.js`) |

### `d1` — Discussão: relacionamentos entre techs, cargos e conteúdo

> **Resolvido:** grafo de conteúdo em `src/content/`, documentado no [GRAPH.md](GRAPH.md). Os caminhos citados abaixo são anteriores à migração.

Pré-requisito do `n4` (techs clicáveis) e do `n5` (cargos do hero clicáveis): definir **como projetos, certificações e pesquisas se ligam às techs e aos cargos do hero**, para que "usos" e "exemplos" sejam gerados a partir dos dados, e não escritos à mão.

**O que já existe e pode servir de ligação:**

| Fonte | Campos | Onde |
| :--- | :--- | :--- |
| Projetos | `techs` (ex.: `[Vue.js, Python, Flask]`), `category` (`App`, `CLI`, `Website`) | frontmatter de `projects/content/*.md` |
| Certificações | `skills` | `certifications/locales/*.json` (`certifications_page.list`) |
| Pesquisas | `tags`, `category` | `researches/locales/*.json` (`researches_page.list`) |
| Techs | `name`, `icon` | listas fixas em `TechStackSection.vue` e `CoreStackSection.vue` |
| Cargos do hero | 4 chaves (`web_development`, `app_development`, `data_science`, `software_architecture`) | `home/locales/*.json` (`hero.roles`) |

**Problema:** são textos livres, escritos de forma independente em cada lugar. Nada garante que "Vue.js" no projeto, nas `skills` de uma certificação e no stack sejam o mesmo identificador, e os cargos do hero não têm nenhuma relação com as `category` dos projetos.

**Pontos a decidir:**
* **Registro central de techs** (ex.: `core/config/techs.js`) com `id`, nome, ícone, aliases e definição pt/en, referenciado por `id` em projetos, certificações e pesquisas? Também eliminaria as listas duplicadas de `TechStackSection` e `CoreStackSection`.
* **Ligação dos cargos:** mapear cada cargo para categorias e/ou techs (ex.: `data_science` → `Python`, `Gemini AI`) ou marcar explicitamente cada conteúdo com os cargos a que pertence?
* **Onde ficam as ligações:** no frontmatter/JSON de cada conteúdo (cada item declara suas techs) ou num índice central?
* **Validação:** checar no build (ou num script) se toda tech citada existe no registro, para evitar ligações quebradas por erro de digitação.
* **Granularidade dos "usos":** listar só projetos, ou projetos + certificações + pesquisas agrupados por tipo?
