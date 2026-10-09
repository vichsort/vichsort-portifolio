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
│   ├── ProjectCard.vue             # Card com variantes 'grid' e 'list' (catálogo) e 'carousel' (Home)
│   ├── ProjectPagination.vue       # Navegação simétrica (← Anterior / Próximo →) para a página de detalhes
│   └── ProjectShowcaseSection.vue  # Carrossel horizontal da Home page com suporte a drag scroll
├── composables/
│   └── useProjects.js              # Projetos do grafo de conteúdo no formato das views + formatador de datas
├── locales/
│   └── <idioma>.json               # Textos de UI (pt, en, es, it)
└── views/
    ├── ProjectsListView.vue        # Rota '/projects' (grade ou lista, com a barra de busca e filtros)
    └── ProjectDetailView.vue       # Rota '/projects/:slug' (Artigo completo do projeto)
```

---

## Como Cadastrar um Novo Projeto

Crie a pasta `src/content/projects/<id>/` com:
1. `<id>.md` /// estrutura: `category`, `date`, `techs`, `topics`, `roles`, `github`, `live`
2. `<id>.pt.md` e `<id>.en.md` /// `title`, `summary` e o artigo completo no corpo
3. `cover.jpg` (opcional) /// imagem de capa

O formato completo, com exemplo, está no [GRAPH.md](../../../GRAPH.md) (seções 4.5 e 5.3). Depois rode `npm run check:content` e `npm run content:index`.

---

## Composables e Funções Utilitárias

### 1. `useProjects()`
* `loadAllProjects(locale = 'pt')`: Retorna array com todos os projetos do grafo. `category` e `techs` vêm como nomes de exibição; os ids ficam em `categoryId` e `techIds`.
* `loadProject(id, locale = 'pt')`: Retorna o projeto específico com HTML compilado em `.html`.
* `getAdjacentProjects(currentId, locale = 'pt')`: Retorna `{ prev, next }` com os projetos vizinhos para paginação circular.
* `formatDateRange(dateVal)`: Helper que formata `["2024-08", "2024-12"]` para `"08/2024 /// 12/2024"`.

### 2. Busca e filtros
* Na listagem, busca e filtros vêm do `useListingFilters` e da barra `ListingToolbar` (em `src/shared/`), comuns a projetos, pesquisas e certificações; a escolha grade/lista é global (`useListingView`). Com `?ref=<id>` na URL (`useRefFilter`), a listagem mostra só o que aponta para esse nó, com um chip removível na barra. A página só declara onde a busca procura (título, resumo, categoria, techs) e os filtros (categoria, tecnologia, ano).

---

## Boas Práticas & Dicas de Manutenção

1. **Paridade de Idiomas**: O `npm run check:content` acusa campos obrigatórios ausentes e textos que existem num idioma e não no outro.
2. **Formato de Datas**: `AAAA-MM` (ou só `AAAA`); a validação recusa outros formatos.
3. **Links Ausentes**: Para projetos de código fechado ou sem demo ativa, mantenha `github: ""` ou `live: ""`. Não insira links fictícios (`#`).
4. **Tipografia**: Os títulos de projetos utilizam a fonte **Montserrat** (`var(--font-body)`). A fonte arcade (`var(--font-heading)`) é reservada para títulos globais da aplicação.
