# Arquitetura do Projeto — vichsort-portifolio

Este documento detalha os princípios arquiteturais, a organização de diretórios e o fluxo de dados da aplicação **vichsort-portifolio**, estruturada sob o paradigma de **Arquitetura Modular Orientada a Domínios (Domain-Driven Modular Architecture)** em **Vue 3 + Vite**.

---

## 1. Visão Geral & Princípios Norteadores

A arquitetura foi desenhada para resolver os problemas de escalabilidade, coesão e acoplamento comuns em SPAs crescentes:

1. **Separação por Camadas e Domínios**:
   - **`core/`**: Infraestrutura transversal, configuração de roteamento, motor de tradução e design tokens.
   - **`shared/`**: Componentes de layout e composables utilitários agnósticos de domínio de negócio.
   - **`modules/`**: Módulos de domínio independentes e auto-suficientes contendo suas próprias views, componentes, composables e arquivos de tradução (`locales/`). O conteúdo (projetos, pesquisas etc.) fica no grafo em `src/content/`.
2. **SPA Multi-Route com Code Splitting**:
   - Roteamento nativo via `vue-router` com carregamento sob demanda (*lazy-loading*) por rota.
   - Transições de página suaves preservando o estado global (tema, configurações e acessibilidade).
3. **Locales Descentralizados com Deep Merge Automático**:
   - Dicionários i18n residem no próprio módulo que os consome. O motor central compila e mescla automaticamente todos os arquivos `locales/<idioma>.json` sem necessidade de registro manual.
4. **CSS Tokens-First Fatiado**:
   - Estilos globais divididos por responsabilidade única (`tokens`, `fonts`, `reset`, `utilities`).
   - Componentes utilizam estritamente `<style scoped>` consumindo as variáveis dos tokens.
5. **TypeScript onde o código é núcleo**:
   - `core/content/` (o grafo) e `modules/terminal/core/` (o shell) são TypeScript estrito; o resto migra aos poucos, quando for mexido (`allowJs` deixa os dois conviverem). `npm run typecheck` roda o `vue-tsc`.
   - Só sintaxe que pode ser apagada (`erasableSyntaxOnly`, sem `enum` nem `namespace`) e imports com a extensão `.ts`: os scripts do vault (`scripts/content.mjs`, `scripts/meta.mjs`) importam o `core/content/` e roda direto no Node, que remove os tipos sozinho.
   - Os tipos do grafo ficam em `core/content/types.ts`; o contrato de comando, o contexto e as saídas do terminal, em `modules/terminal/core/types.ts`.

---

## 2. Mapa Estrutural do Código (`src/`)

```
src/
├── App.vue                         # Shell: navbar, configurações, RouterView e footer (rotas com meta.bare, como o /terminal, ficam sem navbar e footer)
├── main.js                         # Entry point: estilos, router e i18n
│
├── content/                        # Vault de conteúdo (um nó por pasta; ícones e capas junto). Ver GRAPH.md
│
├── assets/
│   └── fonts/                      # Fontes locais (Arcade Gamer, Montserrat)
│
├── core/                           # Infraestrutura transversal
│   ├── config/
│   │   └── profile.js              # E-mail, redes, endereço do site e capa padrão (navbar, footer, contato, terminal)
│   ├── content/                    # Grafo de conteúdo: o vault é lido no build (scripts/contentPlugin.mjs); aqui, a estrutura e os textos por idioma (GRAPH.md, seção 7)
│   ├── i18n/
│   │   ├── languages.js            # Idiomas suportados, obrigatórios e cadeia de fallback
│   │   ├── index.js                # Dicionários de core e dos módulos, um arquivo por idioma; loadLocale baixa o do idioma e os textos do conteúdo
│   │   └── locales/                # Dicionários globais: <idioma>.json (nav, settings, common, footer)
│   ├── router/
│   │   ├── index.js                # Componente de cada página (lazy-loading), rolagem e título da aba
│   │   ├── pages.js                # Tabela de páginas, JS puro: caminho, título, prévia, navegação (router, navbar, footer, meta.mjs)
│   │   └── scrollToHash.js         # Rota com âncora (/certifications#id): rola até o card e o destaca
│   └── styles/                     # tokens, fonts, reset, utilities e o agregador index.css
│
├── shared/                         # Reutilizáveis sem domínio
│   ├── ascii/                      # Motor dos campos ASCII em canvas (hero, footer): grid, camadas, paleta
│   ├── components/
│   │   ├── layout/                 # TheNavbar, SettingsSidebar, TheFooter
│   │   ├── node/                   # NodeMenu: menu de um nó do grafo (n4/n5), sobre o ContextMenu;
│   │   │                           # TechIcon: ícone de tech dos stacks, com hover e menu;
│   │   │                           # NodeMenuHost: menu único dos wikilinks nos textos (n10), no App.vue
│   │   └── ui/                     # BaseSearchInput, BaseSelect, ListingToolbar, ListingEmpty, UntranslatedNote,
│   │                               # MacWindowFrame (moldura de janela do macOS: README do Sobre e terminal)
│   │       └── menu/               # Menu de contexto estilo macOS: ContextMenu (gatilho <button>) sobre o
│   │                               # ContextMenuPanel (ancorado em qualquer elemento), MenuList (um nível), useMenuState
│   │                               # (aberto, submenu, trava por clique), useMenuPosition (@floating-ui),
│   │                               # useSubmenuAim (tolerância diagonal), useMenuKeyboard (setas, Esc)
│   ├── composables/                # useTheme, useSettings, useNavigation, useSmartScroll,
│   │                               # useDraggableScroll, useScrollProgress, useAsciiField, useHeroPresence,
│   │                               # useListingFilters (busca e filtros), useListingView (grade/lista),
│   │                               # useRefFilter (?ref=<id>: só os itens que apontam para um nó),
│   │                               # useNodeMenuHost (estado do menu dos wikilinks),
│   │                               # useViewTransition (troca de página animada: a janela do terminal cresce e encolhe)
│   ├── directives/                 # v-content-links: no HTML de v-html, links internos navegam pelo router
│   │                               # e wikilinks de nós sem página abrem o menu de nó
│   └── views/
│       └── NotFoundView.vue        # 404
│
└── modules/                        # Módulos de domínio: views, components, composables e locales/ próprios
    ├── home/                       # Landing: hero ASCII, sobre, leads, stack
    ├── about/                      # /overview: perfil, stack, README, timeline, galeria
    ├── projects/                   # /projects e /projects/:slug
    ├── researches/                 # /researches
    ├── certifications/             # /certifications
    ├── contact/                    # /contact
    ├── gallery/                    # /gallery e /gallery/:id: grade de polaroids (3, 2 ou 1 por linha) e página da foto
    ├── graph/                      # /graph: contagens, mapa de conhecimento, adoção de techs e matriz; prévia no Sobre
    ├── testimonials/               # Seção de depoimentos (usada pela home)
    └── terminal/                   # Shell (parser, dispatcher, comandos) e VFS sobre o grafo; sessão única (useTerminal)
                                    # mostrada na seção do fim da home (TerminalSection) e em /terminal
```

Cada módulo com dados próprios de interface tem `locales/<idioma>.json`. Os dados de conteúdo (projetos, pesquisas, certificações, timeline, techs, fotos da galeria) não ficam nos módulos: vêm do grafo em `src/content/`.

**Dependências entre módulos.** Um módulo importa de `core/` e `shared/`. As exceções aceitas hoje: a `home` monta seções de `projects` (`ProjectShowcaseSection`), `testimonials` e `terminal` (`TerminalSection`); o `about` monta a prévia do `graph` (`GraphPreviewSection`); e o `neofetch` do terminal usa o `techUsage` do `graph` (o stack mais usado).

---

## 3. Fluxo de Dados & Integração

### A. Idiomas e dicionários (i18n)

`src/core/i18n/languages.js` é a fonte única dos idiomas: **pt, en, es, it**. É JavaScript puro, usado pelo i18n da interface, pelo grafo de conteúdo e pelo script do vault.

- **Interface:** `src/core/i18n/index.js` lê `core/i18n/locales/*.json` e `modules/**/locales/*.json`, identifica o idioma pelo nome do arquivo e mescla tudo por idioma (*deep merge*). Um arquivo com idioma fora da lista é ignorado (com aviso em dev). Fallback da interface: en, depois pt.
- **Conteúdo:** pt e en são obrigatórios em todo nó com texto; es e it são opcionais. Sem o texto do idioma ativo, o grafo usa o primeiro da cadeia *ativo → en → pt*, e as telas mostram o selo `UntranslatedNote`. Detalhes no [GRAPH.md](GRAPH.md), seção 6.
- **Terminal:** os textos fixos das saídas ficam em `terminal.output.*` dos dicionários do módulo, nunca no código.

Para adicionar um idioma: incluí-lo em `languages.js`, criar o `<idioma>.json` em `core/i18n/locales/` e em cada módulo, e as chaves `languages.<idioma>` nos dicionários globais.

### B. Grafo de Conteúdo (`src/content/`)

Projetos, certificações, pesquisas, timeline, fotos da galeria, techs, tópicos, cargos do hero e stacks vivem em `src/content/`, um nó por pasta, num formato compatível com o Obsidian (frontmatter YAML + wikilinks). O núcleo em [`src/core/content/`](src/core/content/) monta o grafo com backlinks; as views leem dele via `useContent()` e o terminal via `content`.

Formato, regras e API completos em [GRAPH.md](GRAPH.md). Validação: `npm run check:content`.

### C. Gestão de Estado & Acessibilidade

- O tema é persistido e sincronizado via `@vueuse/core` (`useColorMode`), com `data-theme="dark"` ou `data-theme="light"` na raiz `<html>`.
- Idioma, tamanho de fonte e animações ficam em `localStorage` (`useSettings`). Animações respeitam também `prefers-reduced-motion`; o idioma ativo vai para o atributo `lang` do `<html>`.

---

## 4. Roteamento da Aplicação

| Rota | View | Módulo | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `HomeView` | `home` | Landing page com hero, sobre, leads, stack, projetos e depoimentos |
| `/overview` | `OverviewView` | `about` | Perfil, stack, README, timeline e galeria |
| `/projects` | `ProjectsListView` | `projects` | Listagem com busca e filtros |
| `/projects/:slug` | `ProjectDetailView` | `projects` | Artigo do projeto em Markdown |
| `/researches` | `ResearchesView` | `researches` | Artigos acadêmicos e premiações |
| `/certifications` | `CertificationsView` | `certifications` | Credenciais e certificações |
| `/gallery` | `GalleryView` | `gallery` | Fotos em polaroid, com tamanho médio, grande ou extra grande |
| `/gallery/:id` | `GalleryDetailView` | `gallery` | Foto inteira, história, ligações e navegação entre fotos |
| `/graph` | `GraphView` | `graph` | Gráficos a partir do grafo de conteúdo |
| `/contact` | `ContactView` | `contact` | Canais de contato e redes sociais |
| `/terminal` | `TerminalView` | `terminal` | Shell interativo sobre o grafo, só a janela (sem navbar nem footer) |
| `/*` | `NotFoundView` | `shared` | Página 404 |

As páginas vivem numa tabela só, [`core/router/pages.js`](src/core/router/pages.js) (caminho, `titleKey`, descrição e se tem prévia de link, lugar na navbar), lida pelo router, pela navbar, pelo footer e pelo `scripts/meta.mjs`. Página nova: uma linha na tabela e o componente em `VIEWS` (`core/router/index.js`). Na navbar, as páginas `nav: 'main'` ficam na pílula; as `nav: 'more'` (Galeria, Grafo e Terminal) ficam na segunda página dela, atrás da seta. As rotas de detalhe são irmãs da listagem, não filhas: a aba ativa é decidida por prefixo do caminho.

---

## 5. Build e Publicação

`npm run build` roda `vite build` e depois `scripts/meta.mjs`, que grava um `index.html` por rota (páginas, projetos e fotos) com título, descrição e imagem próprios, em inglês: é o que LinkedIn, WhatsApp e buscadores leem, sem rodar JavaScript. A imagem é a capa do nó ou o hero (`public/images/og-default.jpg`); a URL absoluta vem de `SITE_URL` (`core/config/profile.js` ou variável de ambiente).

O site é publicado no Cloudflare Pages (`vichsort.com`): ele serve a pasta da rota (`/projects/plante/index.html`) e, para o resto, o `index.html` da raiz, onde o router resolve.

Antes de publicar conteúdo: `npm run check:content` (grafo válido) e `npm run typecheck`.
