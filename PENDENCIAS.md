# Pendências — vichsort-portifolio

O que falta, em ordem de prioridade. Revisada em 2026-10-08 contra o código.

- **Concluído sai daqui.** O histórico fica no git: cada commit cita o código da pendência (`git log --grep n23`), e o que vira regra ou decisão vai para o documento da área (ARCHITECTURE, DESIGN, GRAPH, README da pasta).
- **Códigos fixos.** `n` interface, `a` fundação técnica, `c` conteúdo, `s` sugestão. O número não muda nem é reaproveitado.
- **Etiqueta** entre colchetes: onde mora o trabalho.

---

## 1. Agora

O que o visitante sente nos primeiros segundos, e o que impede divulgar o link.

- **`n19`** `[graph]` `[contact]` **Mobile.** Em 390px, o Grafo fica com 530px (a matriz não tem contêiner de rolagem) e o Contato com 417px (um ícone 3px para fora). O `overflow-x: hidden` do `body` não impede o arrasto lateral no iOS. A matriz, o mapa e os tooltips dos gráficos dependem de hover e não funcionam no toque.
- **`c1`** `[config]` **Contato e redes reais** em `core/config/profile.js` (placeholders, há um `TODO`).

## 2. Próximo

Já decidido, melhora o site ou a base de código.

### Interface

- **`n21`** `[graph]` **Página do Grafo: UX e adições.**
  - Problemas: na matriz tech × projeto, as colunas giram e cortam nomes ("Cemitério Caboclo" vira "Cemitério"), ela depende de hover e estoura no celular; a adoção no tempo tem 39 linhas sem agrupamento; no mapa, as techs são quadrados sem nome, sem zoom, busca nem filtro; os gráficos não conversam entre si.
  - Adições: seleção ligada entre os três gráficos; filtro de período e de tipo no topo; "top 10 + ver todos"; techs agrupadas por área, nas cores das stacks; as análises do `s1`.
- **`n27`** `[core]` **Seleção de texto restrita e colorida.** Moldura sem seleção (navbar, footer, botões, badges, títulos pixel); seleção só no texto corrido (markdown, resumos, terminal), com `::selection` no neon da área. Hoje: um `::selection` global em `reset.css` e alguns `user-select: none` soltos.
- **`n7`** `[contact]` **Redesenhar a tela de contato** na identidade do hero e do footer.

### Fundação técnica

Ordem combinada: `a10` → `a11` → `a12` → `a13`.

- **`a10`** `[docs]` **ARCHITECTURE.md como guia de construção.** Curto e normativo: o que **deve** e o que **nunca** se faz; camadas e quem importa quem (`core` não importa `shared`/`modules`; `shared` não importa `modules`; módulo não importa módulo, salvo exceções registradas); onde cada coisa mora; receitas (página, módulo, componente, tipo de nó, idioma, comando do terminal); definição de pronto (`check:content`, `typecheck`, `build`, PENDENCIAS, formato do commit). Não explica o funcionamento: aponta para o README da pasta (`a11`). O que der para checar vira `npm run check`: cor fixa, `aria-label`/`title`/`alt` escritos à mão, import entre módulos fora da lista, `height` fixo em `px` com texto.
- **`a11`** `[docs]` **README por pasta**, no tom do Beta (Atena): o que a pasta é, como funciona, por quê, armadilhas e como estender. Existem `about`, `graph`, `projects` e `researches` (o GRAPH.md faz o papel do de `core/content`). Faltam:
  - `core/i18n`, `core/router`, `core/styles`, `core/config`;
  - `shared/ascii`, `shared/components/ui/menu`, `shared/components/node`, `shared/composables`;
  - os módulos `home`, `gallery`, `certifications`, `contact`, `testimonials` e `terminal` (o do terminal herda o antigo `terminal.md`: princípios, pipeline do interpretador, contrato do comando e catálogo);
  - `scripts/`.

  Esperando um README do Beta como modelo.
- **`a12`** `[core]` `[terminal]` **Testes.** Não há nenhum. Vitest na lógica pura: `core/content` (montagem do grafo, validação, consultas, fallback de idioma, menu de nó) e o núcleo do terminal (lexer, pipes e `&&`, dispatcher, completion, histórico, VFS). Rodar no `npm run check` (`a10`).
- **`a13`** `[core]` **Bundle principal menor.** O arquivo que toda página baixa tem ~718kB (~243kB comprimido): bibliotecas (~350kB), todo o conteúdo do vault em pt e en (~143kB, inclusive o texto completo dos projetos para quem só abre a home) e os dicionários dos 4 idiomas (~96kB; o do terminal é o maior). Em ordem de impacto:
  1. separar estrutura de texto no grafo: a estrutura (~16kB) vai junto e o texto de cada nó só quando alguém abre o nó (a API de texto do `core/content` fica assíncrona);
  2. carregar só o idioma ativo, de dicionários e de conteúdo;
  3. bibliotecas num arquivo à parte, para o cache sobreviver aos deploys.

  1 e 2 cortam ~40%. Fazer depois do `a11` e do `a12`.
- **`a17`** `[core]` **TypeScript nos componentes.** O ganho real é `<script setup lang="ts">` com props tipadas: o `vue-tsc` passa a pegar prop errada e evento inexistente (o `ProjectCard` ainda trata campos que não existem mais: `name`, `link_github`, `tags`, `short_description`). Migrar só os `.js` rende pouco; vale para a lógica pura (`forceLayout`, `graphData`, `useListingFilters`, `useTimeline`), junto dos testes do `a12`. Quebrar os `.vue` grandes também rende pouco, porque o tamanho é CSS; o que reduz é extrair padrões repetidos (botões, badges, cabeçalhos de seção).
- **`a15`** `[docs]` **README do repositório.** Ainda é o do template do Vite. Deve dizer o que o site é e mostrar um print, a stack, como rodar e publicar; e apontar para ARCHITECTURE, DESIGN e GRAPH.

## 3. Esperando material

Depende do Vitor, não de código.

- **`c3`** `[content]` **Revisar o conteúdo gerado do LinkedIn.** Certificações, marcos da timeline, fotos da galeria e as techs `arduino`, `scratch`, `mblock` e `aws-lambda` vieram do export do LinkedIn e estão com `source: auto-generated`: revisar e apagar a linha. As techs novas ainda não têm `icon.svg`. Os 61 nós de vocabulário marcados `source: placeholder` (techs, tópicos, categorias, cargos, grupos e as coleções das stacks) ficaram porque os projetos reais e as stacks apontam para eles: revisar os textos e apagar a linha. Várias techs só têm a estrutura, sem texto pt/en.
- **`c5`** `[gallery]` **Mais fotos na galeria.** São 4, todas de 2024 (Hackathon Agro e a despedida do prof. Mazzutti). Faltam as de 2025 (Feira de Itá, MIC, Hackathon do IFC, CICC), que o export do LinkedIn não trouxe. Cada foto é um nó com a imagem como `cover.jpg` (`npm run content:new -- photo <id>`).
- **`c6`** `[content]` **Acabamento dos projetos.** `cover.jpg` em 15 dos 18 (só Cemitério, CICC e Trucaralho têm). A premiação do Energin (`researches/feira-energia-limpa-ita`) é provisória. Revisar os textos `source: auto-generated` e apagar a linha.
- **`c8`** `[about]` `[home]` **Revisar os textos do Sobre gerados por IA** a partir do LinkedIn e dos projetos: perfil (`s1_profile`), README (`readme_intro`, "O que me guia" e os 4 pilares, `readme_now_text`) e os 2 slides da home (`about.slide1`/`slide2`), nos 4 idiomas. Os dicionários não têm `source: auto-generated`, então a marca fica aqui.
- **`c7`** `[terminal]` **Currículo em PDF**, um por idioma, em `src/assets/resume/resume.<idioma>.pdf`. O comando `resume` e o `resume.pdf` do VFS aparecem sozinhos.
- **`n8`** `[certifications]` **Modal de certificação** (decidido): o que foi estudado (conteúdo, carga horária, techs) e a imagem da credencial, sem obrigar a baixar nada. As certificações reais já estão no site.
- **`a5`** `[i18n]` **Revisar as traduções es/it**, feitas por IA a partir do pt; principalmente o Sobre e os depoimentos. Depois do `c8`, para não revisar texto que vai sair. Os depoimentos ficam nos dicionários (`testimonials/locales`), não no grafo: cada idioma novo traduz esses itens também.
- **`c4`** `[content]` **Abrir `src/content/` no Obsidian** e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

## 4. Ideias

Não decididas. Viram pendência quando aprovadas.

- **`s1`** `[graph]` **Análises com o que o grafo já tem.**
  - domínios de atuação (`topics`);
  - projetos em paralelo no tempo (pico de 9 em out/2025);
  - coocorrência de techs (Flask + Python em 9 projetos);
  - linguagem por trás de cada projeto (ligações tech → tech);
  - rede de coautoria (32 coautores em 9 pesquisas);
  - produção por ano, perfil por cargo (`roles`) e tipo de entrega (`category`).
- **`s2`** `[projects]` **Métricas por projeto.** Campo `metrics:` no frontmatter (usuários, acurácia, dataset, latência) em cards de números no detalhe. Os números vêm do Vitor.
- **`s3`** `[scripts]` **Atividade do GitHub no build.** Linguagens e commits por mês num JSON, com um heatmap. Depende da API e de um token.
- **`s4`** `[content]` **Gráficos a partir de CSV no nó** (`data.csv` na pasta do projeto ou da pesquisa). Para quando houver análises de dados reais.
- **`s5`** `[content]` **Revisar as ligações de data science.** O cargo `data-science` está em só 2 dos 18 projetos; pytorch, databricks, qgis, postgis, leaflet e openstreetmap não têm nenhum projeto apontando; o PlantE é computer-vision sem tech de ML. Como os gráficos saem dos dados, hoje eles contam a história de um dev web.
- **`s11`** `[config]` **Capa padrão por idioma.** O `og-default.jpg` é o hero em inglês: no site em pt, os projetos sem capa mostram "Hello! My name is". Fazer uma por idioma, ou uma sem texto.
