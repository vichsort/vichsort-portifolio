# Pendências — vichsort-portifolio

Lista do que falta na interface tradicional. Revisada em 2026-10-07 contra o código.

---

## Em aberto

| # | Pendência | Arquivos | A decidir |
| :--- | :--- | :--- | :--- |
| **`n7`** | **Redesenhar a tela de contato** | `ContactView.vue` | Alinhar à identidade do hero e do footer |
| **`n8`** | **Modal de certificação** | `CertificationsView.vue`, novo `CertificationModal.vue` | Decidido: vai ter. Mostra o que foi estudado (conteúdo, carga horária, techs) e a imagem da credencial sem obrigar a baixar nada. Fazer quando os certificados reais entrarem (`c3`) |

## Terminal

Planejamento original em `terminal.md` (raiz, fora do git). A lista abaixo é o que falta dele, mais o que saiu da revisão do código.

| # | Pendência | Arquivos | Observação |
| :--- | :--- | :--- | :--- |
| **`t6`** | **Currículo (`resume.pdf`)** | `public/`, `vfs/manifest.js`, `commands/portfolio/resume.js` | Decidido: vai ter, um PDF por idioma, feito pelo Vitor (`c7`). Quando os PDFs existirem, o `resume` e o `cat resume.pdf` baixam o do idioma ativo. Até lá o comando anuncia um download que falha |

`t6` espera os PDFs (`c7`). O `terminal.md` fica fora do git (no outro computador): a fonte daqui é este arquivo.

## Fundação técnica

| # | Pendência | Observação |
| :--- | :--- | :--- |
| **`a5`** | **Revisar as traduções es/it** da interface | Feitas por IA a partir do pt; conferir tom e termos, principalmente nos textos do Sobre e dos depoimentos |

O `a5` fica para depois da reescrita do Sobre com os dados reais (`c3`), para não revisar texto que vai sair.

Os depoimentos ficam nos dicionários de interface (`testimonials/locales`), não no grafo: cada idioma novo precisa traduzir esses itens também.

## Sugestões

Ideias ainda não decididas. Viram pendência quando forem aprovadas.

| # | Sugestão | Observação |
| :--- | :--- | :--- |
| **`s1`** | **Análises no `/graph`** com o que o grafo já tem | Hoje só o campo `techs` vira gráfico. Dá para mostrar: domínios de atuação (`topics`, em 16/18 projetos e 11/11 pesquisas), projetos em paralelo no tempo (pico de 9 em out/2025, média de 6,1 meses), coocorrência de techs (Flask + Python em 9 projetos), linguagem por trás de cada projeto (ligações tech → tech), rede de coautoria (32 coautores em 9 pesquisas), produção por ano, perfil por cargo (`roles`) e tipo de entrega (`category`) |
| **`s2`** | **Métricas por projeto** | Campo `metrics:` no frontmatter (usuários, acurácia, tamanho do dataset, latência), mostrado como cards de números no detalhe. Os números vêm do Vitor |
| **`s3`** | **Atividade do GitHub no build** | Script puxa linguagens e commits por mês para um JSON; heatmap de atividade. Depende da API e de um token |
| **`s4`** | **Gráficos a partir de CSV no nó** | `data.csv` na pasta do projeto ou da pesquisa, desenhado na página. Para quando houver análises de dados reais |
| **`s5`** | **Revisar as ligações de data science** | O cargo `data-science` está em só 2 dos 18 projetos (Lago Azul e Prisma); pytorch, databricks, qgis, postgis, leaflet e openstreetmap existem como nós, mas nenhum projeto aponta para eles; o PlantE é computer-vision sem tech de ML. Como os gráficos saem dos dados, sem isso eles contam a história de um dev web |

## Conteúdo real

Os projetos já são reais; o resto do conteúdo ainda é fictício. Depende de material, não de código.

* **`c1`** — Dados de contato e redes em `core/config/profile.js` (placeholders, há um `TODO`).
* **`c6`** — Acabamento dos projetos: `cover.jpg` em 16 dos 18 (só Cemitério e CICC têm); a premiação do Energin (`researches/feira-energia-limpa-ita`) é provisória e falta o grupo nos autores; revisar os textos marcados `source: auto-generated` e apagar a linha.
* **`c5`** — Fotos da galeria: as 4 de exemplo em `src/content/gallery/` não têm imagem (aparecem com placeholder). Colocar cada foto como `cover.jpg` na pasta do nó.
* **`c7`** — Currículo em PDF, um por idioma (pt, en, es, it), feito pelo Vitor. Destrava o `t6`.
* **`c3`** — Certificações, pesquisas, timeline e definições das techs em `src/content/`. Várias techs só têm o arquivo de estrutura, sem texto pt/en. A timeline deve ligar (`link`) os projetos reais.
* **`c4`** — Abrir `src/content/` no Obsidian e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

---

## Concluído

* Ajustes de interface (`n11`–`n14`): o hover que sobe virou opcional (`.surface-card.interactive`, só em card clicável ou item de coleção), e o texto do projeto, as seções do `/graph`, os campos e os estados vazios ficam parados; os carrosséis da home (projetos e depoimentos) ganharam respiro vertical e não cortam mais a subida e a sombra do card; a pílula da navbar ganhou uma seta que troca para as páginas fora dela (Galeria e Grafo), com a largura animada e centralizada, e no mobile elas entram no fim da lista; Sobre, Projetos, Pesquisas, Certificações, Galeria e Grafo usam a mesma largura (`--page-width`, 1100px) e o título começa na mesma borda; o detalhe do projeto e o da foto também (antes 900 e 1000px), e o texto do projeto não soma mais a margem do primeiro título ao padding do card. "Voltar" só nas páginas de detalhe (projeto e foto). O Terminal entrou na segunda página da navbar, junto de Galeria e Grafo. Nas páginas de detalhe a aba da seção fica ativa (por prefixo do caminho: `/projects/<id>` marca Projetos), e o texto do projeto tem largura de leitura (~75 caracteres; imagens e código usam o card todo) (`s6`, `s8`)
* Techs clicáveis no detalhe do projeto (`s7`): cada badge abre o menu de nó (projetos, pesquisas, trajetória e techs relacionadas que usam a tech), sem o próprio projeto; tech sem mais nada para mostrar fica como badge comum. O `NodeMenu` ganhou a prop `exclude`
* Textos de acessibilidade traduzidos (`s9`): os 22 `aria-label`, `title` e `alt` fixos em pt (navbar, carrosséis, card de projeto, busca, configurações, logos) foram para os dicionários nos 4 idiomas
* Prévias de link (`s10`): `scripts/meta.mjs` roda depois do `vite build` e grava um `index.html` por rota (páginas, projetos e fotos) com título, descrição e imagem próprios, em inglês. A imagem é a capa do nó (copiada para `dist/og/`) ou o hero (`public/images/og-default.jpg`, 1200×630). A leitura do vault no Node saiu do `content.mjs` para `scripts/vault.mjs`. Domínio em `SITE_URL` (https://vichsort.com, Cloudflare Pages, que já serve a pasta da rota e cai no `index.html` da raiz para o resto). Projeto sem `cover.jpg` usa o hero como capa também no site (cards e detalhe), via `DEFAULT_COVER`. Título do site: `Vitor /// Software Engineering`
* TypeScript no núcleo (`a3`): `core/content/` e `modules/terminal/core/` em TypeScript estrito, com tipos do grafo (`core/content/types.ts`) e do shell (contrato `Command`, `CommandContext`, `CommandOutput` em `modules/terminal/core/types.ts`); `npm run typecheck` (vue-tsc) sem erros. Só sintaxe apagável e imports `.ts`, para o `scripts/content.mjs` continuar rodando direto no Node. Componentes e o resto do código migram aos poucos, quando forem mexidos
* Terminal no celular (`t13`): em telas ≤ 768px, a página `/terminal` e a seção da home mostram um vídeo de uma sessão gravada (`public/videos/terminal-demo.{webm,mp4}` + pôster; neofetch, projetos em destaque, um artigo, `links` e matrix) e o convite para abrir no computador, com o endereço à vista e o botão de compartilhar (folha nativa) ou copiar o link; na página, também "Voltar ao site". Com movimento reduzido o vídeo fica parado, com controles. No `neofetch`, o Host (que mostraria o domínio) virou Resolution
* Comandos e atalhos do terminal (`t9` + `t11`): `history` (numerado como no bash; `-c` limpa), `exit`/`logout` (encerra a sessão como o vermelho e, na página, volta à home), `gui`/`startx` (volta à interface mantendo a sessão, como o amarelo); Ctrl+A e Ctrl+E levam o cursor ao início e ao fim da linha
* Markdown no terminal no estilo glow (`t16`): `cat *.md` sem card, títulos em caixa alta nos neons com régua (═ no h1, ─ no h2), • nas listas, código em bloco com barra lateral; links externos abrem em nova aba (↗), os internos navegam no site
* Projetos em destaque (`t12`): campo `featured: true` nos projetos (PlantE, tera-cli, Atena, Escutas, Criptografy, Next Signage); o carrossel da home mostra só os destaques, do mais recente ao mais antigo (sem nenhum marcado, mostra todos), e o terminal ganhou `projects --featured`
* Easter eggs do terminal (`t10`): `neofetch` (logo neat reduzido em `ascii/neofetch.txt`, dados reais do site e o stack mais usado, vindo do grafo; num pipe sai como texto), `matrix` (chuva em canvas cobrindo a janela, cores dos tokens, sai com Ctrl+C, Esc, q ou toque; com movimento reduzido só avisa) e `rm` (VFS só leitura; `rm -rf /` treme a janela por ~2s e reinicia a sessão). O terminal ganhou processos em primeiro plano: `context.spawn(nome)` segura o prompt até o fim ou um Ctrl+C
* Gráficos a partir do grafo (`a4`): página `/graph` (módulo `graph`) com contagens, mapa de conhecimento (projetos, pesquisas e techs, cor + forma por tipo, layout de forças determinístico), adoção de techs no tempo e matriz tech × projeto (uma `<table>`, que já é a versão acessível); prévia com as 10 techs mais usadas no Sobre, logo depois do stack. Tokens `--viz-*` com a paleta categórica validada nos dois temas. Ficou de fora a métrica de "projeto complexo"
* Projetos reais (`c2`): 18 projetos em `src/content/projects/` (Atena, Bratz, Cemitério Caboclo, CICC, Criptografy, Dicionário IFC, Energin, Escutas, FAIF, GNX, Hotel MVP, IArte, Lago Azul, Next Signage, PlantE, Projeto Prisma, tera-cli, trucaralho), um por projeto mesmo quando são vários repositórios. Novos nós de apoio: tópicos `edtech` e `generative-ai`, techs `laravel` e `nextjs` (no stack da home) e o prêmio da Feira de Energia Limpa
* Limpeza do núcleo do terminal (`t15`): erros esperados saem como `CommandError` e o dispatcher os formata (sumiram os try/catch repetidos e os `if (!vfs)`); `context.locale`; os 5 comandos que só mostram um arquivo viraram uma fábrica (`fileCommands.js`); `vfs.walk()` para `find` e `grep`; `RULE`/`row` em `core/format.js`; `PromptPrefix` compartilhado. O contrato do comando ganhou `valueFlags` e `complete` (o lexer e o Tab não conhecem mais comandos), e descrição e uso saem do nome (`terminal.commands.<nome>`). Histórico ↑/↓ e Tab viraram lógica pura em `core/input/`; o `useVFS` usa `onChange` do engine no lugar do patch em `cd`. Código morto e `export default` duplicados removidos. Bugs: `help` e `aria-label` do prompt traduzidos, `whoami` lê o cargo do perfil, `sudo` lê o usuário do contexto, chaves que faltavam (`execution_failed`, `links.types.photo`), `ls -l` numa pasta com um só arquivo saía no formato de arquivo. O `grep` passou a diferenciar maiúsculas como o de verdade (antes o `-i` era ignorado e a busca nunca diferenciava); `-i` ignora
* Escopo do terminal recuperado (`t0`): o `terminal.md` voltou para a raiz; o que faltava dele virou `t9`–`t16`
* Terminal na home (`t8`): seção no fim da home com o terminal funcionando numa janela do macOS; o verde abre `/terminal`, que agora é só a janela (sem navbar nem footer), com a janela crescendo até a tela cheia (View Transitions). A sessão é uma só: histórico e diretório seguem entre as duas telas; na página, o vermelho encerra a sessão e o amarelo volta mantendo-a. Tema e idioma pelos comandos `theme` e `lang`; trocar o idioma por fora deixa uma linha de aviso (o que já está na tela fica no idioma em que rodou). Entradas no footer (coluna de contato) e nas configurações. A moldura de janela virou `MacWindowFrame`, compartilhada com o README do Sobre. Substitui o `a9`
* Menu de nó nos textos (`n10`): `[[python]]` no corpo de um projeto ou foto vira um nome com sublinhado pontilhado que abre o mesmo menu dos stacks; o nó dono do texto fica fora do menu (no PlantE, o Python não lista o próprio PlantE), e um nó sem mais nada para mostrar continua como texto. Peças: `ContextMenuPanel` (o menu sem gatilho próprio, ancorado em qualquer elemento), `NodeMenuHost` no `App.vue` e a diretiva `v-content-links` (antiga `v-internal-links`)
* Menu de nó (`n4` + `n5`): clicar numa tech (stacks da home e do Sobre) ou num cargo do hero abre um menu no estilo do macOS com o que aponta para o nó ("Ver projetos", "Ver certificado"...); o hover abre o submenu e o clique o trava; um item só leva direto; passando de 6, "Ver todos" abre a listagem filtrada (`?ref=<id>`, com chip removível); techs relacionadas aparecem em cinza; no mobile o submenu desliza para dentro do menu. Certificações, pesquisas e timeline ganharam âncora (`/certifications#id`) com rolagem e destaque do card. Peças: `ContextMenu` genérico (`shared/components/ui/menu/`), `nodeMenu.js` + `useNodeMenu`, `NodeMenu` e `TechIcon` (que tirou o markup duplicado dos dois stacks)
* Auditoria da arquitetura (`a1`): ARCHITECTURE.md e READMEs dos módulos atualizados; um só módulo de Markdown (`core/content/markdown.js`); removido o pacote `@lucide/vue` sem uso; token `--text-on-primary` no lugar do branco fixo
* Listagens (`n1` + `n2`): barra única de busca e filtros (`ListingToolbar` + `useListingFilters`) em projetos, pesquisas e certificações, com busca e selects da mesma altura (`--control-height`) e busca que ignora acentos; alternância grade/lista global, salva no navegador (lista: projetos em linha com miniatura, pesquisas uma por linha, certificações em linha). De quebra, os `#ffffff` que a auditoria `a1` deixou passar viraram `--text-on-primary`
* Wikilinks clicáveis (`n9`): `[[id]]` no texto de um nó vira link para a página dele (projetos, fotos, pesquisas, certificações, timeline), navegando pelo router; nós sem página ficam como texto até o painel de nó. Mapa único de rotas em `core/content/routes.js`
* Terminal abaixo da navbar (`a9`): a página do terminal reserva o topo para a navbar, como as outras; a navbar continua visível para dar acesso às configurações
* Página da galeria (`a6`): `/gallery` com polaroids em três tamanhos (3, 2 ou 1 por linha, escolha salva no navegador) e `/gallery/<id>` com a foto inteira, história, ligações e navegação; fotos viraram nós do grafo (tipo `photo`); o botão "Galeria" da home agora leva para ela
* Pipes e encadeamento no terminal (`t4`): `|` passa a saída adiante (o `grep` filtra a entrada; o `ls` sai um por linha num pipe), `&&` para no primeiro erro, operadores entre aspas são texto, erro de sintaxe para operador sem comando
* Grafo inteiro no terminal (`t5`): pastas `techs/`, `topics/`, `roles/` e `timeline/` com um `<id>.md` por nó (texto + ligações nos dois sentidos) e o comando `links <id>`; o Tab completa ids no `links`. De quebra: o terminal ignorava o idioma ativo e sempre lia o conteúdo em pt
* Atalhos do terminal (`t1`–`t3`): ↑/↓ no histórico (sem duplicar o comando anterior e guardando a linha em edição), Tab completa comandos e caminhos (lista as opções quando há mais de uma), Ctrl+L limpa a tela, Ctrl+C abandona a linha; copiar e colar exigem Shift (Ctrl+Shift+C / Ctrl+Shift+V), como num terminal Linux
* Terminal no padrão visual (`a7`): só tokens do site, segue o tema claro/escuro; tokens novos `--danger` e neons documentados no DESIGN.md
* Formato do projeto compartilhado (`a8`): `core/content/projects.js`, usado pelas telas e pelo terminal
* Header ASCII sorteado ao entrar no terminal (`t7`): não aparecia porque o glob dos headers era desativado no navegador; corrigido, o comando `header` também volta a funcionar
* i18n para pt, en, es e it (`a2`): lista única em `core/i18n/languages.js`; interface traduzida; conteúdo sem tradução cai para en → pt com o selo "não traduzido"; terminal sem textos fixos no código

* Rodapé global com contato e "voltar ao topo", fora do `/terminal` (`8bd105e`)
* Esfera flutuante na seção Sobre da home (`01c7d13`)
* Ícones do stack invertidos no tema escuro (`feb9c36`)
* Anos da timeline clicáveis com rolagem suave (`46e28dc`)
* Botões de fechar e tela cheia no README (`5f4a6eb`, antigo `n3`)
* Grafo de conteúdo em `src/content/` (`5f66c42`, `a05a011`, antiga discussão `d1`)
* Logo NEAT no tema claro: o asset agora tem transparência

## Descartado

* Easter egg no grid de pixels do hero: o grid deixou de existir com o novo hero ASCII (`fd7de0e`). Se ainda quiser um easter egg no hero, vira uma pendência nova.
