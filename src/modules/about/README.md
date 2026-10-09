# Módulo Sobre Mim (`src/modules/about`)

Módulo responsável pela página de apresentação pessoal e profissional (`/overview`), detalhando informações biográficas, stack de desenvolvimento, filosofia de engenharia, linha do tempo interativa e galeria de registros de campo em Bento Grid.

---

## Arquitetura & Princípios

* **Desacoplamento Visual & Semântico**: Cada seção da página (`s1` a `s6`) é um componente isolado e testável de forma independente.
* **Storytelling Interativo & Acessibilidade**:
  * A linha do tempo (**s4**, `TimelineSection`) tem a coluna da esquerda presa na tela (título, trilha de anos e filtros) e os marcos rolando à direita, agrupados por ano; o ano ativo acompanha a rolagem (`IntersectionObserver`). Sem scroll lock: igual com movimento reduzido, e uma coluna só no celular.
  * Os marcos são todos reais e vêm do grafo: nós da timeline (formação, trabalho), pesquisas e projetos em destaque (`featured: true`), montados no `OverviewView`.
* **Galeria Bento Box (3x2)**: A seção **s6** (só quando há fotos) exibe registros de fotos e momentos em uma grade assimétrica (retrato, paisagem e quadrados) com placeholders visuais e link para a galeria completa (`/gallery`, módulo `gallery`).
* **Stack em uso (s2b)**: logo depois do stack entra a prévia dos gráficos (`GraphPreviewSection`, do módulo [graph](../graph/README.md)), com o link para `/graph`.
* **Fontes de Dados**: Os marcos da timeline (`src/content/timeline/`, pesquisas e projetos em destaque) e o stack vêm do grafo de conteúdo (a coleção `about-stack`, ver [GRAPH.md](../../../GRAPH.md)). As fotos da galeria vêm de `src/content/gallery/`. Perfil e textos do README ficam em `src/modules/about/locales/`, um arquivo por idioma.

---

## Estrutura de Arquivos

```
src/modules/about/
├── components/
│   ├── ProfileSummarySection.vue    # s1: Perfil direto, formação na UFSM, status e contato
│   ├── CoreStackSection.vue         # s2: Stack principal e ferramentas do dia a dia
│   ├── DescriptionSection.vue       # s3: Grid dividindo narrativa autoral e janela macOS
│   ├── MacWindow.vue                # Componente de moldura com controles de janela do macOS
│   ├── GithubReadmeContent.vue      # Conteúdo estilizado como Markdown do GitHub
│   ├── TimelineSection.vue          # s4: Linha do tempo: coluna presa (anos, filtros) e marcos por ano
│   ├── TimelineItemCard.vue         # Card reutilizável de evento da timeline
│   └── GallerySection.vue           # s6: Galeria Bento Grid de registros de campo e bastidores
├── composables/
│   └── useTimeline.js               # Filtro por categoria, ordem e agrupamento por ano
├── locales/
│   └── <idioma>.json                # Textos de UI e perfil (pt, en, es, it)
├── views/
│   └── OverviewView.vue             # Orquestrador da rota '/overview' e bloco final de CTA
└── README.md                        # Documentação e guia de manutenção do módulo
```

---

## Fotos da Galeria

As fotos são nós do grafo de conteúdo, em `src/content/gallery/<id>/` (tipo `photo`): a imagem fica na pasta como `cover.*`, e cada idioma tem título, legenda e local. A seção **s6** mostra as quatro mais recentes; a página completa fica no módulo `gallery` (`/gallery`).

```
npm run content:new -- photo minha-foto
```

O campo `format` da estrutura define o encaixe na grade do Sobre:
* `portrait`: Foto vertical ocupando 2 linhas de altura (`grid-row: span 2`).
* `landscape`: Foto horizontal ocupando 2 colunas de largura (`grid-column: span 2`).
* `square`: Foto padrão de 1 coluna x 1 linha (`1x1`).

---

## Boas Práticas de Manutenção

1. **Paridade de Locales**: Mantenha as chaves sincronizadas entre os arquivos de todos os idiomas em `locales/`.
2. **Fallback Visual**: Caso uma imagem física ainda não exista na pasta `public/`, o card renderiza automaticamente um padrão geométrico e ícone de placeholder elegante sem quebrar o layout.
3. **Tipografia e Tokens**: Títulos seguem a tipografia `Montserrat` (`var(--font-body)`), mantendo a fonte arcade exclusivamente para os cabeçalhos de seção.
