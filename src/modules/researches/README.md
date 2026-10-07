# Módulo de Pesquisas (`src/modules/researches`)

Módulo responsável pela listagem, filtragem e exibição de artigos acadêmicos, premiações e projetos de iniciação científica do portfólio.

---

## Arquitetura & Fonte de Dados

* **Fonte de Dados**: As pesquisas são nós do grafo de conteúdo, em `src/content/researches/<id>/` (ver [GRAPH.md](../../../GRAPH.md)). Os arquivos `locales/` guardam só os textos de interface.
* **Deep Merge Automático**: O motor i18n central do projeto compila e mescla automaticamente os dicionários deste módulo sob a chave de namespace `researches_page`.
* **Busca e Filtros**: Busca e filtros vêm do `useListingFilters` e da barra `ListingToolbar` (em `src/shared/`), comuns a projetos, pesquisas e certificações; a escolha grade/lista é global (`useListingView`). Com `?ref=<id>` na URL (`useRefFilter`), a listagem mostra só o que aponta para esse nó, com um chip removível na barra. As opções de categoria, premiação e ano saem da própria lista. Na grade as pesquisas ficam em duas colunas, com o resumo encurtado (`ResearchCard` com `compact`).

---

## Estrutura de Arquivos

```
src/modules/researches/
├── components/
│   └── ResearchCard.vue          # Card para exibição de cada pesquisa com metadados e badges
├── locales/
│   └── <idioma>.json             # Textos de UI (pt, en, es, it)
├── views/
│   └── ResearchesView.vue        # Rota '/researches' (barra de busca e filtros + grade ou lista)
└── README.md                     # Documentação e guia de manutenção do módulo
```

---

## Como Cadastrar uma Nova Pesquisa

As pesquisas são nós do grafo de conteúdo. Crie a pasta `src/content/researches/<id>/` com:
1. `<id>.md` — estrutura: `date`, `authors`, `paper_url`, `techs`, `topics`, `roles`
2. `<id>.pt.md` e `<id>.en.md` — `title`, `institution`, `award`, `description`

O formato completo está no [GRAPH.md](../../../GRAPH.md) (seção 4.7). A antiga `category` passou a ser o primeiro tópico (`topics`), e as `tags` são os nomes das techs e tópicos ligados. Depois rode `npm run check:content` e `npm run content:index`.

---

## Boas Práticas & Dicas de Manutenção

1. **Paridade Bilíngue**: O `npm run check:content` acusa textos que existem num idioma e não no outro.
2. **Links Opcionais**: Quando o artigo não possuir link público ou DOI ativo, omita `paper_url` para evitar que botões vazios ou quebrados sejam renderizados.
3. **Tipografia Padrão**: Títulos de pesquisas utilizam a fonte **Montserrat** (`var(--font-body)`), mantendo a fonte arcade (`var(--font-heading)`) restrita ao cabeçalho da página.
