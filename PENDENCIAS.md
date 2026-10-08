# Pendências — vichsort-portifolio

Lista do que falta na interface tradicional. Revisada em 2026-10-07 contra o código.

---

## Em aberto

| # | Pendência | Arquivos | A decidir |
| :--- | :--- | :--- | :--- |
| **`n7`** | **Redesenhar a tela de contato** | `ContactView.vue` | Alinhar à identidade do hero e do footer |
| **`n8`** | **Modal de certificação** | `CertificationsView.vue`, novo `CertificationModal.vue` | Ainda faz sentido? O card já tem link direto para a credencial |

## Terminal

Planejamento original em `terminal.md` (raiz, fora do git). A lista abaixo é o que falta dele, mais o que saiu da revisão do código.

| # | Pendência | Arquivos | Observação |
| :--- | :--- | :--- | :--- |
| **`t6`** | **Currículo (`resume.pdf`)**: decidir se o site terá um | `public/`, `vfs/manifest.js`, `commands/portfolio/resume.js` | O PDF não existe (`public/` só tem `images/`): o comando `resume` anuncia um download que falha. Com PDF (um por idioma?), o `cat resume.pdf` também baixa; sem PDF, remover o arquivo do `ls` e o comando |
| **`t9`** | **Comandos de sistema**: `history` e `exit` / `gui` | `commands/system/` | O `exit` pode reaproveitar o que o vermelho/amarelo da janela já fazem na página; o `context.router` existe e ninguém usa |
| **`t10`** | **Easter eggs**: `neofetch`, `matrix`, `rm -rf /` | `commands/easter/`, `ascii/neofetch.txt`, novo `MatrixRain.vue` | `matrix` em tela cheia, cancelado com Ctrl+C (o primeiro "processo" do terminal; hoje o Ctrl+C só abandona a linha). `rm -rf /`: glitch de ~2s e reinício amigável |
| **`t11`** | **Ctrl+A / Ctrl+E** (início / fim da linha) | `TerminalPrompt.vue` | No `<input>` o Ctrl+A seleciona tudo: precisa de `preventDefault` |
| **`t12`** | **`projects --featured`** | `commands/portfolio/projects.js` | Só o `--stack` existe (o `--featured` saiu do uso anunciado no `help` até existir). Ver antes se o projeto tem (ou deve ter) um campo de destaque |
| **`t13`** | **Terminal no mobile (≤ 768px)** | `TerminalView.vue`, `TerminalSection.vue` | Hoje não há tratamento nenhum. A spec previa uma landing com vídeo de demo e CTA; com o terminal também na home, decidir se vale isso ou só um aviso |
| **`t14`** | **Atualizar o `terminal.md`** ou aposentá-lo | `terminal.md`, `.gitignore` | Caminhos antigos (`modules/projects/content`), sem `links`, `header`, pastas do grafo, pipes; o callout `e3.6` virou o `t8`. Decidir se vai para o git ou se este arquivo vira a única fonte |
| **`t16`** | **Markdown no terminal** (`cat *.md`) | `OutputMarkdown.vue` | Links externos não abrem em nova aba. A spec pedia estética `glow`/`bat` (títulos em caixa alta, separadores ASCII, `•` nas listas); hoje é um card de Markdown comum. Decidir se ainda quer |

Ordem sugerida: `t9`/`t11` → `t10` → `t13`. `t6`, `t12` e `t16` dependem de decisão; `t14` quando o resto assentar.

## Fundação técnica

| # | Pendência | Observação |
| :--- | :--- | :--- |
| **`a3`** | **TypeScript** em `core/content/` e no núcleo do terminal | Componentes migram aos poucos, quando forem mexidos. O núcleo do terminal já foi limpo (`t15`) e o contrato de comando está documentado em `registry.js` |
| **`a4`** | **Gráficos a partir do grafo** | Visualização do grafo, matriz tech × projeto, adoção de techs no tempo. Definir a métrica de "projeto complexo". Só faz sentido com conteúdo real |
| **`a5`** | **Revisar as traduções es/it** da interface | Feitas por IA a partir do pt; conferir tom e termos, principalmente nos textos do Sobre e dos depoimentos |

Ordem sugerida: `a3` → `a4`.

Os depoimentos ficam nos dicionários de interface (`testimonials/locales`), não no grafo: cada idioma novo precisa traduzir esses itens também.

## Conteúdo real

Os projetos já são reais; o resto do conteúdo ainda é fictício. Depende de material, não de código.

* **`c1`** — Dados de contato e redes em `core/config/profile.js` (placeholders, há um `TODO`).
* **`c6`** — Acabamento dos projetos: `cover.jpg` em 16 dos 18 (só Cemitério e CICC têm); a premiação do Energin (`researches/feira-energia-limpa-ita`) é provisória e falta o grupo nos autores; revisar os textos marcados `source: auto-generated` e apagar a linha.
* **`c5`** — Fotos da galeria: as 4 de exemplo em `src/content/gallery/` não têm imagem (aparecem com placeholder). Colocar cada foto como `cover.jpg` na pasta do nó.
* **`c3`** — Certificações, pesquisas, timeline e definições das techs em `src/content/`. Várias techs só têm o arquivo de estrutura, sem texto pt/en. A timeline deve ligar (`link`) os projetos reais.
* **`c4`** — Abrir `src/content/` no Obsidian e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

---

## Concluído

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
