# Pendências /// vichsort-portifolio

O que falta, em ordem de prioridade. Revisada em 2026-10-13 contra o código.

- **Concluído sai daqui.** O histórico fica no git: cada commit cita o código da pendência (`git log --grep n23`), e o que vira regra ou decisão vai para o documento da área (ARCHITECTURE, DESIGN, GRAPH, README da pasta).
- **Códigos fixos.** `n` interface, `a` fundação técnica, `c` conteúdo, `s` sugestão. O número não muda nem é reaproveitado.
- **Etiqueta** entre colchetes: onde mora o trabalho.

---

## 1. Agora

O que o visitante sente nos primeiros segundos, e o que impede divulgar o link. Prioridade, não ordem de execução: o que depende de material espera o material, e enquanto isso segue o Próximo.

- **`c1`** `[config]` **Contato e redes reais** em `core/config/profile.js` (placeholders, há um `TODO`).
- **`a15`** `[docs]` **README do repositório.** Ainda é o do template do Vite, e quem recebe o link costuma abrir o GitHub. Deve dizer o que o site é e mostrar um print, a stack, como rodar e publicar; e apontar para ARCHITECTURE, DESIGN e GRAPH. Com o badge da CI (`a12`).
- **`c8`** `[about]` `[home]` **Revisar os textos do Sobre gerados por IA** a partir do LinkedIn e dos projetos. É o texto em que o Vitor fala de si, e está na home: perfil (`s1_profile`), README (`readme_intro`, "O que me guia" e os 4 pilares, `readme_now_text`) e os 2 slides da home (`about.slide1`/`slide2`), nos 4 idiomas. Os dicionários não têm `source: auto-generated`, então a marca fica aqui.

## 2. Próximo

Já decidido, melhora o site ou a base de código.

Ordem combinada: `c9` → documento de desenho do `n21` → `n21`. A fundação técnica tem ordem própria (abaixo); entre as duas, ainda não decidido.

### Interface

- **`n21`** `[graph]` `[content]` **Página do Grafo como peça de arte e de dados.** A página não só mostra o que foi feito: mostra que o Vitor pensa fora da caixa, como num Obsidian. Tem que ser fonte de dados e impressionar. Três camadas na mesma página: **arte** (o mapa vivo, na identidade do site: neon, a estética ASCII do hero), **fonte** (tudo navegável até o nó) e **ciência** (análises que revelam o que não se vê lendo os projetos um a um, com o método à mostra).

  Antes de código, um documento de desenho curto para aprovar: o modelo de interação, as perguntas que a página responde e a biblioteca do mapa. Em aberto: o que é mais importante mostrar (define a hierarquia) e quais análises são mais "o Vitor".

  - **Problemas de hoje.** O clique leva à página quando o nó tem uma e abre o menu quando não tem (tech, tópico): quem usa não prevê. O layout é calculado uma vez e desenhado parado, sem zoom, arrastar nem movimento: parece travado. Tudo depende de hover e não funciona no toque. Na matriz tech × projeto, as colunas giram e cortam nomes ("Cemitério Caboclo" vira "Cemitério") e, no celular, ela só cabe rolando de lado; a adoção no tempo tem 39 linhas sem agrupamento; os gráficos não conversam entre si.
  - **Interação, no estilo Obsidian.** Clique esquerdo seleciona (destaca os vizinhos e abre um painel lateral com resumo, ligações e "abrir"), nunca navega direto; duplo clique ou o botão do painel abre a página; clique direito abre o menu de nó do site; roda dá zoom, arrastar o fundo move a vista, arrastar um nó mexe nele e a simulação reage e assenta; grafo local (o nó e os vizinhos de 1 ou 2 níveis). No toque: tocar seleciona, pinça dá zoom, pressionar e segurar abre o menu.
  - **Biblioteca do mapa.** Em TS puro, sem Vue nem imports do site (física, canvas, zoom e arrastar, eventos), escrita como se já fosse biblioteca. Proposta para o documento de desenho: a física pelo `d3-force` (pequeno, sem DOM) e o resto à mão (canvas, zoom, eventos, toque), que é a parte que mostra trabalho; o componente Vue só a envolve. Fica neste repositório, numa pasta isolada, enquanto a API muda; extrair para um repositório próprio (e publicar) quando estabilizar, e ela vira um projeto de portfólio por si. Um clone do Obsidian inteiro (editor, vault, plugins) fica fora: é outro produto.
  - **Etapas, nesta ordem:**
    1. **Auditoria do vault** (`c9`), antes de tudo: as análises só valem se as ligações estiverem certas.
    2. **Análises no build**, entregues e testadas antes de a página nova existir. O plugin de conteúdo (`scripts/contentPlugin.mjs`) calcula e entrega um módulo pronto (`virtual:content/analytics`): leve no navegador, reproduzível e atualizado com o conteúdo. Cada análise responde uma pergunta que alguém faria sobre o Vitor, e traz uma nota de "como foi calculado". O dado é descritivo (cerca de 140 nós, 18 projetos), não estatístico; serve bem à análise de rede. Candidatas, da mais forte à mais simples:
       - comunidades: o algoritmo descobre os grupos de atuação sozinho, para comparar com os tópicos manuais;
       - centralidade de intermediação: as techs e os temas que fazem ponte entre áreas (o Python entre web e dados?);
       - eras do stack: quando cada tech entra e sai, projetos em paralelo (pico de 9 em out/2025);
       - similaridade entre projetos (Jaccard das ligações), projetada em 2D: o mapa dos parecidos;
       - rede de coautoria: 32 coautores em 9 pesquisas.

       Comunidades e centralidade também desenham o mapa: as comunidades viram regiões e a centralidade, o tamanho do nó. Ciência e arte na mesma peça.
    3. **A biblioteca do mapa**, com teste (`a12`).
    4. **A página.** O mapa interativo como protagonista, em largura total, com o painel lateral; embaixo, as análises, que filtram junto com a seleção no mapa. Período e tipo como filtros; techs agrupadas por área, nas cores das stacks.
- **`n7`** `[contact]` **Redesenhar a tela de contato** na identidade do hero e do footer.

### Conteúdo

- **`c9`** `[content]` **Auditoria do vault.** Saiu do `n21`: os arquivos são os mesmos do `c3`, só o Vitor fecha, e já melhora o grafo de hoje. Se o PlantE não aponta para as techs de ML, o grafo diz que o Vitor não faz ML. Hoje o cargo `data-science` está em só 2 dos 18 projetos; pytorch, databricks, qgis, postgis, leaflet e openstreetmap não têm projeto apontando; o PlantE é computer-vision sem tech de ML. Fazer junto com o `c3` (os nós `source: placeholder`).

### Fundação técnica

Decidido em 2026-10-13, no brainstorm do `a10` (padrão de mercado, recortado para um portfólio de uma pessoa só). Ordem: a estrutura primeiro, depois o lint que a protege, depois a documentação, que descreve o resultado: `a18` → `a19` → `a20` → `a22` com `a10` e `a21` → `a23` com `a15`. O `a24` e o `a25` entram a qualquer momento.

- **`a18`** `[core]` **Router fora de `core`: `src/router/index.ts`.** Ele monta o app (conhece as páginas de todos os módulos), então fica com o `main.js` e o `App.vue`, acima das camadas. Fica em `core` o que é dado puro: o `pages.js` (lido pela navbar, pelo footer e pelos scripts de build). O `scrollToHash.js` vai com o router ou fica, conforme quem usa. Quem hoje importa o arquivo do router (`useViewTransition`, a diretiva `contentLinks`, o `useTerminal`) passa a pegá-lo pelo Vue (`useRouter()`, ou pela instância na diretiva): isso desfaz o import circular router → `useViewTransition` → router.
- **`a19`** `[core]` **Camadas com API pública por módulo.** Camadas: app (`main`, `App`, `router`) → `modules` → `shared` → `core`; cada uma só importa as de baixo, e `core` só importa `core`. Cada módulo tem um `index.ts` que exporta o que os outros podem usar; import de dentro da pasta de outro módulo é proibido. `home` e `about` são módulos de página: compõem os módulos de área pela API pública (vitrine de projetos, depoimentos, terminal, prévia do grafo); o contrário não vale. Sem camada `widgets/` (considerada e descartada: separaria a vitrine do resto de projetos). O `graphData.js` vai para `core/content/` (cálculo sobre o grafo, base das análises do `n21`), e a exceção do `neofetch` deixa de existir.
- **`a20`** `[ci]` **Lint e formatação no `npm run check` e na CI.**
  - ESLint (flat config) com `eslint-plugin-vue`, `typescript-eslint`, `eslint-plugin-boundaries` (as camadas e a API pública do `a19`) e `@intlify/eslint-plugin-vue-i18n` (`no-raw-text`: texto e `aria-label`/`title`/`alt` escritos à mão).
  - Stylelint com `stylelint-declaration-strict-value`: cor só existe em `tokens.css`, sem exceção. Antes, as cores que hoje são exceção viram tokens que não mudam com o tema (botões da janela do macOS, texto e degradê sobre foto, sombra em preto translúcido).
  - Prettier: ponto e vírgula, aspas simples, 80 colunas, vírgula no fim (`trailingComma: "all"`, o padrão). Um commit só de formatação, registrado no `.git-blame-ignore-revs` (o `git blame` pula esse commit; no GitHub é automático, localmente `git config blame.ignoreRevsFile .git-blame-ignore-revs`).
  - Depende do `n29` (o `VITOR` escrito à mão sai dos templates).
- **`a22`** `[docs]` **Código e documentação em inglês.** Comentários (cerca de 800 blocos) e documentos (ARCHITECTURE, DESIGN, GRAPH, READMEs, ADRs). O conteúdo do site continua nos quatro idiomas; o PENDENCIAS continua em português (é lista de trabalho, não documentação). As regras de comentário continuam: dizer o porquê, nada que repita o código.
- **`a10`** `[docs]` **ARCHITECTURE.md como guia de construção**, em inglês, no formato que virou referência (o do matklad): visão de cima, mapa do código (uma linha por pasta) e invariantes (as regras de camada do `a19`, cor só em token, texto só de dicionário, conteúdo no grafo, título com `v-fit-title`, movimento pela `motion-off`). Mais as receitas (página, módulo, componente, tipo de nó, idioma, comando do terminal) e o fluxo de trabalho: definição de pronto (`npm run check` passando, PENDENCIAS e documento da área atualizados), formato do commit. Não repete DESIGN e GRAPH: aponta para eles. O que hoje explica o funcionamento (i18n, conteúdo) fica num parágrafo curto até os READMEs de pasta (`a11`). O texto atual tem o tom que limpamos nos comentários e sai inteiro.
- **`a21`** `[docs]` **ADRs em `docs/adr/`**: uma decisão por arquivo (contexto, decisão, consequências), numerados, nunca editados; uma decisão nova substitui a antiga. Daqui em diante, decisão vira ADR em vez de ficar só no item do PENDENCIAS, que some quando é concluído. Retroativos: conteúdo como vault do Obsidian; vault lido no build (`a13`); router fora de `core` (`a18`); camadas com API pública (`a19`); cor só em token; interruptor de animação vence o sistema (`n28`); seleção (`n27`); código e documentação em inglês (`a22`); licença (`a23`).
- **`a23`** `[docs]` **Licença e contribuições.** MIT para o código e o NEAT (tokens, componentes, logo, o `///`). Com todos os direitos reservados: `src/content/`, as imagens de `public/` e os textos sobre o Vitor nos dicionários (Sobre, depoimentos). `LICENSE` na raiz e o recorte explicado no README (`a15`). O projeto não aceita PRs (o `master` protegido já garante que só o Vitor aprova); um `CONTRIBUTING.md` curto diz isso e convida para issues e conversas: o código está aberto para quem quiser aprender.
- **`a24`** `[ci]` **Acessibilidade com o axe no Playwright** (`@axe-core/playwright`): uma auditoria por rota, no teste que já percorre todas.
- **`a25`** `[ci]` **CI em jobs separados e Dependabot.** Lint, typecheck, unit, e2e e build em paralelo, para dizer de cara o que quebrou; o Dependabot abre PR para atualizar dependências.
- **`n29`** `[ui]` **`NeatWordmark`**: o `VITOR.` do NEAT como componente, irmão do `NeatLogo`. Hoje está escrito à mão na navbar, no footer e no texto para leitor de tela do hero.

Considerados e descartados no mesmo brainstorm: husky (a CI já barra o que importa; trabalhando sozinho, pre-commit só atrasa), Lighthouse CI (nos runners do GitHub a nota oscila; o que travaria de forma estável já está coberto pelo `check:dist`, pelo Playwright e pelo axe), meta de cobertura (vira número de vaidade) e camada `widgets/` (ver `a19`). Pinia ficou sem decisão.

## 3. Esperando material

Depende do Vitor, não de código.

- **`c3`** `[content]` **Revisar o conteúdo gerado do LinkedIn.** Certificações, marcos da timeline, fotos da galeria e as techs `arduino`, `scratch`, `mblock` e `aws-lambda` vieram do export do LinkedIn e estão com `source: auto-generated`: revisar e apagar a linha. As techs novas ainda não têm `icon.svg`. Os 61 nós de vocabulário marcados `source: placeholder` (techs, tópicos, categorias, cargos, grupos e as coleções das stacks) ficaram porque os projetos reais e as stacks apontam para eles: revisar os textos e apagar a linha. Várias techs só têm a estrutura, sem texto pt/en.
- **`c5`** `[gallery]` **Mais fotos na galeria.** São 4, todas de 2024 (Hackathon Agro e a despedida do prof. Mazzutti). Faltam as de 2025 (Feira de Itá, MIC, Hackathon do IFC, CICC), que o export do LinkedIn não trouxe. Cada foto é um nó com a imagem como `cover.jpg` (`npm run content:new -- photo <id>`).
- **`c6`** `[content]` **Acabamento dos projetos.** `cover.jpg` em 15 dos 18 (só Cemitério, CICC e Trucaralho têm). A premiação do Energin (`researches/feira-energia-limpa-ita`) é provisória. Revisar os textos `source: auto-generated` e apagar a linha.
- **`c7`** `[terminal]` **Currículo em PDF**, um por idioma, em `src/assets/resume/resume.<idioma>.pdf`. O comando `resume` e o `resume.pdf` do VFS aparecem sozinhos.
- **`n8`** `[certifications]` **Modal de certificação** (decidido): o que foi estudado (conteúdo, carga horária, techs) e a imagem da credencial, sem obrigar a baixar nada. As certificações reais já estão no site.
- **`a5`** `[i18n]` **Revisar as traduções es/it**, feitas por IA a partir do pt; principalmente o Sobre e os depoimentos. Depois do `c8`, para não revisar texto que vai sair. Os depoimentos ficam nos dicionários (`testimonials/locales`), não no grafo: cada idioma novo traduz esses itens também.
- **`a11`** `[docs]` **README por pasta**, em inglês (`a22`), no tom do Beta (Atena); o de cada módulo descreve a API pública dele (`a19`): o que a pasta é, como funciona, por quê, armadilhas e como estender. Existem `about`, `graph`, `projects` e `researches` (o GRAPH.md faz o papel do de `core/content`). Faltam:
  - `core/i18n`, `core/router`, `core/styles`, `core/config`;
  - `shared/ascii`, `shared/components/ui/menu`, `shared/components/node`, `shared/composables`;
  - os módulos `home`, `gallery`, `certifications`, `contact`, `testimonials` e `terminal` (o do terminal herda o antigo `terminal.md`: princípios, pipeline do interpretador, contrato do comando e catálogo);
  - `scripts/`.

  Esperando um README do Beta como modelo. Depois do `a10`.
- **`c4`** `[content]` **Abrir `src/content/` no Obsidian** e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

## 4. Ideias

Não decididas. Viram pendência quando aprovadas.

Nenhuma aberta. Em 2026-10-09: `s11` foi decidido; `s1` (análises do grafo) e `s5` (ligações de data science) entraram no `n21`; `s2` (métricas por projeto), `s3` (atividade do GitHub: os commits recentes são privados, e o gráfico mostraria buracos onde mais houve trabalho), `s4` (gráficos de CSV no nó) e `a17` (TypeScript nos componentes) foram descartados.
