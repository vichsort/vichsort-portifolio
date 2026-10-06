# Módulo de Projetos (`src/modules/projects`)

Módulo responsável pela listagem, filtragem, vitrine (*showcase*) e páginas de detalhes de todos os projetos e cases do portfólio.

---

## Arquitetura & Fonte Única da Verdade (SST)

* **Single Source of Truth (SST)**: Os projetos são nós do grafo de conteúdo, em `src/content/projects/<id>/`. Formato, campos e ligações estão no [GRAPH.md](../../../GRAPH.md).
* **Zero Config para Novos Projetos**: Não é necessário registrar rotas nem editar JSON. `useProjects.js` lê os projetos do grafo e os entrega às views no formato abaixo.
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
│   ├── useProjects.js              # Projetos do grafo de conteúdo no formato das views + formatador de datas
│   └── useProjectsFilter.js        # Lógica reativa de busca textual e multi-filtros (categoria, tech, ano)
├── locales/
│   ├── pt.json                     # Textos de UI em Português
│   └── en.json                     # Textos de UI em Inglês
└── views/
    ├── ProjectsListView.vue        # Rota '/projects' (Grade de cards com barra de multi-filtros)
    └── ProjectDetailView.vue       # Rota '/projects/:slug' (Artigo completo do projeto)
```

---

## Como Cadastrar um Novo Projeto

Crie a pasta `src/content/projects/<id>/` com:
1. `<id>.md` — estrutura: `category`, `date`, `techs`, `topics`, `roles`, `github`, `live`
2. `<id>.pt.md` e `<id>.en.md` — `title`, `summary` e o artigo completo no corpo
3. `cover.jpg` (opcional) — imagem de capa

O formato completo, com exemplo, está no [GRAPH.md](../../../GRAPH.md) (seções 4.5 e 5.3). Depois rode `npm run check:content` e `npm run content:index`.

---

## Composables e Funções Utilitárias

### 1. `useProjects()`
* `loadAllProjects(locale = 'pt')`: Retorna array com todos os projetos do grafo. `category` e `techs` vêm como nomes de exibição; os ids ficam em `categoryId` e `techIds`.
* `loadProject(id, locale = 'pt')`: Retorna o projeto específico com HTML compilado em `.html`.
* `getAdjacentProjects(currentId, locale = 'pt')`: Retorna `{ prev, next }` com os projetos vizinhos para paginação circular.
* `formatDateRange(dateVal)`: Helper que formata `["2024-08", "2024-12"]` para `"08/2024 — 12/2024"`.

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

1. **Paridade de Idiomas**: O `npm run check:content` acusa campos obrigatórios ausentes e textos que existem num idioma e não no outro.
2. **Formato de Datas**: `AAAA-MM` (ou só `AAAA`); a validação recusa outros formatos.
3. **Links Ausentes**: Para projetos de código fechado ou sem demo ativa, mantenha `github: ""` ou `live: ""`. Não insira links fictícios (`#`).
4. **Tipografia**: Os títulos de projetos utilizam a fonte **Montserrat** (`var(--font-body)`). A fonte arcade (`var(--font-heading)`) é reservada para títulos globais da aplicação.
