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
│   ├── pt.json                   # Dicionário e listagem em Português
│   └── en.json                   # Dicionário e listagem em Inglês
├── views/
│   └── ResearchesView.vue        # Rota '/researches' (Toolbar de filtros + Lista + Empty state)
└── README.md                     # Documentação e guia de manutenção do módulo
```

---

## Como Cadastrar uma Nova Pesquisa

Para adicionar uma nova pesquisa ou artigo, insira o objeto correspondente no array `researches_page.list` dentro de:
1. `src/modules/researches/locales/pt.json`
2. `src/modules/researches/locales/en.json`

### Exemplo de Entrada

```json
{
  "id": 4,
  "title": "Título Completo da Pesquisa ou Artigo",
  "category": "Inteligência Artificial & Agritech",
  "institution": "UFSM — Universidade Federal de Santa Maria",
  "authors": "Vitor Mignoni, et al.",
  "award": "1º Lugar — Apresentação Técnica",
  "year": "2024",
  "description": "Resumo detalhado dos objetivos, metodologia aplicada e resultados alcançados pelo estudo.",
  "paper_url": "https://doi.org/10.xxxx/xxxxx",
  "tags": ["Computer Vision", "Edge Computing", "PyTorch", "Python"]
}
```

---

## Especificação do Schema de Pesquisa

| Campo | Tipo | Obrigatório | Descrição / Exemplo |
| :--- | :--- | :---: | :--- |
| `id` | `Number` / `String` | **Sim** | Identificador único da pesquisa. |
| `title` | `String` | **Sim** | Título do artigo ou projeto de pesquisa. |
| `category` | `String` | **Sim** | Área/subárea da pesquisa (ex: `Iniciação Científica & GIS`, `Sistemas Distribuídos`). Alimenta o dropdown de categorias. |
| `institution` | `String` | Não | Instituição de ensino, núcleo ou laboratório de vínculo (ex: `UFSM`). |
| `authors` | `String` | Não | Nome dos autores e colaboradores do trabalho (ex: `Vitor Mignoni, et al.`). |
| `award` | `String` | Não | Premiação ou menção recebida (ex: `1º Lugar`, `Menção Honrosa`). Se vazio (`""`), a badge de prêmio é omitida. |
| `year` | `String` | **Sim** | Ano de realização ou publicação (ex: `"2024"`). Alimenta o dropdown de anos. |
| `description` | `String` | **Sim** | Resumo claro e descritivo do trabalho. |
| `paper_url` | `String` | Não | Link externo para o artigo (PDF, DOI ou repositório). Se vazio (`""`), o botão de ação é omitido. |
| `tags` | `Array<String>` | Não | Tecnologias, frameworks ou metodologias empregadas. Alimentam o filtro de tecnologia e tags clicáveis. |

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

1. **Paridade Bilíngue**: Mantenha sempre sincronizados os arquivos `pt.json` e `en.json` com os mesmos `id`s e quantidade de itens.
2. **Links Opcionais**: Quando o artigo não possuir link público ou DOI ativo, deixe `"paper_url": ""` para evitar que botões vazios ou quebrados sejam renderizados.
3. **Tipografia Padrão**: Títulos de pesquisas utilizam a fonte **Montserrat** (`var(--font-body)`), mantendo a fonte arcade (`var(--font-heading)`) restrita ao cabeçalho da página.
