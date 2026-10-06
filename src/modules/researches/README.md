# Módulo de Pesquisas (`src/modules/researches`)

Módulo responsável pela listagem, filtragem e exibição de artigos acadêmicos, premiações e projetos de iniciação científica do portfólio.

---

## Arquitetura & Fonte de Dados

* **Gerenciamento Descentralizado de Locales**: Os dados das pesquisas e os textos de interface residem em `src/modules/researches/locales/` (`pt.json` e `en.json`).
* **Deep Merge Automático**: O motor i18n central do projeto compila e mescla automaticamente os dicionários deste módulo sob a chave de namespace `researches_page`.
* **Zero Configuração de Filtros**: O composable `useResearchesFilter` infere dinamicamente categorias, anos, premiações e tags a partir da lista cadastrada.

---

## Estrutura de Arquivos

```
src/modules/researches/
├── components/
│   └── ResearchCard.vue          # Card para exibição de cada pesquisa com metadados e badges
├── composables/
│   └── useResearchesFilter.js    # Lógica reativa de busca textual e multi-filtros
├── locales/
│   ├── pt.json                   # Textos de UI em Português
│   └── en.json                   # Textos de UI em Inglês
├── views/
│   └── ResearchesView.vue        # Rota '/researches' (Toolbar de filtros + Lista + Empty state)
└── README.md                     # Documentação e guia de manutenção do módulo
```

---

## Como Cadastrar uma Nova Pesquisa

As pesquisas são nós do grafo de conteúdo. Crie a pasta `src/content/researches/<id>/` com:
1. `<id>.md` — estrutura: `date`, `authors`, `paper_url`, `techs`, `topics`, `roles`
2. `<id>.pt.md` e `<id>.en.md` — `title`, `institution`, `award`, `description`

O formato completo está no [GRAPH.md](../../../GRAPH.md) (seção 4.7). A antiga `category` passou a ser o primeiro tópico (`topics`), e as `tags` são os nomes das techs e tópicos ligados. Depois rode `npm run check:content` e `npm run content:index`.

---

## Composable: `useResearchesFilter(researchesSource, resolveFn)`

Gerencia todo o estado reativo da página:

* **Filtros e Busca**:
  * `searchQuery`: Busca em tempo real por termo em título, resumo, categoria, autores, instituição e tags.
  * `selectedCategory`: Categoria selecionada (`'ALL'` por padrão).
  * `selectedYear`: Ano selecionado (`'ALL'` por padrão).
  * `selectedAward`: Premiação selecionada (`'ALL'` por padrão).
  * `selectedTag`: Tecnologia/área selecionada (`'ALL'` por padrão).
* **Opções Dinâmicas**:
  * `availableCategories`, `availableYears`, `availableAwards`, `availableTags`.
* **Resultados e Ações**:
  * `filteredResearches`: Lista computada com todas as condições aplicadas.
  * `resultsCount` e `totalCount`: Contadores numéricos para feedback visual.
  * `hasActiveFilters`: Flag booleana indicando se há filtros aplicados.
  * `clearFilters()`: Restaura todos os filtros para o estado inicial.

---

## Boas Práticas & Dicas de Manutenção

1. **Paridade Bilíngue**: O `npm run check:content` acusa textos que existem num idioma e não no outro.
2. **Links Opcionais**: Quando o artigo não possuir link público ou DOI ativo, omita `paper_url` para evitar que botões vazios ou quebrados sejam renderizados.
3. **Tipografia Padrão**: Títulos de pesquisas utilizam a fonte **Montserrat** (`var(--font-body)`), mantendo a fonte arcade (`var(--font-heading)`) restrita ao cabeçalho da página.
