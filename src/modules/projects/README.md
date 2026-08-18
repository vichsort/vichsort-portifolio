# Módulo de Projetos (`src/modules/projects`)

Módulo responsável pela listagem, filtragem, vitrine (*showcase*) e páginas de detalhes de todos os projetos e cases do portfólio.

---

## Arquitetura & Fonte Única da Verdade (SST)

* **Single Source of Truth (SST)**: Toda a informação de um projeto reside exclusivamente nos arquivos Markdown com Frontmatter em `content/`.
* **Zero Config para Novos Projetos**: Não é necessário registrar rotas manualmente ou editar arquivos JSON para adicionar projetos. O loader dinâmico (`useProjects.js`) escaneia `content/*.md` automaticamente via `import.meta.glob`.
* **Separação de Textos de UI**: Os arquivos `locales/*.json` contêm estritamente rótulos de interface (placeholders, títulos de seção, botões de ação e contadores).

---

## Estrutura de Arquivos

```
src/modules/projects/
├── components/
│   ├── ProjectCard.vue             # Card híbrido com variantes 'grid' (catálogo) e 'carousel' (Home)
│   ├── ProjectPagination.vue       # Navegação simétrica (← Anterior / Próximo →) para a página de detalhes
│   └── ProjectShowcaseSection.vue  # Carrossel horizontal da Home page com suporte a drag scroll
├── composables/
│   ├── useProjects.js              # Loader SST de Markdowns, cache em memória e formatador de datas
│   └── useProjectsFilter.js        # Lógica reativa de busca textual e multi-filtros (categoria, tech, ano)
├── content/
│   ├── <slug>.pt.md                # Conteúdo e metadados em Português
│   └── <slug>.en.md                # Conteúdo e metadados em Inglês
├── locales/
│   ├── pt.json                     # Textos de UI em Português
│   └── en.json                     # Textos de UI em Inglês
└── views/
    ├── ProjectsListView.vue        # Rota '/projects' (Grade de cards com barra de multi-filtros)
    └── ProjectDetailView.vue       # Rota '/projects/:slug' (Artigo completo do projeto)
```

---

## Como Cadastrar um Novo Projeto

Para adicionar um novo projeto ao portfólio, crie o par de arquivos Markdown em `content/`:
1. `src/modules/projects/content/<id>.pt.md`
2. `src/modules/projects/content/<id>.en.md`

### Template de Exemplo (`meu-projeto.pt.md`)

```markdown
---
id: meu-projeto
title: Nome do Projeto em Destaque
summary: Resumo curto e direto em Markdown com **destaques** para exibição no card.
category: App
techs: [Vue.js, Python, PostgreSQL, Docker]
date: ["01/2024", "06/2024"]
image: /images/meu-projeto-cover.jpg
github: https://github.com/vitor/meu-projeto
live: https://meu-projeto.com
---

## Sobre o Projeto

Descrição detalhada do projeto, desafios técnicos enfrentados e arquitetura da solução.

### Principais Funcionalidades

- **Funcionalidade 1**: Descrição breve.
- **Funcionalidade 2**: Descrição breve.

### Tecnologias e Ferramentas

- **Frontend**: Vue 3, Vite, Pinia
- **Backend**: Python, FastAPI
```

---

## Especificação do Schema Frontmatter

| Campo | Tipo | Obrigatório | Descrição / Exemplo |
| :--- | :--- | :---: | :--- |
| `id` | `String` | **Sim** | Identificador único / slug da URL (ex: `plante`). Deve coincidir com o nome do arquivo (`plante.pt.md`). |
| `title` | `String` | **Sim** | Nome completo do projeto (ex: `PlantE — Gestão Agrícola`). |
| `summary` | `String` | **Sim** | Resumo curto para o card. Aceita Markdown inline (`**negrito**`, `*itálico*`). |
| `category` | `String` | **Sim** | Categoria única para o badge de destaque e dropdown (ex: `App`, `CLI`, `Website`, `API`, `Library`). |
| `techs` | `Array<String>` | **Sim** | Lista de tecnologias utilizadas (ex: `[Vue.js, Python, Flask, Redis]`). Alimentam o dropdown de tecnologias. |
| `date` | `Array<String>` | **Sim** | Range no formato `["MM/AAAA", "MM/AAAA"]`. Ex: `["08/2024", "12/2024"]`. Extrai o ano automaticamente para o filtro. |
| `image` | `String` | Não | Caminho público da imagem de capa (ex: `/images/cover.jpg`). Se vazio (`""`), usa gradiente de fallback. |
| `github` | `String` | Não | URL do repositório no GitHub. Se vazio (`""`), o botão de código fonte é omitido automaticamente. |
| `live` | `String` | Não | URL da aplicação online. Se vazio (`""`), o botão de Live Demo é omitido automaticamente. |

---

## Composables e Funções Utilitárias

### 1. `useProjects()`
* `loadAllProjects(locale = 'pt')`: Retorna array com todos os projetos do catálogo contendo metadados parseados e cache em memória.
* `loadProject(id, locale = 'pt')`: Retorna o projeto específico com HTML compilado em `.html`.
* `getAdjacentProjects(currentId, locale = 'pt')`: Retorna `{ prev, next }` com os projetos vizinhos para paginação circular.
* `formatDateRange(dateVal)`: Helper que formata `["08/2024", "12/2024"]` para `"08/2024 — 12/2024"`.

### 2. `useProjectsFilter(projectsRef)`
* Gerencia o estado reativo de busca e filtros:
  - `searchQuery`: String de busca em tempo real (título, resumo, categoria, techs).
  - `selectedCategory`: Categoria selecionada no dropdown (`'ALL'` por padrão).
  - `selectedTech`: Tecnologia selecionada no dropdown (`'ALL'` por padrão).
  - `selectedYear`: Ano selecionado no dropdown (`'ALL'` por padrão).
  - `filteredProjects`: Array computado de projetos correspondentes.
  - `clearFilters()`: Reseta todos os 4 filtros para o estado inicial.

---

## Boas Práticas & Dicas de Manutenção

1. **Paridade de Idiomas**: Sempre crie ou edite simultaneamente o par `.pt.md` e `.en.md` para manter a paridade do catálogo.
2. **Formato de Datas**: Mantenha estritamente o formato `["MM/AAAA", "MM/AAAA"]` com 2 dígitos para mês e 4 dígitos para ano, garantindo a extração de anos e ordenação do filtro.
3. **Links Ausentes**: Para projetos de código fechado ou sem demo ativa, mantenha `github: ""` ou `live: ""`. Não insira links fictícios (`#`).
4. **Tipografia**: Os títulos de projetos utilizam a fonte **Montserrat** (`var(--font-body)`). A fonte arcade (`var(--font-heading)`) é reservada para títulos globais da aplicação.
