# Módulo Grafo (`src/modules/graph`)

Gráficos a partir do grafo de conteúdo (`a4`): a página `/graph` e a prévia no Sobre (logo depois do stack).

---

## O que mostra

* **Mapa de conhecimento** (`KnowledgeGraph`): projetos, pesquisas reais e as techs que os ligam. Tipo de nó = cor + forma (círculo, quadrado, losango), então a identidade não depende só da cor. Rótulos seletivos: os projetos sempre (menos em tela estreita); o resto com hover ou foco, junto com os vizinhos. Clique leva à página do nó ou abre o menu de nó (techs). No toque, o primeiro toque seleciona e o segundo abre.
* **Adoção no tempo** (`TechAdoptionChart`): uma linha por tech, uma barra fina por projeto no período dele; sobreposição escurece. Com `limit`, só as techs mais usadas (a prévia do Sobre usa 10). Tem a versão em tabela logo abaixo.
* **Tecnologia × projeto** (`TechMatrix`): uma `<table>` de verdade, que já é a versão acessível. Hover destaca linha e coluna e escreve a leitura acima.

Só ligações de estrutura (campo `techs`) contam, então o resultado é igual em todos os idiomas. Pesquisas e certificações com `source: placeholder` ficam de fora; nós sem nenhuma ligação também (não aparecem no mapa, mas entram nas contagens do topo).

## Cores

Tokens `--viz-*` em `core/styles/tokens.css` (ver [DESIGN.md](../../../DESIGN.md)):

* `--viz-accent`: tom único da adoção e da matriz (no escuro, mais claro que o `--primary` para passar de 3:1 sobre a superfície).
* `--viz-project`, `--viz-tech`, `--viz-research`: paleta categórica de 3 cores, validada nos dois temas para todos os pares (é o limite para gráficos em que todos os pares aparecem juntos). Um quarto tipo de nó não ganha cor nova: entra com forma ou vira "outros".

## Estrutura

```
src/modules/graph/
├── core/
│   ├── graphData.js      # Dados puros: períodos dos projetos, uso de techs, nós e arestas, contagens
│   └── forceLayout.js    # Layout de forças determinístico (mesma entrada, mesmo desenho)
├── composables/
│   └── usePeriod.js      # Meses e períodos no idioma ativo (Intl)
├── components/
│   ├── GraphPreviewSection.vue   # Prévia no Sobre + "Explorar o grafo"
│   ├── KnowledgeGraph.vue
│   ├── TechAdoptionChart.vue
│   ├── TechMatrix.vue
│   └── ChartTooltip.vue          # Tooltip compartilhado (valor primeiro, rótulo depois)
├── views/
│   └── GraphView.vue     # /graph: contagens, mapa, adoção, matriz
└── locales/              # pt, en, es, it (chave graph.*)
```
